import axios from "./axios.customize";

// RECOMMENDATION
export const getSimilarProductsApi = (productId, limit) =>
  axios.get(`/v1/api/products/${productId}/similar`, { params: { limit } });

export const getRecommendedProductsApi = (limit) =>
  axios.get(`/v1/api/products/recommended`, { params: { limit } });

export const getPopularProductsApi = (limit, excludeIds) =>
  axios.get(`/v1/api/products/popular`, {
    params: { limit, excludeIds: excludeIds?.join(",") },
  });
