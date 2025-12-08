// controllers/productRecommendationController.js
const {
  getSimilarProductsService,
  getRecentlyViewedProductsService,
  getRecommendedProductsService,
  getPopularProductsService,
} = require("../services/productRecommendationService");

// =========================
// GET SIMILAR PRODUCTS
// =========================
const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu thông tin productId",
      });
    }

    const result = await getSimilarProductsService(parseInt(productId), limit);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Get similar products controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy sản phẩm tương tự",
    });
  }
};

// =========================
// GET RECENTLY VIEWED PRODUCTS
// =========================
const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers["x-session-id"] || req.query.sessionId;
    const excludeProductId = req.query.excludeProductId
      ? parseInt(req.query.excludeProductId)
      : null;
    const limit = parseInt(req.query.limit) || 10;

    if (!userId && !sessionId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu thông tin userId hoặc sessionId",
      });
    }

    const result = await getRecentlyViewedProductsService(
      userId,
      sessionId,
      excludeProductId,
      limit
    );

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get recently viewed controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy sản phẩm đã xem",
    });
  }
};

// =========================
// GET RECOMMENDED PRODUCTS
// =========================
const getRecommendedProducts = async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 6;

    const result = await getRecommendedProductsService(userId, limit);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get recommended products controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy sản phẩm đề xuất",
    });
  }
};

// =========================
// GET POPULAR PRODUCTS
// =========================
const getPopularProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const excludeIds = req.query.excludeIds
      ? req.query.excludeIds.split(",").map((id) => parseInt(id))
      : [];

    const result = await getPopularProductsService(limit, excludeIds);

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get popular products controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy sản phẩm phổ biến",
    });
  }
};

module.exports = {
  getSimilarProducts,
  getRecentlyViewed,
  getRecommendedProducts,
  getPopularProducts,
};
