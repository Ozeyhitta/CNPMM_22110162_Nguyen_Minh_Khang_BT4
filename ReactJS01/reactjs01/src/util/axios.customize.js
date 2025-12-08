import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add request interceptor
instance.interceptors.request.use(
  function (config) {
    // Chỉ thêm token nếu đã có trong localStorage
    const token = localStorage.getItem("access_token");
    console.log(">>> Axios Request - Token exists:", !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(">>> Axios Request - Added Authorization header");
    } else {
      console.log(">>> Axios Request - No token found");
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
    console.log(
      ">>> Axios Error:",
      error?.response?.status,
      error?.response?.data
    );

    // Xử lý lỗi từ server - luôn reject để component có thể catch
    if (error?.response?.data) {
      // Return error data as a rejected promise
      // Không tự động logout ở đây, để component handle
      return Promise.reject(error.response.data);
    }

    // Nếu không có response (network error)
    return Promise.reject({
      EC: -1,
      EM: error?.message || "Không thể kết nối đến server",
    });
  }
);

export default instance;
