const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { getAccount } = require("../controllers/userController");

const { auth } = require("../middleware/auth");
const delay = require("../middleware/delay");

const {
  createProductValidation,
  updateProductValidation,
} = require("../validation/product.validation");

const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../validation/category.validation");

const { globalLimiter } = require("../middleware/rateLimit");
const authorize = require("../middleware/authorize");

const router = express.Router();

// =========================
// ADMIN ROUTES (Chỉ admin mới truy cập)
// =========================

// Account route (Admin only)
router.get(
  "/account",
  globalLimiter,
  auth,
  authorize("admin"),
  delay,
  getAccount
);

// Product Admin routes (Admin only)
router.post(
  "/products",
  globalLimiter,
  auth,
  authorize("admin"),
  createProductValidation,
  createProduct
);

router.put(
  "/products/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  updateProductValidation,
  updateProduct
);

router.delete(
  "/products/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  deleteProduct
);

// Category Admin routes (Admin only)
router.post(
  "/categories",
  globalLimiter,
  auth,
  authorize("admin"),
  createCategoryValidation,
  createCategory
);

router.put(
  "/categories/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  updateCategoryValidation,
  updateCategory
);

router.delete(
  "/categories/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  deleteCategory
);

module.exports = router;
