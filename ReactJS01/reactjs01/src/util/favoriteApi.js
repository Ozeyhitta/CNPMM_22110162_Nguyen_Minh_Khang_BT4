import axios from "./axios.customize";

// FAVORITES
export const addToFavoritesApi = (productId) =>
  axios.post(`/v1/api/favorites`, { productId });

export const removeFromFavoritesApi = (productId) =>
  axios.delete(`/v1/api/favorites/${productId}`);

export const getUserFavoritesApi = () => axios.get(`/v1/api/favorites`);

export const checkFavoriteStatusApi = (productId) =>
  axios.get(`/v1/api/favorites/${productId}/status`);
