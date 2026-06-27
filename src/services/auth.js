import { apiClient, isAuthenticated, currentUser } from "./client.js";

export async function loginUser(whatsapp, contrasenia) {
  try {
    
    const response = await apiClient.post("/auth/login", { whatsapp, contrasenia });
    const data = response.data;

    if (data && data.status && data.jwt) {
      localStorage.setItem("auth_token", data.jwt);
      localStorage.setItem("auth_username", data.username || "");

      isAuthenticated.value = true;
      currentUser.value = {
        username: data.username || "",
        jwt: data.jwt,
      };

      return { status: true, message: data.message };
    } else {
      return { status: false, message: data && data.message ? data.message : "Error en el inicio de sesión" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Error al conectar con el servidor",
    };
  }
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_username");
  isAuthenticated.value = false;
  currentUser.value = {
    username: "",
    jwt: "",
  };
}
