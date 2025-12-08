const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserService = async (name, email, password) => {
  const exist = await User.findOne({ where: { email } });

  if (exist) {
    return { EC: 1, EM: "Email đã tồn tại" };
  }

  const hash = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hash });

  return { EC: 0, EM: "Tạo tài khoản thành công" };
};

const loginService = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) return { EC: 1, EM: "Email không tồn tại" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { EC: 2, EM: "Sai mật khẩu" };

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "user", // Thêm role vào JWT token
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    EC: 0,
    EM: "Đăng nhập thành công",
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "user",
    },
  };
};

const getUserService = async () => {
  const users = await User.findAll();
  return { EC: 0, data: users };
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
};
