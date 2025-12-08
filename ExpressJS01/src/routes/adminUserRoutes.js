const express = require("express");
const {
  createUser: createUserByAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

const { auth } = require("../middleware/auth");

const {
  createUserValidation,
  updateUserValidation,
  updateUserRoleValidation,
} = require("../validation/admin.validation");

const { globalLimiter } = require("../middleware/rateLimit");
const authorize = require("../middleware/authorize");

const router = express.Router();

// =========================
// ADMIN USER MANAGEMENT ROUTES (CRUD)
// Chỉ admin mới có thể truy cập
// =========================

// CREATE - Tạo user mới (Admin only)
router.post(
  "/admin/users",
  globalLimiter,
  auth,
  authorize("admin"),
  createUserValidation,
  createUserByAdmin
);

// READ - Lấy danh sách users (Admin only)
router.get(
  "/admin/users",
  globalLimiter,
  auth,
  authorize("admin"),
  getAllUsers
);

// READ - Lấy user theo ID (Admin only)
router.get(
  "/admin/users/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  getUserById
);

// UPDATE - Cập nhật thông tin user (Admin only)
router.put(
  "/admin/users/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  updateUserValidation,
  updateUser
);

// UPDATE - Cập nhật role của user (Admin only) - Route riêng để tương thích
router.put(
  "/admin/users/:id/role",
  globalLimiter,
  auth,
  authorize("admin"),
  updateUserRoleValidation,
  updateUserRole
);

// DELETE - Xóa user (Admin only)
router.delete(
  "/admin/users/:id",
  globalLimiter,
  auth,
  authorize("admin"),
  deleteUser
);

module.exports = router;
