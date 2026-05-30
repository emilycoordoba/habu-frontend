import { api } from "./axios"
import type {
  Usuario,
  RolUsuario,
  EstadoUsuario,
  EsquemaComision,
  EsquemaComisionDetalle,
  TipoComision,
  Parametros,
  TipoDocumentoReq,
  TipoPersona,
  TipoInmueble,
  Plantilla,
  PlantillaResumen,
} from "@/types/administracion.types"
import type { ApiListResponse } from "@/types/api.types"

// ---------------------------------------------------------------------------
// Parámetros de listado
// ---------------------------------------------------------------------------

export interface ListarUsuariosParams {
  busqueda?: string
  rol?: RolUsuario
  estado?: EstadoUsuario
  page?: number
  limit?: number
}

export interface ListarEsquemasParams {
  busqueda?: string
  tipo?: TipoComision
  estado?: "activo" | "inactivo"
  page?: number
  limit?: number
}

export interface ListarTiposDocumentoParams {
  busqueda?: string
  tipoPersona?: TipoPersona
  tipoInmueble?: TipoInmueble
}

export interface ListarPlantillasParams {
  busqueda?: string
  tipo?: string
}

// ---------------------------------------------------------------------------
// Cuerpos de request
// ---------------------------------------------------------------------------

export interface CrearUsuarioBody {
  nombre: string
  correo: string
  contrasena: string
  roles: RolUsuario[]
  estado?: EstadoUsuario
}

export interface EditarUsuarioBody {
  nombre?: string
  correo?: string
  roles?: RolUsuario[]
}

export interface CrearEsquemaBody {
  nombre: string
  tipo: TipoComision
  porcentajeInmobiliaria: number
  porcentajeAsesor: number
  condiciones: string
  estado?: "activo" | "inactivo"
}

export interface EditarEsquemaBody {
  nombre?: string
  tipo?: TipoComision
  porcentajeInmobiliaria?: number
  porcentajeAsesor?: number
  condiciones?: string
  estado?: "activo" | "inactivo"
}

export interface CrearTipoDocumentoBody {
  nombre: string
  tipoPersona: TipoPersona
  tipoInmueble: TipoInmueble
  requiereCodeudor: boolean
  obligatorio: boolean
}

export interface CrearPlantillaBody {
  nombre: string
  tipo: string
  contenido: string
}

export interface GuardarPlantillaBody {
  nombre: string
  contenido: string
}

// ---------------------------------------------------------------------------
// Usuarios
// ---------------------------------------------------------------------------

/** GET /administracion/usuarios */
export function listarUsuarios(
  params?: ListarUsuariosParams,
): Promise<ApiListResponse<Usuario>> {
  return api.get("/administracion/usuarios", { params })
}

/** GET /administracion/usuarios/:id */
export function obtenerUsuario(id: string): Promise<{ data: Usuario }> {
  return api.get(`/administracion/usuarios/${id}`)
}

/** POST /administracion/usuarios */
export function crearUsuario(body: CrearUsuarioBody): Promise<{ data: Usuario }> {
  return api.post("/administracion/usuarios", body)
}

/** PATCH /administracion/usuarios/:id */
export function editarUsuario(id: string, body: EditarUsuarioBody): Promise<{ data: Usuario }> {
  return api.patch(`/administracion/usuarios/${id}`, body)
}

/** PATCH /administracion/usuarios/:id/estado */
export function cambiarEstadoUsuario(
  id: string,
  estado: EstadoUsuario,
): Promise<{ data: { id: string; estado: EstadoUsuario } }> {
  return api.patch(`/administracion/usuarios/${id}/estado`, { estado })
}

// ---------------------------------------------------------------------------
// Esquemas de comisión
// ---------------------------------------------------------------------------

/** GET /comisiones/esquemas */
export function listarEsquemas(
  params?: ListarEsquemasParams,
): Promise<ApiListResponse<EsquemaComision>> {
  return api.get("/comisiones/esquemas", { params })
}

