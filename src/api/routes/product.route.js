import express from "express";
import { NewProduct, deleteProduct, getAllProduct, getAllProductOfSingleMerchant, getSingleProduct, updateProduct } from "../controllers/product.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { createProductValidation, deleteProductValidation, singleProductValidation, updateProductValidation } from "../../validators/poduct-validator.js";

export const productRoutes=express.Router();

//create product
productRoutes.post("/new",isMerchant,bodyValidator(createProductValidation), NewProduct)
//update product
productRoutes.put("/update/:productId",isMerchant,bodyValidator(updateProductValidation),updateProduct)
//delete product
productRoutes.delete("/delete/:productId",isMerchant,bodyValidator(deleteProductValidation),deleteProduct)
//get single product
productRoutes.get("/:productId",isMerchant,bodyValidator(singleProductValidation),getSingleProduct)
//get all product of a merchant
productRoutes.get("/all/merchant", isMerchant, getAllProductOfSingleMerchant)

//ignore this--- For testing purpose
productRoutes.get("/no",getAllProduct)


