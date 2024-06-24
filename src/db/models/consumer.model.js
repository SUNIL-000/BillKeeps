import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../../config/db.js";

export const Consumer = sequelize.define(
  "consumer",
  {
    consumer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey:true
    },

    contactNo: {
      type: DataTypes.INTEGER,
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


