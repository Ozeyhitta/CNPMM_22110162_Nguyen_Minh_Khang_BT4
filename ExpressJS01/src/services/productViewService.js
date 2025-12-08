const ProductView = require("../models/productView");
const Product = require("../models/product");

const createProductView = async (userId, productId, sessionId) => {
  try {
    const newProductView = await ProductView.create({
      userId,
      productId,
      sessionId,
      viewedAt: new Date(),
    });
    return newProductView;
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi tạo lượt xem sản phẩm");
  }
};

// Trong productViewService.js - getAllProductViews
const getAllProductViews = async (userId = null, sessionId = null) => {
  console.log("=== DEBUG getAllProductViews ===");
  console.log("userId:", userId);
  console.log("sessionId:", sessionId);

  try {
    let where = {};

    // Nếu có userId (user đã đăng nhập), tìm kiếm theo userId
    if (userId) {
      where.userId = userId;
      console.log("Querying by userId (user đã đăng nhập):", userId);
    }
    // Nếu chưa đăng nhập và có sessionId, tìm kiếm theo sessionId
    else if (sessionId) {
      where.sessionId = sessionId;
      console.log("Querying by sessionId (user chưa đăng nhập):", sessionId);
    } else {
      console.log("No filters - getting all views");
      // Nếu không có filter, lấy tất cả (nhưng limit lại)
    }

    console.log("Where clause:", where);

    const views = await ProductView.findAll({
      where,
      order: [["viewedAt", "DESC"]],
      limit: userId || sessionId ? 50 : 20, // Limit cao hơn nếu có filter
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name",
            "price",
            "thumbnail",
            "discount",
            "viewCount",
          ],
        },
      ],
    });

    console.log("Found views count:", views.length);

    // Nếu user đã đăng nhập và có sessionId, cũng tìm kiếm theo sessionId để merge dữ liệu cũ
    let additionalViews = [];
    if (userId && sessionId) {
      console.log("Also querying by sessionId to merge old data:", sessionId);
      additionalViews = await ProductView.findAll({
        where: { sessionId },
        order: [["viewedAt", "DESC"]],
        limit: 50,
        include: [
          {
            model: Product,
            as: "product",
            attributes: [
              "id",
              "name",
              "price",
              "thumbnail",
              "discount",
              "viewCount",
            ],
          },
        ],
      });
      console.log("Found additional views count:", additionalViews.length);
    }

    // Merge tất cả views và loại bỏ duplicate dựa trên productId
    const allViews = [...views, ...additionalViews];
    const uniqueViews = [];
    const seenProductIds = new Set();

    for (const view of allViews) {
      if (view.product && !seenProductIds.has(view.product.id)) {
        uniqueViews.push(view);
        seenProductIds.add(view.product.id);
      }
    }

    console.log("Total unique views count:", uniqueViews.length);

    // Return product info instead of view records
    const products = uniqueViews
      .map((v) => v.product)
      .filter((p) => p !== null);
    console.log("Extracted products count:", products.length);

    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm đã xem thành công",
      DT: products,
    };
  } catch (error) {
    console.error("ERROR in getAllProductViews:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy danh sách sản phẩm đã xem",
      DT: [],
    };
  }
};

const getProductViewsByProductId = async (productId) => {
  try {
    const productViews = await ProductView.findAll({
      where: { productId },
    });
    return productViews;
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi lấy lượt xem sản phẩm");
  }
};

const updateProductView = async (
  id,
  userId,
  productId,
  sessionId,
  viewedAt
) => {
  try {
    const productView = await ProductView.findByPk(id);
    if (!productView) {
      throw new Error("Lượt xem sản phẩm không tồn tại");
    }

    productView.userId = userId || productView.userId;
    productView.productId = productId || productView.productId;
    productView.sessionId = sessionId || productView.sessionId;
    productView.viewedAt = viewedAt || productView.viewedAt;

    await productView.save(); // Lưu thay đổi
    return productView;
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi cập nhật lượt xem sản phẩm");
  }
};

const deleteProductView = async (id) => {
  try {
    const productView = await ProductView.findByPk(id);
    if (!productView) {
      throw new Error("Lượt xem sản phẩm không tồn tại");
    }

    await productView.destroy(); // Xóa lượt xem sản phẩm
    return { message: "Lượt xem sản phẩm đã được xóa thành công" };
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi xóa lượt xem sản phẩm");
  }
};

// Merge session data vào user account khi đăng nhập
const mergeSessionDataToUser = async (userId, sessionId) => {
  try {
    if (!userId || !sessionId) {
      return { message: "userId và sessionId là bắt buộc" };
    }

    // Cập nhật tất cả product views có sessionId thành userId
    const [updatedCount] = await ProductView.update(
      { userId },
      {
        where: {
          sessionId,
          userId: null, // Chỉ cập nhật những record chưa có userId
        },
      }
    );

    console.log(
      `Merged ${updatedCount} product views from session ${sessionId} to user ${userId}`
    );

    return {
      message: `Đã merge ${updatedCount} lượt xem sản phẩm từ session vào tài khoản user`,
      updatedCount,
    };
  } catch (error) {
    console.error("Error merging session data:", error);
    throw new Error("Có lỗi xảy ra khi merge dữ liệu session");
  }
};
// Trong ExpressJS01/src/services/productViewService.js

module.exports = {
  createProductView,
  getAllProductViews,
  getProductViewsByProductId,
  updateProductView,
  deleteProductView,
  mergeSessionDataToUser,
};
