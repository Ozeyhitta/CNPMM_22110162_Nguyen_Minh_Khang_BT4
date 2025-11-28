import { useContext, useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Popconfirm,
  notification,
  Card,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../util/api";
import { AuthContext } from "../components/context/auth.context";

export default function Categories() {
  const { auth } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const isAdmin = auth?.user?.role === "admin";

  // Load danh sách categories
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategoriesApi();
      if (res.EC === 0) {
        setCategories(res.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.EM || "Không thể tải danh sách danh mục",
        });
      }
    } catch (error) {
      console.error("Load categories error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách danh mục",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Xử lý tạo/sửa category
  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingCategory) {
        res = await updateCategoryApi(editingCategory.id, values);
      } else {
        res = await createCategoryApi(values.name, values.description, values.thumbnail);
      }

      if (res.EC === 0) {
        notification.success({
          message: "Thành công",
          description: editingCategory ? "Cập nhật danh mục thành công" : "Tạo danh mục thành công",
        });
        setIsModalOpen(false);
        form.resetFields();
        setEditingCategory(null);
        loadCategories(); // Reload danh sách
      } else {
        notification.error({
          message: "Lỗi",
          description: res.EM || (editingCategory ? "Không thể cập nhật danh mục" : "Không thể tạo danh mục"),
        });
      }
    } catch (error) {
      console.error("Submit category error:", error);
      notification.error({
        message: "Lỗi",
        description: editingCategory ? "Không thể cập nhật danh mục" : "Không thể tạo danh mục",
      });
    }
  };

  // Xử lý edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description || "",
      thumbnail: category.thumbnail || "",
    });
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = async (categoryId) => {
    try {
      const res = await deleteCategoryApi(categoryId);

      if (res.EC === 0) {
        notification.success({
          message: "Thành công",
          description: "Xóa danh mục thành công",
        });
        loadCategories(); // Reload danh sách
      } else {
        notification.error({
          message: "Lỗi",
          description: res.EM || "Không thể xóa danh mục",
        });
      }
    } catch (error) {
      console.error("Delete category error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa danh mục",
      });
    }
  };

  // Mở modal tạo mới
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingCategory(null);
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
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <span style={{ color: "#ccc" }}>Không có</span>
        ),
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
            title="Bạn có chắc muốn xóa danh mục này?"
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
          <h2>Quản lý danh mục</h2>
          <p style={{ color: "red" }}>Bạn cần quyền Admin để truy cập trang này.</p>
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
          <h2>Quản lý danh mục sản phẩm</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm danh mục
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} danh mục`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa danh mục */}
      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText={editingCategory ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
              { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { max: 500, message: "Mô tả không được vượt quá 500 ký tự!" },
            ]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả danh mục (tùy chọn)"
              rows={3}
            />
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
