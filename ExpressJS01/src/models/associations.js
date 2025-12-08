// models/associations.js
const User = require("./user");
const Product = require("./product");
const Category = require("./category");
const Favorite = require("./favorite");
const ProductView = require("./productView");
const ProductComment = require("./productComment");
const ProductPurchase = require("./productPurchase");

// User associations
User.hasMany(Favorite, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(ProductView, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(ProductComment, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(ProductPurchase, { foreignKey: "userId", onDelete: "CASCADE" });

// Product associations
Product.hasMany(Favorite, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(ProductView, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(ProductComment, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});
Product.hasMany(ProductPurchase, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

// Favorite associations
Favorite.belongsTo(User, { foreignKey: "userId" });
Favorite.belongsTo(Product, { foreignKey: "productId", as: "product" });

// ProductView associations
ProductView.belongsTo(User, { foreignKey: "userId" });
ProductView.belongsTo(Product, { foreignKey: "productId", as: "product" });

// ProductComment associations
ProductComment.belongsTo(User, { foreignKey: "userId" });
ProductComment.belongsTo(Product, { foreignKey: "productId" });

// ProductPurchase associations
ProductPurchase.belongsTo(User, { foreignKey: "userId" });
ProductPurchase.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  User,
  Product,
  Category,
  Favorite,
  ProductView,
  ProductComment,
  ProductPurchase,
};
