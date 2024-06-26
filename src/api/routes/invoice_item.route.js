import express from "express";
import { deleleInvoiceItem, getAllInvoiceItem, getAllInvoiceItemWithInvoiceId, getAllInvoiceItemWithItsProducts } from "../controllers/invoice-item.controller.js";

export const invoiceItem=express.Router();



invoiceItem.get("/all",getAllInvoiceItem)
invoiceItem.get("/all/:invoice_id",getAllInvoiceItemWithInvoiceId)
invoiceItem.get("/product/:product_id",getAllInvoiceItemWithItsProducts)

invoiceItem.delete("/:id",deleleInvoiceItem)








