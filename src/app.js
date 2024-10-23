import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { merchantRoutes } from "./api/routes/merchant.route.js";
import { consumerRouter } from "./api/routes/consumer.route.js";
import { productRoutes } from "./api/routes/product.route.js";
import { invoiceItem } from "./api/routes/invoice_item.route.js";
import { sequelize } from "./config/db.js";
import { invoiceRouter } from "./api/routes/invoice.route.js";
import { otpRouter } from "./api/routes/otp.route.js";
import { config } from "./config/env.js";
import { feedbackroutes } from "./api/routes/feedback.route.js";


const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(morgan("dev"));

// Static folder
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://billkeeps.com",
      "https://merchant.billkeeps.com",
      "https://consumer.billkeeps.com",
      "https://www.billkeeps.com",
    ],
    credentials: true,
  })
);

const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);
app.set("views", path.join(dir, "views"));

// API base point
// app.get("/", (req, res) => res.send("API base point"));
app.get("/api/v1", (req, res) => res.send("API v1 base point"));

app.use("/api/v1/merchant", merchantRoutes);
app.use("/api/v1/consumer", consumerRouter);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/invoice", invoiceRouter);
app.use("/api/v1/invoice-item", invoiceItem);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/feedback", feedbackroutes);


// Connect to the server and database
app.listen(config?.server?.port, async () => {
  console.log(`Server running on http://localhost:${config.server.port}`);
  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
});
