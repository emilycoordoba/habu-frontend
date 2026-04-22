"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  UserIcon,
  PercentCircleIcon,
  InformationCircleIcon,
  UserAdd01Icon,
  Building04Icon,
  FileManagementIcon,
  Home01Icon,
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

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type TipoComision = "administracion" | "colocacion" | "venta"

interface EsquemaComision {
  id: string
  nombre: string
  tipo: TipoComision
  // Lo que la inmobiliaria cobra al cliente
  porcentajeInmobiliaria: number
  // Lo que el asesor recibe de ese cobro
  porcentajeAsesor: number
  condiciones: string
  estado: "activo" | "inactivo"
}

interface AsesorComision {
  usuarioId: string
  esquemaId: string
  fechaAsignacion: string
}

interface Asesor {
  id: string
  nombre: string
  correo: string
}

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
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  colocacion: {
    label: "Colocación",
    descripcionBase: "% del primer canon al activar el contrato (pago único)",
    icon: FileManagementIcon,
    className: "bg-violet-100 text-violet-700 border-violet-200",
  },
  venta: {
    label: "Venta",
    descripcionBase: "% sobre el precio total de escrituración",
    icon: Home01Icon,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
}

// ---------------------------------------------------------------------------
// Mock
// ---------------------------------------------------------------------------

const ESQUEMAS_MOCK: EsquemaComision[] = [
  {
    id: "ec-1",
    nombre: "Administración estándar",
    tipo: "administracion",
    porcentajeInmobiliaria: 8,
    porcentajeAsesor: 40,
    condiciones: "Aplica a contratos de arriendo con servicio de administración.",
    estado: "activo",
  },
  {
    id: "ec-2",
    nombre: "Colocación estándar",
    tipo: "colocacion",
    porcentajeInmobiliaria: 50,
    porcentajeAsesor: 60,
    condiciones: "Para arriendos sin administración. Pago único al activar el contrato.",
    estado: "activo",
  },
  {
    id: "ec-3",
    nombre: "Venta inmueble",
    tipo: "venta",
    porcentajeInmobiliaria: 3,
    porcentajeAsesor: 50,
    condiciones: "Aplica sobre el precio total de venta al escriturar.",
    estado: "activo",
  },
  {
    id: "ec-4",
    nombre: "Administración promocional",
    tipo: "administracion",
    porcentajeInmobiliaria: 6,
    porcentajeAsesor: 35,
    condiciones: "Tarifa reducida para captación de nuevos propietarios.",
    estado: "inactivo",
  },
]

const ASESORES_MOCK: Asesor[] = [
  { id: "u-2", nombre: "Ana Rodríguez",  correo: "ana@inmobiliaria.co" },
  { id: "u-3", nombre: "Carlos Mejía",   correo: "carlos@inmobiliaria.co" },
  { id: "u-4", nombre: "Lucía Torres",   correo: "lucia@inmobiliaria.co" },
  { id: "u-5", nombre: "Marcos Salinas", correo: "marcos@inmobiliaria.co" },
]

const ASIGNACIONES_MOCK: AsesorComision[] = [
  { usuarioId: "u-2", esquemaId: "ec-1", fechaAsignacion: "2025-02-01" },
  { usuarioId: "u-3", esquemaId: "ec-1", fechaAsignacion: "2025-02-15" },
  { usuarioId: "u-2", esquemaId: "ec-2", fechaAsignacion: "2025-02-01" },
  { usuarioId: "u-5", esquemaId: "ec-3", fechaAsignacion: "2025-03-20" },
]

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
  onGuardar: (data: Omit<EsquemaComision, "id">) => void
}

function EsquemaDialog({ open, onOpenChange, esquema, onGuardar }: EsquemaDialogProps) {
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

  // Ejemplo de cálculo para mostrar en tiempo real
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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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

          {/* Simulador en tiempo real */}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleGuardar} disabled={!puedeGuardar}>
            {esquema ? "Guardar cambios" : "Crear esquema"}
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
  asignaciones: AsesorComision[]
  onAsignar: (usuarioId: string) => void
  onDesasignar: (usuarioId: string) => void
}

