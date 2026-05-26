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

export type TipoCobro =
  | "canon"
  | "comision_administracion"
  | "comision_colocacion"
  | "arras"
  | "deposito"
  | "penalizacion"
  | "precio_venta"

export interface Contrato {
  id: string
  referencia: string
  tipo: TipoContrato
  estado: EstadoContrato
  inmueble: string
  direccion: string
  /** Arrendador (arriendo) o Vendedor (promesa compraventa) */
  propietario: string
  /** Arrendatario (arriendo) o Comprador (promesa compraventa) */
  contraparte: string
  asesor: string
  fechaInicio: string
  fechaFin: string
  valorCanon: number
}

export const LABELS_POR_TIPO: Record<TipoContrato, { propietario: string; contraparte: string; canon: string }> = {
  arriendo:            { propietario: "Arrendador",  contraparte: "Arrendatario", canon: "Canon" },
  promesa_compraventa: { propietario: "Vendedor",    contraparte: "Comprador",    canon: "Precio" },
}

export const ESTADO_CONTRATO_CONFIG: Record<
  EstadoContrato,
  { label: string; className: string }
> = {
  borrador:                  { label: "Borrador",               className: "badge-gray" },
  en_firmas:                 { label: "En firmas",              className: "badge-blue" },
  activo:                    { label: "Activo",                 className: "badge-green" },
  en_escrituracion:          { label: "En escrituración",       className: "badge-indigo" },
  pendiente_registro:        { label: "Pendiente registro",     className: "badge-orange" },
  por_vencer:                { label: "Por vencer",             className: "badge-yellow" },
  vencido_con_saldos:        { label: "Vencido con saldos",     className: "badge-red" },
  terminacion_en_disputa:    { label: "Terminación en disputa", className: "badge-red" },
  terminado_anticipadamente: { label: "Term. anticipada",       className: "badge-gray" },
  finalizado:                { label: "Finalizado",             className: "badge-gray" },
}
