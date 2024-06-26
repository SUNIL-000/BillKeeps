import { Invoice, InvoiceItem, Product } from "../../db/models/index.js";
export const getAllInvoiceItem = async (req, res) => {
  try {
    const allInvoiceItem = await InvoiceItem.findAll({
      include: {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!allInvoiceItem) {
      return res.status(404).json({
        message: "No invoice items has been found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Getting all invoice item record",
      success: true,
      allInvoiceItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while fetching all invoice record",
      success: false,
    });
  }
};

export const deleleInvoiceItem = async (req, res) => {
  const { id } = req.params;
  try {
    const DeleteItem = await InvoiceItem.destroy({
      where: { invoice_item_id: id },
    });

    if (!DeleteItem) {
      return res.status(404).json({
        message: "No invoice item has been found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Invoice item deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while deleting invoice record",
      success: false,
    });
  }
};
//get all invoiceitem with respect to invoice id
export const getAllInvoiceItemWithInvoiceId = async (req, res) => {
  const { invoice_id } = req.params;
  try {
    const allInvoiceItem = await InvoiceItem.findAll({
      where: { invoice_id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Invoice,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });

    if (!allInvoiceItem) {
      return res.status(404).json({
        message: `No invoice items has been found with invoice id ${invoice_id}`,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Getting all invoice item record having invoice_id ${invoice_id}`,
      success: true,
      allInvoiceItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Error while getting all invoice item record having invoice_id ${invoice_id}`,
      success: false,
    });
  }
};


//getting invoice items with its product details
export const getAllInvoiceItemWithItsProducts = async (req, res) => {
  const { product_id } = req.params;
  try {
    const allInvoiceItem = await InvoiceItem.findAll({
      where: { product_id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });

    if (!allInvoiceItem) {
      return res.status(404).json({
        message: `No invoice items has been found with product id ${product_id}`,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Getting all invoice item record having product_id ${product_id}`,
      success: true,
      allInvoiceItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Error while getting all invoice item record having product id ${product_id}`,
      success: false,
    });
  }
};