import { api } from "./axios"
import type { UsuarioSesion } from "@/lib/session"

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface LoginBody {
  correo: string
  password: string
}

export interface LoginResponse {
  token: string
  usuario: UsuarioSesion
}

// ---------------------------------------------------------------------------
// Funciones
// ---------------------------------------------------------------------------

/** POST /auth/login */
export function login(body: LoginBody): Promise<LoginResponse> {
  return api.post("/auth/login", body)
}

/** POST /auth/recuperar — envía el email con el enlace de reset */
export function recuperarPassword(correo: string): Promise<void> {
  return api.post("/auth/recuperar", { correo })
}

/** POST /auth/restablecer — establece la nueva contraseña usando el token del email */
export function restablecerPassword(token: string, nuevaPassword: string): Promise<void> {
  return api.post("/auth/restablecer", { token, nuevaPassword })
}
