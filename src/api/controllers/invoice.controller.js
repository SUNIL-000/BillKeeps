import { generateID } from "../../utils/generateID.js";
import {
  Consumer,
  Invoice,
  Merchant,
  InvoiceItem,
  Product,
} from "../../db/models/index.js";

// import path, { dirname } from "path"
// import { fileURLToPath } from "url";
// import ejs from "ejs";
// import puppeteer from "puppeteer";
import { Op } from "sequelize";
import { sequelize } from "../../config/db.js";
import { Feedback } from "../../db/models/index.js";

// const generatePng = async ({ invoiceData, invoiceItems }) => {
//   console.log(invoiceData, invoiceItems)
//   const date = new Date().toLocaleDateString()
//   let totalDiscount = 0;
//   let subTotal = 0;

//   invoiceItems.forEach((item) => {
//     const dis = (item.mrp * item.quantity) - item.salePrice
//     const st = (item.mrp * item.quantity)
//     totalDiscount += dis;
//     subTotal += st;
//   })

//   try {
//     const filepath = fileURLToPath(import.meta.url)
//     console.log("Invoice filepath", filepath)

//     const dir = dirname(filepath)
//     console.log("Directory", dir)

//     const templatePath = path.join(dir, '../../views/invoice.ejs');
//     console.log("ejs path", templatePath)

//     const html = await ejs.renderFile(templatePath, { invoiceData, invoiceItems, totalDiscount, subTotal, date });

//     const browser = await puppeteer.launch()
//     const page = await browser.newPage();

//     await page.setContent(html, { waitUntil: 'domcontentloaded' });
//     const pngPath = path.join(dir, '../../../uploads/invoices', `${invoiceData[0].invoiceId}.png`);

//     const png = await page.screenshot({ path: pngPath, fullPage: true });
//     await browser.close();

//     const finalPath = `uploads/Invoices/${invoiceData[0].invoiceId}.png`
//     return finalPath
//   } catch (error) {
//     console.log("Failed to to create invoice image")
//     console.log(error)
//   }
// }
const generateFeedback = async (invoiceId) => {
  try {
    const feedbackId = generateID("F")
    const newFeedback = await Feedback.create({
      feedbackId,
      invoiceId,
      rating: 0,
      comment: ""

    })
    if (!newFeedback) {
      console.log(`Failed to create feedback on invoiceId ${invoiceId}`)
    }
    console.log(newFeedback);
    
  } catch (error) {
    console.log(error);

  }
}
export const newInvoice = async (req, res) => {
  const { consumerId, items, returnValidity, exchangeValidity } = req.body;
  const merchantId = req.id;
  try {
    const invoiceId = generateID("I");
    let totalAmount = 0;
    let finalItems = [];
    let invoiceItems = []
    let invoiceData = []

    const isConsumer = await Consumer.findByPk(consumerId)

    if (!isConsumer) {
      return res.status(404).json({
        message: `No consumer found with consumerId ${consumerId}`,
        success: false,
      });
    }
    //creating new Invoices
    const newInvoice = await Invoice.create({
      invoiceId,
      merchantId,
      consumerId,
      returnValidity,
      exchangeValidity
    });

    for (const data of items) {

      const pdata = await Product.findOne({
        where: { productId: data.productId }
      });

      if (!pdata) {
        await newInvoice.destroy();
        console.log("Invoice deleted")
        return res
          .status(404)
          .json({ message: "Product not found..", success: false });
      }

      let beforeDiscount = pdata?.mrp * data?.quantity;
      console.log("before discount", beforeDiscount);

      let finalDiscountPrice = beforeDiscount;

      if (data?.discountAmount) {
        finalDiscountPrice = beforeDiscount - data?.discountAmount;
      }

      if (data?.discountPercent) {
        const discount = beforeDiscount * (data?.discountPercent / 100);
        finalDiscountPrice = beforeDiscount - discount;
      }

      console.log("final price", finalDiscountPrice);

      totalAmount += finalDiscountPrice;

      finalItems.push({
        invoiceItemId: generateID("IT"),
        invoiceId: invoiceId,
        productId: data?.productId,
        quantity: data?.quantity,
        discountAmount: data?.discountAmount,
        discountPercent: data?.discountPercent,
        salePrice: finalDiscountPrice,
      })

      invoiceItems.push({
        name: pdata.name,
        mrp: pdata.mrp,
        quantity: data?.quantity,
        salePrice: finalDiscountPrice,
      })
    }
    const newInvoiceItem = await InvoiceItem.bulkCreate(finalItems);



    if (!newInvoiceItem) {
      await newInvoice.destroy();
      console.log("Invoice deleted")
      return res.status(400).json({
        message: "Failed to create invoice items..",
        success: false,
      });
    }

    newInvoice.totalAmount = totalAmount;
    await newInvoice.save();

    if (!newInvoice) {
      return res.status(400).json({
        message: "Failed to create invoice .",
        success: false,
      });
    }

    const merchantDets = await Merchant.findOne({
      where: { merchantId: merchantId },
      attributes: ["contactNo", "businessLogoUrl", "businessName"]
    })
    // console.log(merchantDets)

    invoiceData.push({
      invoiceId,
      merchantId,
      consumerId,
      totalAmount,
      returnValidity,
      exchangeValidity,
      contactNo: merchantDets.contactNo,
      businessLogoUrl: merchantDets.businessLogoUrl,
      businessName: merchantDets.businessName
    })

    // const url = await generatePng({ invoiceData, invoiceItems })
    newInvoice.invoiceUrl = ""
    await newInvoice.save();
    generateFeedback(invoiceId)

    return res.status(201).json({
      message: "New Invoice created successfully..",
      success: true,
      newInvoice,
    });
  }
  catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error while creating new Invoice .",
      success: false,
    });
  }
};

