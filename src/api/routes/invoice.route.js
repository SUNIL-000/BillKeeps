import express from "express";
import {  deletSingleInvoice, getAllInvoice, getInvoiceOfConsumer, getSingleInvoice, newInvoice } from "../controllers/invoice.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { invoiceValidation, singleInvoiceValidation } from "../../validators/invoice-validator.js";
import { isConsumer } from "../middleware/consumerMiddleware.js";

export const invoice=express.Router();


invoice.post("/create",isMerchant,bodyValidator(invoiceValidation) ,newInvoice)
invoice.get("/all",getAllInvoice)
invoice.get("/all/consumer",isConsumer,getInvoiceOfConsumer)
invoice.get("/single/:invoiceId",isConsumer,bodyValidator(singleInvoiceValidation),getSingleInvoice)


//ignore this routes(Testing Purpose)
invoice.delete("/:invoiceId",deletSingleInvoice)






