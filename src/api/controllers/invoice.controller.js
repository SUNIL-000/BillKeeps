import { generateID } from "../../utils/generateID.js";
import {
  Consumer,
  Invoice,
  Merchant,
  InvoiceItem,
  Product,
} from "../../db/models/index.js";

export const newInvoice = async (req, res) => {
  const { merchant_id, consumer_id, total_amount, items } = req.body;

  //-----------------ignore it----------
  // items:[{
  //   productid,
  //   quanity,
  //   discountamount,
  //   discountpercent
  // }]
  // //------------------------------------
  // invoice_item_id
  // invoice_id
  // product_id
  // quantity
  // discountAmout
  // discountPercent
  // salePrice

  try {
    const invoice_id = generateID("I"); //create a new invoiceid
    const newInvoice = await Invoice.create({
      invoice_id,
      merchant_id,
      consumer_id,
      total_amount,
    });

    var allInvoiceItemes = [];

    items.map(async (data) => {
      const pdata = await Product.findByPk(data?.product_id);

      var beforeDiscount = pdata.mrp * data?.quantity;
      var finalDiscountPrice;

      if (data?.discountAmout) {
        finalDiscountPrice = beforeDiscount - data?.discountAmout;
      }
      if (data?.discountPercent) {
        let disount =
          (pdata.mrp * data?.quantity * data?.discountPercent) / 100;
         finalDiscountPrice = beforeDiscount - disount;
      }

      var newInvoiceItemes = await InvoiceItem.create({
        invoice_item_id: generateID("IT"),
        invoice_id,
        product_id: pdata?.product_id,
        quantity: data?.quantity,
        discountAmout: data?.discountAmout,
        discountPercent: data?.discountPercent,
        salePrice: finalDiscountPrice,
      });

      console.log(newInvoiceItemes);
    });

    if (!newInvoice) {
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
  const { invoice_id } = req.params;
  try {
    const deletedInvoice = await Invoice.destroy({ where: { invoice_id } });

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
