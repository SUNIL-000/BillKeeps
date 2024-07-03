import express from "express";
import {  deletSingleInvoice, getAllInvoice, getInvoiceOfConsumer, newInvoice } from "../controllers/invoice.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { invoiceValidation } from "../../validators/invoice-validator.js";
import { isConsumer } from "../middleware/consumerMiddleware.js";

export const invoice=express.Router();


invoice.post("/create",isMerchant,bodyValidator(invoiceValidation) ,newInvoice)
invoice.get("/all",getAllInvoice)
invoice.get("/all/consumer",isConsumer,getInvoiceOfConsumer)

//ignore this routes(Testing Purpose)
invoice.delete("/:invoiceId",deletSingleInvoice)






