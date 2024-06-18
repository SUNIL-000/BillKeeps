import express from "express";
import { NewProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/product.controller.js";

export const productRoutes=express.Router();


productRoutes.post("/new",NewProduct)
productRoutes.get("/all",getAllProduct)
productRoutes.put("/update",updateProduct)
productRoutes.delete("/delete",deleteProduct)




