"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Location01Icon,
  UserIcon,
  Clock01Icon,
  Wrench01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Alert01Icon,
  Image01Icon,
  Calendar01Icon,
  PencilEdit01Icon,
  UserAdd01Icon,
  DollarCircleIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { MANTENIMIENTO_MOCK } from "@/lib/mock/mantenimiento"
import type { PrioridadMantenimiento, EstadoMantenimiento } from "@/types/mantenimiento.types"

// ---------------------------------------------------------------------------
// Config visual (igual que UI-M01 para consistencia)
// ---------------------------------------------------------------------------

const ESTADO_CONFIG: Record<EstadoMantenimiento, { label: string; className: string; icon: IconSvgElement }> = {
  pendiente:  { label: "Pendiente",  className: "bg-amber-100 text-amber-700 border-amber-200",  icon: Clock01Icon },
  en_proceso: { label: "En proceso", className: "bg-blue-100 text-blue-700 border-blue-200",     icon: Wrench01Icon },
  finalizado: { label: "Finalizado", className: "bg-green-100 text-green-700 border-green-200",  icon: CheckmarkCircle01Icon },
  cancelado:  { label: "Cancelado",  className: "bg-gray-100 text-gray-500 border-gray-200",     icon: Cancel01Icon },
}

const PRIORIDAD_CONFIG: Record<PrioridadMantenimiento, { label: string; className: string }> = {
  baja:  { label: "Baja",  className: "bg-gray-100 text-gray-500 border-gray-200" },
  media: { label: "Media", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  alta:  { label: "Alta",  className: "bg-red-100 text-red-700 border-red-200" },
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function DetalleMantenimientoClient({ solicitudId }: { solicitudId: string }) {
  const solicitud = MANTENIMIENTO_MOCK[solicitudId] ?? MANTENIMIENTO_MOCK["1"]
  const estadoCfg   = ESTADO_CONFIG[solicitud.estado]
  const prioridadCfg = PRIORIDAD_CONFIG[solicitud.prioridad]
  const [fotoAmpliada, setFotoAmpliada] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-start gap-3">
        <Link href="/mantenimiento">
          <Button variant="ghost" size="icon" className="size-8 mt-0.5 shrink-0">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg font-semibold">Solicitud #{solicitud.id}</h1>
            <Badge variant="outline" className={cn("text-xs gap-1", estadoCfg.className)}>
              <HugeiconsIcon icon={estadoCfg.icon} strokeWidth={2} className="size-3" />
              {estadoCfg.label}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", prioridadCfg.className)}>
              Prioridad {prioridadCfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{solicitud.descripcion}</p>
        </div>

        {/* Botones de acción según estado */}
        <div className="flex items-center gap-2 shrink-0">
          {solicitud.estado === "pendiente" && (
            <Link href={`/mantenimiento/${solicitud.id}/asignar`}>
              <Button size="sm">
                <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4" />
                Asignar proveedor
              </Button>
            </Link>
          )}
          {solicitud.estado === "en_proceso" && (
            <Link href={`/mantenimiento/${solicitud.id}/actualizar`}>
              <Button size="sm">
                <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-4" />
                Actualizar estado
              </Button>
            </Link>
          )}
          {solicitud.estado === "finalizado" && !solicitud.costo && (
            <Link href={`/mantenimiento/${solicitud.id}/costo`}>
              <Button size="sm" variant="outline">
                <HugeiconsIcon icon={DollarCircleIcon} strokeWidth={2} className="size-4" />
                Registrar costo
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-6 flex justify-center">
          <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none justify-start">
            <TabsTrigger value="info" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">
              Información
            </TabsTrigger>
            <TabsTrigger value="evidencias" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">
              Evidencias {solicitud.evidencias.length > 0 && <span className="ml-1.5 text-xs opacity-60">({solicitud.evidencias.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="historial" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">
              Historial
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Información */}
        <TabsContent value="info" className="flex-1 overflow-y-auto mt-0">
          <div className="px-6 py-6 max-w-3xl mx-auto w-full space-y-6">

            {/* Descripción */}
            <section>
              <SectionTitle>Descripción del problema</SectionTitle>
              <p className="text-sm leading-relaxed text-foreground">{solicitud.descripcion}</p>
            </section>

            <Separator />

            {/* Inmueble */}
            <section>
              <SectionTitle>Inmueble</SectionTitle>
              <div className="space-y-2">
                <InfoRow
                  icon={Location01Icon}
                  label="Dirección"
                  value={solicitud.inmuebleDireccion}
                />
                <InfoRow
                  icon={Location01Icon}
                  label="Ubicación"
                  value={solicitud.inmuebleUbicacion}
                />
              </div>
            </section>

            <Separator />

            {/* Proveedor */}
            <section>
              <SectionTitle>Proveedor asignado</SectionTitle>
              {solicitud.proveedorNombre ? (
                <div className="space-y-2">
                  <InfoRow icon={UserIcon} label="Proveedor"    value={solicitud.proveedorNombre} />
                  {solicitud.proveedorEspecialidad && (
                    <InfoRow icon={Wrench01Icon} label="Especialidad" value={solicitud.proveedorEspecialidad} />
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Alert01Icon} strokeWidth={1.5} className="size-4 text-amber-500" />
                  Sin proveedor asignado aún
                </div>
              )}
            </section>

            <Separator />

            {/* Costo */}
            {solicitud.estado === "finalizado" && (
              <>
                <section>
                  <SectionTitle>Costo del mantenimiento</SectionTitle>
                  {solicitud.costo ? (
                    <p className="text-2xl font-semibold tabular-nums">
                      {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(solicitud.costo)}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HugeiconsIcon icon={Alert01Icon} strokeWidth={1.5} className="size-4 text-amber-500" />
                      Costo no registrado aún
                    </div>
                  )}
                </section>
                <Separator />
              </>
            )}

            {/* Registro */}
            <section>
              <SectionTitle>Registro</SectionTitle>
              <div className="space-y-2">
                <InfoRow icon={Calendar01Icon} label="Fecha de registro" value={formatFecha(solicitud.fechaRegistro)} />
                <InfoRow icon={UserIcon}       label="Registrado por"    value={solicitud.registradoPor} />
              </div>
            </section>

          </div>
        </TabsContent>

        {/* Tab: Evidencias */}
        <TabsContent value="evidencias" className="flex-1 overflow-y-auto mt-0">
          <div className="px-6 py-6 max-w-3xl mx-auto w-full">
            {solicitud.evidencias.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <HugeiconsIcon icon={Image01Icon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No se adjuntaron evidencias a esta solicitud.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {solicitud.evidencias.map(ev => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setFotoAmpliada(ev.url)}
                    className="group rounded-lg overflow-hidden border bg-muted aspect-video relative"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ev.url} alt={ev.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                      <p className="text-xs text-white truncate">{ev.nombre}</p>
                      <p className="text-xs text-white/70">{formatFecha(ev.fechaCarga)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="historial" className="flex-1 overflow-y-auto mt-0">
          <div className="px-6 py-6 max-w-3xl mx-auto w-full">
            <ol className="relative border-l border-border space-y-6 ml-3">
              {[...solicitud.historial].reverse().map((h, i) => {
                const cfg = ESTADO_CONFIG[h.estado]
                return (
                  <li key={h.id} className="ml-6">
                    <span className={cn(
                      "absolute -left-2 flex size-4 items-center justify-center rounded-full border",
                      i === 0 ? cn(cfg.className) : "bg-muted border-border",
                    )}>
                      <HugeiconsIcon icon={cfg.icon} strokeWidth={2} className="size-2.5" />
                    </span>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant="outline" className={cn("text-xs", cfg.className)}>
                        {cfg.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatFecha(h.fecha)}</span>
                    </div>
                    {h.nota && <p className="text-sm text-muted-foreground">{h.nota}</p>}
                    <p className="text-xs text-muted-foreground mt-0.5">por {h.usuario}</p>
                  </li>
                )
              })}
            </ol>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lightbox */}
      {fotoAmpliada && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setFotoAmpliada(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoAmpliada}
            alt="Evidencia ampliada"
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes y helpers
// ---------------------------------------------------------------------------

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
      {children}
    </h3>
  )
}

function InfoRow({ icon, label, value }: { icon: IconSvgElement; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function formatFecha(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit", month: "long", year: "numeric",
  })
}
