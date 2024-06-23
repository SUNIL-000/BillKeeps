import express from "express";
import { createNewMerchant, getAllMerchant, getAllMerchantWithProduct, merchantLogin } from "../controllers/merchant.controller.js";
import { Imageupload } from "../middleware/multer.js";

export const merchantRoutes=express.Router();


merchantRoutes.post("/signup",Imageupload, createNewMerchant)
merchantRoutes.get("/all",getAllMerchant)
merchantRoutes.post("/login",merchantLogin)
merchantRoutes.get("/product",getAllMerchantWithProduct)


