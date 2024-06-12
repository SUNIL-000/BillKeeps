require("dotenv").config();

module.exports = {
  db: {
    connectionURI: process.env.DB_CONNECTION_URI,
  },
  server: {
    port: process.env.PORT || 5000,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  },
};
