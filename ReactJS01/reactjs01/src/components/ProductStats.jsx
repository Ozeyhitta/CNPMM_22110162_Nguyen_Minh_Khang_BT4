import React, { useState, useEffect } from "react";
import { Row, Col, Statistic, Card, Spin } from "antd";
import {
  EyeOutlined,
  ShoppingOutlined,
  CommentOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { getProductStatsApi } from "../util/api";

const ProductStats = ({ productId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getProductStatsApi(productId);
        if (res.EC === 0) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Error fetching product stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchStats();
    }
  }, [productId]);

  if (loading) {
    return (
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="small" />
        </div>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="Lượt xem"
            value={stats.totalViews}
            prefix={<EyeOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Đã mua"
            value={stats.totalPurchases}
            prefix={<ShoppingOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Bình luận"
            value={stats.totalComments}
            prefix={<CommentOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Đánh giá"
            value={stats.averageRating}
            prefix={<StarOutlined />}
            suffix="/5"
            valueStyle={{ color: "#f5222d" }}
            precision={1}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ProductStats;
