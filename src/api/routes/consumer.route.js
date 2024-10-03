import express from "express"
import { consumerDetails, consumerLogin, createNewConsumer, getAllConsumer, searchNearByMerchant, updatePasswordConsumer } from "../controllers/consumer.controller.js";
import { bodyValidator } from "../middleware/Zod.js";
import { NearbyMerchant, updatePassword, UserSignInValidation, UserSignupValidation } from "../../validators/consumer-validator.js";
import { isConsumer } from "../middleware/consumerMiddleware.js";
export const consumerRouter = express.Router();


consumerRouter.post("/signup", bodyValidator(UserSignupValidation), createNewConsumer)
consumerRouter.post("/login", bodyValidator(UserSignInValidation), consumerLogin)
consumerRouter.get("/details", isConsumer, consumerDetails)
consumerRouter.put("/updatepassword", isConsumer, bodyValidator(updatePassword), updatePasswordConsumer)
consumerRouter.get("/search-merchant",isConsumer, bodyValidator(NearbyMerchant), searchNearByMerchant)




consumerRouter.get("/all", getAllConsumer)