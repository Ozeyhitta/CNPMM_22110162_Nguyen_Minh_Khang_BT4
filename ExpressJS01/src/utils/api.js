import axios from "./axios.customize";

// Lazy Loading (offset)
export const getProductsLazy = async (offset = 0, limit = 12) => {
  const res = await axios.get(
    `/v1/api/products?offset=${offset}&limit=${limit}`
  );
  return res.data;
};

// Pagination (page-based)
export const getProductsPage = async (page = 1, limit = 12, category = "") => {
  const query = `/v1/api/products?page=${page}&limit=${limit}${
    category ? `&category=${category}` : ""
  }`;

  const res = await axios.get(query);
  return res.data;
};

export const checkFavoriteStatusApi = async (productId) => {
  const res = await axios.get(`/v1/api/favorites/${productId}/status`);
  return res.data; // hợp với cách bạn đang dùng
};
