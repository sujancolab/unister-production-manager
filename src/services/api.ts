import axios from "axios";

const api = axios.create({
  baseURL: "https://deora-production.tech-trico.com/api",
});
api.interceptors.request.use((config) => {
  // Ensure requests use API base path even if callers pass "/endpoint".
  if (typeof config.url === "string" && config.url.startsWith("/")) {
    config.url = config.url.slice(1);
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
