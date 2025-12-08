import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  message,
  Breadcrumb,
  Spin,
  Typography,
  Divider,
  Tag,
} from "antd";
import { LeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { getProductByIdApi } from "../util/api";
import FavoriteButton from "../components/FavoriteButton";
import ProductStats from "../components/ProductStats";
import ProductComments from "../components/ProductComments";
import SimilarProducts from "../components/SimilarProducts";
import RecentlyViewedProducts from "../components/RecentlyViewedProducts";
import useProductView from "../hooks/useProductView";

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track product view
  useProductView(productId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(productId);
        if (res.EC === 0) {
          setProduct(res.data);
        } else {
          message.error(res.EM);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        message.error("Có lỗi xảy ra khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Sản phẩm không tồn tại</h2>
        <Link to="/products">
          <Button icon={<LeftOutlined />}>Quay lại danh sách sản phẩm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: <Link to="/products">Sản phẩm</Link>,
          },
          {
            title: product.name,
          },
        ]}
      />

      {/* Back button */}
      <Link to="/products">
        <Button icon={<LeftOutlined />} style={{ marginBottom: 16 }}>
          Quay lại
        </Button>
      </Link>

      <Row gutter={[24, 24]}>
        {/* Product Image and Info */}
        <Col xs={24} lg={12}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <img
                src={product.thumbnail || "https://picsum.photos/400/400"}
                alt={product.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <Title level={2} style={{ margin: 0, flex: 1 }}>
                {product.name}
              </Title>
              <FavoriteButton productId={product.id} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: "24px", color: "#ff4d4f" }}>
                {product.price.toLocaleString()} đ
              </Text>
              {product.discount > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Tag color="green" style={{ fontSize: "14px" }}>
                    Giảm giá {product.discount}%
                  </Tag>
                  <Text
                    style={{
                      marginLeft: 8,
                      textDecoration: "line-through",
                      color: "#999",
                    }}
                  >
                    {Math.round(
                      product.price / (1 - product.discount / 100)
                    ).toLocaleString()}{" "}
                    đ
                  </Text>
                </div>
              )}
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Text strong>Danh mục: </Text>
              <Tag color="blue">{product.category}</Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Trạng thái: </Text>
              <Tag color={product.isActive ? "green" : "red"}>
                {product.isActive ? "Đang bán" : "Ngừng bán"}
              </Tag>
            </div>

            {product.stock !== undefined && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Tồn kho: </Text>
                <Text>{product.stock} sản phẩm</Text>
              </div>
            )}

            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              block
              disabled={!product.isActive}
            >
              {product.isActive ? "Thêm vào giỏ hàng" : "Sản phẩm tạm hết"}
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Product Stats */}
      <ProductStats productId={product.id} />

      {/* Product Description */}
      <Card title="Mô tả sản phẩm" style={{ margin: "24px 0" }}>
        <Paragraph>
          Thông tin chi tiết về sản phẩm {product.name} sẽ được cập nhật sớm.
        </Paragraph>
      </Card>

      {/* Product Comments */}
      <ProductComments productId={product.id} />

      {/* Similar Products */}
      <div style={{ marginTop: 32 }}>
        <Card
          title="Sản phẩm tương tự"
          variant="borderless"
          style={{ marginBottom: 24 }}
        >
          <SimilarProducts productId={product.id} limit={6} />
        </Card>
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewedProducts excludeProductId={product.id} limit={12} />
    </div>
  );
};

export default ProductDetail;
