const rateLimit = require("express-rate-limit");

exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Quá nhiều request, thử lại sau.",
});

// Áp dụng giới hạn cho login
exports.loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: "Đăng nhập quá nhiều lần, thử lại sau.",
});

// OTP phải giới hạn cực mạnh
exports.otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "Gửi OTP quá nhiều lần.",
});
