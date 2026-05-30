import { api } from "./axios"
import type {
  SolicitudMantenimiento,
  ProveedorOpcion,
  EstadoMantenimiento,
  PrioridadMantenimiento,
} from "@/types/mantenimiento.types"
import type { ApiListResponse } from "@/types/api.types"

// ---------------------------------------------------------------------------
// Parámetros
// ---------------------------------------------------------------------------

export interface ListarMantenimientoParams {
  busqueda?: string
  estado?: EstadoMantenimiento
  prioridad?: PrioridadMantenimiento
  page?: number
  limit?: number
}

export interface ResumenEstadosMantenimiento {
  pendiente: number
  en_proceso: number
  finalizado: number
  cancelado: number
}

export interface ListarMantenimientoResponse extends ApiListResponse<SolicitudMantenimiento> {
  resumenEstados: ResumenEstadosMantenimiento
}

export interface AsignarProveedorBody {
  proveedorId: string
  fechaVisita?: string
  notas?: string
}

export interface GuardarProveedorBody {
  nombre: string
  especialidad: string
  telefono: string
  correo?: string
  calificacion?: number
}

// ---------------------------------------------------------------------------
// Funciones — Solicitudes
// ---------------------------------------------------------------------------

/** GET /mantenimiento */
export function listarMantenimiento(
  params?: ListarMantenimientoParams,
): Promise<ListarMantenimientoResponse> {
  return api.get("/mantenimiento", { params })
}

/** GET /mantenimiento/:id */
export function obtenerMantenimiento(id: string): Promise<{ data: SolicitudMantenimiento }> {
  return api.get(`/mantenimiento/${id}`)
}

/** POST /mantenimiento — multipart/form-data */
export function registrarMantenimiento(
  inmuebleId: string,
  descripcion: string,
  prioridad: PrioridadMantenimiento,
  evidencias: File[],
): Promise<{ data: SolicitudMantenimiento }> {
  const form = new FormData()
  form.append("inmuebleId", inmuebleId)
  form.append("descripcion", descripcion)
  form.append("prioridad", prioridad)
  evidencias.forEach(f => form.append("evidencias", f))
  return api.post("/mantenimiento", form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

/** PATCH /mantenimiento/:id/asignar */
export function asignarProveedor(
  id: string,
  body: AsignarProveedorBody,
): Promise<{ data: SolicitudMantenimiento }> {
  return api.patch(`/mantenimiento/${id}/asignar`, body)
}

/** PATCH /mantenimiento/:id/estado — multipart/form-data */
export function actualizarEstado(
  id: string,
  estado: "finalizado" | "cancelado",
  nota: string,
  evidencias: File[],
): Promise<{ data: SolicitudMantenimiento }> {
  const form = new FormData()
  form.append("estado", estado)
  form.append("nota", nota)
  evidencias.forEach(f => form.append("evidencias", f))
  return api.patch(`/mantenimiento/${id}/estado`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

/** PATCH /mantenimiento/:id/costo — multipart/form-data */
export function registrarCosto(
  id: string,
  costo: number,
  factura?: File,
): Promise<{ data: SolicitudMantenimiento }> {
  const form = new FormData()
  form.append("costo", String(costo))
  if (factura) form.append("factura", factura)
  return api.patch(`/mantenimiento/${id}/costo`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

// ---------------------------------------------------------------------------
// Funciones — Proveedores
// ---------------------------------------------------------------------------

/** GET /mantenimiento/proveedores */
export function listarProveedores(params?: {
  busqueda?: string
}): Promise<{ data: ProveedorOpcion[] }> {
  return api.get("/mantenimiento/proveedores", { params })
}

/** POST /mantenimiento/proveedores */
export function crearProveedor(
  body: GuardarProveedorBody,
): Promise<{ data: ProveedorOpcion }> {
  return api.post("/mantenimiento/proveedores", body)
}

/** PATCH /mantenimiento/proveedores/:id */
export function editarProveedor(
  id: string,
  body: Partial<GuardarProveedorBody>,
): Promise<{ data: ProveedorOpcion }> {
  return api.patch(`/mantenimiento/proveedores/${id}`, body)
}

/** DELETE /mantenimiento/proveedores/:id */
export function eliminarProveedor(id: string): Promise<void> {
  return api.delete(`/mantenimiento/proveedores/${id}`)
}
