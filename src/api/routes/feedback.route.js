import express from "express";
import { getFeedback, updateFeedBack } from "../controllers/feedback.controller.js";
import { isConsumer } from "../middleware/consumerMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { getfeedbackValidation, updatefeedbackValidation } from "../../validators/feedback.validator.js";

export const feedbackroutes = express.Router()

feedbackroutes.put("/update/:invoiceId", isConsumer, bodyValidator(updatefeedbackValidation), updateFeedBack)
feedbackroutes.get("/get/:invoiceId", isConsumer, bodyValidator(getfeedbackValidation), getFeedback)