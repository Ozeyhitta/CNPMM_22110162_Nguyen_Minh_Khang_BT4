import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add request interceptor
instance.interceptors.request.use(
  function (config) {
    // Chỉ thêm token nếu đã có trong localStorage
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  function (response) {
    // Trả về data từ response
    if (response && response.data) return response.data;
    return response;
  },
  function (error) {
    // Xử lý lỗi từ server
    if (error?.response?.data) {
      // Nếu có data từ server, trả về
      return error.response.data;
    }
    
    // Nếu không có response (network error)
    return {
      EC: -1,
      EM: error?.message || "Không thể kết nối đến server",
    };
  }
);

export default instance;
