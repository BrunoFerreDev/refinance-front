import axios from "axios";
import { ref } from "vue";

// Reactive auth state
export const isAuthenticated = ref(!!localStorage.getItem("auth_token"));
export const currentUser = ref({
  username: localStorage.getItem("auth_username") || "",
  jwt: localStorage.getItem("auth_token") || "",
});

// Configuración del cliente de Axios conectado al backend del usuario
export const apiClient = axios.create({
  baseURL: "http://localhost:8081",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + currentUser.value.jwt
  },
});

// Interceptor to add JWT token to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle unauthenticated (401) responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes("/auth/login")
    ) {
      // Clear local storage and reactive auth state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_username");
      isAuthenticated.value = false;
      currentUser.value = { username: "", jwt: "" };
      // Redirect to login if possible
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
