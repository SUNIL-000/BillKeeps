const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { loggerMiddleware } = require("./api/middleware");
const { serverConfig, sequelize } = require("./config");

const app = express();

const v1Router = express.Router();

// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(loggerMiddleware.logger);

// API base point
app.get("/", (req, res) => res.send("API base point"));
app.get("/api/v1", (req, res) => res.send("API v1 base point"));

app.use("/api/v1", v1Router);

// connect to the server and database
app.listen(serverConfig.port, async () => {
  console.log(`Server running on http://localhost:${serverConfig.port}`);
  // connect to the database
  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
});
