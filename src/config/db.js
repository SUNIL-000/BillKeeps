const { db } = require("./env");
const { Sequelize } = require("sequelize");

exports.sequelize = new Sequelize(db.connectionURI, {
  dialect: "postgres",
  logging: false,
});
