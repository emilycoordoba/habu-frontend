import { api } from "./axios"
import type {
  ClienteResumen,
  ClienteDetalle,
  Interaccion,
  ContratoClienteResumen,
  InmuebleClienteResumen,
  TipoCliente,
  TipoPersona,
  TipoDocumento,
  TipoInteraccion,
} from "@/types/cliente.types"
import type { ApiListResponse } from "@/types/api.types"

// ---------------------------------------------------------------------------
// Parámetros
// ---------------------------------------------------------------------------

export interface ListarClientesParams {
  busqueda?: string
  tipo?: TipoCliente
  tipoPersona?: TipoPersona
  activo?: boolean
  page?: number
  limit?: number
}

export interface ListarInteraccionesParams {
  tipo?: TipoInteraccion
  desde?: string
  hasta?: string
  page?: number
  limit?: number
}

interface ClienteBodyBase {
  tipos: TipoCliente[]
  telefono: string
  email: string
  ciudad: string
}

export interface CrearClienteNaturalBody extends ClienteBodyBase {
  tipoPersona: "natural"
  nombre: string
  documento: string
  tipoDocumento: "CC" | "CE" | "PAS"
}

export interface CrearClienteJuridicaBody extends ClienteBodyBase {
  tipoPersona: "juridica"
  nombre: string
  documento: string
  tipoDocumento: "NIT"
  representanteLegal: string
}

export type CrearClienteBody = CrearClienteNaturalBody | CrearClienteJuridicaBody
export type EditarClienteBody = CrearClienteBody

export interface RegistrarInteraccionBody {
  tipo: TipoInteraccion
  fecha: string
  hora: string
  descripcion: string
  inmuebleId?: string
}

// ---------------------------------------------------------------------------
// Funciones
// ---------------------------------------------------------------------------

/** GET /clientes */
export function listarClientes(params?: ListarClientesParams): Promise<ApiListResponse<ClienteResumen>> {
  return api.get("/clientes", { params })
}

/** GET /clientes/:id */
export function obtenerCliente(id: string): Promise<{ data: ClienteDetalle }> {
  return api.get(`/clientes/${id}`)
}

/** POST /clientes */
export function crearCliente(body: CrearClienteBody): Promise<{ data: ClienteResumen }> {
  return api.post("/clientes", body)
}

/** PUT /clientes/:id */
export function editarCliente(id: string, body: EditarClienteBody): Promise<{ data: ClienteResumen }> {
  return api.put(`/clientes/${id}`, body)
}

/** PATCH /clientes/:id/estado */
export function cambiarEstadoCliente(id: string, activo: boolean): Promise<{ data: { id: string; activo: boolean } }> {
  return api.patch(`/clientes/${id}/estado`, { activo })
}

/** GET /clientes/:id/contratos */
export function listarContratosCliente(id: string): Promise<{ data: ContratoClienteResumen[] }> {
  return api.get(`/clientes/${id}/contratos`)
}

/** GET /clientes/:id/inmuebles */
export function listarInmueblesCliente(id: string): Promise<{ data: InmuebleClienteResumen[] }> {
  return api.get(`/clientes/${id}/inmuebles`)
}

/** GET /clientes/:id/interacciones */
export function listarInteracciones(
  id: string,
  params?: ListarInteraccionesParams,
): Promise<ApiListResponse<Interaccion>> {
  return api.get(`/clientes/${id}/interacciones`, { params })
}

/** POST /clientes/:id/interacciones */
export function registrarInteraccion(
  id: string,
  body: RegistrarInteraccionBody,
): Promise<{ data: Interaccion }> {
  return api.post(`/clientes/${id}/interacciones`, body)
}
