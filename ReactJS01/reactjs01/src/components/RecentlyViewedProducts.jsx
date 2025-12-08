import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Spin, Empty } from "antd";
import { getRecentlyViewedApi, verifyTokenApi } from "../util/api";
import { AuthContext } from "./context/auth.context";
import ProductCard from "./ProductCard";

const RecentlyViewedProducts = ({ excludeProductId, limit = 8 }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        // Nếu user đã đăng nhập, verify token trước
        if (auth?.isAuthenticated) {
          try {
            await verifyTokenApi();
            console.log(">>> RecentlyViewedProducts - Token valid");
          } catch (tokenError) {
            console.log(
              ">>> RecentlyViewedProducts - Token invalid, logging out:",
              tokenError
            );
            localStorage.removeItem("access_token");
            setAuth({
              isAuthenticated: false,
              user: { email: "", name: "", role: "" },
            });
            setLoading(false);
            return;
          }
        }

        // Nếu user đã đăng nhập, gọi API mà không cần sessionId
        // Nếu chưa đăng nhập, cần sessionId
        let sessionId = null;
        if (!auth?.isAuthenticated) {
          sessionId = localStorage.getItem("sessionId");
          if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`;
            localStorage.setItem("sessionId", sessionId);
          }
        }

        // Gọi API: nếu đã đăng nhập thì không truyền sessionId, nếu chưa thì truyền sessionId
        const res = await getRecentlyViewedApi(
          auth?.isAuthenticated ? null : sessionId
        );
        if (res && res.EC === 0 && res.DT) {
          // Filter out excluded product if specified
          let filteredProducts = res.DT;
          if (excludeProductId) {
            filteredProducts = res.DT.filter(
              (product) => product.id !== excludeProductId
            );
          }
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [auth?.isAuthenticated, excludeProductId, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Card title="Sản phẩm đã xem" size="small" style={{ marginTop: 16 }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card title="Sản phẩm đã xem" size="small" style={{ marginTop: 16 }}>
        <Empty description="Chưa có sản phẩm nào được xem gần đây" />
      </Card>
    );
  }

  // Filter out duplicates by product ID
  const uniqueProducts = products.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );

  return (
    <Card title="Sản phẩm đã xem" size="small" style={{ marginTop: 16 }}>
      <Row gutter={[12, 12]}>
        {uniqueProducts.map((product) => (
          <Col key={product.id} xs={12} sm={8} md={6} lg={4} xl={3}>
            <ProductCard item={product} showFavorite={true} compact={true} />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default RecentlyViewedProducts;
