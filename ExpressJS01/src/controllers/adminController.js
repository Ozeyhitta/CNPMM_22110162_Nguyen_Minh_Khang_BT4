const {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  updateUserRoleService,
  deleteUserService,
} = require("../services/adminService");

// =========================
// CREATE USER (Admin only)
// =========================
const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    const result = await createUserService(name, email, password, role);

    if (result.EC === 0) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Create user controller error:", error);
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
    const result = await getAllUsersService();

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get all users controller error:", error);
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

    const result = await getUserByIdService(id);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Get user by id controller error:", error);
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
    const updateData = req.body;

    const result = await updateUserService(id, updateData);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Update user controller error:", error);
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

    const result = await updateUserRoleService(id, role);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Update user role controller error:", error);
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

    const result = await deleteUserService(id, req.user.email);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Delete user controller error:", error);
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
