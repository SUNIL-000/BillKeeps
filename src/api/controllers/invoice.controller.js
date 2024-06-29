import { generateID } from "../../utils/generateID.js";
import {
  Consumer,
  Invoice,
  Merchant,
  InvoiceItem,
  Product,
} from "../../db/models/index.js";

export const newInvoice = async (req, res) => {
  const { merchantId, consumerId, items, returnValidity,
    exchangeValidity } = req.body;

  try {
    let totalAmount = 0;
    const invoiceId = generateID("I");
    const newInvoices = await Invoice.create({
      invoiceId,
      merchantId,
      consumerId,
      totalAmount,
      returnValidity,
      exchangeValidity
    });

    for (const data of items) {
      console.log(data);
      const pdata = await Product.findByPk(data?.productId);

      if (!pdata) {
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

      const newInvoiceItem = await InvoiceItem.create({
        invoiceItemId: generateID("IT"),
        invoiceId,
        productId: pdata?.productId,
        quantity: data?.quantity,
        discountAmount: data?.discountAmount,
        discountPercent: data?.discountPercent,
        salePrice: finalDiscountPrice,
      });
      console.log(newInvoiceItem);
      if (!newInvoiceItem) {
        return res.status(400).json({
          message: "Failed to create Invoice and invoice item..",
          success: false,
        });
      }
    }
    console.log("total_amount", totalAmount);
    newInvoices.totalAmount = totalAmount;
    await newInvoices.save();

    if (!newInvoices) {
      return res.status(400).json({
        message: "Failed to create Invoice and invoice item..",
        success: false,
      });
    }

    return res.status(201).json({
      message: "New Invoice and Invoice items are created successfully..",
      success: true,
      newInvoice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while creating new Invoice and InvoiceIems",
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
  const { consumerId } = req.params;

  try {
    const allInvoices = await Invoice.findAll({
      where: { consumerId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: InvoiceItem,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });

    if (!allInvoices) {
      return res.status(404).json({
        message: `No Invoice found with consumer id ${consumerId}`,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Getting Invoices having consumer id ${consumerId}`,
      success: true,
      allInvoices,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while getting single invoice record of a consumer",
      success: false,
    });
  }
};
