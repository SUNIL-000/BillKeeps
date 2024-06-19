import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";


export const Merchant =sequelize.define(
  "merchant",
  {
    merchant_id: {
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   
   
  },
  { timestamps: true }
);

    await sequelize.sync();
   
