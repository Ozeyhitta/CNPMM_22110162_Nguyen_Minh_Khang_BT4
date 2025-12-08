// models/ProductPurchase.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductPurchase = sequelize.define(
  "ProductPurchase",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Link to order if exists
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    purchasePrice: {
      type: DataTypes.INTEGER, // Price at time of purchase
      allowNull: false,
    },
    purchasedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      {
        fields: ["userId", "productId"],
      },
      {
        fields: ["productId", "purchasedAt"],
      },
      {
        fields: ["purchasedAt"],
      },
    ],
  }
);

module.exports = ProductPurchase;
