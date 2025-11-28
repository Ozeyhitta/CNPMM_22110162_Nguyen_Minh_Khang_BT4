export default function ProductCard({ item }) {
  return (
    <div className="product-card">
      <img
        src={item.thumbnail || "https://picsum.photos/200/200"}
        alt=""
        style={{
          width: "100 %",
          height: "150px",
          objectFit: "cover",
          borderRadius: 8,
          marginBottom: 8,
        }}
      />
      <h4>{item.name}</h4>
      <p style={{ color: "red" }}>{item.price.toLocaleString()} đ</p>
      {item.discount > 0 && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Giảm giá: {item.discount}%
        </p>
      )}
      <p style={{ color: "#666", fontSize: "12px" }}>
        Lượt xem: {item.viewCount || 0}
      </p>
    </div>
  );
}
