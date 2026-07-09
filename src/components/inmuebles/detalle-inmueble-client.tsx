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
  RefreshIcon,
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
import type { TipoInmueble, ModalidadInmueble, EstadoInmueble, InmuebleDetalle, FotoInmueble } from "@/types/inmueble.types"
import { obtenerInmueble } from "@/lib/api/inmuebles"

const MapaInmueble = dynamic(
  () => import("./mapa-inmueble").then(m => m.MapaInmueble),
  {
    ssr: false,
    loading: () => <div className="w-full h-52 rounded-lg bg-muted animate-pulse" />,
  }
)

// ---------------------------------------------------------------------------
// Config visual
// ---------------------------------------------------------------------------

const ESTADO_CONFIG: Record<EstadoInmueble, { label: string; className: string }> = {
  disponible:        { label: "Disponible",         className: "badge-green" },
  arrendado:         { label: "Arrendado",           className: "badge-blue" },
  en_proceso_venta:  { label: "En proceso de venta", className: "badge-purple" },
  vendido:           { label: "Vendido",             className: "badge-gray" },
  en_mantenimiento:  { label: "En mantenimiento",    className: "badge-amber" },
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

function DetalleInmuebleSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="border-b px-6 py-4 flex items-start gap-4">
        <div className="size-8 rounded-md bg-muted mt-0.5 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-72 rounded bg-muted" />
          <div className="h-4 w-52 rounded bg-muted" />
        </div>
        <div className="flex gap-2 shrink-0">
          <div className="h-8 w-28 rounded-md bg-muted" />
          <div className="h-8 w-20 rounded-md bg-muted" />
        </div>
      </div>
      <div className="px-6 py-3 border-b flex gap-6">
        {[80, 64, 96, 56].map(w => (
          <div key={w} className={`h-4 rounded bg-muted`} style={{ width: w }} />
        ))}
      </div>
      <div className="border-b px-6 flex">
        {["Información", "Fotos", "Historial"].map(t => (
          <div key={t} className="px-4 py-3">
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="flex-1 px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-3 w-32 rounded bg-muted" />
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-14 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface DetalleInmuebleClientProps {
  inmuebleId: string
}

export function DetalleInmuebleClient({ inmuebleId }: DetalleInmuebleClientProps) {
  const [inmueble, setInmueble]         = React.useState<InmuebleDetalle | null>(null)
  const [isLoading, setIsLoading]       = React.useState(true)
  const [error, setError]               = React.useState<string | null>(null)
  const [retryKey, setRetryKey]         = React.useState(0)
  // fotoAmpliada debe declararse antes de cualquier return condicional
  const [fotoAmpliada, setFotoAmpliada] = React.useState<FotoInmueble | null>(null)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)

    obtenerInmueble(inmuebleId)
      .then(res => {
        if (cancelado) return
        setInmueble(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        if (cancelado) return
        setError(err instanceof Error ? err.message : "Error al cargar el inmueble")
        setIsLoading(false)
      })

    return () => { cancelado = true }
  }, [inmuebleId, retryKey])

  if (isLoading) return <DetalleInmuebleSkeleton />

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-10 opacity-30" />
        <p className="text-sm font-medium">{error}</p>
        <Button variant="outline" size="sm" className="mt-1 gap-1.5" onClick={() => setRetryKey(k => k + 1)}>
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-3.5" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (!inmueble) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-10 opacity-30" />
        <p className="text-sm font-medium">Inmueble no encontrado</p>
        <Link href="/inmuebles">
          <Button variant="outline" size="sm" className="mt-1">Volver a inmuebles</Button>
        </Link>
      </div>
    )
  }

  const estadoConfig = ESTADO_CONFIG[inmueble.estado]
  const TipoIcono = TIPO_ICON[inmueble.tipo]

  return (
    <div className="flex flex-col h-full">

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
              <Badge variant="outline" className="text-xs font-medium badge-green gap-1">
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
      <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0">
        <div className="border-b px-6">
          <div className="max-w-3xl mx-auto">
          <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none justify-start">
            <TabsTrigger value="info" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">Información</TabsTrigger>
            <TabsTrigger value="fotos" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">
              Fotos
              {inmueble.fotos.length > 0 && (
                <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
                  {inmueble.fotos.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="historial" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">Historial</TabsTrigger>
          </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto">

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
                <MapaInmueble coordenadas={inmueble.coordenadas ?? null} />
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
          </div>
        </div>
      </Tabs>

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
