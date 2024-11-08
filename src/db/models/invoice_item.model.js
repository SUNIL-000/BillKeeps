import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const InvoiceItem = sequelize.define(
  "invoice_item",
  {
    invoiceItemId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    discountAmount: { 
      type: DataTypes.DOUBLE,
    },
    discountPercent: {
      type: DataTypes.DOUBLE,
    },
    salePrice: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    timestamps: true,
  }
);
