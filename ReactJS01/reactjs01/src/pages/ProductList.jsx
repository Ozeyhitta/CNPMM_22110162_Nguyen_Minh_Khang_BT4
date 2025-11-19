import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProductCard from "../components/ProductCard";
import { getProductsApi, createProductApi } from "../util/api";
import { AuthContext } from "../components/context/auth.context";
import "../styles/product.css";

export default function ProductList() {
  const { auth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Kiểm tra xem user có phải admin không
  const isAdmin = auth?.user?.role === "admin";

  const limit = 12;
  const loaderRef = useRef(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const initializedRef = useRef(false);

  // Đồng bộ ref với state
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const loadMore = async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    setLoading(true);
    loadingRef.current = true;

    try {
      const currentPage = pageRef.current;
      const res = await getProductsApi(currentPage, limit);

      if (res.data && res.data.length > 0) {
        setProducts((prev) => [...prev, ...res.data]);
        pageRef.current = currentPage + 1;

        if (res.data.length < limit) {
          setHasMore(false);
          hasMoreRef.current = false;
        }
      } else {
        setHasMore(false);
        hasMoreRef.current = false;
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      setHasMore(false);
      hasMoreRef.current = false;
    }

    setLoading(false);
    loadingRef.current = false;
  };

  // Load sản phẩm ban đầu khi component mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Sử dụng setTimeout để tránh warning về setState trong effect
      setTimeout(() => {
        loadMore();
      }, 0);
    }
  }, []);

  // Tạo sản phẩm mới (Admin only)
  const handleCreateProduct = async (values) => {
    try {
      const res = await createProductApi(
        values.name,
        values.category,
        values.price,
        values.thumbnail || ""
      );

      if (res?.EC === 0) {
        notification.success({
          message: "Thành công",
          description: "Tạo sản phẩm thành công",
        });
        setIsModalOpen(false);
        form.resetFields();

        // Reset và load lại danh sách từ đầu
        setProducts([]);
        pageRef.current = 1;
        setHasMore(true);
        hasMoreRef.current = true;
        loadMore();
      } else {
        notification.error({
          message: "Lỗi",
          description: res?.EM || "Không thể tạo sản phẩm",
        });
      }
    } catch (error) {
      console.error("Create product error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tạo sản phẩm",
      });
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleCreateProduct(values);
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  // observer chỉ tạo 1 lần
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingRef.current &&
          hasMoreRef.current
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Tất cả sản phẩm</h2>
        {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm sản phẩm
          </Button>
        )}
      </div>

      <div className="grid">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      <div ref={loaderRef} style={{ height: 50 }} />

      {loading && <p style={{ textAlign: "center" }}>Đang tải thêm...</p>}

      {!hasMore && (
        <p style={{ textAlign: "center", marginTop: 10 }}>
          Hết sản phẩm rồi 🎉
        </p>
      )}

      {/* Modal thêm sản phẩm (chỉ admin) */}
      {isAdmin && (
        <Modal
          title="Thêm sản phẩm mới"
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText="Tạo"
          cancelText="Hủy"
          width={600}
        >
          <Form form={form} layout="vertical" autoComplete="off">
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                { min: 2, message: "Tên sản phẩm phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="category"
              rules={[
                { required: true, message: "Vui lòng nhập danh mục!" },
                { min: 2, message: "Danh mục phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập danh mục (ví dụ: Điện tử, Quần áo...)" />
            </Form.Item>

            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá!" },
                {
                  type: "number",
                  min: 0,
                  message: "Giá phải lớn hơn hoặc bằng 0!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập giá sản phẩm"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              label="Hình ảnh (URL)"
              name="thumbnail"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || value.trim() === "") {
                      return Promise.resolve(); // Cho phép để trống
                    }
                    // Nếu có giá trị, kiểm tra URL
                    try {
                      new URL(value);
                      return Promise.resolve();
                    } catch {
                      return Promise.reject(
                        new Error("Vui lòng nhập URL hợp lệ!")
                      );
                    }
                  },
                },
              ]}
            >
              <Input placeholder="https://example.com/image.jpg (tùy chọn)" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
