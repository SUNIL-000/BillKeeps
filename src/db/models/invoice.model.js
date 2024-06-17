import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../../config/db.js";


export const Invoice = sequelize.define("invoice", {
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  merchant_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoice_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_amount: {
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

await sequelize.sync();

