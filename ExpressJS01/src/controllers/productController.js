const Product = require("../models/product");

// =========================
// GET PRODUCTS (Public - không cần auth)
// =========================
const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 12, category = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const where = {};
    if (category) {
      where.category = category;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      offset,
      limit,
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      total: count,
      page,
      limit,
      data: rows,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy danh sách sản phẩm",
    });
  }
};

// =========================
// GET PRODUCT BY ID (Public)
// =========================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy sản phẩm",
      });
    }

    return res.status(200).json({
      EC: 0,
      EM: "Lấy sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("Get product by id error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// =========================
// CREATE PRODUCT (Admin only)
// =========================
const createProduct = async (req, res) => {
  try {
    const { name, category, price, thumbnail } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      thumbnail: thumbnail || "",
    });

    return res.status(201).json({
      EC: 0,
      EM: "Tạo sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi tạo sản phẩm",
    });
  }
};

// =========================
// UPDATE PRODUCT (Admin only)
// =========================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, thumbnail } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy sản phẩm",
      });
    }

    // Cập nhật các field được truyền vào
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;

    await product.save();

    return res.status(200).json({
      EC: 0,
      EM: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi cập nhật sản phẩm",
    });
  }
};

// =========================
// DELETE PRODUCT (Admin only)
// =========================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy sản phẩm",
      });
    }

    await product.destroy();

    return res.status(200).json({
      EC: 0,
      EM: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi xóa sản phẩm",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
