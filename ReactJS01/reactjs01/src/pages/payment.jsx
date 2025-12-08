import React, { useContext, useState } from "react";
import { Button, Card, Row, Col, List, Typography, Empty, message } from "antd";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../components/context/auth.context";
import { trackProductPurchaseApi } from "../util/api";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, clearCart } = useContext(CartContext);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success'

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      message.warning("Giỏ hàng trống!");
      return;
    }

    setPaymentStatus("processing");

    try {
      // Track purchases for each item
      const purchasePromises = cartItems.map((item) =>
        trackProductPurchaseApi(item.id, item.quantity, item.price)
      );

      await Promise.all(purchasePromises);

      // Simulate payment processing
      setTimeout(() => {
        setPaymentStatus("success");
        clearCart();
        message.success("Thanh toán thành công!");
      }, 2000);
    } catch (error) {
      console.error("Error tracking purchases:", error);
      // Still proceed with payment even if tracking fails
      setTimeout(() => {
        setPaymentStatus("success");
        clearCart();
        message.success("Thanh toán thành công!");
      }, 2000);
    }
  };

  if (paymentStatus === "success") {
    return (
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Card style={{ textAlign: "center" }}>
          <Title level={2} style={{ color: "#52c41a" }}>
            🎉 Thanh toán thành công!
          </Title>
          <Text
            style={{ fontSize: "16px", display: "block", marginBottom: "20px" }}
          >
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý thành công.
          </Text>
          <Button type="primary" size="large" onClick={() => navigate("/")}>
            Tiếp tục mua sắm
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
        style={{ marginBottom: "20px" }}
      >
        Quay lại
      </Button>

      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Card title="Thông tin đơn hàng" style={{ marginBottom: "20px" }}>
            {cartItems.length === 0 ? (
              <Empty description="Giỏ hàng trống" />
            ) : (
              <List
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        src={item.thumbnail || "https://picsum.photos/50/50"}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "12px",
                          borderRadius: "4px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text strong>{item.name}</Text>
                        <br />
                        <Text type="secondary">
                          {item.price.toLocaleString()} đ x {item.quantity}
                        </Text>
                      </div>
                      <Text strong style={{ marginLeft: "12px" }}>
                        {(item.price * item.quantity).toLocaleString()} đ
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Tóm tắt thanh toán">
            <div style={{ marginBottom: "16px" }}>
              <Text>Số lượng sản phẩm: {cartCount}</Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>Tổng tiền: {totalAmount.toLocaleString()} đ</Text>
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={paymentStatus === "processing"}
              disabled={cartItems.length === 0}
              onClick={handlePayment}
            >
              {paymentStatus === "processing"
                ? "Đang xử lý..."
                : "Thanh toán ngay"}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentPage;
