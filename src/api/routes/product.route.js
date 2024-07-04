import express from "express";
import { NewProduct, deleteProduct, getAllProduct, getAllProductOfSingleMerchant, getSingleProduct, searchProduct, updateProduct } from "../controllers/product.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";
import { bodyValidator } from "../middleware/Zod.js";
import { createProductValidation, deleteProductValidation, searchProductValidation, singleProductValidation, updateProductValidation } from "../../validators/product-validator.js";

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
productRoutes.get("/all/merchant", isMerchant , getAllProductOfSingleMerchant)

//seach product on the basis of name
productRoutes.get("/search/name", isMerchant ,bodyValidator(searchProductValidation), searchProduct)






//ignore this--- For testing purpose
productRoutes.get("/all/product",getAllProduct)


