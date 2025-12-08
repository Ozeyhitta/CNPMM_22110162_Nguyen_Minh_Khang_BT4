const { Favorite, Product } = require("../models/associations");

module.exports = {
  // Add product to favorites
  addToFavoritesService: async (userId, productId) => {
    try {
      // ❗ CHECK LOGIN
      if (!userId) {
        return {
          EC: 1,
          EM: "Vui lòng đăng nhập để thêm vào yêu thích",
          DT: null,
        };
      }

      // Check product exists
      const product = await Product.findByPk(productId);
      if (!product) return { EC: 1, EM: "Sản phẩm không tồn tại", DT: null };

      // Check if exists
      const exist = await Favorite.findOne({ where: { userId, productId } });
      if (exist)
        return { EC: 2, EM: "Sản phẩm đã tồn tại trong yêu thích", DT: null };

      const newFav = await Favorite.create({ userId, productId });

      return { EC: 0, EM: "Đã thêm vào danh sách yêu thích", DT: newFav };
    } catch (err) {
      console.error("add favorite error:", err);
      return { EC: -1, EM: "Lỗi server", DT: null };
    }
  },

  // Remove product from favorites
  removeFromFavoritesService: async (userId, productId) => {
    try {
      // ❗ CHECK LOGIN
      if (!userId) {
        return { EC: 1, EM: "Vui lòng đăng nhập để xóa yêu thích" };
      }

      const row = await Favorite.destroy({ where: { userId, productId } });

      if (row === 0)
        return { EC: 1, EM: "Không tìm thấy sản phẩm trong yêu thích" };

      return { EC: 0, EM: "Đã xóa khỏi danh sách yêu thích" };
    } catch (err) {
      console.error("remove favorite error:", err);
      return { EC: -1, EM: "Lỗi server" };
    }
  },

  // Get user’s favorites list
  getUserFavoritesService: async (userId) => {
    try {
      console.log("getUserFavoritesService - userId:", userId);

      // ❗ CHECK LOGIN
      if (!userId) {
        console.log("getUserFavoritesService - no userId");
        return {
          EC: 1,
          EM: "Vui lòng đăng nhập để xem danh sách yêu thích",
          DT: [],
        };
      }

      console.log(
        "getUserFavoritesService - querying favorites for userId:",
        userId
      );

      const favorites = await Favorite.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "thumbnail", "discount"],
          },
        ],
      });

      console.log(
        "getUserFavoritesService - found favorites:",
        favorites.length
      );

      // Debug: Check each favorite and its product
      favorites.forEach((fav, index) => {
        console.log(`Favorite ${index}:`, {
          id: fav.id,
          userId: fav.userId,
          productId: fav.productId,
          product: fav.product
            ? {
                id: fav.product.id,
                name: fav.product.name,
              }
            : null,
        });
      });

      // Filter out favorites with null products (products that were deleted)
      const validFavorites = favorites.filter((fav) => fav.product !== null);

      console.log(
        "getUserFavoritesService - valid favorites after filtering:",
        validFavorites.length
      );

      return {
        EC: 0,
        EM: "OK",
        DT: validFavorites.map((fav) => fav.product),
      };
    } catch (err) {
      console.error("get favorites error:", err);
      return { EC: -1, EM: "Lỗi server", DT: [] };
    }
  },

  // Check if product is favorited
  checkFavoriteStatusService: async (userId, productId) => {
    try {
      // ❗ CHECK LOGIN
      if (!userId) {
        return {
          EC: 1,
          EM: "Người dùng chưa đăng nhập",
          DT: { isFavorited: false },
        };
      }

      const exist = await Favorite.findOne({ where: { userId, productId } });

      return {
        EC: 0,
        EM: "OK",
        DT: { isFavorited: !!exist },
      };
    } catch (err) {
      console.error("check favorite error:", err);
      return { EC: -1, EM: "Lỗi server", DT: null };
    }
  },
};
