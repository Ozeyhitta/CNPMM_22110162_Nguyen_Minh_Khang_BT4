import axios from "./axios.customize";

// COMMENTS
export const addProductCommentApi = (productId, commentData) =>
  axios.post(`/v1/api/products/${productId}/comments`, commentData);

export const getProductCommentsApi = (productId, page, limit) =>
  axios.get(`/v1/api/products/${productId}/comments`, {
    params: { page, limit },
  });

export const getProductStatsApi = (productId) =>
  axios.get(`/v1/api/products/${productId}/stats`);

export const deleteProductCommentApi = (commentId) =>
  axios.delete(`/v1/api/products/comments/${commentId}`);
