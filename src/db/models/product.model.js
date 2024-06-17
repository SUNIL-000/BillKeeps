import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../../config/db.js";

export const Product = sequelize.define(
  "product",
  {
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

await sequelize.sync();
