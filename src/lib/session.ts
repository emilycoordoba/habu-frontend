// Gestión de la sesión del usuario autenticado en el cliente.
// Única fuente de verdad para token y datos del usuario en localStorage.

export interface UsuarioSesion {
  id: string
  nombre: string
  correo: string
  rol: "administrador" | "asesor"
}

const TOKEN_KEY   = "habu_token"
const USUARIO_KEY = "habu_usuario"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUsuario(): UsuarioSesion | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(USUARIO_KEY)
    return raw ? (JSON.parse(raw) as UsuarioSesion) : null
  } catch {
    return null
  }
}

export function setSession(token: string, usuario: UsuarioSesion): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario))
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USUARIO_KEY)
}