function PanelAsesores({ esquema, asignaciones, onAsignar, onDesasignar }: PanelAsesoresProps) {
  const cfg = TIPO_CONFIG[esquema.tipo]
  const asignadosIds = asignaciones
    .filter(a => a.esquemaId === esquema.id)
    .map(a => a.usuarioId)
  const asignados  = ASESORES_MOCK.filter(a =>  asignadosIds.includes(a.id))
  const disponibles = ASESORES_MOCK.filter(a => !asignadosIds.includes(a.id))

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
              esquema.estado === "activo"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            )}
          >
            {esquema.estado === "activo" ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        {/* Desglose de tasas */}
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
            Asesores con este esquema ({asignados.length})
          </p>
          {asignados.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Ningún asesor asignado aún.</p>
          ) : (
            <div className="space-y-1">
              {asignados.map(asesor => {
                const asig = asignaciones.find(
                  a => a.esquemaId === esquema.id && a.usuarioId === asesor.id
                )
                return (
                  <div
                    key={asesor.id}
                    className="flex items-center gap-3 rounded-md border px-3 py-2 bg-background"
                  >
                    <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{asesor.nombre}</p>
                      {asig && (
                        <p className="text-xs text-muted-foreground">Desde {formatFecha(asig.fechaAsignacion)}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-red-600 shrink-0"
                      onClick={() => onDesasignar(asesor.id)}
                      title="Quitar asignación"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
                    </Button>
                  </div>
                )
              })}
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
  const [esquemas, setEsquemas] = React.useState<EsquemaComision[]>(ESQUEMAS_MOCK)
  const [asignaciones, setAsignaciones] = React.useState<AsesorComision[]>(ASIGNACIONES_MOCK)
  const [seleccionado, setSeleccionado] = React.useState<EsquemaComision | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editando, setEditando] = React.useState<EsquemaComision | null>(null)
  const [confirmEliminar, setConfirmEliminar] = React.useState<EsquemaComision | null>(null)

  function handleNuevo() { setEditando(null); setDialogOpen(true) }
  function handleEditar(e: EsquemaComision) { setEditando(e); setDialogOpen(true) }

  function handleGuardar(data: Omit<EsquemaComision, "id">) {
    if (editando) {
      const actualizado = { ...editando, ...data }
      setEsquemas(prev => prev.map(e => e.id === editando.id ? actualizado : e))
      if (seleccionado?.id === editando.id) setSeleccionado(actualizado)
    } else {
      setEsquemas(prev => [...prev, { ...data, id: `ec-${Date.now()}` }])
    }
    setDialogOpen(false)
  }

  function confirmarEliminar() {
    if (!confirmEliminar) return
    setEsquemas(prev => prev.filter(e => e.id !== confirmEliminar.id))
    setAsignaciones(prev => prev.filter(a => a.esquemaId !== confirmEliminar.id))
    if (seleccionado?.id === confirmEliminar.id) setSeleccionado(null)
    setConfirmEliminar(null)
  }

  function handleAsignar(usuarioId: string) {
    if (!seleccionado) return
    setAsignaciones(prev => [...prev, {
      usuarioId,
      esquemaId: seleccionado.id,
      fechaAsignacion: new Date().toISOString().split("T")[0],
    }])
  }

  function handleDesasignar(usuarioId: string) {
    if (!seleccionado) return
    setAsignaciones(prev =>
      prev.filter(a => !(a.esquemaId === seleccionado.id && a.usuarioId === usuarioId))
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
            const asignadosCount = asignaciones.filter(a => a.esquemaId === esquema.id).length
            const isSelected = seleccionado?.id === esquema.id

            return (
              <button
                key={esquema.id}
                onClick={() => setSeleccionado(esquema)}
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
                    {asignadosCount} asesor{asignadosCount !== 1 ? "es" : ""}
                    {esquema.estado === "inactivo" && " · Inactivo"}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-0.5 shrink-0 self-center transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
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
        {seleccionado ? (
          <PanelAsesores
            esquema={seleccionado}
            asignaciones={asignaciones}
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
