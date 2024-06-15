import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("sqlite::memory:");

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

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Consumer tables created!");
  } catch (error) {
    console.error("Unable to create consumer tables", error);
  }
})();