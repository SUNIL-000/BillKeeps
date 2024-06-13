import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("sqlite::memory:");

const InvoiceItem = sequelize.define("invoiceItem", {
  invoice_item_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

await sequelize.sync({ force: true });
export { InvoiceItem };
