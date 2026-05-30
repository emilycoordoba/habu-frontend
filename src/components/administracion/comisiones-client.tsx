"use client"

import * as React from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  Cancel01Icon,
  UserIcon,
  PercentCircleIcon,
  InformationCircleIcon,
  UserAdd01Icon,
  Building04Icon,
  FileManagementIcon,
  Home01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  listarEsquemas,
  obtenerEsquema,
  crearEsquema,
  editarEsquema,
  eliminarEsquema,
  asignarAsesor,
  desasignarAsesor,
  listarUsuarios,
} from "@/lib/api/administracion"
import type {
  EsquemaComision,
  EsquemaComisionDetalle,
  AsesorAsignado,
  TipoComision,
  Usuario,
} from "@/types/administracion.types"

// ---------------------------------------------------------------------------
// Config por tipo
// ---------------------------------------------------------------------------

const TIPO_CONFIG: Record<TipoComision, {
  label: string
  descripcionBase: string
  icon: typeof Building04Icon
  className: string
}> = {
  administracion: {
    label: "Administración",
    descripcionBase: "% mensual sobre el canon de arriendo",
    icon: Building04Icon,
    className: "badge-blue",
  },
  colocacion: {
    label: "Colocación",
    descripcionBase: "% del primer canon al activar el contrato (pago único)",
    icon: FileManagementIcon,
    className: "badge-violet",
  },
  venta: {
    label: "Venta",
    descripcionBase: "% sobre el precio total de escrituración",
    icon: Home01Icon,
    className: "badge-amber",
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFecha(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function PctInput({
  id, value, onChange, label, descripcion,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  label: string
  descripcion: string
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          min={0.01}
          max={100}
          step={0.01}
          placeholder="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="pr-8"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
      </div>
      <p className="text-xs text-muted-foreground">{descripcion}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dialog crear/editar
// ---------------------------------------------------------------------------

interface EsquemaDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  esquema: EsquemaComision | null
  onGuardar: (data: Omit<EsquemaComision, "id">) => Promise<void>
  isSubmitting?: boolean
}

function EsquemaDialog({ open, onOpenChange, esquema, onGuardar, isSubmitting }: EsquemaDialogProps) {
  const [nombre, setNombre] = React.useState("")
  const [tipo, setTipo] = React.useState<TipoComision>("administracion")
  const [pctInmobiliaria, setPctInmobiliaria] = React.useState("")
  const [pctAsesor, setPctAsesor] = React.useState("")
  const [condiciones, setCondiciones] = React.useState("")
  const [activo, setActivo] = React.useState(true)

  React.useEffect(() => {
    if (open) {
      setNombre(esquema?.nombre ?? "")
      setTipo(esquema?.tipo ?? "administracion")
      setPctInmobiliaria(esquema ? String(esquema.porcentajeInmobiliaria) : "")
      setPctAsesor(esquema ? String(esquema.porcentajeAsesor) : "")
      setCondiciones(esquema?.condiciones ?? "")
      setActivo(esquema ? esquema.estado === "activo" : true)
    }
  }, [open, esquema])

  const pI = parseFloat(pctInmobiliaria)
  const pA = parseFloat(pctAsesor)
  const puedeGuardar =
    nombre.trim().length > 0 &&
    !isNaN(pI) && pI > 0 && pI <= 100 &&
    !isNaN(pA) && pA > 0 && pA <= 100

  const ejemploBase = tipo === "venta" ? 200_000_000 : 1_000_000
  const ejemploLabel = tipo === "venta" ? "$200.000.000 (precio venta)" : "$1.000.000 (canon mensual)"
  const cobro = !isNaN(pI) ? Math.round(ejemploBase * pI / 100) : null
  const asesorGana = cobro !== null && !isNaN(pA) ? Math.round(cobro * pA / 100) : null
  const fmt = (n: number) => n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })

  function handleGuardar() {
    if (!puedeGuardar) return
    onGuardar({
      nombre: nombre.trim(),
      tipo,
      porcentajeInmobiliaria: pI,
      porcentajeAsesor: pA,
      condiciones: condiciones.trim(),
      estado: activo ? "activo" : "inactivo",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{esquema ? "Editar esquema" : "Nuevo esquema de comisión"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="ec-nombre">Nombre</Label>
            <Input
              id="ec-nombre"
              placeholder="Ej. Administración estándar"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Tipo de comisión</Label>
            <Select value={tipo} onValueChange={v => setTipo(v as TipoComision)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="administracion">Administración — mensual sobre el canon</SelectItem>
                <SelectItem value="colocacion">Colocación — pago único al activar arriendo</SelectItem>
                <SelectItem value="venta">Venta — sobre el precio de escrituración</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{TIPO_CONFIG[tipo].descripcionBase}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PctInput
              id="ec-pct-inm"
              value={pctInmobiliaria}
              onChange={setPctInmobiliaria}
              label="Cobro al cliente"
              descripcion="Lo que la inmobiliaria le cobra al propietario"
            />
            <PctInput
              id="ec-pct-asesor"
              value={pctAsesor}
              onChange={setPctAsesor}
              label="Participación del asesor"
              descripcion="Del cobro al cliente, qué % recibe el asesor"
            />
          </div>

          {cobro !== null && asesorGana !== null && (
            <div className="rounded-lg bg-muted/40 border px-4 py-3 text-xs space-y-1.5">
              <p className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
                Ejemplo con {ejemploLabel}
              </p>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cobro al propietario ({pI}%)</span>
                <span className="font-medium">{fmt(cobro)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Al asesor ({pA}% del cobro)</span>
                <span className="font-medium text-primary">{fmt(asesorGana)}</span>
              </div>
              <div className="flex justify-between border-t pt-1.5">
                <span className="text-muted-foreground">Neto inmobiliaria</span>
                <span className="font-medium">{fmt(cobro - asesorGana)}</span>
              </div>
            </div>
          )}

          <div className="grid gap-1.5">
            <Label htmlFor="ec-cond">Condiciones</Label>
            <Textarea
              id="ec-cond"
              placeholder="Describe cuándo y cómo aplica este esquema…"
              value={condiciones}
              onChange={e => setCondiciones(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {esquema && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Estado</p>
                <p className="text-xs text-muted-foreground">
                  {activo ? "Disponible para asignar a asesores" : "No aparece en nuevas asignaciones"}
                </p>
              </div>
              <Switch checked={activo} onCheckedChange={setActivo} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleGuardar} disabled={!puedeGuardar || isSubmitting}>
            {isSubmitting ? "Guardando…" : esquema ? "Guardar cambios" : "Crear esquema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Panel derecho: asesores asignados
// ---------------------------------------------------------------------------

interface PanelAsesoresProps {
  esquema: EsquemaComision
  asesoresAsignados: AsesorAsignado[]
  todosAsesores: Usuario[]
  onAsignar: (usuarioId: string) => Promise<void>
  onDesasignar: (usuarioId: string) => Promise<void>
}

function PanelAsesores({ esquema, asesoresAsignados, todosAsesores, onAsignar, onDesasignar }: PanelAsesoresProps) {
  const cfg = TIPO_CONFIG[esquema.tipo]
  const asignadosIds = asesoresAsignados.map(a => a.usuarioId)
  const disponibles = todosAsesores.filter(a => !asignadosIds.includes(a.id))

  const fmt = (n: number) => n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
  const ejemploBase = esquema.tipo === "venta" ? 200_000_000 : 1_000_000
  const cobro = Math.round(ejemploBase * esquema.porcentajeInmobiliaria / 100)
  const asesorGana = Math.round(cobro * esquema.porcentajeAsesor / 100)

  return (
    <div className="flex flex-col h-full">
      {/* Cabecera con resumen del esquema */}
      <div className="px-5 py-4 border-b space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{esquema.nombre}</p>
            <Badge variant="outline" className={cn("text-xs font-medium mt-1", cfg.className)}>
              <HugeiconsIcon icon={cfg.icon} strokeWidth={2} className="size-3 mr-1" />
              {cfg.label}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium shrink-0",
              esquema.estado === "activo" ? "badge-green" : "badge-gray"
            )}
          >
            {esquema.estado === "activo" ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted/40 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Al cliente</p>
            <p className="text-lg font-bold text-foreground leading-tight">{esquema.porcentajeInmobiliaria}%</p>
            <p className="text-xs text-muted-foreground">{fmt(cobro)}</p>
          </div>
          <div className="rounded-md bg-primary/5 border border-primary/20 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-primary/70 font-semibold">Al asesor</p>
            <p className="text-lg font-bold text-primary leading-tight">{esquema.porcentajeAsesor}%</p>
            <p className="text-xs text-primary/70">{fmt(asesorGana)}</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/60">
          Ejemplo con {esquema.tipo === "venta" ? "$200M precio de venta" : "$1M de canon mensual"}
        </p>

        {esquema.condiciones && (
          <p className="text-xs text-muted-foreground leading-relaxed">{esquema.condiciones}</p>
        )}
      </div>

      {/* Asesores */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Asesores con este esquema ({asesoresAsignados.length})
          </p>
          {asesoresAsignados.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Ningún asesor asignado aún.</p>
          ) : (
            <div className="space-y-1">
              {asesoresAsignados.map(asesor => (
                <div
                  key={asesor.usuarioId}
                  className="flex items-center gap-3 rounded-md border px-3 py-2 bg-background"
                >
                  <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{asesor.nombre}</p>
                    <p className="text-xs text-muted-foreground">Desde {formatFecha(asesor.fechaAsignacion)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-red-600 shrink-0"
                    onClick={() => onDesasignar(asesor.usuarioId)}
                    title="Quitar asignación"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {disponibles.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Asignar asesor
            </p>
            <div className="space-y-1">
              {disponibles.map(asesor => (
                <div
                  key={asesor.id}
                  className="flex items-center gap-3 rounded-md border border-dashed px-3 py-2"
                >
                  <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                  </div>
                  <p className="flex-1 text-sm text-muted-foreground truncate">{asesor.nombre}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 shrink-0"
                    onClick={() => onAsignar(asesor.id)}
                  >
                    <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-3.5" />
                    Asignar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function ComisionesClient() {
  const [esquemas, setEsquemas] = React.useState<EsquemaComision[]>([])
  const [todosAsesores, setTodosAsesores] = React.useState<Usuario[]>([])
  const [seleccionado, setSeleccionado] = React.useState<EsquemaComisionDetalle | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoadingDetalle, setIsLoadingDetalle] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editando, setEditando] = React.useState<EsquemaComision | null>(null)
  const [confirmEliminar, setConfirmEliminar] = React.useState<EsquemaComision | null>(null)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)
    Promise.all([
      listarEsquemas({ limit: 100 }),
      listarUsuarios({ rol: "asesor", estado: "activo", limit: 100 }),
    ])
      .then(([esquemaRes, asesorRes]) => {
        if (cancelado) return
        setEsquemas(esquemaRes.data ?? [])
        setTodosAsesores(asesorRes.data ?? [])
      })
      .catch(() => { if (!cancelado) setError("No se pudo cargar la información.") })
      .finally(() => { if (!cancelado) setIsLoading(false) })
    return () => { cancelado = true }
  }, [retryKey])

  async function seleccionarEsquema(esquema: EsquemaComision) {
    setIsLoadingDetalle(true)
    try {
      const res = await obtenerEsquema(esquema.id)
      setSeleccionado(res.data)
    } catch {
      toast.error("No se pudo cargar el detalle del esquema.")
    } finally {
      setIsLoadingDetalle(false)
    }
  }

  function handleNuevo() { setEditando(null); setDialogOpen(true) }
  function handleEditar(e: EsquemaComision) { setEditando(e); setDialogOpen(true) }

  async function handleGuardar(data: Omit<EsquemaComision, "id">) {
    setIsSubmitting(true)
    try {
      if (editando) {
        await editarEsquema(editando.id, data)
        toast.success("Esquema actualizado")
      } else {
        await crearEsquema(data)
        toast.success("Esquema creado")
      }
      setDialogOpen(false)
      setRetryKey(k => k + 1)
      if (seleccionado && editando?.id === seleccionado.id) {
        const res = await obtenerEsquema(editando.id)
        setSeleccionado(res.data)
      }
    } catch {
      toast.error(editando ? "No se pudo actualizar el esquema." : "No se pudo crear el esquema.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function confirmarEliminar() {
    if (!confirmEliminar) return
    try {
      await eliminarEsquema(confirmEliminar.id)
      toast.success("Esquema eliminado")
      if (seleccionado?.id === confirmEliminar.id) setSeleccionado(null)
      setConfirmEliminar(null)
      setRetryKey(k => k + 1)
    } catch {
      toast.error("No se pudo eliminar el esquema. Puede estar referenciado en contratos activos.")
      setConfirmEliminar(null)
    }
  }

  async function handleAsignar(usuarioId: string) {
    if (!seleccionado) return
    try {
      await asignarAsesor(seleccionado.id, usuarioId)
      const res = await obtenerEsquema(seleccionado.id)
      setSeleccionado(res.data)
    } catch {
      toast.error("No se pudo asignar el asesor.")
    }
  }

  async function handleDesasignar(usuarioId: string) {
    if (!seleccionado) return
    try {
      await desasignarAsesor(seleccionado.id, usuarioId)
      const res = await obtenerEsquema(seleccionado.id)
      setSeleccionado(res.data)
    } catch {
      toast.error("No se pudo desasignar el asesor.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full overflow-hidden animate-pulse">
        <div className="w-[420px] border-r bg-muted/10" />
        <div className="flex-1 bg-muted/5" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={() => setRetryKey(k => k + 1)} className="gap-2">
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const activos = esquemas.filter(e => e.estado === "activo").length

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Lista de esquemas ── */}
      <div className="flex flex-col w-[420px] shrink-0 border-r h-full">
        <div className="px-5 py-3.5 flex items-center justify-between border-b shrink-0">
          <div>
            <p className="text-sm font-semibold">Esquemas de comisión</p>
            <p className="text-xs text-muted-foreground">
              {activos} activo{activos !== 1 ? "s" : ""} · {esquemas.length} total
            </p>
          </div>
          <Button size="sm" onClick={handleNuevo}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
            Nuevo
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {esquemas.map(esquema => {
            const cfg = TIPO_CONFIG[esquema.tipo]
            const isSelected = seleccionado?.id === esquema.id

            return (
              <button
                key={esquema.id}
                onClick={() => seleccionarEsquema(esquema)}
                className={cn(
                  "w-full text-left px-5 py-3 flex gap-3 hover:bg-muted/40 transition-colors",
                  isSelected && "bg-muted/60 border-l-2 border-primary"
                )}
              >
                <div className={cn(
                  "size-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  isSelected ? "bg-primary/15" : "bg-muted"
                )}>
                  <HugeiconsIcon
                    icon={PercentCircleIcon}
                    strokeWidth={2}
                    className={cn("size-4", isSelected ? "text-primary" : "text-muted-foreground")}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium truncate">{esquema.nombre}</span>
                    <Badge variant="outline" className={cn("text-[10px] font-medium shrink-0 px-1.5", cfg.className)}>
                      {cfg.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      Cliente: {esquema.porcentajeInmobiliaria}%
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-xs text-primary/80">
                      Asesor: {esquema.porcentajeAsesor}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {esquema.estado === "inactivo" && "Inactivo"}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-0.5 shrink-0 self-center transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                  onClick={e => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="size-7"
                    onClick={() => handleEditar(esquema)} title="Editar">
                    <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 hover:text-red-600"
                    onClick={() => setConfirmEliminar(esquema)} title="Eliminar">
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
                  </Button>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <div className="flex-1 h-full overflow-hidden">
        {isLoadingDetalle ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground animate-pulse">
            Cargando detalle…
          </div>
        ) : seleccionado ? (
          <PanelAsesores
            esquema={seleccionado}
            asesoresAsignados={seleccionado.asesores}
            todosAsesores={todosAsesores}
            onAsignar={handleAsignar}
            onDesasignar={handleDesasignar}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-8 opacity-30" />
            <p className="text-sm">Selecciona un esquema para ver sus asesores</p>
          </div>
        )}
      </div>

      <EsquemaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        esquema={editando}
        onGuardar={handleGuardar}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={!!confirmEliminar} onOpenChange={open => !open && setConfirmEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esquema?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <strong>{confirmEliminar?.nombre}</strong> y se removerán todas sus
              asignaciones a asesores. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminar}
              className="bg-destructive text-white hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
