import express from "express";
import { deleleInvoiceItem, getAllInvoiceItem } from "../controllers/invoice-item.controller.js";

export const invoiceItem=express.Router();



invoiceItem.get("/all",getAllInvoiceItem)
invoiceItem.delete("/:id",deleleInvoiceItem)








