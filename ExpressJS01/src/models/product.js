// models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
  // Thêm các trường mới cho lọc nâng cao
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Phần trăm giảm giá (0-100)
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Lượt xem
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0, // Đánh giá trung bình (0-5)
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Sản phẩm có đang hoạt động không
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Số lượng tồn kho
  },
});

module.exports = Product;
