import express from "express";
import { deleleInvoiceItem, getAllInvoiceItem, getAllInvoiceItemWithInvoiceId, getAllInvoiceItemWithItsProducts } from "../controllers/invoice-item.controller.js";

export const invoiceItem=express.Router();



invoiceItem.get("/all",getAllInvoiceItem)
invoiceItem.get("/all/:invoiceId",getAllInvoiceItemWithInvoiceId)
invoiceItem.get("/product/:productId",getAllInvoiceItemWithItsProducts)

invoiceItem.delete("/:id",deleleInvoiceItem)








