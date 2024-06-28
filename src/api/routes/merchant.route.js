import express from "express";
import { createNewMerchant, getAllMerchant, getAllMerchantID, getAllProductWithSingleMerchant, merchantLogin } from "../controllers/merchant.controller.js";
import { Imageupload } from "../middleware/multer.js";
import {  bodyValidator } from "../middleware/Zod.js";
import {  merchantSignupValidation, merchantSignInValidation} from "../../validators/mechant-validator.js";

export const merchantRoutes=express.Router();


merchantRoutes.post("/signup",Imageupload, bodyValidator(merchantSignupValidation),createNewMerchant)
merchantRoutes.get("/all",getAllMerchant)
merchantRoutes.post("/login",bodyValidator(merchantSignInValidation),merchantLogin)
merchantRoutes.get("/product/:merchantId",getAllProductWithSingleMerchant)



//No use
merchantRoutes.get("/id",getAllMerchantID)



