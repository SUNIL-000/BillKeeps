import express from "express";
import { createNewMerchant, getAllMerchant } from "../controllers/merchant.controller.js";
import { Imageupload } from "../middleware/multer.js";

export const merchantRoutes=express.Router();


merchantRoutes.post("/create",Imageupload, createNewMerchant)
merchantRoutes.get("/all",getAllMerchant)
