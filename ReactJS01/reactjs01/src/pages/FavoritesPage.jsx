import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Empty, Spin, message, Breadcrumb } from "antd";
import { HeartOutlined, LeftOutlined } from "@ant-design/icons";
import { AuthContext } from "../components/context/auth.context";
import { getUserFavoritesApi } from "../util/api";
import ProductCard from "../components/ProductCard";

const FavoritesPage = () => {
  const { auth } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!auth?.isAuthenticated) {
        setLoading(false);
        return;
      }

      const res = await getUserFavoritesApi();

      if (res.EC === 0) {
        setFavorites(res.DT ?? []);
      } else {
        message.error(res.EM);
      }

      setLoading(false);
    };

    loadFavorites();
  }, [auth?.isAuthenticated]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!auth?.isAuthenticated) {
    return (
      <Empty
        description="Vui lòng đăng nhập để xem sản phẩm yêu thích"
        style={{ marginTop: "40px" }}
      >
        <Link to="/login">Đăng nhập</Link>
      </Empty>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: "Sản phẩm yêu thích",
          },
        ]}
      />

      <Link to="/products">
        <LeftOutlined /> Quay lại danh sách sản phẩm
      </Link>

      {/* Filter and deduplicate favorites */}
      {(() => {
        const validFavorites = favorites
          .filter((product) => product && product.id) // Filter out null/undefined products
          .filter(
            (
              product,
              index,
              self // Remove duplicates by ID
            ) => index === self.findIndex((p) => p.id === product.id)
          );

        return (
          <>
            <h1 style={{ marginTop: 16 }}>
              <HeartOutlined style={{ color: "red" }} /> Sản phẩm yêu thích (
              {validFavorites.length})
            </h1>

            {validFavorites.length === 0 ? (
              <Empty description="Bạn chưa thích sản phẩm nào" />
            ) : (
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                {validFavorites.map((product) => (
                  <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard item={product} showFavorite />
                  </Col>
                ))}
              </Row>
            )}
          </>
        );
      })()}
    </div>
  );
};

export default FavoritesPage;
