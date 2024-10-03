import { sequelize } from "../../config/db.js";
import { Consumer } from "./consumer.model.js";
import { Invoice } from "./invoice.model.js";
import { Merchant } from "./merchant.model.js";
import { Product } from "./product.model.js";
import { InvoiceItem } from "./invoice_item.model.js";
import { Otp } from "./otps.model.js";
import { Feedback } from "./feedback.model.js";

// One-to-many relation between Merchant and Product
Merchant.hasMany(Product, { foreignKey: "merchantId" });
Product.belongsTo(Merchant, { foreignKey: "merchantId" });

// One-to-many relation between Invoice and InvoiceItem
Invoice.hasMany(InvoiceItem, { foreignKey: "invoiceId" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoiceId" });

// One-to-many relation between Product and InvoiceItem
Product.hasMany(InvoiceItem, { foreignKey: "productId" });
InvoiceItem.belongsTo(Product, { foreignKey: "productId" });

// One-to-many relation between Merchant and Invoice
Merchant.hasMany(Invoice, { foreignKey: "merchantId" });
Invoice.belongsTo(Merchant, { foreignKey: "merchantId" });

// One-to-many relation between Consumer and Invoice
Consumer.hasMany(Invoice, { foreignKey: "consumerId" });
Invoice.belongsTo(Consumer, { foreignKey: "consumerId" });

// One-to-one relation between Consumer and Otp
Consumer.hasOne(Otp, { foreignKey: "consumerId" });
Otp.belongsTo(Consumer, { foreignKey: "consumerId" });

Invoice.hasOne(Feedback, { foreignKey: "invoiceId" });
Feedback.belongsTo(Invoice, { foreignKey: "invoiceId" });

await sequelize.sync({});
console.log("Tables are created successfully");

export { Merchant, Product, Consumer, Invoice, InvoiceItem, Otp, Feedback };
