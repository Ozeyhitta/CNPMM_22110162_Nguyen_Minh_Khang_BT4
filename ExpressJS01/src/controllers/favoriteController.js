// controllers/favoriteController.js
const {
  addToFavoritesService,
  removeFromFavoritesService,
  getUserFavoritesService,
  checkFavoriteStatusService,
} = require("../services/favoriteService");

module.exports = {
  addToFavorites: async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId)
      return res.status(400).json({ EC: 1, EM: "Thiếu productId" });

    const result = await addToFavoritesService(userId, productId);
    return res.status(200).json(result);
  },

  removeFromFavorites: async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await removeFromFavoritesService(userId, productId);
    return res.status(200).json(result);
  },

  getUserFavorites: async (req, res) => {
    const userId = req.user.id;

    const result = await getUserFavoritesService(userId);
    return res.status(200).json(result);
  },

  checkFavoriteStatus: async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await checkFavoriteStatusService(userId, productId);
    return res.status(200).json(result);
  },
};
