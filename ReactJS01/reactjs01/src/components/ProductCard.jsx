export default function ProductCard({ item }) {
  return (
    <div className="product-card">
      <img
        src={item.thumbnail || "https://via.placeholder.com/200"}
        alt=""
        style={{ width: "100%", borderRadius: 6 }}
      />
      <h4>{item.name}</h4>
      <p style={{ color: "red" }}>{item.price.toLocaleString()} đ</p>
    </div>
  );
}
