import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db.js";

export const Invoice = sequelize.define(
  "invoice",
  {
    invoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    merchantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    consumerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    totalAmount: {
      type: DataTypes.DOUBLE,
    },
    returnValidity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    exchangeValidity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    invoiceUrl:{
      type:DataTypes.STRING,
      allowNull:true
    },

  },
  { timestamps: true }
);