/** GET /comisiones/esquemas/:id */
export function obtenerEsquema(id: string): Promise<{ data: EsquemaComisionDetalle }> {
  return api.get(`/comisiones/esquemas/${id}`)
}

/** POST /comisiones/esquemas */
export function crearEsquema(body: CrearEsquemaBody): Promise<{ data: EsquemaComision }> {
  return api.post("/comisiones/esquemas", body)
}

/** PATCH /comisiones/esquemas/:id */
export function editarEsquema(
  id: string,
  body: EditarEsquemaBody,
): Promise<{ data: EsquemaComision }> {
  return api.patch(`/comisiones/esquemas/${id}`, body)
}

/** DELETE /comisiones/esquemas/:id */
export function eliminarEsquema(id: string): Promise<void> {
  return api.delete(`/comisiones/esquemas/${id}`)
}

/** POST /comisiones/esquemas/:id/asesores */
export function asignarAsesor(
  esquemaId: string,
  usuarioId: string,
): Promise<{ data: { usuarioId: string; nombre: string; correo: string; fechaAsignacion: string } }> {
  return api.post(`/comisiones/esquemas/${esquemaId}/asesores`, { usuarioId })
}

/** DELETE /comisiones/esquemas/:id/asesores/:usuarioId */
export function desasignarAsesor(esquemaId: string, usuarioId: string): Promise<void> {
  return api.delete(`/comisiones/esquemas/${esquemaId}/asesores/${usuarioId}`)
}

// ---------------------------------------------------------------------------
// Parámetros
// ---------------------------------------------------------------------------

/** GET /administracion/parametros */
export function obtenerParametros(): Promise<{ data: Parametros }> {
  return api.get("/administracion/parametros")
}

/** PATCH /administracion/parametros */
export function actualizarParametros(
  body: Partial<Parametros>,
): Promise<{ data: Parametros }> {
  return api.patch("/administracion/parametros", body)
}

// ---------------------------------------------------------------------------
// Tipos de documento
// ---------------------------------------------------------------------------

/** GET /administracion/tipos-documento */
export function listarTiposDocumento(
  params?: ListarTiposDocumentoParams,
): Promise<{ data: TipoDocumentoReq[] }> {
  return api.get("/administracion/tipos-documento", { params })
}

/** POST /administracion/tipos-documento */
export function crearTipoDocumento(
  body: CrearTipoDocumentoBody,
): Promise<{ data: TipoDocumentoReq }> {
  return api.post("/administracion/tipos-documento", body)
}

/** PATCH /administracion/tipos-documento/:id */
export function editarTipoDocumento(
  id: string,
  body: Partial<CrearTipoDocumentoBody>,
): Promise<{ data: TipoDocumentoReq }> {
  return api.patch(`/administracion/tipos-documento/${id}`, body)
}

/** DELETE /administracion/tipos-documento/:id */
export function eliminarTipoDocumento(id: string): Promise<void> {
  return api.delete(`/administracion/tipos-documento/${id}`)
}

// ---------------------------------------------------------------------------
// Plantillas
// ---------------------------------------------------------------------------

/** GET /administracion/plantillas */
export function listarPlantillas(
  params?: ListarPlantillasParams,
): Promise<{ data: PlantillaResumen[] }> {
  return api.get("/administracion/plantillas", { params })
}

/** GET /administracion/plantillas/:id */
export function obtenerPlantilla(id: string): Promise<{ data: Plantilla }> {
  return api.get(`/administracion/plantillas/${id}`)
}

/** POST /administracion/plantillas */
export function crearPlantilla(body: CrearPlantillaBody): Promise<{ data: Plantilla }> {
  return api.post("/administracion/plantillas", body)
}

/** PUT /administracion/plantillas/:id */
export function guardarPlantilla(
  id: string,
  body: GuardarPlantillaBody,
): Promise<{ data: Plantilla }> {
  return api.put(`/administracion/plantillas/${id}`, body)
}

/** DELETE /administracion/plantillas/:id */
export function eliminarPlantilla(id: string): Promise<void> {
  return api.delete(`/administracion/plantillas/${id}`)
}
