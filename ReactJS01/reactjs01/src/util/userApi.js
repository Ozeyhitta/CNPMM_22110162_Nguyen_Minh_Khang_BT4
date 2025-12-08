import axios from "./axios.customize";

// Tạo user mới (ADMIN)
export const deleteUserApi = (id) => {
  return axios.delete(`/v1/api/admin/users/${id}`);
};

// Lấy toàn bộ danh sách users
export const getAllUsersApi = () => {
  return axios.get(`/v1/api/admin/users`);
};

// AUTH
export const createUserApi = (name, email, password) =>
  axios.post("/v1/api/register", { name, email, password });

export const createUserByAdminApi = (name, email, password, role = "user") => {
  return axios.post(`/v1/api/admin/users`, {
    name,
    email,
    password,
    role,
  });
};

export const updateUserApi = (id, data) => {
  return axios.put(`/v1/api/admin/users/${id}`, data);
};

export const loginApi = (email, password) =>
  axios.post("/v1/api/login", { email, password });

export const getUserApi = () => axios.get("/v1/api/user");

// Logout - tạo sessionId mới cho anonymous user
export const logoutApi = () => {
  return axios.post("/v1/api/logout");
};

// Verify token còn hạn hay không (Frontend dùng để kiểm tra login state)
export const verifyTokenApi = () => {
  return axios.get("/v1/api/user"); // route này require auth, token tự gắn từ axios.customize
};
