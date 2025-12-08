const {
  createUserService,
  loginService,
  getUserService,
} = require("../services/userService");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};

// =========================
// GET CURRENT USER INFO (User chỉ xem được thông tin của chính mình)
// =========================
const getUser = async (req, res) => {
  try {
    // req.user được inject từ middleware auth
    // User chỉ xem được thông tin của chính mình
    const userData = {
      email: req.user.email || "",
      name: req.user.name || "",
      role: req.user.role || "user",
    };

    return res.status(200).json({
      EC: 0,
      EM: "Lấy thông tin user thành công",
      data: userData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
};
