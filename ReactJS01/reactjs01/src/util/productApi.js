import axios from "./axios.customize";

// PRODUCT LIST
export const getProductsApi = (page = 1, limit = 10, category = "") =>
  axios.get(
    `/v1/api/products?page=${page}&limit=${limit}&category=${category}`
  );

export const getProductByIdApi = (id) => axios.get(`/v1/api/products/${id}`);

// PRODUCT MANAGEMENT (ADMIN)
export const createProductApi = (productData) =>
  axios.post(`/v1/api/products`, productData);

export const updateProductApi = (id, productData) =>
  axios.put(`/v1/api/products/${id}`, productData);

export const deleteProductApi = (id) => axios.delete(`/v1/api/products/${id}`);

// SEARCH + FILTER
export const searchProductsApi = (keyword) =>
  axios.get(`/v1/api/products/search?q=${keyword}`);

export const filterProductsApi = (filters) =>
  axios.get(`/v1/api/products/filter`, { params: filters });
