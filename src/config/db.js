import { Sequelize } from "sequelize";
import { config } from "./env.js";

export const sequelize = new Sequelize(config.db.connectionURI, {
  dialect: "postgres",
  logging: false,
});
