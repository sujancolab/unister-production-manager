import axios from "axios";

export const API_SOURCE_STORAGE_KEY = "apiSource";

export const API_SOURCES = {
  amta: {
    label: "Amta",
    webBaseUrl: "https://amta-production.tech-trico.com",
  },
  deora: {
    label: "Deora",
    webBaseUrl: "https://deora-production.tech-trico.com",
  },
} as const;

export type ApiSourceKey = keyof typeof API_SOURCES;

const DEFAULT_SOURCE: ApiSourceKey = "amta";

const buildApiBaseUrl = (webBaseUrl: string) =>
  `${webBaseUrl.replace(/\/+$/, "")}/api`;

export const getStoredApiSource = (): ApiSourceKey => {
  const storedSource = localStorage.getItem(API_SOURCE_STORAGE_KEY);

  if (storedSource && storedSource in API_SOURCES) {
    return storedSource as ApiSourceKey;
  }

  return DEFAULT_SOURCE;
};

export const getApiBaseUrlForSource = (source: ApiSourceKey) =>
  buildApiBaseUrl(API_SOURCES[source].webBaseUrl);

const api = axios.create({
  baseURL: getApiBaseUrlForSource(getStoredApiSource()),
});

export const setApiSource = (source: ApiSourceKey) => {
  localStorage.setItem(API_SOURCE_STORAGE_KEY, source);
  api.defaults.baseURL = getApiBaseUrlForSource(source);
};

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
