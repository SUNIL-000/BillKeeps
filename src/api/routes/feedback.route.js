import express from "express";
import { updateFeedBack } from "../controllers/feedback.controller.js";
import { isConsumer } from "../middleware/consumerMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { feedbackValidation } from "../../validators/feedback.validator.js";

export const feedbackroutes = express.Router()

feedbackroutes.put("/update/:invoiceId", isConsumer, bodyValidator(feedbackValidation), updateFeedBack)