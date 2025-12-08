import React, { useContext } from "react";
import { Card, Button } from "antd"; // ✅ BẮT BUỘC PHẢI IMPORT
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { CartContext } from "./context/auth.context";
import usePurchaseCounts from "../hooks/usePurchaseCounts";

export default function ProductCard({
  item,
  showFavorite = false,
  compact = false,
}) {
  // Guard clause: return null if item is undefined/null
  if (!item) {
    console.warn("ProductCard received undefined/null item");
    return null;
  }

  // FIX: item có thể là Favorite (item.product) hoặc Product (item)
  const product = item.product || item;

  const imageHeight = compact ? "120px" : "150px";
  const priceFontSize = compact ? "14px" : "16px";

  // Cart context
  const { addToCart, buyNow } = useContext(CartContext);

  // Purchase counts from backend
  const { purchaseCounts: backendPurchaseCounts } = usePurchaseCounts();

  // Combine local and backend purchase counts
  const backendCount = backendPurchaseCounts[product.id] || 0;
  const purchaseCount = backendCount;

  return (
    <Card
      hoverable
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent card content from overflowing
      }}
      cover={
        <div style={{ position: "relative" }}>
          <Link to={`/products/${product.id}`}>
            <img
              src={product.thumbnail || "https://picsum.photos/200/200"}
              alt={product.name}
              style={{
                width: "100%",
                height: imageHeight,
                objectFit: "cover",
                display: "block", // Remove any default image spacing
              }}
            />
          </Link>
          {showFavorite && (
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <FavoriteButton productId={product.id} size="small" />
            </div>
          )}
        </div>
      }
      styles={{
        body: {
          padding: compact ? "12px" : "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* Product content area - takes available space */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Link
          to={`/products/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <h4
              style={{
                fontSize: compact ? "14px" : "16px",
                margin: "0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: "1.4",
                flex: 1,
              }}
            >
              {product.name}
            </h4>
            {purchaseCount > 0 && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#1890ff",
                  fontWeight: "bold",
                  marginLeft: "8px",
                  whiteSpace: "nowrap",
                  flexShrink: 0, // Don't shrink this element
                }}
              >
                Đã mua: {purchaseCount}
              </span>
            )}
          </div>
        </Link>

        <p
          style={{
            color: "red",
            fontSize: priceFontSize,
            fontWeight: "bold",
            margin: "0 0 4px 0",
          }}
        >
          {product.price.toLocaleString()} đ
        </p>

        {product.discount > 0 && (
          <p
            style={{
              color: "green",
              fontWeight: "bold",
              fontSize: compact ? "12px" : "14px",
              margin: "0 0 4px 0",
            }}
          >
            Giảm giá: {product.discount}%
          </p>
        )}

        {!compact && (
          <p
            style={{
              color: "#666",
              fontSize: "12px",
              margin: "0 0 8px 0",
            }}
          >
            Lượt xem: {product.viewCount || 0}
          </p>
        )}
      </div>

      {/* Button container - fixed at bottom, within card boundaries */}
      <div
        style={{
          flexShrink: 0, // Don't shrink buttons
          marginTop: "8px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: compact ? "4px" : "8px",
            width: "100%",
            alignItems: "stretch", // Make buttons same height
          }}
        >
          <Button
            type="default"
            size="small"
            style={{
              flex: "1 1 0%",
              minWidth: 0, // Allow shrinking below content if needed
              fontSize: compact ? "12px" : "14px",
              padding: compact ? "4px 8px" : "6px 12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: "auto", // Allow flexible height
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
          >
            {compact ? "Thêm" : "Thêm vào giỏ"}
          </Button>
          <Button
            type="primary"
            size="small"
            style={{
              flex: "1 1 0%",
              minWidth: 0, // Allow shrinking below content if needed
              fontSize: compact ? "12px" : "14px",
              padding: compact ? "4px 8px" : "6px 12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: "auto", // Allow flexible height
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              buyNow(product.id);
            }}
          >
            {compact ? "Mua" : "Mua ngay"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
