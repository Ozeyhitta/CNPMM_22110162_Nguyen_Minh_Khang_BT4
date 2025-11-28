// =========================
// CATEGORY CONTROLLER
// =========================
const {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} = require("../services/categoryService");

// =========================
// GET ALL CATEGORIES (Public)
// =========================
const getCategories = async (req, res) => {
  try {
    const result = await getCategoriesService();

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get categories controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy danh sách danh mục",
    });
  }
};

// =========================
// GET CATEGORY BY ID (Public)
// =========================
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getCategoryByIdService(id);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Get category by id controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// =========================
// CREATE CATEGORY (Admin only)
// =========================
const createCategory = async (req, res) => {
  try {
    const result = await createCategoryService(req.body);

    if (result.EC === 0) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Create category controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi tạo danh mục",
    });
  }
};

// =========================
// UPDATE CATEGORY (Admin only)
// =========================
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await updateCategoryService(id, req.body);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Update category controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi cập nhật danh mục",
    });
  }
};

// =========================
// DELETE CATEGORY (Admin only)
// =========================
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteCategoryService(id);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Delete category controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi xóa danh mục",
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
