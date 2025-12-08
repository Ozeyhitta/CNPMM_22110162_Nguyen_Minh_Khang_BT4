import axios from "./axios.customize";

// Track product purchase
export const trackProductPurchaseApi = (
  productId,
  quantity = 1,
  purchasePrice
) => {
  return axios.post(`/v1/api/productpurchases`, {
    productId,
    quantity,
    purchasePrice,
  });
};

// Get purchase count for a product
export const getProductPurchaseCountApi = (productId) => {
  return axios.get(`/v1/api/productpurchases/count/${productId}`);
};

// Get all purchase counts
export const getAllPurchaseCountsApi = () => {
  return axios.get(`/v1/api/productpurchases/counts`);
};
