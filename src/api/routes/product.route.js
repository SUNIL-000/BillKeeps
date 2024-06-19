import express from "express";
import { NewProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/product.controller.js";

export const productRoutes=express.Router();


productRoutes.post("/new",NewProduct)
productRoutes.get("/all",getAllProduct)
productRoutes.put("/update/:product_id",updateProduct)
productRoutes.delete("/delete/:product_id",deleteProduct)




