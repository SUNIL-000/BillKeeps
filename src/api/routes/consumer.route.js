import express from "express"
import { createNewConsumer, getAllConsumer } from "../controllers/consumer.controller.js";

export const consumerRouter = express.Router();


consumerRouter.post("/signup",createNewConsumer)
consumerRouter.get("/all",getAllConsumer)
