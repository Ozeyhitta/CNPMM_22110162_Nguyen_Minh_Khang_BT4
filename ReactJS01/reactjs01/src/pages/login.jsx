import React, { useContext } from "react";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { loginApi } from "../util/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { ArrowLeftOutlined } from "@ant-design/icons";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (values) => {
    try {
      const { email, password } = values;

      console.log(">>> Attempting login with:", email);
      const res = await loginApi(email, password);
      console.log(">>> Login response:", res);

      // Kiểm tra response
      if (res && res.EC === 0) {
        // Save token
        if (res.access_token) {
          localStorage.setItem("access_token", res.access_token);
        }

        notification.success({
          message: "Đăng nhập thành công",
          description: res.EM || "Chào mừng bạn trở lại!",
        });

        // Set Auth Context với đầy đủ thông tin
        setAuth({
          isAuthenticated: true,
          user: {
            id: res?.user?.id ?? "",
            email: res?.user?.email ?? "",
            name: res?.user?.name ?? "",
            role: res?.user?.role ?? "user",
          },
        });

        // Navigate về trang chủ
        navigate("/");
      } else {
        // Xử lý lỗi từ server
        notification.error({
          message: "Đăng nhập thất bại",
          description: res?.EM || "Email hoặc mật khẩu không đúng",
        });
      }
    } catch (error) {
      // Xử lý lỗi network hoặc lỗi khác
      console.error("Login error:", error);
      notification.error({
        message: "Lỗi đăng nhập",
        description: error?.message || "Không thể kết nối đến server. Vui lòng thử lại!",
      });
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Đăng Nhập</legend>

          <Form
            name="loginForm"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email..." />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu..." />
            </Form.Item>

            {/* Forgot Password */}
            <div style={{ marginBottom: "15px" }}>
              <Link to="/forgot">Quên mật khẩu?</Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>

          <Link to={"/"}>
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>

          <Divider />

          <div style={{ textAlign: "center" }}>
            Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default LoginPage;
