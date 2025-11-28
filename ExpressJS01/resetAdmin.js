require("dotenv").config();
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const User = require("./src/models/user");

// KẾT NỐI DATABASE
const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  }
);

async function resetAdmin() {
  try {
    // MẬT KHẨU MỚI BẠN MUỐN ĐẶT
    const newPassword = "admin123";
    const hash = await bcrypt.hash(newPassword, 10);

    // TÌM ADMIN
    const email = "admin@gmail.com";
    const admin = await User.findOne({ where: { email } });

    if (!admin) {
      console.log("❌ Chưa có admin, tạo admin mới...");
      await User.create({
        name: "Admin",
        email,
        password: hash,
        role: "admin",
      });
      console.log("✅ Tạo admin thành công! Mật khẩu: " + newPassword);
    } else {
      console.log("🔧 Admin tồn tại. Đang cập nhật mật khẩu...");
      admin.password = hash;
      await admin.save();
      console.log(
        "✅ Reset mật khẩu admin thành công! Mật khẩu mới: " + newPassword
      );
    }

    process.exit(0);
  } catch (e) {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  }
}

resetAdmin();
