import axios from "axios";

if (import.meta.env.DEV) {
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const path = window.location.pathname;

  let token = null;

  if (path.startsWith("/admin")) {
    token = localStorage.getItem("adminToken");
  } else if (path.startsWith("/hospital")) {
    token = localStorage.getItem("hospitalToken");
  } else if (path.startsWith("/doctor")) {
    token = localStorage.getItem("doctorToken");
  } else {
    token =
      localStorage.getItem("patientToken") ||
      localStorage.getItem("token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;