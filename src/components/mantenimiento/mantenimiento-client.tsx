"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  LicenseMaintenanceIcon,
  Add01Icon,
  Search01Icon,
  FilterIcon,
  Clock01Icon,
  Wrench01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Alert01Icon,
  Location01Icon,
  RepairIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { MANTENIMIENTO_LIST } from "@/lib/mock/mantenimiento"
import type { PrioridadMantenimiento, EstadoMantenimiento } from "@/types/mantenimiento.types"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ESTADO_CONFIG: Record<EstadoMantenimiento, {
  label: string
  className: string
  icon: IconSvgElement
}> = {
  pendiente:   { label: "Pendiente",   className: "badge-amber",  icon: Clock01Icon },
  en_proceso:  { label: "En proceso",  className: "badge-blue",   icon: Wrench01Icon },
  finalizado:  { label: "Finalizado",  className: "badge-green",  icon: CheckmarkCircle01Icon },
  cancelado:   { label: "Cancelado",   className: "badge-gray",   icon: Cancel01Icon },
}

const PRIORIDAD_CONFIG: Record<PrioridadMantenimiento, { label: string; className: string }> = {
  baja:  { label: "Baja",  className: "badge-gray" },
  media: { label: "Media", className: "badge-yellow" },
  alta:  { label: "Alta",  className: "badge-red" },
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function MantenimientoClient() {
  const [busqueda,  setBusqueda]  = React.useState("")
  const [estado,    setEstado]    = React.useState<EstadoMantenimiento | "todos">("todos")
  const [prioridad, setPrioridad] = React.useState<PrioridadMantenimiento | "todos">("todos")

  const solicitudes = MANTENIMIENTO_LIST

  const filtradas = solicitudes.filter(s => {
    if (estado    !== "todos" && s.estado    !== estado)    return false
    if (prioridad !== "todos" && s.prioridad !== prioridad) return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (
        !s.inmuebleDireccion.toLowerCase().includes(q) &&
        !s.inmuebleUbicacion.toLowerCase().includes(q) &&
        !s.descripcion.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  const totalPendientes  = solicitudes.filter(s => s.estado === "pendiente").length
  const totalEnProceso   = solicitudes.filter(s => s.estado === "en_proceso").length
  const totalFinalizadas = solicitudes.filter(s => s.estado === "finalizado").length
  const totalCanceladas  = solicitudes.filter(s => s.estado === "cancelado").length

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Mantenimiento</h1>
          <p className="text-sm text-muted-foreground">
            {solicitudes.length} solicitudes registradas
          </p>
        </div>
        <Link href="/mantenimiento/proveedores">
          <Button size="sm" variant="outline" className="gap-1.5">
            <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4" />
            Proveedores
          </Button>
        </Link>
        <Link href="/mantenimiento/nueva">
          <Button size="sm" className="gap-1.5">
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
            Nueva solicitud
          </Button>
        </Link>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-6xl mx-auto w-full">

        {/* Cards de resumen */}
        <div className="grid grid-cols-4 gap-4">
          <SummaryCard label="Pendientes"  value={totalPendientes}  className="alert-amber"  valueClassName="text-amber-700  dark:text-amber-300" />
          <SummaryCard label="En proceso"  value={totalEnProceso}   className="alert-blue"   valueClassName="text-blue-700   dark:text-blue-300" />
          <SummaryCard label="Finalizadas" value={totalFinalizadas} className="alert-green"  valueClassName="text-green-700  dark:text-green-300" />
          <SummaryCard label="Canceladas"  value={totalCanceladas}  className="alert-gray"   valueClassName="text-gray-500   dark:text-gray-400" />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por inmueble o descripción…"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.5} className="size-4 text-muted-foreground" />

            <Select value={estado} onValueChange={v => setEstado(v as EstadoMantenimiento | "todos")}>
              <SelectTrigger className="h-9 w-[160px] text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_proceso">En proceso</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={prioridad} onValueChange={v => setPrioridad(v as PrioridadMantenimiento | "todos")}>
              <SelectTrigger className="h-9 w-[150px] text-sm">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla */}
        {filtradas.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <HugeiconsIcon icon={RepairIcon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay solicitudes que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Solicitud</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inmueble</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Prioridad</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Proveedor</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtradas.map(s => {
                  const estadoCfg   = ESTADO_CONFIG[s.estado]
                  const prioridadCfg = PRIORIDAD_CONFIG[s.prioridad]
                  const esAlta = s.prioridad === "alta" && s.estado === "pendiente"

                  return (
                    <tr key={s.id} className={cn("hover:bg-muted/30 transition-colors", esAlta && "bg-red-50/40")}>

                      {/* Solicitud */}
                      <td className="px-4 py-3 max-w-[260px]">
                        <div className="flex items-start gap-2">
                          {esAlta && (
                            <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} className="size-4 shrink-0 text-red-500 mt-0.5" />
                          )}
                          <p className="text-sm line-clamp-2 leading-snug">{s.descripcion}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Registrado por {s.registradoPor} · {formatFecha(s.fechaRegistro)}
                        </p>
                      </td>

                      {/* Inmueble */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <HugeiconsIcon icon={Location01Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                          <span className="truncate max-w-[160px] text-foreground">{s.inmuebleDireccion}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 pl-5">{s.inmuebleUbicacion}</p>
                      </td>

                      {/* Prioridad */}
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={cn("text-xs", prioridadCfg.className)}>
                          {prioridadCfg.label}
                        </Badge>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={cn("text-xs gap-1", estadoCfg.className)}>
                          <HugeiconsIcon icon={estadoCfg.icon} strokeWidth={2} className="size-3" />
                          {estadoCfg.label}
                        </Badge>
                      </td>

                      {/* Proveedor */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {s.proveedorNombre ?? (
                          <span className="italic text-muted-foreground/60">Sin asignar</span>
                        )}
                      </td>

                      {/* Fecha */}
                      <td className="px-4 py-3 text-right text-muted-foreground tabular-nums text-xs">
                        {formatFecha(s.fechaRegistro)}
                      </td>

                      {/* Acción */}
                      <td className="px-4 py-3 text-right">
                        <Link href={`/mantenimiento/${s.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            Ver detalle
                          </Button>
                        </Link>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-right">
          {filtradas.length} de {solicitudes.length} solicitudes
        </p>

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes y helpers
// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string
  value: number
  className?: string
  valueClassName?: string
}) {
  return (
    <div className={cn("border rounded-lg px-4 py-4", className)}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-2xl font-semibold tabular-nums", valueClassName)}>{value}</p>
    </div>
  )
}

function formatFecha(fecha: string) {
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
