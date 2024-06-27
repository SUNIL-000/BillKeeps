import express from "express";
import { NewProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/product.controller.js";
import { isMerchant } from "../middleware/merchantMiddleware.js";

export const productRoutes=express.Router();


productRoutes.post("/new",isMerchant, NewProduct)
productRoutes.get("/all",getAllProduct)
productRoutes.put("/update/:productId",updateProduct)
productRoutes.delete("/delete/:productId",isMerchant,deleteProduct)




