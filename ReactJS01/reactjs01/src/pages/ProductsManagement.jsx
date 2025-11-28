import { useContext, useEffect, useState, useRef } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  notification,
  Card,
  Space,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getCategoriesApi,
} from "../util/api";
import { AuthContext } from "../components/context/auth.context";

export default function ProductsManagement() {
  const { auth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const isAdmin = auth?.user?.role === "admin";

  // Load danh sách products
  const loadProducts = async () => {
    setLoading(true);
    try {
      // Load tất cả sản phẩm để quản lý (không filter theo category)
      const res = await getProductsApi(1, 31, "");
      if (res.EC === 0) {
        setProducts(res.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.EM || "Không thể tải danh sách sản phẩm",
        });
      }
    } catch (error) {
      console.error("Load products error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
      });
    }
    setLoading(false);
  };

  // Load danh sách categories
  const loadCategories = async () => {
    try {
      const res = await getCategoriesApi();
      if (res.EC === 0) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Load categories error:", error);
    }
  };

  // Load data khi component mount (chỉ một lần)
  // Load data khi component mount
  useEffect(() => {
    if (isAdmin) {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        loadProducts();
        loadCategories();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // Xử lý tạo/sửa product
  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingProduct) {
        res = await updateProductApi(editingProduct.id, values);
      } else {
        res = await createProductApi(values);
      }

      if (res.EC === 0) {
        notification.success({
          message: "Thành công",
          description: editingProduct
            ? "Cập nhật sản phẩm thành công"
            : "Tạo sản phẩm thành công",
        });
        setIsModalOpen(false);
        form.resetFields();
        setEditingProduct(null);
        loadProducts(); // Reload danh sách
      } else {
        notification.error({
          message: "Lỗi",
          description:
            res.EM ||
            (editingProduct
              ? "Không thể cập nhật sản phẩm"
              : "Không thể tạo sản phẩm"),
        });
      }
    } catch (error) {
      console.error("Submit product error:", error);
      notification.error({
        message: "Lỗi",
        description: editingProduct
          ? "Không thể cập nhật sản phẩm"
          : "Không thể tạo sản phẩm",
      });
    }
  };

  // Xử lý edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      price: product.price,
      thumbnail: product.thumbnail || "",
      discount: product.discount || 0,
      viewCount: product.viewCount || 0,
      rating: product.rating || 0,
      isActive: product.isActive,
      stock: product.stock || 0,
    });
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = async (productId) => {
    try {
      const res = await deleteProductApi(productId);

      if (res.EC === 0) {
        notification.success({
          message: "Thành công",
          description: "Xóa sản phẩm thành công",
        });
        loadProducts(); // Reload danh sách
      } else {
        notification.error({
          message: "Lỗi",
          description: res.EM || "Không thể xóa sản phẩm",
        });
      }
    } catch (error) {
      console.error("Delete product error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa sản phẩm",
      });
    }
  };

  // Mở modal tạo mới
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({
      discount: 0,
      viewCount: 0,
      rating: 0,
      isActive: true,
      stock: 0,
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingProduct(null);
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price?.toLocaleString()} đ`,
      width: 100,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => (discount > 0 ? `${discount}%` : "-"),
      width: 80,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (rating > 0 ? `${rating}/5` : "-"),
      width: 80,
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Hoạt động" : "Ngưng"}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) =>
        thumbnail ? (
          <img
            src={thumbnail}
            alt="thumbnail"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <span style={{ color: "#ccc" }}>Không có</span>
        ),
      width: 80,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!isAdmin) {
    return (
      <div style={{ padding: 20 }}>
        <Card>
          <h2>Quản lý sản phẩm</h2>
          <p style={{ color: "red" }}>
            Bạn cần quyền Admin để truy cập trang này.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Quản lý sản phẩm</h2>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadProducts}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm sản phẩm
            </Button>
          </Space>
        </div>

        <Table
          key={`products-table-${products.length}`}
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText={editingProduct ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            <Select placeholder="Chọn danh mục">
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
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber
              placeholder="Nhập giá sản phẩm"
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Giảm giá (%)"
            name="discount"
            rules={[
              {
                type: "number",
                min: 0,
                max: 100,
                message: "Giảm giá phải từ 0-100!",
              },
            ]}
          >
            <InputNumber
              placeholder="Nhập % giảm giá"
              min={0}
              max={100}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Lượt xem"
            name="viewCount"
            rules={[{ type: "number", min: 0, message: "Lượt xem phải >= 0!" }]}
          >
            <InputNumber
              placeholder="Nhập lượt xem"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Đánh giá"
            name="rating"
            rules={[
              {
                type: "number",
                min: 0,
                max: 5,
                message: "Đánh giá phải từ 0-5!",
              },
            ]}
          >
            <InputNumber
              placeholder="Nhập đánh giá trung bình"
              min={0}
              max={5}
              step={0.1}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Tồn kho"
            name="stock"
            rules={[{ type: "number", min: 0, message: "Tồn kho phải >= 0!" }]}
          >
            <InputNumber
              placeholder="Nhập số lượng tồn kho"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="isActive"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Ngưng hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hình ảnh (URL)"
            name="thumbnail"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.resolve();
                  }
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
    </div>
  );
}
