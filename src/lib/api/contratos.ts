import { api } from "./axios"
import type {
  ContratoResumen,
  ContratoDetalle,
  TipoContrato,
  EstadoContrato,
  DocumentoContrato,
  FirmaContrato,
} from "@/types/contrato.types"
import type { Cobro, EstadoCobro, EventoCuenta } from "@/types/pago.types"
import type { ApiListResponse } from "@/types/api.types"

// ---------------------------------------------------------------------------
// Parámetros y shapes de request
// ---------------------------------------------------------------------------

export interface ListarContratosParams {
  busqueda?: string
  estado?: EstadoContrato
  tipo?: TipoContrato
  asesor?: string
  page?: number
  limit?: number
}

export interface ListarContratosResponse extends ApiListResponse<ContratoResumen> {
  resumenEstados: Record<EstadoContrato, number>
}

export interface CrearArriendoBody {
  inmuebleId: string
  contraparteId: string
  asesor: string
  fechaInicio: string
  duracionMeses: number
  valorCanon: number
  diaCorte: number
  incluyeAdministracion: boolean
  valorAdministracion?: number
  tieneDeposito: boolean
  tipoDeposito?: "meses_canon" | "valor_fijo"
  mesesDeposito?: number
  valorDeposito?: number
  tieneCodeudor: boolean
  codeudor?: { nombre: string; documento: string }
}

export interface CrearPromesaBody {
  inmuebleId: string
  contraparteId: string
  asesor: string
  precioVenta: number
  valorArras: number
  fechaLimiteArras: string
  formaPago: "contado" | "credito_hipotecario" | "mixto"
  entidadFinanciera?: string
  fechaAprobacionCredito?: string
  valorContado?: number
  valorCredito?: number
  fechaEscrituracion?: string
  notaria?: string
}

export interface RenovarContratoBody {
  nuevaFechaFin: string
  nuevoValorCanon?: number
}

export interface TerminarContratoBody {
  motivo: string
  fechaTerminacion: string
  enDisputa: boolean
}

export interface EscriturarBody {
  fechaEscrituracion: string
  notaria: string
  numeroEscritura?: string
}

export interface ActualizarDocumentoBody {
  estado: "recibido" | "rechazado"
  nota?: string
}

export interface ListarCobrosParams {
  estado?: EstadoCobro
  tipo?: string
  page?: number
  limit?: number
}

export interface ListarCobrosResponse extends ApiListResponse<Cobro> {
  resumen: {
    totalPendiente: number
    totalEnMora: number
    totalPagado: number
  }
}

export interface EstadoCuentaResponse {
  data: EventoCuenta[]
  saldoActual: number
}

export interface ListarEstadoCuentaParams {
  desde?: string
  hasta?: string
}

// ---------------------------------------------------------------------------
// Funciones
// ---------------------------------------------------------------------------

/** GET /contratos */
export function listarContratos(params?: ListarContratosParams): Promise<ListarContratosResponse> {
  return api.get("/contratos", { params })
}

/** GET /contratos/:id */
export function obtenerContrato(id: string): Promise<{ data: ContratoDetalle }> {
  return api.get(`/contratos/${id}`)
}

/** POST /contratos/arriendo */
export function crearArriendo(body: CrearArriendoBody): Promise<{ data: { id: string; referencia: string; estado: "borrador" } }> {
  return api.post("/contratos/arriendo", body)
}

/** POST /contratos/promesa */
export function crearPromesa(body: CrearPromesaBody): Promise<{ data: { id: string; referencia: string; estado: "borrador" } }> {
  return api.post("/contratos/promesa", body)
}

/** POST /contratos/:id/renovar */
export function renovarContrato(id: string, body: RenovarContratoBody): Promise<{ data: { id: string; estado: EstadoContrato; fechaFin: string; valorCanon: number } }> {
  return api.post(`/contratos/${id}/renovar`, body)
}

/** POST /contratos/:id/terminar */
export function terminarContrato(id: string, body: TerminarContratoBody): Promise<{ data: { id: string; estado: EstadoContrato } }> {
  return api.post(`/contratos/${id}/terminar`, body)
}

/** PATCH /contratos/:id/firmas */
export function actualizarFirmas(
  id: string,
  firmas: { parte: string; rol: string; estado: "firmado" }[],
): Promise<{ data: { id: string; estado: EstadoContrato; firmas: FirmaContrato[] } }> {
  return api.patch(`/contratos/${id}/firmas`, { firmas })
}

/** POST /contratos/:id/escriturar */
export function escriturar(id: string, body: EscriturarBody): Promise<{ data: { id: string; estado: "pendiente_registro" } }> {
  return api.post(`/contratos/${id}/escriturar`, body)
}

/** GET /contratos/:id/documentos */
export function listarDocumentos(id: string): Promise<{ data: DocumentoContrato[] }> {
  return api.get(`/contratos/${id}/documentos`)
}

/** POST /contratos/:id/documentos  (multipart/form-data) */
export function subirDocumento(id: string, tipo: string, nombre: string, archivo: File): Promise<{ data: DocumentoContrato }> {
  const form = new FormData()
  form.append("tipo", tipo)
  form.append("nombre", nombre)
  form.append("archivo", archivo)
  return api.post(`/contratos/${id}/documentos`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

/** PATCH /contratos/:id/documentos/:docId */
export function actualizarDocumento(id: string, docId: string, body: ActualizarDocumentoBody): Promise<{ data: DocumentoContrato }> {
  return api.patch(`/contratos/${id}/documentos/${docId}`, body)
}

/** DELETE /contratos/:id/documentos/:docId */
export function eliminarDocumento(id: string, docId: string): Promise<void> {
  return api.delete(`/contratos/${id}/documentos/${docId}`)
}

/** GET /contratos/:id/documentos/:docId/descargar — retorna la URL directa */
export function urlDescargarDocumento(id: string, docId: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/contratos/${id}/documentos/${docId}/descargar`
}

/** DELETE /contratos/:id */
export function eliminarContrato(id: string): Promise<void> {
  return api.delete(`/contratos/${id}`)
}

/** GET /contratos/:id/cobros */
export function listarCobros(id: string, params?: ListarCobrosParams): Promise<ListarCobrosResponse> {
  return api.get(`/contratos/${id}/cobros`, { params })
}

/** GET /contratos/:id/estado-cuenta */
export function obtenerEstadoCuenta(id: string, params?: ListarEstadoCuentaParams): Promise<EstadoCuentaResponse> {
  return api.get(`/contratos/${id}/estado-cuenta`, { params })
}
