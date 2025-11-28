const Product = require("../models/product");
const Fuse = require("fuse.js");
const { Op } = require("sequelize");

// =========================
// REMOVE VIETNAMESE TONES
// =========================
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

// =========================
// GET PRODUCTS (Public - không cần auth) - With Pagination
// =========================
const getProductsService = async (page = 1, limit = 12, category = "") => {
  try {
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

    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      total: count,
      page,
      limit,
      data: rows,
    };
  } catch (error) {
    console.error("Get products service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy danh sách sản phẩm",
    };
  }
};

// =========================
// GET ALL PRODUCTS (Public - không cần auth) - No Pagination
// =========================
const getAllProductsService = async (category = "") => {
  try {
    const where = {};
    if (category) {
      where.category = category;
    }

    const products = await Product.findAll({
      where,
      order: [["id", "ASC"]],
    });

    return {
      EC: 0,
      EM: "Lấy tất cả sản phẩm thành công",
      total: products.length,
      data: products,
    };
  } catch (error) {
    console.error("Get all products service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy tất cả sản phẩm",
    };
  }
};

// =========================
// GET PRODUCT BY ID (Public)
// =========================
const getProductByIdService = async (id) => {
  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return {
        EC: 1,
        EM: "Không tìm thấy sản phẩm",
      };
    }

    return {
      EC: 0,
      EM: "Lấy sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    console.error("Get product by id service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server",
    };
  }
};

// =========================
// CREATE PRODUCT (Admin only)
// =========================
const createProductService = async (productData) => {
  try {
    const { name, category, price, thumbnail } = productData;

    const product = await Product.create({
      name,
      category,
      price,
      thumbnail: thumbnail || "",
    });

    return {
      EC: 0,
      EM: "Tạo sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    console.error("Create product service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi tạo sản phẩm",
    };
  }
};

// =========================
// UPDATE PRODUCT (Admin only)
// =========================
const updateProductService = async (id, updateData) => {
  try {
    const {
      name,
      category,
      price,
      thumbnail,
      discount,
      viewCount,
      rating,
      stock,
      isActive,
    } = updateData;

    const product = await Product.findByPk(id);

    if (!product) {
      return {
        EC: 1,
        EM: "Không tìm thấy sản phẩm",
      };
    }

    // Cập nhật các field được truyền vào
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (discount !== undefined) product.discount = discount;
    if (viewCount !== undefined) product.viewCount = viewCount;
    if (rating !== undefined) product.rating = parseFloat(rating) || 0;
    if (stock !== undefined) product.stock = stock;
    if (isActive !== undefined)
      product.isActive = isActive === true || isActive === "true";

    await product.save();

    return {
      EC: 0,
      EM: "Cập nhật sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    console.error("Update product service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi cập nhật sản phẩm",
    };
  }
};

// =========================
// DELETE PRODUCT (Admin only)
// =========================
const deleteProductService = async (id) => {
  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return {
        EC: 1,
        EM: "Không tìm thấy sản phẩm",
      };
    }

    await product.destroy();

    return {
      EC: 0,
      EM: "Xóa sản phẩm thành công",
    };
  } catch (error) {
    console.error("Delete product service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi xóa sản phẩm",
    };
  }
};

// =========================
// FUZZY SEARCH PRODUCTS
// =========================
const searchProductsService = async (query = "") => {
  try {
    if (!query.trim()) {
      return {
        EC: 0,
        EM: "Không có từ khóa",
        data: [],
        total: 0,
      };
    }

    const keyword = removeVietnameseTones(query);

    // Lấy tất cả sản phẩm
    const products = await Product.findAll();

    // Chuẩn hóa dữ liệu để tìm fuzzy không dấu
    const normalizedProducts = products.map((p) => ({
      ...p.dataValues,
      normalizedName: removeVietnameseTones(p.name),
      normalizedCategory: removeVietnameseTones(p.category),
    }));

    // Config Fuse.js
    const fuse = new Fuse(normalizedProducts, {
      keys: ["normalizedName", "normalizedCategory"],
      includeScore: true,
      threshold: 0.4, // độ fuzzy: càng thấp → càng chính xác
      distance: 100, // khoảng cách từ khóa
    });

    const result = fuse.search(keyword).map((r) => r.item);

    return {
      EC: 0,
      EM: "Tìm kiếm thành công",
      total: result.length,
      data: result,
    };
  } catch (error) {
    console.error("Search products service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi tìm kiếm sản phẩm",
    };
  }
};

// =========================
// FILTER PRODUCTS (multiple conditions)
// =========================
const filterProductsService = async (filters) => {
  try {
    // Use parsed filters

    // Parse filters properly
    const parsedFilters = {};
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== "") {
        // Parse numeric values
        if (['minPrice', 'maxPrice', 'minDiscount', 'maxDiscount', 'minViewCount', 'maxViewCount', 'minRating', 'maxRating'].includes(key)) {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            parsedFilters[key] = numValue;
          }
        } else {
          parsedFilters[key] = value;
        }
      }
    });

    const {
      category,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      minViewCount,
      maxViewCount,
      minRating,
      maxRating,
      isActive
    } = parsedFilters;

    const where = {};

    // Category filter
    if (category && category.trim() !== "") {
      where.category = category;
    }

    // Price range filter
    if ((minPrice !== undefined && minPrice !== "") || (maxPrice !== undefined && maxPrice !== "")) {
      where.price = {};
      if (minPrice !== undefined && minPrice !== "") where.price[Op.gte] = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") where.price[Op.lte] = Number(maxPrice);
    }

    // Discount range filter
    if (minDiscount !== undefined || maxDiscount !== undefined) {
      where.discount = {};
      if (minDiscount !== undefined) where.discount[Op.gte] = minDiscount;
      if (maxDiscount !== undefined) where.discount[Op.lte] = maxDiscount;
    }

    // View count range filter
    if (minViewCount !== undefined || maxViewCount !== undefined) {
      where.viewCount = {};
      if (minViewCount !== undefined) where.viewCount[Op.gte] = minViewCount;
      if (maxViewCount !== undefined) where.viewCount[Op.lte] = maxViewCount;
    }

    // Rating range filter
    if (minRating !== undefined || maxRating !== undefined) {
      where.rating = {};
      if (minRating !== undefined) where.rating[Op.gte] = minRating;
      if (maxRating !== undefined) where.rating[Op.lte] = maxRating;
    }

    // Active status filter
    if (isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true" || isActive === true;
    }


    // First get all products
    let products = await Product.findAll({
      where: category ? { category } : {},
      order: [["id", "ASC"]]
    });

    // Manual filtering for range conditions
    console.log("Filter values:", { minViewCount, maxViewCount });

    if (minViewCount !== undefined) {
      console.log("Filtering by minViewCount:", minViewCount);
      products = products.filter(product => {
        const viewCount = product.dataValues.viewCount;
        console.log(`Product ${product.dataValues.id}: viewCount=${viewCount}, keep=${viewCount >= minViewCount}`);
        return viewCount >= minViewCount;
      });
    }

    return {
      EC: 0,
      EM: "Lọc sản phẩm thành công",
      total: products.length,
      data: products,
    };
  } catch (error) {
    console.error("Filter products service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lọc sản phẩm",
    };
  }
};

module.exports = {
  getProductsService,
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  searchProductsService,
  filterProductsService,
};
