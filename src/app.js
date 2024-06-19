import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan"
import dotenv from "dotenv";
import {v4 as uuid} from "uuid"
// import { userRoute } from "./api/routes/user.route.js";
import { merchantRoutes } from "./api/routes/merchant.route.js";
import { consumerRouter } from "./api/routes/consumer.route.js";
import { dbConnect } from "./utils/dbutil.js";
import { productRoutes } from "./api/routes/product.route.js";
import { sequelize } from "./config/db.js";

dotenv.config();
const app = express();

//connection to the database
dbConnect();


// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors());
app.use(morgan("dev"))
app.use("/uploads",express.static("uploads"))

// app.use(loggerMiddleware.logger);

// API base point
app.get("/", (req, res) => res.send("API base point"));
app.get("/api/v1", (req, res) => res.send("API v1 base point"));

// all user route 

// app.use("/api/v1/user", userRoute);
app.use("/api/v1/merchant", merchantRoutes);
app.use("/api/v1/consumer", consumerRouter);
app.use("/api/v1/product", productRoutes);



// connect to the server and database
app.listen(process.env.PORT, async () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
  
});
