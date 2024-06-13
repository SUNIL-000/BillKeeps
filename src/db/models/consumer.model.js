import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("sqlite::memory:");

const Consumer = sequelize.define("consumer", {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },

  consumer_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

await sequelize.sync({ force: true });
export { Consumer };
