const rateLimit = require("express-rate-limit");

exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Quá nhiều request, thử lại sau.",
});

// Áp dụng giới hạn cho login
exports.loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: "Đăng nhập quá nhiều lần, thử lại sau.",
});

// OTP phải giới hạn cực mạnh
exports.otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "Gửi OTP quá nhiều lần.",
});

// Rate limiter cho API lấy dữ liệu sản phẩm (ít nghiêm ngặt hơn)
exports.productDataLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 200, // 200 requests per minute
  message: "Quá nhiều request lấy dữ liệu sản phẩm, thử lại sau.",
});
