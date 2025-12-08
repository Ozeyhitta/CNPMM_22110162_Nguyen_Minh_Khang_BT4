const express = require("express");
const {
  getProducts,
  getAllProducts,
  getProductById,
  searchProducts,
  filterProducts,
} = require("../controllers/productController");

const {
  getCategories,
  getCategoryById,
} = require("../controllers/categoryController");

const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus,
} = require("../controllers/favoriteController");

const {
  createProductView,
  getAllProductViews,
  getProductViewsByProductId,
  updateProductView,
  deleteProductView,
} = require("../controllers/productViewController");

const {
  addProductComment,
  getProductComments,
  getProductStats,
  deleteProductComment,
} = require("../controllers/productCommentController");

const {
  getSimilarProducts,
  getRecommendedProducts,
  getPopularProducts,
  getRecentlyViewed,
} = require("../controllers/productRecommendationController");

const {
  createProductPurchase,
  getProductPurchaseCount,
  getAllPurchaseCounts,
} = require("../controllers/productPurchaseController");

const { createUser, handleLogin } = require("../controllers/userController");

const {
  forgotPassword,
  resetPassword,
  checkOTP,
  logout,
} = require("../controllers/auth.controller");

const { auth, optionalAuth } = require("../middleware/auth");

const {
  registerValidation,
  loginValidation,
  forgotValidation,
  checkOtpValidation,
  resetPasswordValidation,
} = require("../validation/user.validation");

const { getProductsValidation } = require("../validation/product.validation");

const {
  globalLimiter,
  loginLimiter,
  otpLimiter,
  productDataLimiter,
} = require("../middleware/rateLimit");

const router = express.Router();

// =========================
// PUBLIC ROUTES (Không cần auth)
// =========================

// Test route
router.get("/", globalLimiter, (req, res) => {
  return res.status(200).json("Hello world api");
});

// Product routes (Public - ai cũng xem được)
router.get("/products/search", globalLimiter, searchProducts);
router.get("/products", productDataLimiter, getProductsValidation, getProducts);
router.get("/all-products", productDataLimiter, getAllProducts);
router.get("/products/filter", productDataLimiter, filterProducts);
// Route with parameter must be last
router.get("/products/:id", productDataLimiter, getProductById);

// Category routes (Public - ai cũng xem được)
router.get("/categories", productDataLimiter, getCategories);
router.get("/categories/:id", productDataLimiter, getCategoryById);

// Favorite routes (Protected - cần đăng nhập)
router.post("/favorites", auth, addToFavorites);
router.delete("/favorites/:productId", auth, removeFromFavorites);
router.get("/favorites", auth, getUserFavorites);
router.get("/favorites/:productId/status", auth, checkFavoriteStatus);

// Product View routes (Public - nhưng có thể track user nếu đăng nhập)
// Tạo mới lượt xem sản phẩm (sử dụng optionalAuth để lấy user info nếu có)
router.post("/productviews", optionalAuth, createProductView);

// Lấy tất cả lượt xem sản phẩm (sử dụng optionalAuth để lấy user info nếu có)
router.get("/productviews", optionalAuth, getAllProductViews);

// Lấy lượt xem sản phẩm theo sản phẩm ID
router.get("/productviews/:productId", getProductViewsByProductId);

// Cập nhật lượt xem sản phẩm
router.put("/productviews/:id", updateProductView);

// Xóa lượt xem sản phẩm
router.delete("/productviews/:id", deleteProductView);

// Product Purchase routes
router.post("/productpurchases", optionalAuth, createProductPurchase);
router.get("/productpurchases/count/:productId", getProductPurchaseCount);
router.get("/productpurchases/counts", getAllPurchaseCounts);

// Product Comment routes (Protected for posting, Public for viewing)
router.post(
  "/products/:productId/comments",
  globalLimiter,
  auth,
  addProductComment
);
router.get("/products/:productId/comments", globalLimiter, getProductComments);
router.get("/products/:productId/stats", globalLimiter, getProductStats);
router.delete(
  "/products/comments/:commentId",
  globalLimiter,
  auth,
  deleteProductComment
);

// Product Recommendation routes (Public)
router.get("/products/:productId/similar", globalLimiter, getSimilarProducts);
router.get("/products/recommended", productDataLimiter, getRecommendedProducts);
router.get("/products/popular", productDataLimiter, getPopularProducts);

// Register + Login + Logout (Public)
router.post("/register", globalLimiter, registerValidation, createUser);
router.post("/login", loginLimiter, loginValidation, handleLogin);
router.post("/logout", globalLimiter, logout);

// OTP routes (Public)
router.post("/forgot-password", otpLimiter, forgotValidation, forgotPassword);
router.post("/check-otp", otpLimiter, checkOtpValidation, checkOTP);
router.post(
  "/reset-password",
  globalLimiter,
  resetPasswordValidation,
  resetPassword
);

module.exports = router;
