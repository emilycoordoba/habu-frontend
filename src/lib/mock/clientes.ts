import type { Cliente, TipoCliente } from "@/types/cliente.types"
import type { TipoContrato, EstadoContrato } from "@/types/contrato.types"

// ---------------------------------------------------------------------------
// Interacciones (historial)
// ---------------------------------------------------------------------------

export type TipoInteraccion = "visita" | "nota"

export interface Interaccion {
  id: string
  tipo: TipoInteraccion
  fecha: string
  descripcion: string
  asesor: string
  inmueble?: string
}

export const INTERACCIONES_MOCK: Record<string, Interaccion[]> = {
  "1": [
    { id: "i1", tipo: "nota", fecha: "2025-02-10", descripcion: "Propietaria solicitó revisar cláusula de renovación antes del vencimiento. Prefiere renovar a largo plazo.", asesor: "Emily Perea" },
    { id: "i2", tipo: "visita", fecha: "2024-09-05", descripcion: "Visita al inmueble Cra 15 #93-47 para revisión previa a la firma del contrato.", asesor: "Emily Perea", inmueble: "Cra 15 #93-47, Apto 301 Torre A" },
  ],
  "2": [
    { id: "i1", tipo: "nota", fecha: "2025-01-15", descripcion: "Empresa solicita facturación mensual antes del día 5. Contacto de pagos: contabilidad@pedrazasas.com.", asesor: "Emily Perea" },
  ],
  "3": [
    { id: "i1", tipo: "nota", fecha: "2024-11-02", descripcion: "Llamó para confirmar disponibilidad del apto en Chapinero. Interesado en contrato desde noviembre.", asesor: "Emily Perea" },
    { id: "i2", tipo: "visita", fecha: "2024-10-18", descripcion: "Primera visita al apartamento Cra 15 #93-47. Cliente conforme con el espacio y la ubicación.", asesor: "Emily Perea", inmueble: "Cra 15 #93-47, Apto 301 Torre A" },
  ],
  "4": [
    { id: "i1", tipo: "nota", fecha: "2025-03-20", descripcion: "Propietaria también interesada en arrendar su casa en Usaquén. Solicita avalúo comercial.", asesor: "Emily Perea" },
  ],
  "6": [
    { id: "i1", tipo: "visita", fecha: "2025-02-20", descripcion: "Visita a la casa Cra 7 #120-30. Interesada en arrendar. Lleva pareja para segunda visita.", asesor: "Emily Perea", inmueble: "Cra 7 #120-30, Usaquén" },
    { id: "i2", tipo: "visita", fecha: "2025-03-05", descripcion: "Segunda visita con pareja. Solicitan tiempo para decidir.", asesor: "Emily Perea", inmueble: "Cra 7 #120-30, Usaquén" },
    { id: "i3", tipo: "nota", fecha: "2025-03-10", descripcion: "Decidieron no avanzar por ahora. Posible interés en 2-3 meses. Anotar para seguimiento.", asesor: "Emily Perea" },
  ],
  "10": [
    { id: "i1", tipo: "visita", fecha: "2025-04-05", descripcion: "Visita al apartamento Av. Suba #91-20. Cliente llega puntual, hace preguntas sobre parqueadero.", asesor: "Emily Perea", inmueble: "Av. Suba #91-20, Apto 204" },
  ],
}

// ---------------------------------------------------------------------------
// Contratos por cliente
// ---------------------------------------------------------------------------

export interface ContratoResumen {
  id: string
  referencia: string
  tipo: TipoContrato
  estado: EstadoContrato
  inmueble: string
  direccion: string
  rol: TipoCliente
}

export const CONTRATOS_POR_CLIENTE: Record<string, ContratoResumen[]> = {
  "1": [
    { id: "1", referencia: "CTR-2025-001", tipo: "arriendo", estado: "activo", inmueble: "Apto 301 Torre A", direccion: "Cra 15 #93-47, Bogotá", rol: "propietario" },
  ],
  "2": [
    { id: "2", referencia: "CTR-2025-002", tipo: "arriendo", estado: "activo", inmueble: "CC Plaza, Local 3", direccion: "Medellín — El Poblado", rol: "propietario" },
  ],
  "3": [
    { id: "1", referencia: "CTR-2025-001", tipo: "arriendo", estado: "activo", inmueble: "Apto 301 Torre A", direccion: "Cra 15 #93-47, Bogotá", rol: "arrendatario" },
  ],
  "4": [
    { id: "3", referencia: "CTR-2025-003", tipo: "promesa_compraventa", estado: "en_escrituracion", inmueble: "Apto 502", direccion: "Cll 80 #45-12, Bogotá", rol: "propietario" },
    { id: "4", referencia: "CTR-2025-004", tipo: "arriendo", estado: "por_vencer", inmueble: "Local Granada", direccion: "Cll 50 #10-15, Cali", rol: "arrendatario" },
  ],
  "7": [
    { id: "1", referencia: "CTR-2025-001", tipo: "arriendo", estado: "activo", inmueble: "Apto 301 Torre A", direccion: "Cra 15 #93-47, Bogotá", rol: "codeudor" },
  ],
  "9": [
    { id: "2", referencia: "CTR-2025-002", tipo: "arriendo", estado: "activo", inmueble: "CC Plaza, Local 3", direccion: "Medellín — El Poblado", rol: "propietario" },
    { id: "5", referencia: "CTR-2025-005", tipo: "arriendo", estado: "finalizado", inmueble: "Local 2 Granada", direccion: "Cll 50 #10-15, Cali", rol: "propietario" },
  ],
}

