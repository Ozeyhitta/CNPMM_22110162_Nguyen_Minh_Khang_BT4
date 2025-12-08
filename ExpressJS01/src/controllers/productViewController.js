const productViewService = require("../services/productViewService");

// Create - Thêm một lượt xem sản phẩm
const createProductView = async (req, res) => {
  const { productId } = req.body;

  // Lấy userId từ authenticated user (nếu đã đăng nhập)
  const userId = req.user?.id || null;

  // Lấy sessionId từ headers hoặc cookies (cho user chưa đăng nhập)
  let sessionId =
    req.headers["x-session-id"] ||
    req.query.sessionId ||
    req.cookies?.sessionId;

  // Luôn tạo sessionId mới nếu user chưa đăng nhập hoặc không có sessionId
  // Điều này đảm bảo rằng ngay cả khi logout, vẫn có sessionId để track
  if (!userId) {
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      console.log("Created new sessionId for anonymous user:", sessionId);
    }
    // Nếu có sessionId cũ, vẫn sử dụng (có thể frontend đã gửi sessionId mới sau logout)
  }

  // Nếu đã đăng nhập, sessionId có thể không cần thiết
  // Nhưng vẫn giữ để tương thích với logic merge data
  if (userId && !sessionId) {
    sessionId = null;
  }

  console.log(
    "Create Product View - userId:",
    userId,
    "productId:",
    productId,
    "sessionId:",
    sessionId
  );

  try {
    const newProductView = await productViewService.createProductView(
      userId,
      productId,
      sessionId
    );

    // Trả về ProductView và sessionId (cho anonymous user)
    const response = {
      ...newProductView.toJSON(),
    };

    // Nếu là anonymous user, luôn trả về sessionId để frontend lưu lại
    if (!userId && sessionId) {
      response.sessionId = sessionId;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Read - Lấy tất cả lượt xem sản phẩm
// Trong ExpressJS01/src/controllers/productViewController.js
// Trong productViewController.js
const getAllProductViews = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    // Luôn lấy sessionId từ headers/query/cookies để merge dữ liệu cũ
    const sessionId =
      req.headers["x-session-id"] ||
      req.query.sessionId ||
      req.cookies?.sessionId ||
      null;

    console.log("Controller - userId:", userId, "sessionId:", sessionId);

    const result = await productViewService.getAllProductViews(
      userId,
      sessionId
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
      DT: [],
    });
  }
};

// Read - Lấy tất cả lượt xem của một sản phẩm cụ thể
const getProductViewsByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const productViews = await productViewService.getProductViewsByProductId(
      productId
    );

    if (productViews.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có lượt xem sản phẩm này" });
    }

    res.status(200).json(productViews); // Trả về danh sách lượt xem cho sản phẩm
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update - Cập nhật một lượt xem sản phẩm
const updateProductView = async (req, res) => {
  const { id } = req.params;
  const { userId, productId, sessionId, viewedAt } = req.body;
  try {
    const updatedProductView = await productViewService.updateProductView(
      id,
      userId,
      productId,
      sessionId,
      viewedAt
    );
    res.status(200).json(updatedProductView); // Trả về ProductView đã được cập nhật
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete - Xóa một lượt xem sản phẩm
const deleteProductView = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productViewService.deleteProductView(id);
    res.status(200).json(result); // Trả về thông báo xóa thành công
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Merge session data vào user account
const mergeSessionDataToUser = async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
  }

  if (!sessionId) {
    return res.status(400).json({ message: "sessionId là bắt buộc" });
  }

  try {
    const result = await productViewService.mergeSessionDataToUser(
      userId,
      sessionId
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProductView,
  getAllProductViews,
  getProductViewsByProductId,
  updateProductView,
  deleteProductView,
  mergeSessionDataToUser,
};
