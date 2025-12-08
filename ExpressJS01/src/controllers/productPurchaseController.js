const productPurchaseService = require("../services/productPurchaseService");

// Create - Thêm một lượt mua sản phẩm
const createProductPurchase = async (req, res) => {
  const { productId, quantity, purchasePrice } = req.body;
  const userId = req.user?.id || null; // Có thể null cho anonymous users

  try {
    const newPurchase = await productPurchaseService.createProductPurchase(
      userId,
      productId,
      quantity || 1,
      purchasePrice
    );
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get purchase count for a product
const getProductPurchaseCount = async (req, res) => {
  const { productId } = req.params;

  try {
    const count = await productPurchaseService.getProductPurchaseCount(
      productId
    );
    res
      .status(200)
      .json({ productId: parseInt(productId), purchaseCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all purchase counts
const getAllPurchaseCounts = async (req, res) => {
  try {
    const counts = await productPurchaseService.getAllPurchaseCounts();
    res.status(200).json({ counts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProductPurchase,
  getProductPurchaseCount,
  getAllPurchaseCounts,
};
