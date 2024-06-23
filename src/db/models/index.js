import { sequelize } from "../../config/db.js";
import { Merchant } from "./merchant.model.js";
import { Product } from "./product.model.js";

Merchant.hasMany(Product, { foreignKey: "merchant_id" });
Product.belongsTo(Merchant, { foreignKey: "merchant_id" });

await sequelize.sync({ alter: true });
export { Merchant, Product };
