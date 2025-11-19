import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import {
  getAllUsersApi,
  createUserByAdminApi,
  updateUserApi,
  deleteUserApi,
} from "../util/api";
import { AuthContext } from "../components/context/auth.context";

const UserPage = () => {
  const { auth } = useContext(AuthContext);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Kiểm tra xem user có phải admin không
  const isAdmin = auth?.user?.role === "admin";

  // Fetch danh sách users từ database
  const fetchUsers = async () => {
    if (!isAdmin) {
      notification.warning({
        message: "Không có quyền",
        description: "Chỉ admin mới có thể xem danh sách users",
      });
      return;
    }

    setLoading(true);
    try {
      console.log(">>> Fetching users from database...");
      const res = await getAllUsersApi();
      console.log(">>> Fetch users response:", res);

      if (res?.EC === 0 && res.data) {
        // Đảm bảo data là array
        const users = Array.isArray(res.data) ? res.data : [];
        setDataSource(users);
        console.log(`>>> Loaded ${users.length} users from database`);
      } else {
        console.error(">>> Fetch users failed:", res);
        notification.error({
          message: "Lỗi",
          description: res?.EM || "Không thể lấy danh sách users",
        });
        setDataSource([]);
      }
    } catch (error) {
      console.error(">>> Fetch users error:", error);
      notification.error({
        message: "Lỗi",
        description: error?.EM || "Không thể kết nối đến server",
      });
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users khi component mount hoặc khi isAdmin thay đổi
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tạo user mới
  const handleCreate = async (values) => {
    try {
      const res = await createUserByAdminApi(
        values.name,
        values.email,
        values.password,
        values.role || "user"
      );

      if (res?.EC === 0) {
        notification.success({
          message: "Thành công",
          description: "Tạo user thành công",
        });
        setIsModalOpen(false);
        form.resetFields();
        fetchUsers();
      } else {
        notification.error({
          message: "Lỗi",
          description: res?.EM || "Không thể tạo user",
        });
      }
    } catch (error) {
      console.error("Create user error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tạo user",
      });
    }
  };

  // Cập nhật user
  const handleUpdate = async (values) => {
    try {
      const updateData = {};
      if (values.name) updateData.name = values.name;
      if (values.email) updateData.email = values.email;
      // Chỉ cập nhật password nếu user nhập mật khẩu mới
      if (values.password && values.password.trim() !== "") {
        updateData.password = values.password;
      }
      if (values.role) updateData.role = values.role;

      const res = await updateUserApi(editingUser.id, updateData);

      if (res?.EC === 0) {
        notification.success({
          message: "Thành công",
          description: "Cập nhật user thành công",
        });
        setIsModalOpen(false);
        setEditingUser(null);
        form.resetFields();
        fetchUsers();
      } else {
        notification.error({
          message: "Lỗi",
          description: res?.EM || "Không thể cập nhật user",
        });
      }
    } catch (error) {
      console.error("Update user error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật user",
      });
    }
  };

  // Xóa user
  const handleDelete = async (id) => {
    try {
      const res = await deleteUserApi(id);

      if (res?.EC === 0) {
        notification.success({
          message: "Thành công",
          description: "Xóa user thành công",
        });
        fetchUsers();
      } else {
        notification.error({
          message: "Lỗi",
          description: res?.EM || "Không thể xóa user",
        });
      }
    } catch (error) {
      console.error("Delete user error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa user",
      });
    }
  };

  // Mở modal để tạo mới
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: "user" });
    setIsModalOpen(true);
  };

  // Mở modal để sửa
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role || "user",
      password: "", // Không hiển thị password cũ
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await handleUpdate(values);
      } else {
        await handleCreate(values);
      }
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role?.toUpperCase() || "USER"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa user"
            description="Bạn có chắc chắn muốn xóa user này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Nếu không phải admin, hiển thị thông báo
  if (!isAdmin) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <h2>Không có quyền truy cập</h2>
        <p>Chỉ admin mới có thể xem và quản lý users</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Quản lý Users</h2>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm User
          </Button>
        </Space>
      </div>

      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} users`,
        }}
      />

      <Modal
        title={editingUser ? "Sửa User" : "Thêm User Mới"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingUser ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="Tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên!" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên user" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: !editingUser,
                message: "Vui lòng nhập mật khẩu!",
              },
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    // Nếu đang sửa và để trống, cho phép
                    if (editingUser) return Promise.resolve();
                    // Nếu đang tạo mới và để trống, báo lỗi
                    return Promise.reject(new Error("Vui lòng nhập mật khẩu!"));
                  }
                  // Nếu có giá trị, kiểm tra độ dài
                  if (value.length < 6) {
                    return Promise.reject(
                      new Error("Mật khẩu phải có ít nhất 6 ký tự!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              placeholder={
                editingUser ? "Để trống nếu không đổi" : "Nhập mật khẩu"
              }
            />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn role!" }]}
          >
            <Select placeholder="Chọn role">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
