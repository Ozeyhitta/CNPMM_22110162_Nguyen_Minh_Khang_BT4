const User = require("../models/user");
const bcrypt = require("bcrypt");

// =========================
// CREATE USER (Admin only)
// =========================
const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        EC: 1,
        EM: "Email đã tồn tại",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return res.status(201).json({
      EC: 0,
      EM: "Tạo user thành công",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi tạo user",
    });
  }
};

// =========================
// GET ALL USERS (Admin only)
// =========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "otp", "otpExpire"] }, // Không trả về password và OTP
    });

    return res.status(200).json({
      EC: 0,
      EM: "Lấy danh sách users thành công",
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy danh sách users",
    });
  }
};

// =========================
// GET USER BY ID (Admin only)
// =========================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "otp", "otpExpire"] },
    });

    if (!user) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy user",
      });
    }

    return res.status(200).json({
      EC: 0,
      EM: "Lấy thông tin user thành công",
      data: user,
    });
  } catch (error) {
    console.error("Get user by id error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// =========================
// UPDATE USER (Admin only)
// =========================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy user",
      });
    }

    // Kiểm tra email mới có trùng với user khác không
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          EC: 1,
          EM: "Email đã được sử dụng bởi user khác",
        });
      }
      user.email = email;
    }

    // Cập nhật các field
    if (name !== undefined) user.name = name;
    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          EC: 1,
          EM: "Role phải là 'user' hoặc 'admin'",
        });
      }
      user.role = role;
    }
    if (password !== undefined) {
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
    }

    await user.save();

    return res.status(200).json({
      EC: 0,
      EM: "Cập nhật user thành công",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi cập nhật user",
    });
  }
};

// =========================
// UPDATE USER ROLE (Admin only) - Giữ lại để tương thích
// =========================
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        EC: 1,
        EM: "Role phải là 'user' hoặc 'admin'",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy user",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      EC: 0,
      EM: "Cập nhật role thành công",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi cập nhật role",
    });
  }
};

// =========================
// DELETE USER (Admin only)
// =========================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy user",
      });
    }

    // Không cho phép xóa chính mình
    if (user.email === req.user.email) {
      return res.status(400).json({
        EC: 1,
        EM: "Không thể xóa chính mình",
      });
    }

    await user.destroy();

    return res.status(200).json({
      EC: 0,
      EM: "Xóa user thành công",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi xóa user",
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
};
