"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  UserAdd01Icon,
  Location01Icon,
  Alert01Icon,
  StarIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MANTENIMIENTO_MOCK, PROVEEDORES_OPCIONES } from "@/lib/mock/mantenimiento"
import type { ProveedorOpcion } from "@/lib/mock/mantenimiento"
import type { PrioridadMantenimiento } from "@/types/mantenimiento.types"

const PRIORIDAD_CONFIG: Record<PrioridadMantenimiento, { label: string; className: string }> = {
  baja:  { label: "Baja",  className: "bg-gray-100 text-gray-500 border-gray-200" },
  media: { label: "Media", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  alta:  { label: "Alta",  className: "bg-red-100 text-red-700 border-red-200" },
}

export function AsignarProveedorClient({ solicitudId }: { solicitudId: string }) {
  const router = useRouter()
  const solicitud = MANTENIMIENTO_MOCK[solicitudId] ?? MANTENIMIENTO_MOCK["1"]

  const [proveedorId, setProveedorId]   = React.useState("")
  const [fechaVisita, setFechaVisita]   = React.useState("")
  const [notas, setNotas]               = React.useState("")
  const [errors, setErrors]             = React.useState<{ proveedor?: string; fecha?: string }>({})
  const [guardando, setGuardando]       = React.useState(false)

  const prioridadCfg = PRIORIDAD_CONFIG[solicitud.prioridad]

  function validate() {
    const e: typeof errors = {}
    if (!proveedorId) e.proveedor = "Selecciona un proveedor."
    if (!fechaVisita) e.fecha     = "Indica una fecha tentativa de visita."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setGuardando(true)
    // TODO: PATCH /mantenimiento/:id/asignar con { proveedorId, fechaVisita, notas }
    setTimeout(() => {
      setGuardando(false)
      toast.success("Proveedor asignado correctamente")
      router.push(`/mantenimiento/${solicitudId}`)
    }, 600)
  }

  const proveedorSeleccionado = PROVEEDORES_OPCIONES.find(p => p.id === proveedorId)

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <Link href={`/mantenimiento/${solicitudId}`}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Asignar proveedor</h1>
          <p className="text-sm text-muted-foreground">Solicitud #{solicitud.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 max-w-2xl mx-auto w-full space-y-6">

        {/* Resumen de la solicitud */}
        <div className="rounded-lg border bg-muted/30 px-4 py-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Solicitud #{solicitud.id}</span>
            <Badge variant="outline" className={cn("text-xs", prioridadCfg.className)}>
              Prioridad {prioridadCfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-snug">{solicitud.descripcion}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Location01Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
            {solicitud.inmuebleDireccion} · {solicitud.inmuebleUbicacion}
          </div>
        </div>

        <hr className="border-border" />

        {/* Selección de proveedor */}
        <section className="space-y-3">
          <SectionTitle>Seleccionar proveedor</SectionTitle>

          <div className="space-y-2">
            {PROVEEDORES_OPCIONES.map(p => (
              <ProveedorCard
                key={p.id}
                proveedor={p}
                selected={proveedorId === p.id}
                onSelect={() => {
                  setProveedorId(p.id)
                  setErrors(e => ({ ...e, proveedor: undefined }))
                }}
              />
            ))}
          </div>
          {errors.proveedor && <p className="text-xs text-destructive">{errors.proveedor}</p>}
        </section>

        <hr className="border-border" />

        {/* Fecha tentativa */}
        <section className="space-y-3">
          <SectionTitle>Visita programada</SectionTitle>

          <div className="space-y-1.5">
            <Label htmlFor="fecha">Fecha tentativa de visita <span className="text-destructive">*</span></Label>
            <Input
              id="fecha"
              type="date"
              value={fechaVisita}
              onChange={e => {
                setFechaVisita(e.target.value)
                setErrors(ev => ({ ...ev, fecha: undefined }))
              }}
              min={new Date().toISOString().split("T")[0]}
              className={cn("h-9 w-48", errors.fecha && "border-destructive")}
            />
            {errors.fecha && <p className="text-xs text-destructive">{errors.fecha}</p>}
          </div>
        </section>

        <hr className="border-border" />

        {/* Notas */}
        <section className="space-y-3">
          <SectionTitle>Notas adicionales</SectionTitle>

          <div className="space-y-1.5">
            <Label htmlFor="notas">Notas para el proveedor <span className="text-xs text-muted-foreground font-normal">(opcional)</span></Label>
            <Textarea
              id="notas"
              placeholder="Instrucciones de acceso, contacto del arrendatario, detalles del problema…"
              rows={3}
              value={notas}
              onChange={e => setNotas(e.target.value)}
              className="resize-none"
            />
          </div>
        </section>

        {/* Nota informativa */}
        <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Al asignar el proveedor la solicitud pasará automáticamente a estado <strong>En proceso</strong>.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2 pb-6">
          <Link href={`/mantenimiento/${solicitudId}`}>
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={guardando || !proveedorSeleccionado}>
            <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4" />
            {guardando ? "Asignando…" : "Asignar proveedor"}
          </Button>
        </div>

      </form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function ProveedorCard({
  proveedor,
  selected,
  onSelect,
}: {
  proveedor: ProveedorOpcion
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left border rounded-lg px-4 py-3 transition-all flex items-start justify-between gap-3",
        selected
          ? "border-primary ring-1 ring-primary bg-primary/5"
          : "hover:border-muted-foreground/40",
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{proveedor.nombre}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{proveedor.especialidad} · {proveedor.telefono}</p>
        {proveedor.calificacion !== null && (
          <div className="flex items-center gap-1 mt-1">
            <HugeiconsIcon icon={StarIcon} strokeWidth={2} className="size-3 text-amber-400" />
            <span className="text-xs text-muted-foreground">{proveedor.calificacion.toFixed(1)}</span>
          </div>
        )}
      </div>
      {selected && (
        <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-5 text-primary shrink-0 mt-0.5" />
      )}
    </button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  )
}