export const getAllInvoice = async (req, res) => {
  try {
    const allInvoices = await Invoice.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Merchant,
          attributes: {
            exclude: ["createdAt", "updatedAt", "buisnessLogoUrl", "password"],
          },
        },
        {
          model: Consumer,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: InvoiceItem,
          attributes: {
            exclude: ["createdAt", "updatedAt"],

          },

        },
      ],
    });

    return res.status(200).json({
      message: "Getting all invoices ",
      success: true,
      allInvoices,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while getting all invoices",
      success: false,
      error: error,
    });
  }
};

export const deletSingleInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const deletedInvoice = await Invoice.destroy({ where: { invoiceId } });



    if (!deletedInvoice) {
      return res.status(404).json({
        message: "Invoice not found .",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Invoice Deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while deleting single invoice",
      success: false,
      error: error,
    });
  }
};

//GET ALL invoice with respect to consumer id
export const getInvoiceOfConsumer = async (req, res) => {
  const consumerId = req.id;
  try {
    const allInvoices = await Invoice.findAll({
      where: { consumerId },

      attributes: { exclude: ["createdAt", "updatedAt", "merchantId", "consumerId"] },
      include: [
        {
          model: InvoiceItem,
          attributes: { exclude: ["createdAt", "updatedAt", "invoiceId", "productId"] },
          include: [
            {
              model: Product,
              attributes: { exclude: ["createdAt", "updatedAt", "merchantId"] },
            },
          ],
        },
        {
          model: Consumer,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Merchant,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
      ],
      order: [['invoiceDate', 'DESC']]
    });

    if (!allInvoices || allInvoices.length === 0) {
      return res.status(404).json({
        message: `No invoices found with consumer id ${consumerId}`,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Getting all invoices having consumer id ${consumerId}`,
      success: true,
      allInvoices,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while getting invoices for a consumer",
      success: false,
    });
  }
};
export const getInvoiceOfMerchant = async (req, res) => {

  const merchantId = req.id;

  try {
    const allInvoices = await Invoice.findAll({
      where: { merchantId },
      attributes: { exclude: ["createdAt", "updatedAt", "merchantId", "merchantId"] },
      include: [
        {
          model: InvoiceItem,
          attributes: { exclude: ["createdAt", "updatedAt", "invoiceId", "productId"] },
          include: [
            {
              model: Product,
              attributes: { exclude: ["createdAt", "updatedAt", "merchantId"] },
            },
          ],
        },
        {
          model: Consumer,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Merchant,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
      ],
      order: [['invoiceDate', 'DESC']]
    });

    if (!allInvoices) {
      return res.status(404).json({
        message: `No invoices found with merchantId ${merchantId}`,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Getting all invoices having merchantId ${merchantId}`,
      success: true,
      allInvoices,
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while getting invoices for a merchant",
      success: false,
    });
  }
};

//get single invoice of a consumer
export const getSingleInvoiceofAConsumer = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const singleInvoice = await Invoice.findOne({
      where: { invoiceId },
      attributes: { exclude: ["createdAt", "updatedAt", "merchantId", "consumerId"] },
      include: [
        {
          model: InvoiceItem,
          attributes: { exclude: ["createdAt", "updatedAt", "invoiceId", "productId"] },
          include: [
            {
              model: Product,
              attributes: { exclude: ["createdAt", "updatedAt", "merchantId"] },
            },
          ],
        },
        {
          model: Consumer,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Merchant,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
      ],

    });

    if (!singleInvoice || singleInvoice.length === 0) {
      return res.status(404).json({
        message: `No invoices found with invoice id ${invoiceId}`,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Getting invoice having invoice id ${invoiceId}`,
      success: true,
      singleInvoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while single invoice",
      success: false,
    });
  }
}

export const getSingleInvoiceofAMerchant = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const singleInvoice = await Invoice.findOne({
      where: { invoiceId },
      attributes: { exclude: ["createdAt", "updatedAt", "merchantId", "consumerId"] },
      include: [
        {
          model: InvoiceItem,
          attributes: { exclude: ["createdAt", "updatedAt", "invoiceId", "productId"] },
          include: [
            {
              model: Product,
              attributes: { exclude: ["createdAt", "updatedAt", "merchantId"] },
            },
          ],
        },
        {
          model: Consumer,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Merchant,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
      ],

    });

    if (!singleInvoice || singleInvoice.length === 0) {
      return res.status(404).json({
        message: `No invoices found with invoice id ${invoiceId}`,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Getting invoice having invoice id ${invoiceId}`,
      success: true,
      singleInvoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while single invoice",
      success: false,
    });
  }
}

export const searchInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    const searchedInvoice = await Invoice.findAll({
      where: {
        [Op.or]: [
          {
            invoiceId: {
              [Op.iLike]: `${id.trim()}`
            },

          },
          {
            consumerId: {
              [Op.iLike]: `${id.trim()}`
            },
          }
        ],

      },
      include: [
        {
          model: InvoiceItem,
          attributes: { exclude: ["createdAt", "updatedAt", "invoiceId", "productId"] },
          include: [
            {
              model: Product,
              attributes: { exclude: ["createdAt", "updatedAt", "merchantId"] },
            },
          ],
        },
        {
          model: Consumer,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Merchant,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
      ],
    })
    console.log(searchedInvoice)
    if (!searchedInvoice || searchedInvoice.length == 0) {
      return res.status(400).json({
        message: `No invoice found with ${id}`,
        success: false
      }
      )
    }
    return res.status(200).json({
      message: `Getting invoice having ${id}`,
      success: true,
      searchedInvoice
    }
    )
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Error while searching invoice details",
      success: false,
    }
    )
  }
}
export const countInvoices = async (req, res) => {
  const { merchantId } = req.params
  try {
    const invoiceCount = await Invoice.count({
      where: { merchantId }
    })

    return res.status(200).json({
      message: `getting ${invoiceCount} inovices`,
      success: true,
      invoiceCount
    })

  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Error while fetching total no of invoice ",
      success: false,
    })
  }

}
// 
///Net Revenue
export const netRevenue = async (req, res) => {
  const { merchantId } = req.params

  try {
    const allInvoice = await Invoice.findAll({
      where: { merchantId }
    })
    let totalRevenue = 0;
    if (!allInvoice) {
      return res.status(400).json({
        message: "Failed to get net revenue",
        success: false,
      })
    }

    for (const data of allInvoice) {
      totalRevenue += data?.totalAmount
    }

    return res.status(200).json({
      message: "getting net revenue",
      success: true,
      totalRevenue
    })

  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Error while getting net revenue ",
      success: false,
    })
  }

}


export const getTop3Products = async (req, res) => {
  const { merchantId } = req.params
  try {
    const results = await InvoiceItem.findAll({
      attributes: [

        [sequelize.fn('SUM', sequelize.col('quantity')), 'product_freq'],
        [sequelize.col('product.productId'), 'product.productId'],
        [sequelize.col('product.name'), 'product.name']
      ],
      include: [
        {
          model: Invoice,
          attributes: [],
          where: {
            merchantId: merchantId
          }
        },
        {
          model: Product,
          attributes: ['productId', 'name']
        }
      ],
      group: ['invoice_item.productId', 'product.productId', 'product.name'],
      order: [[sequelize.col('product_freq'), 'DESC']],
      limit: 3
    });

    const products = (results.map(result => result.get({ plain: true })));
    console.log(products)

    return res.status(200).json({
      message: "Getting top 3 products",
      success: true,
      products

    })
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({
      message: "Error occour while getting top 3 products",
      success: false,


    })
  }
};




