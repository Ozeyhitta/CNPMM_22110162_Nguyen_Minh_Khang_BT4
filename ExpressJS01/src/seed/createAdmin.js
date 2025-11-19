/**
 * Script tạo user admin mẫu
 * Chạy: node src/seed/createAdmin.js
 */

require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

const createAdmin = async () => {
  try {
    // Kết nối database
    await sequelize.authenticate();
    console.log("✅ Kết nối database thành công");

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({
      where: { email: "admin@example.com" },
    });

    if (existingAdmin) {
      // Cập nhật role thành admin nếu chưa phải admin
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("✅ Đã cập nhật user thành admin");
      } else {
        console.log("ℹ️  Admin đã tồn tại");
      }
      console.log("📧 Email: admin@example.com");
      console.log("🔑 Password: admin123");
      return;
    }

    // Tạo admin mới
    const hashPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashPassword,
      role: "admin",
    });

    console.log("✅ Tạo admin thành công!");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Hãy đổi mật khẩu sau khi đăng nhập!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

createAdmin();

