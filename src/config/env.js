import dotenv from "dotenv";
dotenv.config({
  path: ".env"
});

export const config = {
  db: {
    connectionURI: process.env.DB_CONNECTION_URI,
  },
  server: {
    port: process.env.PORT || 5000,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET_KEY,
    jwtAccessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  },
  bcrypt: {
    salt: process.env.BCRYPT_SALT,
  },
  tandc: process.env.TANDC,
  webHooks: {
    merchantsHookUrl: process.env.MERCHANT_HOOKS_URL,
    consumerHookUrl: process.env.CONSUMER_HOOKS_URL,

  }
};
