import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

// Adjunta el JWT en cada request (se activa cuando haya auth implementada)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Desenvuelve { data: T } → T para que las funciones de la API no tengan que acceder a .data.data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const mensaje = error.response?.data?.error?.mensaje ?? "Error de conexión"
    return Promise.reject(new Error(mensaje))
  }
)
