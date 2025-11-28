const {
  getProductsService,
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  searchProductsService,
  filterProductsService,
} = require("../services/productService");

// =========================
// GET PRODUCTS (Public - không cần auth) - With Pagination
// =========================
const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 12, category = "" } = req.query;

    const result = await getProductsService(page, limit, category);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get products controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy danh sách sản phẩm",
    });
  }
};

// =========================
// GET ALL PRODUCTS (Public - không cần auth) - No Pagination
// =========================
const getAllProducts = async (req, res) => {
  try {
    let { category = "" } = req.query;

    const result = await getAllProductsService(category);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get all products controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy tất cả sản phẩm",
    });
  }
};

// =========================
// GET PRODUCT BY ID (Public)
// =========================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getProductByIdService(id);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Get product by id controller error:", error);
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
    const result = await createProductService(req.body);

    if (result.EC === 0) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Create product controller error:", error);
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

    const result = await updateProductService(id, req.body);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Update product controller error:", error);
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

    const result = await deleteProductService(id);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Delete product controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi xóa sản phẩm",
    });
  }
};

// =========================
// FUZZY SEARCH PRODUCTS
// =========================
const searchProducts = async (req, res) => {
  try {
    const { q = "" } = req.query;

    const result = await searchProductsService(q);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Search products controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi tìm kiếm sản phẩm",
    });
  }
};

// =========================
// FILTER PRODUCTS (multiple conditions)
// =========================
const filterProducts = async (req, res) => {
  try {
    const filters = req.query;

    // Parse string values to numbers for proper filtering
    const parsedFilters = {};
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== "") {
        // Try to parse as number for numeric filters
        if (['minPrice', 'maxPrice', 'minDiscount', 'maxDiscount', 'minViewCount', 'maxViewCount', 'minRating', 'maxRating'].includes(key)) {
          parsedFilters[key] = Number(value);
        } else {
          parsedFilters[key] = value;
        }
      }
    });

    console.log("Parsed filters:", parsedFilters);

    const result = await filterProductsService(parsedFilters);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Filter products controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lọc sản phẩm",
    });
  }
};

module.exports = {
  getProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterProducts,
};
