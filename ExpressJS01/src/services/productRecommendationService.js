// services/productRecommendationService.js
const {
  Product,
  ProductView,
  Favorite,
  ProductPurchase,
} = require("../models/associations");
const { Op } = require("sequelize");

// =========================
// GET SIMILAR PRODUCTS
// =========================
const getSimilarProductsService = async (productId, limit = 6) => {
  try {
    // Get the current product
    const currentProduct = await Product.findByPk(productId);
    if (!currentProduct) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    // Find similar products by category, price range, and popularity
    const similarProducts = await Product.findAll({
      where: {
        id: { [Op.ne]: productId }, // Exclude current product
        isActive: true,
        category: currentProduct.category, // Same category
      },
      order: [
        // Order by price proximity first
        [
          require("sequelize").literal(`ABS(price - ${currentProduct.price})`),
          "ASC",
        ],
        // Then by view count (popularity)
        ["viewCount", "DESC"],
        // Finally by rating
        ["rating", "DESC"],
      ],
      limit: limit * 2, // Get more to filter
    });

    // If not enough similar products in same category, get popular products from other categories
    if (similarProducts.length < limit) {
      const additionalProducts = await Product.findAll({
        where: {
          id: { [Op.ne]: productId },
          isActive: true,
          category: { [Op.ne]: currentProduct.category },
        },
        order: [
          ["viewCount", "DESC"],
          ["rating", "DESC"],
        ],
        limit: limit - similarProducts.length,
      });

      similarProducts.push(...additionalProducts);
    }

    // Return only the requested limit
    const finalProducts = similarProducts.slice(0, limit);

    return {
      EC: 0,
      EM: "Lấy sản phẩm tương tự thành công",
      data: finalProducts,
      total: finalProducts.length,
    };
  } catch (error) {
    console.error("Get similar products service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy sản phẩm tương tự",
    };
  }
};

// =========================
// GET RECENTLY VIEWED PRODUCTS (Alternative to productViewService)
// =========================
const getRecentlyViewedProductsService = async (
  userId,
  sessionId,
  excludeProductId = null,
  limit = 10
) => {
  try {
    // Get recently viewed product IDs
    const recentViews = await ProductView.findAll({
      where: {
        ...(userId ? { userId } : { sessionId }),
        ...(excludeProductId && { productId: { [Op.ne]: excludeProductId } }),
      },
      attributes: ["productId"],
      order: [["viewedAt", "DESC"]],
      limit: limit + 1, // +1 in case we exclude current product
      include: [
        {
          model: Product,
          as: "Product",
          where: { isActive: true },
          attributes: ["id", "name", "thumbnail", "price", "category"],
        },
      ],
    });

    // Extract unique products (avoid duplicates)
    const seenIds = new Set();
    const products = [];

    for (const view of recentViews) {
      if (view.Product && !seenIds.has(view.Product.id)) {
        seenIds.add(view.Product.id);
        products.push(view.Product);
        if (products.length >= limit) break;
      }
    }

    return {
      EC: 0,
      EM: "Lấy sản phẩm đã xem gần đây thành công",
      data: products,
      total: products.length,
    };
  } catch (error) {
    console.error("Get recently viewed products service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy sản phẩm đã xem",
    };
  }
};

// =========================
// GET RECOMMENDED PRODUCTS BASED ON USER BEHAVIOR
// =========================
const getRecommendedProductsService = async (userId, limit = 6) => {
  try {
    if (!userId) {
      // For anonymous users, return popular products
      return getPopularProductsService(limit);
    }

    // Get user's favorite categories based on views and favorites
    const userViews = await ProductView.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["category"],
        },
      ],
      limit: 20,
    });

    const userFavorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["category"],
        },
      ],
    });

    // Count category preferences
    const categoryScores = {};
    [...userViews, ...userFavorites].forEach((item) => {
      const category = item.Product?.category;
      if (category) {
        categoryScores[category] = (categoryScores[category] || 0) + 1;
      }
    });

    // Get most preferred categories
    const preferredCategories = Object.keys(categoryScores)
      .sort((a, b) => categoryScores[b] - categoryScores[a])
      .slice(0, 3);

    // Get products from preferred categories that user hasn't viewed/favorited
    const viewedProductIds = userViews.map((v) => v.productId);
    const favoritedProductIds = userFavorites.map((f) => f.productId);
    const excludedIds = [...viewedProductIds, ...favoritedProductIds];

    const recommendedProducts = await Product.findAll({
      where: {
        isActive: true,
        category: { [Op.in]: preferredCategories },
        ...(excludedIds.length > 0 && { id: { [Op.notIn]: excludedIds } }),
      },
      order: [
        ["viewCount", "DESC"],
        ["rating", "DESC"],
      ],
      limit,
    });

    // If not enough recommendations, fill with popular products
    if (recommendedProducts.length < limit) {
      const popularProducts = await getPopularProductsService(
        limit - recommendedProducts.length,
        excludedIds
      );
      recommendedProducts.push(...popularProducts.data);
    }

    return {
      EC: 0,
      EM: "Lấy sản phẩm đề xuất thành công",
      data: recommendedProducts.slice(0, limit),
      total: Math.min(recommendedProducts.length, limit),
    };
  } catch (error) {
    console.error("Get recommended products service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy sản phẩm đề xuất",
    };
  }
};

// =========================
// GET POPULAR PRODUCTS (Helper function)
// =========================
const getPopularProductsService = async (limit = 6, excludeIds = []) => {
  try {
    const popularProducts = await Product.findAll({
      where: {
        isActive: true,
        ...(excludeIds.length > 0 && { id: { [Op.notIn]: excludeIds } }),
      },
      order: [
        ["viewCount", "DESC"],
        ["rating", "DESC"],
      ],
      limit,
    });

    return {
      EC: 0,
      EM: "Lấy sản phẩm phổ biến thành công",
      data: popularProducts,
      total: popularProducts.length,
    };
  } catch (error) {
    console.error("Get popular products service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy sản phẩm phổ biến",
    };
  }
};

module.exports = {
  getSimilarProductsService,
  getRecentlyViewedProductsService,
  getRecommendedProductsService,
  getPopularProductsService,
};
