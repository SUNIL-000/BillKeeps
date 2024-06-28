import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const Product = sequelize.define(
  "product",
  {
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    merchantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mrp: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
