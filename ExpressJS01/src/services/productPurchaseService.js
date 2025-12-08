const ProductPurchase = require("../models/productPurchase");
const Product = require("../models/product");

const createProductPurchase = async (
  userId,
  productId,
  quantity,
  purchasePrice
) => {
  try {
    const newPurchase = await ProductPurchase.create({
      userId,
      productId,
      quantity: quantity || 1,
      purchasePrice,
      purchasedAt: new Date(),
    });

    // Update product's purchase count (if needed)
    // This could be done with a separate counter field in Product model

    return newPurchase;
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi tạo lượt mua sản phẩm");
  }
};

const getProductPurchaseCount = async (productId) => {
  try {
    const result = await ProductPurchase.findAll({
      where: { productId },
      attributes: [
        [
          ProductPurchase.sequelize.fn(
            "SUM",
            ProductPurchase.sequelize.col("quantity")
          ),
          "totalQuantity",
        ],
      ],
      raw: true,
    });

    return result[0]?.totalQuantity || 0;
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi lấy số lượt mua sản phẩm");
  }
};

const getAllPurchaseCounts = async () => {
  try {
    const results = await ProductPurchase.findAll({
      attributes: [
        "productId",
        [
          ProductPurchase.sequelize.fn(
            "SUM",
            ProductPurchase.sequelize.col("quantity")
          ),
          "totalQuantity",
        ],
      ],
      group: ["productId"],
      raw: true,
    });

    // Convert to object format
    const counts = {};
    results.forEach((result) => {
      counts[result.productId] = result.totalQuantity;
    });

    return counts;
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi lấy tất cả số lượt mua sản phẩm");
  }
};

module.exports = {
  createProductPurchase,
  getProductPurchaseCount,
  getAllPurchaseCounts,
};
