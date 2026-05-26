export type TipoPersona = "natural" | "juridica"

export type TipoCliente =
  | "propietario"
  | "arrendatario"
  | "prospecto"
  | "codeudor"

export interface Cliente {
  id: string
  tipoPersona: TipoPersona
  /** Nombre completo (natural) o razón social (jurídica) */
  nombre: string
  /** CC / NIT / CE */
  documento: string
  tipoDocumento: "CC" | "NIT" | "CE" | "PAS"
  tipos: TipoCliente[]
  telefono: string
  email: string
  ciudad: string
  fechaRegistro: string
  /** Solo persona jurídica */
  representanteLegal?: string
  activo: boolean
}

export const TIPO_CLIENTE_CONFIG: Record<
  TipoCliente,
  { label: string; className: string }
> = {
  propietario:  { label: "Propietario",  className: "badge-blue" },
  arrendatario: { label: "Arrendatario", className: "badge-green" },
  prospecto:    { label: "Prospecto",    className: "badge-amber" },
  codeudor:     { label: "Codeudor",     className: "badge-purple" },
}
