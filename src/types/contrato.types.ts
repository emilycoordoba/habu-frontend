export type EstadoContrato =
  | "borrador"
  | "en_firmas"
  | "activo"
  | "en_escrituracion"
  | "pendiente_registro"
  | "por_vencer"
  | "vencido_con_saldos"
  | "terminacion_en_disputa"
  | "terminado_anticipadamente"
  | "finalizado"

export type TipoContrato = "arriendo" | "promesa_compraventa"

export interface Contrato {
  id: string
  referencia: string
  tipo: TipoContrato
  estado: EstadoContrato
  inmueble: string
  direccion: string
  arrendador: string
  arrendatario: string
  asesor: string
  fechaInicio: string
  fechaFin: string
  valorCanon: number
}

export const ESTADO_CONTRATO_CONFIG: Record<
  EstadoContrato,
  { label: string; className: string }
> = {
  borrador:                  { label: "Borrador",               className: "bg-gray-100 text-gray-600 border-gray-200" },
  en_firmas:                 { label: "En firmas",              className: "bg-blue-100 text-blue-700 border-blue-200" },
  activo:                    { label: "Activo",                 className: "bg-green-100 text-green-700 border-green-200" },
  en_escrituracion:          { label: "En escrituración",       className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  pendiente_registro:        { label: "Pendiente registro",     className: "bg-orange-100 text-orange-700 border-orange-200" },
  por_vencer:                { label: "Por vencer",             className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  vencido_con_saldos:        { label: "Vencido con saldos",     className: "bg-red-100 text-red-700 border-red-200" },
  terminacion_en_disputa:    { label: "Terminación en disputa", className: "bg-red-200 text-red-800 border-red-300" },
  terminado_anticipadamente: { label: "Term. anticipada",       className: "bg-gray-200 text-gray-700 border-gray-300" },
  finalizado:                { label: "Finalizado",             className: "bg-gray-100 text-gray-500 border-gray-200" },
}
