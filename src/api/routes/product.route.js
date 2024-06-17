import express from "express";
import { NewProduct } from "../controllers/product.controller.js";

export const productRoutes=express.Router();


productRoutes.post("/new",NewProduct)

