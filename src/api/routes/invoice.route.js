import express from "express";
import {  deletSingleInvoice, getAllInvoice, getInvoiceOfConsumer, newInvoice } from "../controllers/invoice.controller.js";

export const invoice=express.Router();


invoice.post("/create",newInvoice)
invoice.get("/all",getAllInvoice)
invoice.delete("/:invoice_id",deletSingleInvoice)
invoice.get("/:consumer_id",getInvoiceOfConsumer)








