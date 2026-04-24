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
  propietario: { label: "Propietario",  className: "bg-blue-100 text-blue-700 border-blue-200" },
  arrendatario: { label: "Arrendatario", className: "bg-green-100 text-green-700 border-green-200" },
  prospecto:    { label: "Prospecto",    className: "bg-amber-100 text-amber-700 border-amber-200" },
  codeudor:     { label: "Codeudor",     className: "bg-purple-100 text-purple-700 border-purple-200" },
}
