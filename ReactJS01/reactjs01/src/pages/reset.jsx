import { Row, Col, Form, Input, Button, notification } from "antd";
import axios from "../util/axios.customize";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPage() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const email = search.get("email");
  const otp = search.get("otp");

  const onFinish = async ({ password }) => {
    try {
      const res = await axios.post("/v1/api/reset-password", {
        email,
        otp,
        password,
      });

      notification.success({
        message: "Đặt lại mật khẩu",
        description: res.data?.EM || "Mật khẩu đã được đặt lại thành công",
      });

      navigate("/login");
    } catch (err) {
      notification.error({
        message: "Đặt lại mật khẩu",
        description:
          err?.response?.data?.EM || "Có lỗi xảy ra khi đặt lại mật khẩu",
      });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: 15, border: "1px solid #ccc" }}>
          <legend>Đặt lại mật khẩu</legend>

          <Form layout="vertical" onFinish={onFinish}>
            {/* Mật khẩu mới */}
            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message: "Mật khẩu phải bao gồm chữ và số!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            {/* Xác nhận mật khẩu */}
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Mật khẩu không khớp!");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Đổi mật khẩu
            </Button>
          </Form>
        </fieldset>
      </Col>
    </Row>
  );
}
