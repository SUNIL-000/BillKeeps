import { sequelize } from "../../config/db.js";
import { Consumer } from "./consumer.model.js";
import { Invoice } from "./invoice.model.js";
import { Merchant } from "./merchant.model.js";
import { Product } from "./product.model.js";
import { InvoiceItem } from "./invoice_item.model.js";

//one to many relation between merchant and product
Merchant.hasMany(Product, { foreignKey: "merchant_id" });
Product.belongsTo(Merchant, { foreignKey: "merchant_id" });

//one to many relation between invoice and invoice item
Invoice.hasMany(InvoiceItem, { foreignKey: "invoice_id" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoice_id" });

//one to many relation between product and invoice-item
Product.hasMany(InvoiceItem, { foreignKey: "product_id" });
InvoiceItem.belongsTo(Product, { foreignKey: "product_id" });

//one to many relation between merchant and invoice
Merchant.hasMany(Invoice, { foreignKey: "merchant_id" });
Invoice.belongsTo(Merchant, { foreignKey: "merchant_id" });

//one to many relation between merchant and invoice
Consumer.hasMany(Invoice, { foreignKey: "consumer_id" });
Invoice.belongsTo(Consumer, { foreignKey: "consumer_id" });

await sequelize.sync({ alter: true });
console.log("Tables are created successfully")

export { Merchant, Product, Consumer, Invoice, InvoiceItem };
