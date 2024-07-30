
import express from "express";
import { isConsumer } from "../middleware/consumerMiddleware.js";
import { deleteOtp, generateOtp, getOtp, verifyOtp } from "../controllers/otp.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { deleteOtpValidation, getOtpValidation, verifyOtpValidation } from "../../validators/otp-validator.js";

export const otpRouter = express.Router()


otpRouter.post("/new", isConsumer, generateOtp)
otpRouter.post("/verify", isMerchant, bodyValidator(verifyOtpValidation), verifyOtp)
otpRouter.delete("/consumer/:consumerId", bodyValidator(deleteOtpValidation), deleteOtp)
otpRouter.get("/consumer/:consumerId", bodyValidator(getOtpValidation), getOtp)


