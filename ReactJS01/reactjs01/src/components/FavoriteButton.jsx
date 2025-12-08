import React, { useState, useEffect, useContext } from "react";
import { Button, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { AuthContext } from "./context/auth.context";
import { useNavigate } from "react-router-dom";
import {
  addToFavoritesApi,
  removeFromFavoritesApi,
  checkFavoriteStatusApi,
} from "../util/api";

const FavoriteButton = ({ productId, size = "default", showText = false }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // Check status on mount
  useEffect(() => {
    const loadStatus = async () => {
      if (!auth?.isAuthenticated) {
        setChecking(false);
        return;
      }

      const res = await checkFavoriteStatusApi(productId);

      if (res?.EC === 0) {
        setIsFavorited(res.DT.isFavorited);
      }
      setChecking(false);
    };

    loadStatus();
  }, [auth?.isAuthenticated, productId]);

  const toggleFavorite = async () => {
    if (!auth?.isAuthenticated) {
      message.info("Vui lòng đăng nhập để sử dụng tính năng yêu thích");
      setTimeout(() => navigate("/login"), 1000); // Redirect sau 1 giây
      return;
    }

    setLoading(true);
    let res;

    if (isFavorited) {
      res = await removeFromFavoritesApi(productId);
      if (res.EC === 0) {
        setIsFavorited(false); // ← sửa: chỉ cần false
      }
    } else {
      res = await addToFavoritesApi(productId);
      if (res.EC === 0) {
        setIsFavorited(true); // ← sửa: chỉ cần true
      }
    }

    message[res.EC === 0 ? "success" : "error"](res.EM);
    setLoading(false);
  };

  return (
    <Button
      type="text"
      icon={
        checking ? (
          <HeartOutlined style={{ color: "#ccc" }} />
        ) : isFavorited ? (
          <HeartFilled style={{ color: "red" }} />
        ) : (
          <HeartOutlined style={{ color: "#666" }} />
        )
      }
      size={size}
      loading={loading}
      onClick={toggleFavorite}
      disabled={checking}
    >
      {showText && (isFavorited ? "Đã yêu thích" : "Yêu thích")}
    </Button>
  );
};

export default FavoriteButton;
