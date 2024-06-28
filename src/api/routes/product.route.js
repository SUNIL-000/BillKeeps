import express from "express";
import { NewProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/product.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { createProductValidation, updateProductValidation } from "../../validators/poduct-validator.js";

export const productRoutes=express.Router();


productRoutes.post("/new",isMerchant,bodyValidator(createProductValidation), NewProduct)
productRoutes.put("/update/:productId",isMerchant,bodyValidator(updateProductValidation),updateProduct)
productRoutes.delete("/delete/:productId",isMerchant,deleteProduct)

//ignore this--- For testing purpose
productRoutes.get("/all",getAllProduct)


