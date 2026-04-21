"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  PencilEdit01Icon,
  Building04Icon,
  Location01Icon,
  UserIcon,
  SquareIcon,
  Money01Icon,
  Image01Icon,
  EyeIcon,
  ViewOffIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Home01Icon,
  Store01Icon,
  ChimneyIcon,
  FileEditIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { TipoInmueble, ModalidadInmueble, EstadoInmueble } from "@/types/inmueble.types"

const MapaInmueble = dynamic(
  () => import("./mapa-inmueble").then(m => m.MapaInmueble),
  {
    ssr: false,
    loading: () => <div className="w-full h-52 rounded-lg bg-muted animate-pulse" />,
  }
)

// ---------------------------------------------------------------------------
// Mock — se reemplaza con hook useInmueble(id)
// ---------------------------------------------------------------------------

interface FotoInmueble {
  id: string
  url: string
  descripcion?: string
}

interface CambioHistorial {
  id: string
  fecha: string
  campo: string
  valorAnterior: string
  valorNuevo: string
  usuario: string
}

export interface InmuebleDetalle {
  id: string
  tipo: TipoInmueble
  modalidad: ModalidadInmueble
  estado: EstadoInmueble
  publicado: boolean
  direccion: string
  ubicacion: string
  area: number
  precio: number
  propietario: string
  propietarioId: string
  fechaRegistro: string
  coordenadas: [number, number]
  fotos: FotoInmueble[]
  historial: CambioHistorial[]
}

