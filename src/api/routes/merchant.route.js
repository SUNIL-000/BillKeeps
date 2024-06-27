import express from "express";
import { createNewMerchant, getAllMerchant, getAllMerchantID, getAllMerchantWithProduct, merchantLogin } from "../controllers/merchant.controller.js";
import { Imageupload } from "../middleware/multer.js";
import { validator } from "../middleware/Zod.js";
import { merchantSignup ,merchantSignIn} from "../../validators/mechant-validato.js";

export const merchantRoutes=express.Router();


merchantRoutes.post("/signup",Imageupload,validator(merchantSignup),createNewMerchant)
merchantRoutes.get("/all",getAllMerchant)
merchantRoutes.post("/login",validator(merchantSignIn),merchantLogin)
merchantRoutes.get("/product",getAllMerchantWithProduct)



//No use
merchantRoutes.get("/id",getAllMerchantID)



