import express from "express";
import { getAllFeedback, getAvgFeedback, getFeedback, updateFeedBack } from "../controllers/feedback.controller.js";
import { isConsumer } from "../middleware/consumerMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { getfeedbackValidation, updatefeedbackValidation } from "../../validators/feedback.validator.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";

export const feedbackroutes = express.Router()

feedbackroutes.put("/update/:invoiceId", isConsumer, bodyValidator(updatefeedbackValidation), updateFeedBack)
feedbackroutes.get("/get/:invoiceId", isConsumer, bodyValidator(getfeedbackValidation), getFeedback)
feedbackroutes.get("/avgfeedback", isMerchant, getAvgFeedback)
feedbackroutes.get("/allfeedback", isMerchant, getAllFeedback)