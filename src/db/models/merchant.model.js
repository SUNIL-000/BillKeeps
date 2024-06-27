import { Sequelize, DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../../config/db.js";

export const Merchant = sequelize.define(
  "merchant",
  {
    merchantId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },

    buisnessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buisnessLogoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gstNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique:true
    },
    businessType :{
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);
