// controllers/productCommentController.js
const {
  addProductCommentService,
  getProductCommentsService,
  getProductStatsService,
  deleteProductCommentService,
} = require("../services/productCommentService");

// =========================
// ADD COMMENT TO PRODUCT
// =========================
const addProductComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { comment, rating } = req.body;

    if (!userId) {
      return res.status(401).json({
        EC: 1,
        EM: "Người dùng chưa đăng nhập",
      });
    }

    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu thông tin productId",
      });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        EC: 1,
        EM: "Nội dung bình luận không được để trống",
      });
    }

    const result = await addProductCommentService(
      userId,
      parseInt(productId),
      comment,
      rating
    );

    if (result.EC === 0) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Add product comment controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi thêm bình luận",
    });
  }
};

// =========================
// GET PRODUCT COMMENTS
// =========================
const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu thông tin productId",
      });
    }

    const result = await getProductCommentsService(
      parseInt(productId),
      page,
      limit
    );

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Get product comments controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy bình luận",
    });
  }
};

// =========================
// GET PRODUCT STATS
// =========================
const getProductStats = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu thông tin productId",
      });
    }

    const result = await getProductStatsService(parseInt(productId));

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Get product stats controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi lấy thống kê sản phẩm",
    });
  }
};

// =========================
// DELETE PRODUCT COMMENT
// =========================
const deleteProductComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { commentId } = req.params;
    const isAdmin = req.user?.role === "admin";

    if (!userId) {
      return res.status(401).json({
        EC: 1,
        EM: "Người dùng chưa đăng nhập",
      });
    }

    if (!commentId) {
      return res.status(400).json({
        EC: 1,
        EM: "Thiếu thông tin commentId",
      });
    }

    const result = await deleteProductCommentService(
      parseInt(commentId),
      userId,
      isAdmin
    );

    if (result.EC === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(result.EC === 2 ? 403 : 404).json(result);
    }
  } catch (error) {
    console.error("Delete product comment controller error:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server khi xóa bình luận",
    });
  }
};

module.exports = {
  addProductComment,
  getProductComments,
  getProductStats,
  deleteProductComment,
};
