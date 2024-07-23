
import express from "express";
import { isConsumer } from "../middleware/consumerMiddleware.js";
import { deleteOtp, generateOtp, verifyOtp } from "../controllers/otp.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { deleteOtpValidation, verifyOtpValidation } from "../../validators/otp-validator.js";

export const otpRouter = express.Router()


otpRouter.post("/new", isConsumer, generateOtp)
otpRouter.post("/verify", isMerchant, bodyValidator(verifyOtpValidation), verifyOtp)
otpRouter.delete("/consumer/:consumerId", bodyValidator(deleteOtpValidation), deleteOtp)


