import axios from "./axios.customize";

// CATEGORIES
export const getCategoriesApi = () => axios.get("/v1/api/categories");

export const getCategoryByIdApi = (id) => axios.get(`/v1/api/categories/${id}`);

export const createCategoryApi = (name, description = "", thumbnail = "") =>
  axios.post(`/v1/api/categories`, { name, description, thumbnail });

export const updateCategoryApi = (id, data) =>
  axios.put(`/v1/api/categories/${id}`, data);

export const deleteCategoryApi = (id) =>
  axios.delete(`/v1/api/categories/${id}`);
