import express from "express";
import { createNewMerchant, getAllMerchant, getAllMerchantID, merchantDetails, merchantLogin, updateMerchant } from "../controllers/merchant.controller.js";
import { Imageupload, newImageupload } from "../middleware/multer.js";
import { bodyValidator } from "../middleware/Zod.js";
import { merchantSignupValidation, merchantSignInValidation, merchantTopProductValidation, merchantUpdateValidation } from "../../validators/mechant-validator.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { getTop3Products } from "../controllers/invoice.controller.js";
import { totalConsumer } from "../controllers/consumer.controller.js";
import { totalconsumerValidation } from "../../validators/consumer-validator.js";

export const merchantRoutes = express.Router();


merchantRoutes.post("/signup", Imageupload, bodyValidator(merchantSignupValidation), createNewMerchant)
merchantRoutes.post("/login", bodyValidator(merchantSignInValidation), merchantLogin)
merchantRoutes.put("/update/:merchantId", newImageupload, bodyValidator(merchantUpdateValidation), updateMerchant)
merchantRoutes.get("/details", isMerchant, merchantDetails)
merchantRoutes.get("/topproduct/:merchantId", bodyValidator(merchantTopProductValidation), getTop3Products)
merchantRoutes.get("/totalconsumer/:merchantId", bodyValidator(totalconsumerValidation), totalConsumer)


//No use-- testing purpose
merchantRoutes.get("/id", getAllMerchantID)
merchantRoutes.get("/all", getAllMerchant)



