import { sequelize } from "../../config/db.js";
import { Consumer } from "./consumer.model.js";
import { Invoice } from "./invoice.model.js";
import { Merchant } from "./merchant.model.js";
import { Product } from "./product.model.js";
import { InvoiceItem } from "./invoice_item.model.js";
import { Otp } from "./otps.model.js";

//one to many relation between merchant and product
Merchant.hasMany(Product, { foreignKey: "merchantId" });
Product.belongsTo(Merchant, { foreignKey: "merchantId" });

//one to many relation between invoice and invoice item
Invoice.hasMany(InvoiceItem, { foreignKey: "invoiceId" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoiceId" });

//one to many relation between product and invoice-item
Product.hasMany(InvoiceItem, { foreignKey: "productId" });
InvoiceItem.belongsTo(Product, { foreignKey: "productId" });

//one to many relation between merchant and invoice
Merchant.hasMany(Invoice, { foreignKey: "merchantId" });
Invoice.belongsTo(Merchant, { foreignKey: "merchantId" });

//one to many relation between merchant and invoice
Consumer.hasMany(Invoice, { foreignKey: "consumerId" });
Invoice.belongsTo(Consumer, { foreignKey: "consumerId" });

//one to one relation between consumer and otp

Consumer.hasOne(Otp, { foreignKey: "consumerId" ,as:"otp"});
Otp.belongsTo(Consumer, { foreignKey: "consumerId" ,as:"consumer"})

await sequelize.sync({ alter: true });
console.log("Tables are created successfully")

export { Merchant, Product, Consumer, Invoice, InvoiceItem, Otp };
