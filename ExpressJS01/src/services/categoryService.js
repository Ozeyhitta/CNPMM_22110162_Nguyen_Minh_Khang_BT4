// =========================
// CATEGORY SERVICE
// =========================
const Category = require("../models/category");

// =========================
// GET ALL CATEGORIES (Public)
// =========================
const getCategoriesService = async () => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    return {
      EC: 0,
      EM: "Lấy danh sách danh mục thành công",
      data: categories,
    };
  } catch (error) {
    console.error("Get categories service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy danh sách danh mục",
    };
  }
};

// =========================
// GET CATEGORY BY ID (Public)
// =========================
const getCategoryByIdService = async (id) => {
  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return {
        EC: 1,
        EM: "Không tìm thấy danh mục",
      };
    }

    return {
      EC: 0,
      EM: "Lấy danh mục thành công",
      data: category,
    };
  } catch (error) {
    console.error("Get category by id service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server",
    };
  }
};

// =========================
// CREATE CATEGORY (Admin only)
// =========================
const createCategoryService = async (categoryData) => {
  try {
    const { name, description, thumbnail } = categoryData;

    const category = await Category.create({
      name,
      description: description || "",
      thumbnail: thumbnail || "",
    });

    return {
      EC: 0,
      EM: "Tạo danh mục thành công",
      data: category,
    };
  } catch (error) {
    console.error("Create category service error:", error);

    // Handle unique constraint error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return {
        EC: 1,
        EM: "Tên danh mục đã tồn tại",
      };
    }

    return {
      EC: 1,
      EM: "Lỗi server khi tạo danh mục",
    };
  }
};

// =========================
// UPDATE CATEGORY (Admin only)
// =========================
const updateCategoryService = async (id, updateData) => {
  try {
    const { name, description, thumbnail } = updateData;

    const category = await Category.findByPk(id);

    if (!category) {
      return {
        EC: 1,
        EM: "Không tìm thấy danh mục",
      };
    }

    // Cập nhật các field được truyền vào
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (thumbnail !== undefined) category.thumbnail = thumbnail;

    await category.save();

    return {
      EC: 0,
      EM: "Cập nhật danh mục thành công",
      data: category,
    };
  } catch (error) {
    console.error("Update category service error:", error);

    // Handle unique constraint error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return {
        EC: 1,
        EM: "Tên danh mục đã tồn tại",
      };
    }

    return {
      EC: 1,
      EM: "Lỗi server khi cập nhật danh mục",
    };
  }
};

// =========================
// DELETE CATEGORY (Admin only)
// =========================
const deleteCategoryService = async (id) => {
  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return {
        EC: 1,
        EM: "Không tìm thấy danh mục",
      };
    }

    await category.destroy();

    return {
      EC: 0,
      EM: "Xóa danh mục thành công",
    };
  } catch (error) {
    console.error("Delete category service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi xóa danh mục",
    };
  }
};

module.exports = {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
