import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  List,
  Form,
  Input,
  Button,
  Rate,
  message,
  Avatar,
  Popconfirm,
  Pagination,
  Empty,
  Spin,
  Space,
} from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { AuthContext } from "./context/auth.context";
import {
  getProductCommentsApi,
  addProductCommentApi,
  deleteProductCommentApi,
} from "../util/api";

// Utility function to extract username from email
const extractUsernameFromEmail = (email) => {
  if (!email || typeof email !== "string") {
    return "Anonymous";
  }

  // Trim whitespace and validate email format
  const trimmedEmail = email.trim();

  // Check if email contains @ symbol
  if (!trimmedEmail.includes("@")) {
    return "Anonymous";
  }

  // Split email by @ and take the first part
  const username = trimmedEmail.split("@")[0];

  // Return username if valid, otherwise return default
  return username && username.length > 0 ? username : "Anonymous";
};

const { TextArea } = Input;

const ProductComments = ({ productId }) => {
  const { auth } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [form] = Form.useForm();

  const isLoggedIn = auth?.isAuthenticated;
  const isAdmin = auth?.user?.role === "admin";

  // Fetch comments
  const fetchComments = async (page = 1) => {
    try {
      const res = await getProductCommentsApi(
        productId,
        page,
        pagination.pageSize
      );
      if (res.EC === 0) {
        setComments(res.data);
        setPagination((prev) => ({
          ...prev,
          current: page,
          total: res.pagination.totalItems,
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  const handleSubmitComment = async (values) => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        comment: values.comment,
        rating: values.rating,
      };

      const res = await addProductCommentApi(productId, commentData);
      if (res.EC === 0) {
        message.success("Đã thêm bình luận thành công");
        form.resetFields();
        fetchComments(1); // Refresh comments
      } else {
        message.error(res.EM);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error("Có lỗi xảy ra khi thêm bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteProductCommentApi(commentId);
      if (res.EC === 0) {
        message.success("Đã xóa bình luận");
        fetchComments(pagination.current);
      } else {
        message.error(res.EM);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("Có lỗi xảy ra khi xóa bình luận");
    }
  };

  const handlePageChange = (page) => {
    fetchComments(page);
  };

  const CommentForm = () => (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Form form={form} onFinish={handleSubmitComment} layout="vertical">
        <Form.Item
          name="rating"
          label="Đánh giá"
          rules={[{ required: true, message: "Vui lòng chọn đánh giá" }]}
        >
          <Rate allowHalf />
        </Form.Item>
        <Form.Item
          name="comment"
          label="Bình luận"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung bình luận" },
            { min: 10, message: "Bình luận phải có ít nhất 10 ký tự" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            maxLength={500}
            showCount
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={!isLoggedIn}
          >
            {isLoggedIn ? "Gửi bình luận" : "Đăng nhập để bình luận"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  if (loading) {
    return (
      <Card title="Bình luận sản phẩm" size="small">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card title={`Bình luận sản phẩm (${pagination.total})`} size="small">
      {isLoggedIn && <CommentForm />}

      {!isLoggedIn && (
        <Card
          size="small"
          style={{
            marginBottom: 16,
            backgroundColor: "#f6ffed",
            borderColor: "#b7eb8f",
          }}
        >
          <p style={{ margin: 0, color: "#52c41a" }}>
            <UserOutlined style={{ marginRight: 8 }} />
            Đăng nhập để có thể bình luận và đánh giá sản phẩm
          </p>
        </Card>
      )}

      {comments.length === 0 ? (
        <Empty
          description="Chưa có bình luận nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <List
            dataSource={comments}
            renderItem={(item) => (
              <div
                style={{
                  padding: "16px",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <Avatar icon={<UserOutlined />} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>
                        {extractUsernameFromEmail(item.user.email)}
                      </strong>
                      {item.hasPurchased && (
                        <span
                          style={{
                            backgroundColor: "#52c41a",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            marginLeft: 8,
                          }}
                        >
                          Đã mua
                        </span>
                      )}
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "12px",
                          color: "#999",
                        }}
                      >
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div>
                      <Rate
                        disabled
                        value={item.rating}
                        style={{ fontSize: 14, marginBottom: 8 }}
                      />
                      <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                        {item.comment}
                      </p>
                    </div>
                    {(isAdmin ||
                      (isLoggedIn && item.user.id === auth.user.id)) && (
                      <div style={{ marginTop: "8px" }}>
                        <Popconfirm
                          title="Bạn có chắc muốn xóa bình luận này?"
                          onConfirm={() => handleDeleteComment(item.id)}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                          >
                            Xóa
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          />

          {pagination.total > pagination.pageSize && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default ProductComments;
