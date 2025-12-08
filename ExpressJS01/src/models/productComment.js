// models/ProductComment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductComment = sequelize.define(
  "ProductComment",
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true, // Optional rating with comment
      validate: {
        min: 0,
        max: 5,
      },
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Auto approve for simplicity
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    indexes: [
      {
        fields: ["productId", "createdAt"],
      },
      {
        fields: ["userId", "createdAt"],
      },
    ],
  }
);

module.exports = ProductComment;
