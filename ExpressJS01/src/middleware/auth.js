require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Những API không cần token
  const whiteLists = [
    "/register",
    "/login",
    "/forgot-password",
    "/check-otp",
    "/reset-password",
    "/products/recently-viewed",
  ];

  // Nếu request đang vào API không cần auth → cho qua
  if (whiteLists.includes(req.originalUrl.replace("/v1/api", ""))) {
    return next();
  }

  // Lấy token từ header
  const authorization = req.headers?.authorization;
  if (!authorization)
    return res.status(401).json({
      EC: 1,
      EM: "Người dùng chưa đăng nhập",
    });

  const token = authorization.split(" ")[1];
  if (!token)
    return res.status(401).json({
      EC: 1,
      EM: "Người dùng chưa đăng nhập",
    });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email || "",
      name: decoded.name || "",
      role: decoded.role || "user", // Lấy role từ JWT token
    };

    next();
  } catch (err) {
    console.log("JWT verification failed:", err.message);
    return res.status(401).json({
      EC: 1,
      EM: "Người dùng chưa đăng nhập",
    });
  }
};

// Optional auth middleware - lấy user info nếu có token, không bắt buộc
const optionalAuth = (req, res, next) => {
  const authorization = req.headers?.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id,
          email: decoded.email || "",
          name: decoded.name || "",
          role: decoded.role || "user",
        };
      } catch (error) {
        // Token invalid, ignore and continue without user info
        console.log("Invalid token in optional auth:", error.message);
      }
    }
  }
  next();
};

module.exports = {
  auth,
  optionalAuth,
};
