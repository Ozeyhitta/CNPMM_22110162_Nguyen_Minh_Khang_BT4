const express = require("express");
const { getUser } = require("../controllers/userController");
const {
  mergeSessionDataToUser,
} = require("../controllers/productViewController");
const { auth } = require("../middleware/auth");
const { globalLimiter } = require("../middleware/rateLimit");

const router = express.Router();

// =========================
// PROTECTED ROUTES (Cần đăng nhập)
// =========================

// User routes (Cần đăng nhập)
router.get("/user", globalLimiter, auth, getUser);

// Product View routes (Cần đăng nhập)
router.post("/merge-session-data", globalLimiter, auth, mergeSessionDataToUser);

module.exports = router;
