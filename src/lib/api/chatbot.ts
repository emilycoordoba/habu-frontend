import { api } from "./axios"
import type {
  SolicitudChatbot,
  MensajeChatHistorial,
  EstadoSolicitud,
  TipoSolicitud,
} from "@/types/chatbot.types"
import type { ApiListResponse } from "@/types/api.types"

// ---------------------------------------------------------------------------
// Parámetros
// ---------------------------------------------------------------------------

export interface EnviarSolicitudBody {
  tipo: TipoSolicitud
  nombre: string
  telefono: string
  correo?: string
  inmuebleInteres?: string
  mensaje?: string
  fechaVisita?: string
  horaVisita?: string
  historial: MensajeChatHistorial[]
}

export interface ListarSolicitudesParams {
  busqueda?: string
  estado?: EstadoSolicitud
  tipo?: TipoSolicitud
  conAsesor?: boolean
  page?: number
  limit?: number
}

export interface ListarSolicitudesResponse extends ApiListResponse<SolicitudChatbot> {
  resumenEstados: { nueva: number; en_gestion: number; atendida: number }
}

// ---------------------------------------------------------------------------
// Funciones
// ---------------------------------------------------------------------------

/** POST /chatbot/solicitudes — endpoint público, sin auth obligatoria */
export function enviarSolicitudChatbot(
  body: EnviarSolicitudBody,
): Promise<{ data: { id: string; estado: "nueva" } }> {
  return api.post("/chatbot/solicitudes", body)
}

/** GET /chatbot/solicitudes */
export function listarSolicitudesChatbot(
  params?: ListarSolicitudesParams,
): Promise<ListarSolicitudesResponse> {
  return api.get("/chatbot/solicitudes", { params })
}

/** GET /chatbot/solicitudes/:id */
export function obtenerSolicitudChatbot(id: string): Promise<{ data: SolicitudChatbot }> {
  return api.get(`/chatbot/solicitudes/${id}`)
}

/** PATCH /chatbot/solicitudes/:id/asesor */
export function asignarAsesorChatbot(
  id: string,
  asesorAsignado: string,
): Promise<{ data: { id: string; estado: EstadoSolicitud; asesorAsignado: string } }> {
  return api.patch(`/chatbot/solicitudes/${id}/asesor`, { asesorAsignado })
}

/** PATCH /chatbot/solicitudes/:id/atender */
export function marcarAtendidaChatbot(
  id: string,
): Promise<{ data: { id: string; estado: "atendida" } }> {
  return api.patch(`/chatbot/solicitudes/${id}/atender`, {})
}
