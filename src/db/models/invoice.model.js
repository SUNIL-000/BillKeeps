import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../../config/db.js";

export const Invoice = sequelize.define(
  "invoice",
  {
    invoice_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    merchant_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    consumer_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total_amount: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: true }
);
