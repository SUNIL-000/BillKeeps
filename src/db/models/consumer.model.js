import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../../config/db.js";

 export const Consumer =  sequelize.define("consumer", {
  consumer_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:"consumer"
  },
},{
  timestamps:true
});


    await sequelize.sync();
    console.log("Consumer tables created!");
  