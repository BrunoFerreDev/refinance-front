import { apiClient, isAuthenticated, currentUser } from "./client.js";

export const ALLOWED_ROLES = ["SECRETARIO", "PRESIDENTE", "SUPERUSER", "SUPERUSUARIO"];

export function parseJwtPayload(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn("No se pudo decodificar payload JWT:", e.message);
    return null;
  }
}

export function extractUserRole(data, jwtToken) {
  let rawRole = null;

  // 1. Extraer desde la respuesta directa del endpoint
  if (data) {
    if (data.role) rawRole = data.role;
    else if (data.rol) rawRole = data.rol;
    else if (Array.isArray(data.roles) && data.roles.length > 0) rawRole = data.roles[0];
  }

  // 2. Extraer desde el payload del JWT si no vino en el cuerpo
  if (!rawRole && jwtToken) {
    const payload = parseJwtPayload(jwtToken);
    if (payload) {
      if (payload.role) rawRole = payload.role;
      else if (payload.rol) rawRole = payload.rol;
      else if (payload.auth) rawRole = payload.auth;
      else if (Array.isArray(payload.roles) && payload.roles.length > 0) rawRole = payload.roles[0];
      else if (Array.isArray(payload.authorities) && payload.authorities.length > 0) {
        const authItem = payload.authorities[0];
        rawRole = typeof authItem === "object" ? authItem.authority : authItem;
      }
    }
  }

  if (!rawRole) return "SECRETARIO";

  let normalized = String(rawRole).trim().toUpperCase();
  if (normalized.startsWith("ROLE_")) {
    normalized = normalized.substring(5);
  }
  if (normalized === "SUPERUSUARIO") {
    normalized = "SUPERUSER";
  }

  return normalized;
}

export function isAuthorizedRole(role) {
  if (!role) return false;
  const upper = String(role).toUpperCase();
  return ALLOWED_ROLES.some((allowed) => upper.includes(allowed));
}

export async function loginUser(whatsapp, contrasenia) {
  try {
    const response = await apiClient.post("/auth/login", { whatsapp, contrasenia });
    const data = response.data;

    if (data && data.status && data.jwt) {
      const detectedRole = extractUserRole(data, data.jwt);

      // Si el rol detectado no pertenece a los roles autorizados, denegar
      if (!isAuthorizedRole(detectedRole)) {
        return {
          status: false,
          message: "Acceso no autorizado: Solo roles SECRETARIO, PRESIDENTE o SUPERUSER pueden ingresar.",
        };
      }

      localStorage.setItem("auth_token", data.jwt);
      localStorage.setItem("auth_username", data.username || "");
      localStorage.setItem("auth_role", detectedRole);

      isAuthenticated.value = true;
      currentUser.value = {
        username: data.username || "",
        jwt: data.jwt,
        role: detectedRole,
      };

      return { status: true, message: data.message, role: detectedRole };
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
  localStorage.removeItem("auth_role");
  isAuthenticated.value = false;
  currentUser.value = {
    username: "",
    jwt: "",
    role: "",
  };
}

