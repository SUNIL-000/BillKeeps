import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../../config/db.js";

export const Consumer = sequelize.define(
  "consumer",
  {
    consumerId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey:true
    },

    contactNo: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);


