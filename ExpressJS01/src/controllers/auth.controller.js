const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendMail = require("../utils/sendMail");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // Tạo OTP 6 số
    const otp = crypto.randomInt(100000, 999999).toString();

    // Lưu OTP vào database
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    await user.save();

    // Gửi email
    const subject = "Đặt lại mật khẩu";
    const html = `<p>Mã OTP của bạn là: <strong>${otp}</strong></p>
                  <p>Mã này sẽ hết hạn sau 10 phút.</p>`;

    await sendMail(user.email, subject, html);

    return res.json({ message: "Đã gửi OTP đến email của bạn" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const checkOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      where: {
        email,
        otp,
        otpExpire: { [require("sequelize").Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    return res.json({ message: "OTP hợp lệ" });
  } catch (error) {
    console.error("Check OTP error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
        otp,
        otpExpire: { [require("sequelize").Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    // Hash password mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.otp = "";
    user.otpExpire = null;

    await user.save();

    return res.json({ message: "Đặt mật khẩu thành công!" });
  } catch (err) {
    console.log("RESET ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  forgotPassword,
  checkOTP,
  resetPassword,
};
