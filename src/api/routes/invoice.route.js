import express from "express";
import {  deletSingleInvoice, getAllInvoice, getInvoiceOfConsumer, getInvoiceOfMerchant,  getSingleInvoiceofAConsumer, getSingleInvoiceofAMerchant, newInvoice, searchInvoice } from "../controllers/invoice.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { invoiceValidation, searchInvoiceValidation, singleInvoiceValidation } from "../../validators/invoice-validator.js";
import { isConsumer } from "../middleware/consumerMiddleware.js";
import { searchProduct } from "../controllers/product.controller.js";

export const invoiceRouter=express.Router();


invoiceRouter.post("/create",isMerchant,bodyValidator(invoiceValidation) ,newInvoice)
invoiceRouter.get("/all",getAllInvoice)

invoiceRouter.get("/all/consumer",isConsumer,getInvoiceOfConsumer)
invoiceRouter.get("/all/merchant",isMerchant,getInvoiceOfMerchant)

invoiceRouter.get("/single/consumer/:invoiceId",isConsumer,bodyValidator(singleInvoiceValidation),getSingleInvoiceofAConsumer)
invoiceRouter.get("/single/merchant/:invoiceId",isMerchant,bodyValidator(singleInvoiceValidation),getSingleInvoiceofAMerchant)


invoiceRouter.get("/search/:id",bodyValidator(searchInvoiceValidation),searchInvoice)

//ignore this routes(Testing Purpose)
invoiceRouter.delete("/:invoiceId",deletSingleInvoice)






