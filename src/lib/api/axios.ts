import axios from "axios"
import { getToken, clearSession } from "@/lib/session"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

// Adjunta el JWT en cada request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Desenvuelve { data: T } → T para que las funciones de la API no tengan que acceder a .data.data
// 401 → limpia sesión y redirige al login
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearSession()
      window.location.href = "/login"
    }
    const mensaje = error.response?.data?.error?.mensaje ?? "Error de conexión"
    return Promise.reject(new Error(mensaje))
  }
)
