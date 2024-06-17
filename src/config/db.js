// const { db } = require("./env");
import  { Sequelize } from "sequelize";

export const sequelize = new Sequelize(`postgres://postgres:1234@localhost:5432/billing-client`, {
  dialect: "postgres",
  logging: false,
});
