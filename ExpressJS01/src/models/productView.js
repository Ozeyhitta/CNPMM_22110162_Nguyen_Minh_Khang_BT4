// models/ProductView.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductView = sequelize.define(
  "ProductView",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null for anonymous users
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
    sessionId: {
      type: DataTypes.STRING, // For anonymous users
      allowNull: true,
    },
    viewedAt: {
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
        fields: ["sessionId", "productId"],
      },
      {
        fields: ["viewedAt"],
      },
    ],
  }
);

module.exports = ProductView;
