import { Sequelize, DataTypes } from "sequelize";
import { Merchant } from ".";

const sequelize = new Sequelize("sqlite::memory:");

const Merchant = sequelize.define("merchant", {
  merchant_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
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
export { Merchant, sequelize };
