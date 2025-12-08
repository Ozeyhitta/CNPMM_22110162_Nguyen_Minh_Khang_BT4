import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import { getSimilarProductsApi } from "../util/api";
import ProductCard from "./ProductCard";

const SimilarProducts = ({ productId, limit = 6 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Khai báo useNavigate

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const res = await getSimilarProductsApi(productId, limit);
        if (res.EC === 0) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId, limit]);

  // Hàm xử lý click vào sản phẩm
  const handleProductClick = (id) => {
    // Cuộn lên đầu trang khi người dùng nhấn vào sản phẩm
    window.scrollTo(0, 0);

    // Chuyển hướng tới trang chi tiết sản phẩm
    navigate(`/products/${id}`);
  };

  if (loading) {
    return (
      <Card title="Sản phẩm tương tự" size="small" style={{ marginTop: 16 }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card title="Sản phẩm tương tự" size="small" style={{ marginTop: 16 }}>
        <Empty description="Không có sản phẩm tương tự" />
      </Card>
    );
  }

  // Filter out duplicates by product ID
  const uniqueProducts = products.filter(
    (product, index, self) => index === self.findIndex((p) => p.id === product.id)
  );

  return (
    <Card title="Sản phẩm tương tự" size="small" style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        {uniqueProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <div onClick={() => handleProductClick(product.id)}>
              <ProductCard item={product} showFavorite={true} />
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default SimilarProducts;
