import  { sequelize }  from "./db";
import  { db as dbConfig, server as serverConfig, jwt as jwtConfig }  from "./env";

module.exports = {
  sequelize,
  dbConfig,
  serverConfig,
  jwtConfig,
};
