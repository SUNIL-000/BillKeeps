import { InvoiceItem, Product } from "../../db/models/index.js";
export const getAllInvoiceItem = async (req, res) => {
  try {
    const allInvoiceItem = await InvoiceItem.findAll({
      include: {
        model: Product,
      },
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
