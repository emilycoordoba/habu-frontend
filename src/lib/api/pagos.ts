import { api } from "./axios"
import type { Cobro, CobroDetalle, ContratoEnMora, PagoReporte } from "@/types/pago.types"
import type { ApiListResponse } from "@/types/api.types"

// ---------------------------------------------------------------------------
// Parámetros
// ---------------------------------------------------------------------------

export interface ListarMoraParams {
  contratoId?: string
  page?: number
  limit?: number
}

export interface ListarPagosReporteParams {
  desde?: string
  hasta?: string
  clienteId?: string
  inmuebleId?: string
  tipo?: string
  page?: number
  limit?: number
}

// ---------------------------------------------------------------------------
// Funciones
// ---------------------------------------------------------------------------

/** GET /cobros/:cobroId */
export function obtenerCobro(cobroId: string): Promise<{ data: CobroDetalle }> {
  return api.get(`/cobros/${cobroId}`)
}

/** POST /cobros/:cobroId/pagos  (multipart/form-data) */
export function registrarPago(
  cobroId: string,
  fecha: string,
  comprobante: File,
  notas?: string,
): Promise<{
  data: {
    pagoId: string
    cobroId: string
    nuevoEstadoCobro: Cobro["estado"]
    comprobante: { url: string; fechaPago: string }
  }
}> {
  const form = new FormData()
  form.append("fecha", fecha)
  form.append("comprobante", comprobante)
  if (notas) form.append("notas", notas)
  return api.post(`/cobros/${cobroId}/pagos`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

/** GET /cobros/mora */
export function listarMora(params?: ListarMoraParams): Promise<
  ApiListResponse<ContratoEnMora> & {
    resumen: { totalEnMora: number; interesesAcumulados: number; contratosAfectados: number }
  }
> {
  return api.get("/cobros/mora", { params })
}

/** GET /reportes/pagos */
export function listarReportePagos(params?: ListarPagosReporteParams): Promise<
  ApiListResponse<PagoReporte> & { resumen: { totalRecibido: number } }
> {
  return api.get("/reportes/pagos", { params })
}
