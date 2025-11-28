import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Space,
} from "antd";
import ProductCard from "../components/ProductCard";
import {
  getProductsApi,
  createProductApi,
  searchProductsApi,
  filterProductsApi,
  getCategoriesApi,
} from "../util/api";
import { AuthContext } from "../components/context/auth.context";
import "../styles/product.css";
import { Select } from "antd";

export default function ProductList() {
  const { auth } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minViewCount, setMinViewCount] = useState("");
  const [maxViewCount, setMaxViewCount] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("");
  const [categories, setCategories] = useState([]);

  // Kiểm tra xem user có phải admin không
  const isAdmin = auth?.user?.role === "admin";

  const initializedRef = useRef(false);

  // Đồng bộ ref với state
  // Load tất cả products một lần
  const loadProducts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // Sử dụng API mới để lấy tất cả products
      const res = await fetch(`http://localhost:8080/v1/api/all-products`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result.EC === 0) {
        setProducts(result.data);
        setHasMore(false); // Đã load hết tất cả
      } else {
        notification.error({
          message: "Lỗi",
          description: result.EM || "Không thể tải sản phẩm",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải sản phẩm",
      });
    }

    setLoading(false);
  };

  const handleSearch = async (keyword) => {
    const q = keyword.trim();
    if (!q) return resetSearch();

    setIsSearching(true);
    setLoading(true);

    try {
      const res = await searchProductsApi(q);

      if (res.EC === 0) {
        setProducts(res.data);
        setSearchValue(q);
        // Để cho phép infinite scroll, không set hasMore = false ngay lập tức
        // Chỉ set khi thực sự không còn dữ liệu
      } else {
        setProducts([]);
        setSearchValue("");
      }
    } catch (err) {
      console.error("Search error:", err);
    }

    setLoading(false);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategoriesApi();
      if (res.EC === 0) {
        setCategories(res.data);
      }
    };

    fetchCategories();
  }, []);

  const resetSearch = () => {
    setIsSearching(false);
    setSearchValue(""); // Clear search input
    loadProducts();
  };

  // Load sản phẩm ban đầu khi component mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      loadProducts();
    }
  }, []);

  // Kiểm tra query parameter để tự động mở modal thêm sản phẩm
  useEffect(() => {
    const addParam = searchParams.get("add");
    if (addParam === "true" && !isModalOpen) {
      setIsModalOpen(true);
    }
  }, [searchParams, isModalOpen]);

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

        // Loại bỏ query parameter khi tạo thành công
        if (searchParams.get("add") === "true") {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        }

        // Load lại toàn bộ danh sách
        loadProducts();
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

  const handleCancel = () => {
    console.log("handleCancel called");
    setIsModalOpen(false);
    form.resetFields();
    // Loại bỏ query parameter khi đóng modal
    if (searchParams.get("add") === "true") {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleCreateProduct(values);
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  return (
    <div style={{ padding: 20, height: "100vh", overflow: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Tất cả sản phẩm</h2>

        {/* Bộ lọc và tìm kiếm */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* 🔍 Ô tìm kiếm sản phẩm */}
          <Space.Compact style={{ width: 250 }}>
            <Input
              placeholder="Tìm sản phẩm..."
              allowClear
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (e.target.value.trim() === "") {
                  resetSearch();
                }
              }}
              onPressEnter={() => handleSearch(searchValue)}
            />
            <Button type="primary" onClick={() => handleSearch(searchValue)}>
              Tìm
            </Button>
          </Space.Compact>

          {/* NÚT FILTER nâng cao */}
          <Button onClick={() => setIsFilterOpen(true)}>Bộ lọc</Button>
        </div>
      </div>

      <div className="grid">
        {products.map((item, index) => (
          <ProductCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>

      {loading && <p style={{ textAlign: "center" }}>Đang tải sản phẩm...</p>}

      {/* Ẩn thông báo "Hết sản phẩm rồi" để infinite scroll mượt mà */}
      {/* {!hasMore && (
        <p style={{ textAlign: "center", marginTop: 10 }}>
          Hết sản phẩm rồi 🎉
        </p>
      )} */}

      {/* Modal thêm sản phẩm */}
      {isModalOpen && (
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
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select placeholder="Chọn danh mục từ danh sách">
                {categories.map((category) => (
                  <Select.Option key={category.name} value={category.name}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
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
      <Modal
        title="Lọc sản phẩm nâng cao"
        open={isFilterOpen}
        onCancel={() => setIsFilterOpen(false)}
        footer={[
          <Button
            key="reset"
            onClick={() => {
              setCategoryFilter("");
              setMinPrice("");
              setMaxPrice("");
              setMinDiscount("");
              setMaxDiscount("");
              setMinViewCount("");
              setMaxViewCount("");
              setMinRating("");
              setMaxRating("");
              setIsActiveFilter("");
            }}
          >
            Reset
          </Button>,
          <Button key="cancel" onClick={() => setIsFilterOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              try {
                const filters = {
                  category: categoryFilter || "",
                  minPrice: minPrice || "",
                  maxPrice: maxPrice || "",
                  minDiscount: minDiscount || "",
                  maxDiscount: maxDiscount || "",
                  minViewCount: minViewCount || "",
                  maxViewCount: maxViewCount || "",
                  minRating: minRating || "",
                  maxRating: maxRating || "",
                  isActive: isActiveFilter || "",
                };

                const res = await filterProductsApi(filters);
                console.log("Filter response:", res);

                if (res && Array.isArray(res)) {
                  // API trả về array data trực tiếp (backward compatibility)
                  setProducts(res);
                  setHasMore(false);
                } else if (res && res.EC === 0) {
                  // API trả về object {EC, EM, data}
                  setProducts(res.data || []);
                  setHasMore(false);
                } else {
                  console.error("Filter error:", res?.EM || "Unknown error");
                  setProducts([]);
                  setHasMore(false);
                }
                setIsFilterOpen(false);
              } catch (error) {
                console.error("Filter failed:", error);
                setIsFilterOpen(false);
              }
            }}
          >
            Áp dụng
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Danh mục">
            <Select
              allowClear
              placeholder="Chọn danh mục"
              value={categoryFilter || undefined}
              onChange={(value) => setCategoryFilter(value)}
            >
              {categories.map((cat) => (
                <Select.Option key={cat.name} value={cat.name}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Giá thấp nhất">
            <InputNumber
              style={{ width: "100%" }}
              value={minPrice}
              onChange={setMinPrice}
              min={0}
            />
          </Form.Item>

          <Form.Item label="Giá cao nhất">
            <InputNumber
              style={{ width: "100%" }}
              value={maxPrice}
              onChange={setMaxPrice}
              min={0}
            />
          </Form.Item>

          <Form.Item label="Giảm giá từ (%)">
            <InputNumber
              style={{ width: "100%" }}
              value={minDiscount}
              onChange={setMinDiscount}
              min={0}
              max={100}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item label="Giảm giá đến (%)">
            <InputNumber
              style={{ width: "100%" }}
              value={maxDiscount}
              onChange={setMaxDiscount}
              min={0}
              max={100}
              placeholder="100"
            />
          </Form.Item>

          <Form.Item label="Lượt xem từ">
            <InputNumber
              style={{ width: "100%" }}
              value={minViewCount}
              onChange={setMinViewCount}
              min={0}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item label="Lượt xem đến">
            <InputNumber
              style={{ width: "100%" }}
              value={maxViewCount}
              onChange={setMaxViewCount}
              min={0}
              placeholder="1000"
            />
          </Form.Item>

          <Form.Item label="Đánh giá từ">
            <InputNumber
              style={{ width: "100%" }}
              value={minRating}
              onChange={setMinRating}
              min={0}
              max={5}
              step={0.1}
              placeholder="0.0"
            />
          </Form.Item>

          <Form.Item label="Đánh giá đến">
            <InputNumber
              style={{ width: "100%" }}
              value={maxRating}
              onChange={setMaxRating}
              min={0}
              max={5}
              step={0.1}
              placeholder="5.0"
            />
          </Form.Item>

          <Form.Item label="Trạng thái">
            <Select
              allowClear
              placeholder="Chọn trạng thái"
              value={isActiveFilter || undefined}
              onChange={(value) => setIsActiveFilter(value)}
            >
              <Select.Option value="true">Đang hoạt động</Select.Option>
              <Select.Option value="false">Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
