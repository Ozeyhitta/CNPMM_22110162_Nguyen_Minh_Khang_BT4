// services/productCommentService.js
const {
  ProductComment,
  Product,
  User,
  ProductPurchase,
  ProductView,
} = require("../models/associations");

// =========================
// ADD COMMENT TO PRODUCT
// =========================
const addProductCommentService = async (userId, productId, comment, rating) => {
  try {
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    // Check if user has purchased this product (optional - for credibility)
    const hasPurchased = await ProductPurchase.findOne({
      where: { userId, productId },
    });

    // Create comment
    const newComment = await ProductComment.create({
      userId,
      productId,
      comment: comment.trim(),
      rating: rating ? parseFloat(rating) : null,
      isApproved: true, // Auto approve for simplicity
    });

    return {
      EC: 0,
      EM: "Đã thêm bình luận thành công",
      data: {
        id: newComment.id,
        comment: newComment.comment,
        rating: newComment.rating,
        createdAt: newComment.createdAt,
        hasPurchased: !!hasPurchased,
      },
    };
  } catch (error) {
    console.error("Add product comment service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi thêm bình luận",
    };
  }
};

// =========================
// GET PRODUCT COMMENTS
// =========================
const getProductCommentsService = async (productId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows: comments } = await ProductComment.findAndCountAll({
      where: {
        productId,
        isApproved: true,
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"], // Don't expose sensitive data
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // Check if users have purchased the product
    const commentsWithPurchaseInfo = await Promise.all(
      comments.map(async (comment) => {
        const hasPurchased = await ProductPurchase.findOne({
          where: { userId: comment.userId, productId },
        });

        return {
          id: comment.id,
          comment: comment.comment,
          rating: comment.rating,
          createdAt: comment.createdAt,
          user: {
            id: comment.User.id,
            name: comment.User.name,
            email: comment.User.email,
          },
          hasPurchased: !!hasPurchased,
        };
      })
    );

    return {
      EC: 0,
      EM: "Lấy bình luận thành công",
      data: commentsWithPurchaseInfo,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    console.error("Get product comments service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy bình luận",
    };
  }
};

// =========================
// GET PRODUCT STATS (PURCHASES, COMMENTS, VIEWS)
// =========================
const getProductStatsService = async (productId) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    // Get stats in parallel
    const [totalPurchases, totalComments, totalViews, averageRating] =
      await Promise.all([
        ProductPurchase.count({ where: { productId } }),
        ProductComment.count({ where: { productId, isApproved: true } }),
        ProductView.count({ where: { productId } }),
        ProductComment.findAll({
          where: {
            productId,
            isApproved: true,
            rating: { [require("sequelize").Op.ne]: null },
          },
          attributes: [
            [
              require("sequelize").fn(
                "AVG",
                require("sequelize").col("rating")
              ),
              "avgRating",
            ],
          ],
        }).then((result) => result[0]?.dataValues?.avgRating || 0),
      ]);

    return {
      EC: 0,
      EM: "Lấy thống kê sản phẩm thành công",
      data: {
        productId,
        totalPurchases,
        totalComments,
        totalViews: product.viewCount || totalViews, // Use product.viewCount as primary
        averageRating: parseFloat(averageRating).toFixed(1),
      },
    };
  } catch (error) {
    console.error("Get product stats service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi lấy thống kê sản phẩm",
    };
  }
};

// =========================
// DELETE COMMENT (Admin only or comment owner)
// =========================
const deleteProductCommentService = async (
  commentId,
  userId,
  isAdmin = false
) => {
  try {
    const comment = await ProductComment.findByPk(commentId);
    if (!comment) {
      return {
        EC: 1,
        EM: "Bình luận không tồn tại",
      };
    }

    // Check permission
    if (!isAdmin && comment.userId !== userId) {
      return {
        EC: 2,
        EM: "Không có quyền xóa bình luận này",
      };
    }

    await comment.destroy();

    return {
      EC: 0,
      EM: "Đã xóa bình luận thành công",
    };
  } catch (error) {
    console.error("Delete product comment service error:", error);
    return {
      EC: 1,
      EM: "Lỗi server khi xóa bình luận",
    };
  }
};

module.exports = {
  addProductCommentService,
  getProductCommentsService,
  getProductStatsService,
  deleteProductCommentService,
};
