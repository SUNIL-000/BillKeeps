import express from "express";
import { getAllUser, userSignup } from "../controllers/user.controller.js";

export const userRoute=express.Router();


userRoute.post("/signup",userSignup)
userRoute.get("/getall",getAllUser)