export const INMUEBLES_MOCK: Record<string, InmuebleDetalle> = {
  "1": {
    id: "1", tipo: "apartamento", modalidad: "arriendo", estado: "arrendado",
    publicado: true, direccion: "Cra 15 #93-47, Apto 301 Torre A",
    ubicacion: "Bogotá — Chapinero", area: 68, precio: 2800000,
    propietario: "Ana Martínez", propietarioId: "p-1",
    fechaRegistro: "2025-01-15", coordenadas: [4.6451, -74.0631],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Sala", descripcion: "Sala principal" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Cocina", descripcion: "Cocina" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+1", descripcion: "Habitación 1" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+2", descripcion: "Habitación 2" },
      { id: "f5", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño", descripcion: "Baño principal" },
      { id: "f6", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Balcón", descripcion: "Balcón" },
    ],
    historial: [
      { id: "h1", fecha: "2025-04-10", campo: "estado", valorAnterior: "disponible", valorNuevo: "arrendado", usuario: "Emily Perea" },
      { id: "h2", fecha: "2025-02-20", campo: "precio", valorAnterior: "$2.600.000", valorNuevo: "$2.800.000", usuario: "Emily Perea" },
      { id: "h3", fecha: "2025-01-15", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "2": {
    id: "2", tipo: "local", modalidad: "arriendo", estado: "arrendado",
    publicado: true, direccion: "CC Plaza, Local 3",
    ubicacion: "Medellín — El Poblado", area: 120, precio: 4800000,
    propietario: "Inversiones Pedraza S.A.S.", propietarioId: "p-2",
    fechaRegistro: "2025-01-20", coordenadas: [6.2087, -75.5636],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Interior", descripcion: "Interior" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Bodega", descripcion: "Bodega" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño", descripcion: "Baño" },
    ],
    historial: [
      { id: "h1", fecha: "2025-03-01", campo: "estado", valorAnterior: "disponible", valorNuevo: "arrendado", usuario: "Ana Rodríguez" },
      { id: "h2", fecha: "2025-01-20", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "3": {
    id: "3", tipo: "apartamento", modalidad: "venta", estado: "en_proceso_venta",
    publicado: true, direccion: "Cll 80 #45-12, Apto 502",
    ubicacion: "Bogotá — Barrios Unidos", area: 54, precio: 320000000,
    propietario: "Luis Gómez", propietarioId: "p-3",
    fechaRegistro: "2025-02-03", coordenadas: [4.6648, -74.0837],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Sala+comedor", descripcion: "Sala comedor" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Cocina", descripcion: "Cocina" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación", descripcion: "Habitación principal" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Vista", descripcion: "Vista desde el balcón" },
      { id: "f5", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Parqueadero", descripcion: "Parqueadero" },
      { id: "f6", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Zona+comunal", descripcion: "Zona comunal" },
      { id: "f7", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Terraza", descripcion: "Terraza" },
      { id: "f8", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada edificio" },
    ],
    historial: [
      { id: "h1", fecha: "2025-03-15", campo: "estado", valorAnterior: "disponible", valorNuevo: "en_proceso_venta", usuario: "Emily Perea" },
      { id: "h2", fecha: "2025-03-15", campo: "publicado", valorAnterior: "Sí", valorNuevo: "No", usuario: "Sistema" },
      { id: "h3", fecha: "2025-02-03", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "4": {
    id: "4", tipo: "casa", modalidad: "ambos", estado: "disponible",
    publicado: true, direccion: "Cra 7 #120-30",
    ubicacion: "Bogotá — Usaquén", area: 180, precio: 5200000,
    propietario: "María Ospina", propietarioId: "p-4",
    fechaRegistro: "2025-03-10", coordenadas: [4.7095, -74.0419],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Sala", descripcion: "Sala" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Comedor", descripcion: "Comedor" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Cocina", descripcion: "Cocina" },
      { id: "f5", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Patio", descripcion: "Patio" },
      { id: "f6", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Jardín", descripcion: "Jardín" },
      { id: "f7", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Garaje", descripcion: "Garaje" },
      { id: "f8", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+1", descripcion: "Habitación 1" },
      { id: "f9", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+2", descripcion: "Habitación 2" },
      { id: "f10", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño+principal", descripcion: "Baño principal" },
    ],
    historial: [
      { id: "h1", fecha: "2025-03-10", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "5": {
    id: "5", tipo: "apartamento", modalidad: "arriendo", estado: "disponible",
    publicado: false, direccion: "Av. Suba #91-20, Apto 204",
    ubicacion: "Bogotá — Suba", area: 52, precio: 1900000,
    propietario: "Carlos Reyes", propietarioId: "p-5",
    fechaRegistro: "2025-03-18", coordenadas: [4.7464, -74.0825],
    fotos: [],
    historial: [
      { id: "h1", fecha: "2025-03-18", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "6": {
    id: "6", tipo: "local", modalidad: "arriendo", estado: "en_mantenimiento",
    publicado: false, direccion: "Cll 50 #10-15, Local 2",
    ubicacion: "Cali — Granada", area: 90, precio: 3200000,
    propietario: "Fondos Cali S.A.", propietarioId: "p-6",
    fechaRegistro: "2025-04-01", coordenadas: [3.4516, -76.5319],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Interior", descripcion: "Interior" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño", descripcion: "Baño" },
    ],
    historial: [
      { id: "h1", fecha: "2025-04-05", campo: "estado", valorAnterior: "disponible", valorNuevo: "en_mantenimiento", usuario: "Emily Perea" },
      { id: "h2", fecha: "2025-04-01", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
  "7": {
    id: "7", tipo: "casa", modalidad: "venta", estado: "disponible",
    publicado: true, direccion: "Cra 45 #60-10",
    ubicacion: "Medellín — Laureles", area: 240, precio: 850000000,
    propietario: "Hernando Castro", propietarioId: "p-7",
    fechaRegistro: "2025-04-05", coordenadas: [6.2518, -75.5636],
    fotos: [
      { id: "f1", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Fachada", descripcion: "Fachada" },
      { id: "f2", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Sala", descripcion: "Sala" },
      { id: "f3", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Comedor", descripcion: "Comedor" },
      { id: "f4", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Cocina", descripcion: "Cocina" },
      { id: "f5", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Piscina", descripcion: "Piscina" },
      { id: "f6", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Jardín", descripcion: "Jardín" },
      { id: "f7", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Habitación+principal", descripcion: "Habitación principal" },
      { id: "f8", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Estudio", descripcion: "Estudio" },
      { id: "f9", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Garaje", descripcion: "Garaje doble" },
      { id: "f10", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Terraza", descripcion: "Terraza" },
      { id: "f11", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Vista+exterior", descripcion: "Vista exterior" },
      { id: "f12", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=Baño+principal", descripcion: "Baño principal" },
    ],
    historial: [
      { id: "h1", fecha: "2025-04-05", campo: "—", valorAnterior: "—", valorNuevo: "Inmueble registrado", usuario: "Emily Perea" },
    ],
  },
}

// ---------------------------------------------------------------------------
// Config visual
// ---------------------------------------------------------------------------

const ESTADO_CONFIG: Record<EstadoInmueble, { label: string; className: string }> = {
  disponible:        { label: "Disponible",         className: "bg-green-100 text-green-700 border-green-200" },
  arrendado:         { label: "Arrendado",           className: "bg-blue-100 text-blue-700 border-blue-200" },
  en_proceso_venta:  { label: "En proceso de venta", className: "bg-purple-100 text-purple-700 border-purple-200" },
  vendido:           { label: "Vendido",             className: "bg-gray-100 text-gray-500 border-gray-200" },
  en_mantenimiento:  { label: "En mantenimiento",    className: "bg-amber-100 text-amber-700 border-amber-200" },
}

const TIPO_ICON: Record<TipoInmueble, typeof Home01Icon> = {
  casa:        ChimneyIcon,
  apartamento: Building04Icon,
  local:       Store01Icon,
  otro:        Building04Icon,
}

const TIPO_LABELS: Record<TipoInmueble, string> = {
  casa:        "Casa",
  apartamento: "Apartamento",
  local:       "Local comercial",
  otro:        "Otro",
}

const MODALIDAD_LABELS: Record<ModalidadInmueble, string> = {
  arriendo: "Arriendo",
  venta:    "Venta",
  ambos:    "Arriendo y venta",
}

function formatCOP(value: number) {
  if (value >= 1_000_000_000) {
    const miles = value / 1_000_000_000
    return `$${miles % 1 === 0 ? miles : miles.toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    const millones = value / 1_000_000
    return `$${millones % 1 === 0 ? millones : millones.toFixed(1)}M`
  }
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

function formatFecha(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
      {children}
    </h3>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface DetalleInmuebleClientProps {
  inmuebleId: string
}

export function DetalleInmuebleClient({ inmuebleId }: DetalleInmuebleClientProps) {
  const inmueble = INMUEBLES_MOCK[inmuebleId] ?? INMUEBLES_MOCK["1"]
  const estadoConfig = ESTADO_CONFIG[inmueble.estado]
  const TipoIcono = TIPO_ICON[inmueble.tipo]

  const [fotoAmpliada, setFotoAmpliada] = React.useState<FotoInmueble | null>(null)

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-start gap-4">
        <Link href="/inmuebles">
          <Button variant="ghost" size="icon" className="size-8 mt-0.5">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={TipoIcono} strokeWidth={2} className="size-5 text-muted-foreground" />
              <h1 className="text-lg font-semibold">{inmueble.direccion}</h1>
            </div>
            <Badge
              variant="outline"
              className={cn("text-xs font-medium", estadoConfig.className)}
            >
              {estadoConfig.label}
            </Badge>
            {inmueble.publicado ? (
              <Badge variant="outline" className="text-xs font-medium bg-green-50 text-green-700 border-green-200 gap-1">
                <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3" />
                Publicado
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs font-medium text-muted-foreground gap-1">
                <HugeiconsIcon icon={ViewOffIcon} strokeWidth={2} className="size-3" />
                No publicado
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {inmueble.ubicacion} · {TIPO_LABELS[inmueble.tipo]} · {MODALIDAD_LABELS[inmueble.modalidad]}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {inmueble.estado === "disponible" && (
            <Link href={`/contratos/nuevo?inmuebleId=${inmueble.id}`}>
              <Button size="sm" variant="outline">
                <HugeiconsIcon icon={FileEditIcon} strokeWidth={2} className="size-4" />
                Iniciar contrato
              </Button>
            </Link>
          )}
          <Link href={`/inmuebles/${inmueble.id}/editar`}>
            <Button size="sm">
              <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary chips */}
      <div className="px-6 py-3 flex gap-4 flex-wrap border-b bg-muted/20">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <HugeiconsIcon icon={SquareIcon} strokeWidth={2} className="size-4" />
          <span className="font-medium text-foreground">{inmueble.area} m²</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <HugeiconsIcon icon={Money01Icon} strokeWidth={2} className="size-4" />
          <span className="font-medium text-foreground">{formatCOP(inmueble.precio)}</span>
          <span className="text-xs">{inmueble.modalidad === "venta" ? "precio venta" : "/ mes"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4" />
          <span className="font-medium text-foreground">{inmueble.propietario}</span>
        </div>
        <div className="ml-auto self-center text-xs text-muted-foreground">
          Registrado el <span className="font-medium text-foreground">{formatFecha(inmueble.fechaRegistro)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="info">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="fotos">
                Fotos
                {inmueble.fotos.length > 0 && (
                  <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
                    {inmueble.fotos.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>

            {/* Tab — Información */}
            <TabsContent value="info" className="flex flex-col gap-8">

              {/* Datos del inmueble */}
              <div>
                <SectionTitle>Datos del inmueble</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                  <InfoRow label="Tipo" value={TIPO_LABELS[inmueble.tipo]} />
                  <InfoRow label="Modalidad" value={MODALIDAD_LABELS[inmueble.modalidad]} />
                  <InfoRow label="Estado" value={
                    <Badge variant="outline" className={cn("text-xs font-medium", estadoConfig.className)}>
                      {estadoConfig.label}
                    </Badge>
                  } />
                  <InfoRow label="Área" value={`${inmueble.area} m²`} />
                  <InfoRow
                    label={inmueble.modalidad === "venta" ? "Precio de venta" : "Canon mensual"}
                    value={
                      <span className="font-semibold text-base">
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(inmueble.precio)}
                      </span>
                    }
                  />
                  <InfoRow label="Publicado en portal" value={
                    inmueble.publicado
                      ? <span className="text-green-700 flex items-center gap-1"><HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" /> Sí</span>
                      : <span className="text-muted-foreground flex items-center gap-1"><HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" /> No</span>
                  } />
                </div>
              </div>

              <Separator />

              {/* Ubicación */}
              <div>
                <SectionTitle>Ubicación</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                  <InfoRow label="Dirección" value={inmueble.direccion} />
                  <InfoRow label="Ciudad / Zona" value={inmueble.ubicacion} />
                </div>
                <MapaInmueble coordenadas={inmueble.coordenadas} />
              </div>

              <Separator />

              {/* Propietario */}
              <div>
                <SectionTitle>Propietario</SectionTitle>
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20 w-fit">
                  <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{inmueble.propietario}</p>
                    <p className="text-xs text-muted-foreground">Propietario</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab — Fotos */}
            <TabsContent value="fotos">
              {inmueble.fotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
                  <HugeiconsIcon icon={Image01Icon} strokeWidth={1.5} className="size-10 opacity-40" />
                  <div>
                    <p className="text-sm font-medium">Sin fotos registradas</p>
                    <p className="text-xs mt-0.5">Puedes agregarlas editando el inmueble.</p>
                  </div>
                  <Link href={`/inmuebles/${inmueble.id}/editar`}>
                    <Button size="sm" variant="outline" className="mt-2">
                      <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-4" />
                      Editar inmueble
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {inmueble.fotos.map((foto) => (
                    <button
                      key={foto.id}
                      onClick={() => setFotoAmpliada(foto)}
                      className="group relative aspect-video rounded-lg overflow-hidden border bg-muted hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={foto.url}
                        alt={foto.descripcion ?? "Foto del inmueble"}
                        className="w-full h-full object-cover"
                      />
                      {foto.descripcion && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                          {foto.descripcion}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tab — Historial */}
            <TabsContent value="historial">
              <div className="flex flex-col">
                {inmueble.historial.map((cambio, index) => (
                  <div key={cambio.id} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "size-2.5 rounded-full mt-1 shrink-0",
                        index === 0 ? "bg-primary" : "bg-muted-foreground/40"
                      )} />
                      {index < inmueble.historial.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1.5" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={cn("pb-6", index === inmueble.historial.length - 1 && "pb-0")}>
                      <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3.5" />
                        {formatFecha(cambio.fecha)} · {cambio.usuario}
                      </p>
                      {cambio.campo === "—" ? (
                        <p className="text-sm font-medium">{cambio.valorNuevo}</p>
                      ) : (
                        <p className="text-sm">
                          Campo <span className="font-medium">{cambio.campo}</span>
                          {" "} cambiado de{" "}
                          <span className="line-through text-muted-foreground">{cambio.valorAnterior}</span>
                          {" "} a{" "}
                          <span className="font-medium">{cambio.valorNuevo}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Lightbox */}
      {fotoAmpliada && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setFotoAmpliada(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoAmpliada.url}
              alt={fotoAmpliada.descripcion ?? "Foto del inmueble"}
              className="w-full rounded-lg object-contain max-h-[80vh]"
            />
            {fotoAmpliada.descripcion && (
              <p className="text-white text-sm text-center mt-2 opacity-80">{fotoAmpliada.descripcion}</p>
            )}
            <button
              onClick={() => setFotoAmpliada(null)}
              className="absolute -top-3 -right-3 size-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
