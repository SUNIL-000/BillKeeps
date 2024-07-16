import { generateID } from "../../utils/generateID.js";
import {
  Consumer,
  Invoice,
  Merchant,
  InvoiceItem,
  Product,
} from "../../db/models/index.js";

export const newInvoice = async (req, res) => {
  const { consumerId, items, returnValidity,
    exchangeValidity } = req.body;

  const merchantId = req.id;


  try {
    const invoiceId = generateID("I");
    let totalAmount = 0;

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

    let finalItems = [];
    for (const data of items) {

      const pdata = await Product.findByPk(data?.productId);

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

    }
    const newInvoiceItem = await InvoiceItem.bulkCreate(finalItems);

    //passing the whole items array

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