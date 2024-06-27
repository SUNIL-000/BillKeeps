import express from "express"
import { consumerLogin, createNewConsumer, getAllConsumer } from "../controllers/consumer.controller.js";
import { validator } from "../middleware/Zod.js"; 
import {  UserSignInValidation,  UserSignupValidation } from "../../validators/consumer-validator.js";
export const consumerRouter = express.Router();


consumerRouter.post("/signup",validator(UserSignupValidation),createNewConsumer)
consumerRouter.get("/all",getAllConsumer)
consumerRouter.post("/login",validator(UserSignInValidation),consumerLogin)

