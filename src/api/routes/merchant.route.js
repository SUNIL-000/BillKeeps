import express from "express";
import { createNewMerchant, getAllMerchant, getAllMerchantID, merchantDetails, merchantLogin } from "../controllers/merchant.controller.js";
import { Imageupload } from "../middleware/multer.js";
import {  bodyValidator } from "../middleware/Zod.js";
import {  merchantSignupValidation, merchantSignInValidation, merchantTopProductValidation} from "../../validators/mechant-validator.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { getTop3Products } from "../controllers/invoice.controller.js";

export const merchantRoutes=express.Router();


merchantRoutes.post("/signup",Imageupload, bodyValidator(merchantSignupValidation),createNewMerchant)
merchantRoutes.post("/login",bodyValidator(merchantSignInValidation),merchantLogin)
merchantRoutes.get("/details",isMerchant,merchantDetails)
merchantRoutes.get("/topproduct/:merchantId",bodyValidator(merchantTopProductValidation),getTop3Products)


//No use-- testing purpose
merchantRoutes.get("/id",getAllMerchantID)
merchantRoutes.get("/all",getAllMerchant)



