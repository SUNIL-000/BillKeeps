import { sequelize } from "../src/config";
const { models } = require("../src/db/models/index");

const args = process.argv;

if (args[2]) {
  if (args[2] == "-f") {
    sequelize.sync({ alter: true });
  }
} else {
  sequelize.sync();
}
