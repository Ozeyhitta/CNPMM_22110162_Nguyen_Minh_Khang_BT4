// const express = require("express");
// const {
//   createUser,
//   handleLogin,
//   getUser,
//   getAccount,
// } = require("../controllers/userController");

// const {
//   forgotPassword,
//   resetPassword,
// } = require("../controllers/auth.controller");

// const auth = require("../middleware/auth");
// const delay = require("../middleware/delay");

// const routerAPI = express.Router();

// // Test route
// routerAPI.get("/", (req, res) => {
//   return res.status(200).json("Hello world api");
// });

// // Register + Login
// routerAPI.post("/register", createUser);
// routerAPI.post("/login", handleLogin);

// // Forgot + Reset password
// routerAPI.post("/forgot-password", forgotPassword);
// routerAPI.post("/check-otp", checkOTP);
// routerAPI.post("/reset-password", resetPassword);

// // Protected routes
// routerAPI.get("/user", auth, getUser);
// routerAPI.get("/account", auth, delay, getAccount);

// module.exports = routerAPI;
const express = require("express");

const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");

const {
  forgotPassword,
  resetPassword,
  checkOTP,
} = require("../controllers/auth.controller");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

const {
  registerValidation,
  loginValidation,
  forgotValidation,
  checkOtpValidation,
  resetPasswordValidation,
} = require("../validation/user.validation");

const {
  getProductsValidation,
  createProductValidation,
  updateProductValidation,
} = require("../validation/product.validation");

const {
  createUserValidation,
  updateUserValidation,
  updateUserRoleValidation,
} = require("../validation/admin.validation");

const {
  createUser: createUserByAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

const {
  globalLimiter,
  loginLimiter,
  otpLimiter,
} = require("../middleware/rateLimit");

const authorize = require("../middleware/authorize");

const routerAPI = express.Router();

// =========================
// PUBLIC ROUTES (Không cần auth)
// =========================

// Test route
routerAPI.get("/", globalLimiter, (req, res) => {
  return res.status(200).json("Hello world api");
});

// Product routes (Public - ai cũng xem được)
routerAPI.get("/products", globalLimiter, getProductsValidation, getProducts);
routerAPI.get("/products/:id", globalLimiter, getProductById);

// Register + Login (Public)
routerAPI.post("/register", globalLimiter, registerValidation, createUser);
routerAPI.post("/login", loginLimiter, loginValidation, handleLogin);

// OTP routes (Public)
routerAPI.post(
  "/forgot-password",
  otpLimiter,
  forgotValidation,
  forgotPassword
);
routerAPI.post("/check-otp", otpLimiter, checkOtpValidation, checkOTP);
routerAPI.post(
  "/reset-password",
  globalLimiter,
  resetPasswordValidation,
  resetPassword
);

// =========================
// PROTECTED ROUTES (Cần đăng nhập)
// =========================

// User routes (Cần đăng nhập)
routerAPI.get("/user", globalLimiter, auth, getUser);

// =========================
// ADMIN ROUTES (Chỉ admin mới truy cập)
// =========================

// Account route (Admin only)
routerAPI.get(
  "/account",
  globalLimiter,
  auth,
  authorize("admin"),
  delay,
  getAccount
);

// Product Admin routes (Admin only)
routerAPI.post(
  "/products",
  globalLimiter,
  auth,
  authorize("admin"),
  createProductValidation,
  createProduct
);

routerAPI.put(
  "/products/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  updateProductValidation,
  updateProduct
);

routerAPI.delete(
  "/products/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  deleteProduct
);

// =========================
// ADMIN USER MANAGEMENT ROUTES (CRUD)
// Chỉ admin mới có thể truy cập
// =========================

// CREATE - Tạo user mới (Admin only)
routerAPI.post(
  "/admin/users",
  globalLimiter,
  auth,
  authorize("admin"),
  createUserValidation,
  createUserByAdmin
);

// READ - Lấy danh sách users (Admin only)
routerAPI.get(
  "/admin/users",
  globalLimiter,
  auth,
  authorize("admin"),
  getAllUsers
);

// READ - Lấy user theo ID (Admin only)
routerAPI.get(
  "/admin/users/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  getUserById
);

// UPDATE - Cập nhật thông tin user (Admin only)
routerAPI.put(
  "/admin/users/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  updateUserValidation,
  updateUser
);

// UPDATE - Cập nhật role của user (Admin only) - Route riêng để tương thích
routerAPI.put(
  "/admin/users/:id/role",
  globalLimiter,
  auth,
  authorize("admin"),
  updateUserRoleValidation,
  updateUserRole
);

// DELETE - Xóa user (Admin only)
routerAPI.delete(
  "/admin/users/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  deleteUser
);

module.exports = routerAPI;
