import express from "express"
import { consumerLogin, createNewConsumer, getAllConsumer } from "../controllers/consumer.controller.js";
import { bodyValidator } from "../middleware/Zod.js"; 
import {  UserSignInValidation,  UserSignupValidation } from "../../validators/consumer-validator.js";
export const consumerRouter = express.Router();


consumerRouter.post("/signup",bodyValidator(UserSignupValidation),createNewConsumer)
consumerRouter.post("/login",bodyValidator(UserSignInValidation),consumerLogin)


consumerRouter.get("/all",getAllConsumer)