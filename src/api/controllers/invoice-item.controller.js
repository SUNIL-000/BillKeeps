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
        message: "No invoice items found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Retrieved all invoice item records",
      success: true,
      allInvoiceItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while fetching all invoice item records",
      success: false,
    });
  }
};

export const deleleInvoiceItem = async (req, res) => {
  const { id } = req.params;
  try {
    const DeleteItem = await InvoiceItem.destroy({
      where: { invoiceItemId: id },
    });

    if (!DeleteItem) {
      return res.status(404).json({
        message: "No invoice item found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Invoice item deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while deleting invoice item",
      success: false,
    });
  }
};

//get all invoiceitem with respect to invoice id
export const getAllInvoiceItemWithInvoiceId = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const allInvoiceItem = await InvoiceItem.findAll({
      where: { invoiceId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Invoice,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });

    if (!allInvoiceItem) {
      return res.status(404).json({
        message: `No invoice items found with invoice ID ${invoiceId}`,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Getting all invoice item records with invoice ID ${invoiceId}`,
      success: true,
      allInvoiceItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Error while fetching all invoice item records with invoice ID ${invoiceId}`,
      success: false,
    });
  }
};

//getting invoice items with its product details
export const getAllInvoiceItemWithItsProducts = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const allInvoiceItem = await InvoiceItem.findAll({
      where: { invoiceId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });

    if (!allInvoiceItem) {
      return res.status(404).json({
        message: `No invoice items found with invoice ID ${invoiceId}`,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Retrieved all invoice item records with invoice ID ${invoiceId}`,
      success: true,
      allInvoiceItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Error while fetching all invoice item records with invoice ID ${invoiceId}`,
      success: false,
    });
  }
};
