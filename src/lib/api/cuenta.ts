import { api } from "./axios"
import type { UsuarioSesion } from "@/lib/session"

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface MiPerfil extends UsuarioSesion {
  telefono?: string
  ciudad?: string
}

export interface ActualizarPerfilBody {
  nombre?: string
  correo?: string
  telefono?: string
  ciudad?: string
}

export interface CambiarPasswordBody {
  actual: string
  nueva: string
}

export interface NotificacionesConfig {
  vencimientoContrato: boolean
  cobroEnMora: boolean
  nuevoContrato: boolean
  pagoRegistrado: boolean
}

// ---------------------------------------------------------------------------
// Funciones
// ---------------------------------------------------------------------------

/** GET /usuarios/me */
export function obtenerMiPerfil(): Promise<{ data: MiPerfil }> {
  return api.get("/usuarios/me")
}

/** PATCH /usuarios/me */
export function actualizarMiPerfil(
  body: ActualizarPerfilBody,
): Promise<{ data: MiPerfil }> {
  return api.patch("/usuarios/me", body)
}

/** PATCH /usuarios/me/password */
export function cambiarMiPassword(body: CambiarPasswordBody): Promise<void> {
  return api.patch("/usuarios/me/password", body)
}

/** GET /usuarios/me/notificaciones */
export function obtenerNotificaciones(): Promise<{ data: NotificacionesConfig }> {
  return api.get("/usuarios/me/notificaciones")
}

/** PATCH /usuarios/me/notificaciones */
export function actualizarNotificaciones(
  body: Partial<NotificacionesConfig>,
): Promise<{ data: NotificacionesConfig }> {
  return api.patch("/usuarios/me/notificaciones", body)
}