export const CLIENTES_MOCK: Cliente[] = [
  {
    id: "1",
    tipoPersona: "natural",
    nombre: "Ana Lucía Martínez Ruiz",
    documento: "52.789.034",
    tipoDocumento: "CC",
    tipos: ["propietario"],
    telefono: "310 456 7890",
    email: "ana.martinez@gmail.com",
    ciudad: "Bogotá",
    fechaRegistro: "2024-08-12",
    activo: true,
  },
  {
    id: "2",
    tipoPersona: "juridica",
    nombre: "Inversiones Pedraza S.A.S.",
    documento: "900.234.567-1",
    tipoDocumento: "NIT",
    tipos: ["propietario"],
    telefono: "601 745 1200",
    email: "gerencia@pedrazasas.com",
    ciudad: "Medellín",
    fechaRegistro: "2024-09-03",
    representanteLegal: "Roberto Pedraza Núñez",
    activo: true,
  },
  {
    id: "3",
    tipoPersona: "natural",
    nombre: "Carlos Eduardo Reyes Mora",
    documento: "80.123.456",
    tipoDocumento: "CC",
    tipos: ["arrendatario"],
    telefono: "315 234 9876",
    email: "carlosreyes@hotmail.com",
    ciudad: "Bogotá",
    fechaRegistro: "2024-10-15",
    activo: true,
  },
  {
    id: "4",
    tipoPersona: "natural",
    nombre: "María Fernanda Ospina Castro",
    documento: "43.210.987",
    tipoDocumento: "CC",
    tipos: ["propietario", "arrendatario"],
    telefono: "312 876 5432",
    email: "mf.ospina@outlook.com",
    ciudad: "Bogotá",
    fechaRegistro: "2024-11-20",
    activo: true,
  },
  {
    id: "5",
    tipoPersona: "natural",
    nombre: "Luis Hernando Gómez Vargas",
    documento: "71.456.789",
    tipoDocumento: "CC",
    tipos: ["propietario"],
    telefono: "317 654 3210",
    email: "luisgomez@gmail.com",
    ciudad: "Cali",
    fechaRegistro: "2025-01-08",
    activo: true,
  },
  {
    id: "6",
    tipoPersona: "natural",
    nombre: "Sofía Valentina Torres Pinto",
    documento: "1.023.456.789",
    tipoDocumento: "CC",
    tipos: ["prospecto"],
    telefono: "304 321 6547",
    email: "sofia.torres@gmail.com",
    ciudad: "Bogotá",
    fechaRegistro: "2025-02-14",
    activo: true,
  },
  {
    id: "7",
    tipoPersona: "natural",
    nombre: "Andrés Felipe Suárez Medina",
    documento: "1.098.765.432",
    tipoDocumento: "CC",
    tipos: ["arrendatario", "codeudor"],
    telefono: "321 987 6543",
    email: "asuarez@empresa.co",
    ciudad: "Bogotá",
    fechaRegistro: "2025-02-28",
    activo: true,
  },
  {
    id: "8",
    tipoPersona: "natural",
    nombre: "Patricia Inés Herrera Lozano",
    documento: "39.876.543",
    tipoDocumento: "CC",
    tipos: ["codeudor"],
    telefono: "313 456 7891",
    email: "patricia.herrera@gmail.com",
    ciudad: "Medellín",
    fechaRegistro: "2025-03-05",
    activo: true,
  },
  {
    id: "9",
    tipoPersona: "juridica",
    nombre: "Fondos Inmobiliarios Cali S.A.",
    documento: "800.987.654-2",
    tipoDocumento: "NIT",
    tipos: ["propietario"],
    telefono: "602 345 6780",
    email: "contacto@fondoscali.com",
    ciudad: "Cali",
    fechaRegistro: "2025-03-18",
    representanteLegal: "Hernando Castro Vélez",
    activo: false,
  },
  {
    id: "10",
    tipoPersona: "natural",
    nombre: "Jorge Iván Ramírez Ossa",
    documento: "98.456.123",
    tipoDocumento: "CC",
    tipos: ["prospecto"],
    telefono: "318 543 2109",
    email: "j.ramirez.ossa@gmail.com",
    ciudad: "Medellín",
    fechaRegistro: "2025-04-02",
    activo: true,
  },
]
