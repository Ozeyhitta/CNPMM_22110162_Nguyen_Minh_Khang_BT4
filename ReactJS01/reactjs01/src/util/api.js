import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = { name, email, password };
  return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = { email, password };
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get(URL_API);
};

// 🔥 API lấy danh sách sản phẩm (có phân trang)
const getProductsApi = (page = 1, limit = 10, category = "") => {
  const URL_API = `/v1/api/products?page=${page}&limit=${limit}&category=${category}`;
  return axios.get(URL_API);
};

// Lấy sản phẩm theo ID
const getProductByIdApi = (id) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.get(URL_API);
};

// =========================
// ADMIN PRODUCT MANAGEMENT APIs
// =========================

// Tạo sản phẩm mới (Admin only)
const createProductApi = (name, category, price, thumbnail = "") => {
  const URL_API = "/v1/api/products";
  const data = { name, category, price, thumbnail };
  return axios.post(URL_API, data);
};

// Cập nhật sản phẩm (Admin only)
const updateProductApi = (id, data) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.put(URL_API, data);
};

// Xóa sản phẩm (Admin only)
const deleteProductApi = (id) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.delete(URL_API);
};

const searchProductsApi = (keyword) => {
  return axios.get(`/v1/api/products/search?q=${keyword}`);
};

export const filterProductsApi = (filters) => {
  return axios
    .get(`/v1/api/products/filter`, {
      params: filters,
    })
    .then((res) => res.data);
};

// =========================
// ADMIN USER MANAGEMENT APIs
// =========================

// Lấy danh sách tất cả users (Admin only)
const getAllUsersApi = () => {
  const URL_API = "/v1/api/admin/users";
  return axios.get(URL_API);
};

// Lấy user theo ID (Admin only)
const getUserByIdApi = (id) => {
  const URL_API = `/v1/api/admin/users/${id}`;
  return axios.get(URL_API);
};

// Tạo user mới (Admin only)
const createUserByAdminApi = (name, email, password, role = "user") => {
  const URL_API = "/v1/api/admin/users";
  const data = { name, email, password, role };
  return axios.post(URL_API, data);
};

// Cập nhật user (Admin only)
const updateUserApi = (id, data) => {
  const URL_API = `/v1/api/admin/users/${id}`;
  return axios.put(URL_API, data);
};

// Cập nhật role của user (Admin only)
const updateUserRoleApi = (id, role) => {
  const URL_API = `/v1/api/admin/users/${id}/role`;
  return axios.put(URL_API, { role });
};

// Xóa user (Admin only)
const deleteUserApi = (id) => {
  const URL_API = `/v1/api/admin/users/${id}`;
  return axios.delete(URL_API);
};

// =========================
// CATEGORY APIs
// =========================

// Lấy danh sách danh mục
const getCategoriesApi = () => {
  return axios.get("/v1/api/categories");
};

// Lấy danh mục theo ID
const getCategoryByIdApi = (id) => {
  return axios.get(`/v1/api/categories/${id}`);
};

// Tạo danh mục mới (Admin only)
const createCategoryApi = (name, description = "", thumbnail = "") => {
  const data = { name, description, thumbnail };
  return axios.post("/v1/api/categories", data);
};

// Cập nhật danh mục (Admin only)
const updateCategoryApi = (id, data) => {
  return axios.put(`/v1/api/categories/${id}`, data);
};

// Xóa danh mục (Admin only)
const deleteCategoryApi = (id) => {
  return axios.delete(`/v1/api/categories/${id}`);
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  getProductsApi,
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getAllUsersApi,
  getUserByIdApi,
  createUserByAdminApi,
  updateUserApi,
  updateUserRoleApi,
  deleteUserApi,
  searchProductsApi,
  getCategoriesApi,
  getCategoryByIdApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
};
