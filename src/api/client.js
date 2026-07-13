import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Root API function — all HTTP calls must go through this.
 */
export async function request(config) {
  try {
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    throw new Error(message);
  }
}

export default api;
