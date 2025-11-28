const User = require("../models/user");
const bcrypt = require("bcrypt");

// =========================
// CREATE USER
// =========================
const createUserService = async (name, email, password, role = "user") => {
  try {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return {
        EC: 1,
        EM: "Email đã tồn tại",
      };
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

    return {
      EC: 0,
      EM: "Tạo user thành công",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Create user service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi tạo user",
    };
  }
};

// =========================
// GET ALL USERS
// =========================
const getAllUsersService = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "otp", "otpExpire"] }, // Không trả về password và OTP
    });

    return {
      EC: 0,
      EM: "Lấy danh sách users thành công",
      data: users,
    };
  } catch (error) {
    console.error("Get all users service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy danh sách users",
    };
  }
};

// =========================
// GET USER BY ID
// =========================
const getUserByIdService = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "otp", "otpExpire"] },
    });

    if (!user) {
      return {
        EC: 1,
        EM: "Không tìm thấy user",
      };
    }

    return {
      EC: 0,
      EM: "Lấy thông tin user thành công",
      data: user,
    };
  } catch (error) {
    console.error("Get user by id service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server",
    };
  }
};

// =========================
// UPDATE USER
// =========================
const updateUserService = async (id, updateData) => {
  try {
    const { name, email, password, role } = updateData;

    const user = await User.findByPk(id);

    if (!user) {
      return {
        EC: 1,
        EM: "Không tìm thấy user",
      };
    }

    // Kiểm tra email mới có trùng với user khác không
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return {
          EC: 1,
          EM: "Email đã được sử dụng bởi user khác",
        };
      }
      user.email = email;
    }

    // Cập nhật các field
    if (name !== undefined) user.name = name;
    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return {
          EC: 1,
          EM: "Role phải là 'user' hoặc 'admin'",
        };
      }
      user.role = role;
    }
    if (password !== undefined) {
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
    }

    await user.save();

    return {
      EC: 0,
      EM: "Cập nhật user thành công",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Update user service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi cập nhật user",
    };
  }
};

// =========================
// UPDATE USER ROLE
// =========================
const updateUserRoleService = async (id, role) => {
  try {
    if (!role || !["user", "admin"].includes(role)) {
      return {
        EC: 1,
        EM: "Role phải là 'user' hoặc 'admin'",
      };
    }

    const user = await User.findByPk(id);

    if (!user) {
      return {
        EC: 1,
        EM: "Không tìm thấy user",
      };
    }

    user.role = role;
    await user.save();

    return {
      EC: 0,
      EM: "Cập nhật role thành công",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Update user role service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi cập nhật role",
    };
  }
};

// =========================
// DELETE USER
// =========================
const deleteUserService = async (id, currentUserEmail) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return {
        EC: 1,
        EM: "Không tìm thấy user",
      };
    }

    // Không cho phép xóa chính mình
    if (user.email === currentUserEmail) {
      return {
        EC: 1,
        EM: "Không thể xóa chính mình",
      };
    }

    await user.destroy();

    return {
      EC: 0,
      EM: "Xóa user thành công",
    };
  } catch (error) {
    console.error("Delete user service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi xóa user",
    };
  }
};

module.exports = {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  updateUserRoleService,
  deleteUserService,
};
