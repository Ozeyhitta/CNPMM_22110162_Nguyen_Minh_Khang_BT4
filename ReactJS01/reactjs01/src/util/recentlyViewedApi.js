import axios from "./axios.customize";

// Track view
export const trackProductViewApi = (userId, productId, sessionId) => {
  const headers = {};
  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  return axios.post(
    `/v1/api/productviews`,
    {
      productId,
    },
    { headers }
  );
};

// Recently viewed
export const getRecentlyViewedApi = (sessionId, limit = 10) => {
  const headers = {};
  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  return axios.get(`/v1/api/productviews?limit=${limit}`, {
    headers,
  });
};
