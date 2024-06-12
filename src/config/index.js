const { sequelize } = require("./db");
const { db: dbConfig, server: serverConfig, jwt: jwtConfig } = require("./env");

module.exports = {
  sequelize,
  dbConfig,
  serverConfig,
  jwtConfig,
};
