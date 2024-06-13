import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { dbConnect } from "./utils/dbutil.js";

import { userRoute } from "./api/routes/user.route.js";


config({
  path: ".env",
});

const app = express();
//connection to the database
dbConnect();


// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// app.use(loggerMiddleware.logger);

// API base point
app.get("/", (req, res) => res.send("API base point"));
app.get("/api/v1", (req, res) => res.send("API v1 base point"));

// all user route 

app.use("/api/v1/user", userRoute);


// connect to the server and database
app.listen(process.env.PORT, async () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
  
});
