const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config");
const { Roles } = require("../../enums");

const Merchant = sequelize.define(
  "merchants",
  {
    merchantId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessLogoUrl: {
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
  },
  {
    timestamps: true,
  }
);

Merchant.prototype.toJSON = function () {
  let attributes = Object.assign({}, this.get());

  delete attributes.password;
  return attributes;
};

module.exports = Merchant;
