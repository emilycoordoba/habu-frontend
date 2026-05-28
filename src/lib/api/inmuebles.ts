import { api } from "./axios"
import type {
  InmuebleResumen,
  InmuebleDetalle,
  FotoInmueble,
  CambioHistorial,
  TipoInmueble,
  ModalidadInmueble,
  EstadoInmueble,
} from "@/types/inmueble.types"
import type { ApiListResponse } from "@/types/api.types"

// ---------------------------------------------------------------------------
// Parámetros
// ---------------------------------------------------------------------------

export interface ListarInmueblesParams {
  busqueda?: string
  tipo?: TipoInmueble
  modalidad?: ModalidadInmueble
  estado?: EstadoInmueble
  disponibles?: boolean
  propietarioId?: string
  page?: number
  limit?: number
}

export interface ListarInmueblesResponse extends ApiListResponse<InmuebleResumen> {
  /** Conteo por estado — para las tarjetas de resumen del encabezado */
  resumenEstados: Record<EstadoInmueble, number>
}

export interface RegistrarInmuebleBody {
  tipo: TipoInmueble
  modalidad: ModalidadInmueble
  direccion: string
  ubicacion: string
  area: number
  precio: number
  propietarioId: string
  publicado: boolean
  coordenadas?: [number, number]
}

export type EditarInmuebleBody = RegistrarInmuebleBody

export interface CambiarEstadoInmuebleBody {
  estado: EstadoInmueble
  nota?: string
}

export interface ListarHistorialParams {
  page?: number
  limit?: number
}

// ---------------------------------------------------------------------------
// Funciones
// ---------------------------------------------------------------------------

/** GET /inmuebles */
export function listarInmuebles(params?: ListarInmueblesParams): Promise<ListarInmueblesResponse> {
  return api.get("/inmuebles", { params })
}

/** GET /inmuebles/:id */
export function obtenerInmueble(id: string): Promise<{ data: InmuebleDetalle }> {
  return api.get(`/inmuebles/${id}`)
}

/** POST /inmuebles */
export function registrarInmueble(body: RegistrarInmuebleBody): Promise<{ data: InmuebleResumen }> {
  return api.post("/inmuebles", body)
}

/** PUT /inmuebles/:id */
export function editarInmueble(id: string, body: EditarInmuebleBody): Promise<{ data: InmuebleResumen }> {
  return api.put(`/inmuebles/${id}`, body)
}

/** PATCH /inmuebles/:id/estado */
export function cambiarEstadoInmueble(
  id: string,
  body: CambiarEstadoInmuebleBody,
): Promise<{ data: { id: string; estado: EstadoInmueble } }> {
  return api.patch(`/inmuebles/${id}/estado`, body)
}

/** GET /inmuebles/:id/fotos */
export function listarFotos(id: string): Promise<{ data: FotoInmueble[] }> {
  return api.get(`/inmuebles/${id}/fotos`)
}

/** POST /inmuebles/:id/fotos  (multipart/form-data) */
export function subirFoto(id: string, archivo: File, descripcion?: string): Promise<{ data: FotoInmueble }> {
  const form = new FormData()
  form.append("archivo", archivo)
  if (descripcion) form.append("descripcion", descripcion)
  return api.post(`/inmuebles/${id}/fotos`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

/** DELETE /inmuebles/:id/fotos/:fotoId */
export function eliminarFoto(id: string, fotoId: string): Promise<void> {
  return api.delete(`/inmuebles/${id}/fotos/${fotoId}`)
}

/** GET /inmuebles/:id/historial */
export function listarHistorial(
  id: string,
  params?: ListarHistorialParams,
): Promise<ApiListResponse<CambioHistorial>> {
  return api.get(`/inmuebles/${id}/historial`, { params })
}
