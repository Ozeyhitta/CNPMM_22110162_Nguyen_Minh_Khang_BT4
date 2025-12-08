const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendMail = require("../utils/sendMail");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        EC: 1,
        EM: "Email không tồn tại trong hệ thống",
      });
    }

    // Tạo OTP 6 số
    const otp = crypto.randomInt(100000, 999999).toString();

    // Lưu OTP vào database
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    await user.save();

    // Gửi email
    const subject = "Đặt lại mật khẩu - FullStack App";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1890ff;">Đặt lại mật khẩu</h2>
        <p>Xin chào ${user.name},</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <div style="background-color: #f6ffed; border: 1px solid #b7eb8f; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #52c41a;">
            Mã OTP của bạn: <span style="font-size: 24px;">${otp}</span>
          </p>
        </div>
        <p><strong>Lưu ý:</strong></p>
        <ul>
          <li>Mã OTP sẽ hết hạn sau 10 phút</li>
          <li>Vui lòng không chia sẻ mã này với ai khác</li>
          <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
        </ul>
        <p>Trân trọng,<br>Đội ngũ FullStack App</p>
      </div>
    `;

    await sendMail(user.email, subject, html);

    return res.json({
      EC: 0,
      EM: "Đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra hộp thư!",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.",
    });
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
      return res.status(400).json({
        EC: 1,
        EM: "Mã OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    return res.json({
      EC: 0,
      EM: "Mã OTP hợp lệ. Bạn có thể đặt lại mật khẩu.",
    });
  } catch (error) {
    console.error("Check OTP error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Có lỗi xảy ra khi kiểm tra OTP",
    });
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
      return res.status(400).json({
        EC: 1,
        EM: "Mã OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    // Hash password mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.otp = "";
    user.otpExpire = null;

    await user.save();

    return res.json({
      EC: 0,
      EM: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.",
    });
  } catch (err) {
    console.log("RESET ERROR:", err);
    res.status(500).json({
      EC: 1,
      EM: "Có lỗi xảy ra khi đặt lại mật khẩu",
    });
  }
};

// Logout - tạo sessionId mới cho anonymous user
const logout = async (req, res) => {
  try {
    // Tạo sessionId mới
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    console.log("User logged out, new sessionId created:", sessionId);

    return res.json({
      EC: 0,
      EM: "Đăng xuất thành công",
      DT: {
        sessionId: sessionId,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Có lỗi xảy ra khi đăng xuất",
    });
  }
};

module.exports = {
  forgotPassword,
  checkOTP,
  resetPassword,
  logout,
};
