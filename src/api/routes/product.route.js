import express from "express";
import { NewProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/product.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";

export const productRoutes=express.Router();


productRoutes.post("/new",isMerchant, NewProduct)
productRoutes.get("/all",getAllProduct)
productRoutes.put("/update/:product_id",updateProduct)
productRoutes.delete("/delete/:product_id",isMerchant,deleteProduct)




