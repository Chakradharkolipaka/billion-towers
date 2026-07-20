import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

function formatRequestError(error) {
  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return "Cannot reach the API server. Start the backend with: npm run backend";
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Check that the backend is running on port 3099.";
  }

  if (error.response?.status === 431) {
    return "Request headers too large. Clear browser cookies and restart the backend server.";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Request failed"
  );
}

/**
 * Root API function — all HTTP calls must go through this.
 */
export async function request(config) {
  try {
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    throw new Error(formatRequestError(error));
  }
}

export default api;
