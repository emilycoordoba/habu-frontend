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
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Tipos y mock
// ---------------------------------------------------------------------------

interface EsquemaComision {
  id: string
  nombre: string
  porcentaje: number
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

const ESQUEMAS_MOCK: EsquemaComision[] = [
  {
    id: "ec-1",
    nombre: "Estándar arriendo",
    porcentaje: 8,
    condiciones: "Aplica para contratos de arriendo con administración. Se cobra mensualmente sobre el canon.",
    estado: "activo",
  },
  {
    id: "ec-2",
    nombre: "Colocación arriendo",
    porcentaje: 50,
    condiciones: "Equivale al 50% del primer canon. Pago único al activar el contrato.",
    estado: "activo",
  },
  {
    id: "ec-3",
    nombre: "Venta inmueble",
    porcentaje: 3,
    condiciones: "Aplica sobre el precio total de venta al escriturar.",
    estado: "activo",
  },
  {
    id: "ec-4",
    nombre: "Promocional Q1",
    porcentaje: 6,
    condiciones: "Esquema temporal con reducción de comisión para captación de nuevos propietarios.",
    estado: "inactivo",
  },
]

const ASESORES_MOCK: Asesor[] = [
  { id: "u-2", nombre: "Ana Rodríguez",   correo: "ana@inmobiliaria.co" },
  { id: "u-3", nombre: "Carlos Mejía",    correo: "carlos@inmobiliaria.co" },
  { id: "u-4", nombre: "Lucía Torres",    correo: "lucia@inmobiliaria.co" },
  { id: "u-5", nombre: "Marcos Salinas",  correo: "marcos@inmobiliaria.co" },
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

// ---------------------------------------------------------------------------
// Dialog crear/editar esquema
// ---------------------------------------------------------------------------

interface EsquemaDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  esquema: EsquemaComision | null
  onGuardar: (data: Omit<EsquemaComision, "id">) => void
}

function EsquemaDialog({ open, onOpenChange, esquema, onGuardar }: EsquemaDialogProps) {
  const [nombre, setNombre] = React.useState("")
  const [porcentaje, setPorcentaje] = React.useState("")
  const [condiciones, setCondiciones] = React.useState("")
  const [activo, setActivo] = React.useState(true)

  React.useEffect(() => {
    if (open) {
      setNombre(esquema?.nombre ?? "")
      setPorcentaje(esquema ? String(esquema.porcentaje) : "")
      setCondiciones(esquema?.condiciones ?? "")
      setActivo(esquema ? esquema.estado === "activo" : true)
    }
  }, [open, esquema])

  const pct = parseFloat(porcentaje)
  const puedeGuardar = nombre.trim().length > 0 && !isNaN(pct) && pct > 0 && pct <= 100

  function handleGuardar() {
    if (!puedeGuardar) return
    onGuardar({
      nombre: nombre.trim(),
      porcentaje: pct,
      condiciones: condiciones.trim(),
      estado: activo ? "activo" : "inactivo",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{esquema ? "Editar esquema" : "Nuevo esquema de comisión"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="ec-nombre">Nombre</Label>
            <Input
              id="ec-nombre"
              placeholder="Ej. Estándar arriendo"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ec-pct">Porcentaje (%)</Label>
            <div className="relative">
              <Input
                id="ec-pct"
                type="number"
                min={0.01}
                max={100}
                step={0.01}
                placeholder="Ej. 8"
                value={porcentaje}
                onChange={e => setPorcentaje(e.target.value)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ec-cond">Condiciones</Label>
            <Textarea
              id="ec-cond"
              placeholder="Describe cuándo y cómo aplica este esquema…"
              value={condiciones}
              onChange={e => setCondiciones(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {esquema && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Estado</p>
                <p className="text-xs text-muted-foreground">
                  {activo ? "El esquema puede asignarse a asesores" : "No aparece en nuevas asignaciones"}
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
// Panel de asesores asignados
// ---------------------------------------------------------------------------

interface PanelAsesoresProps {
  esquema: EsquemaComision
  asignaciones: AsesorComision[]
  onAsignar: (usuarioId: string) => void
  onDesasignar: (usuarioId: string) => void
}

function PanelAsesores({ esquema, asignaciones, onAsignar, onDesasignar }: PanelAsesoresProps) {
  const asignadosIds = asignaciones
    .filter(a => a.esquemaId === esquema.id)
    .map(a => a.usuarioId)

  const asignados = ASESORES_MOCK.filter(a => asignadosIds.includes(a.id))
  const disponibles = ASESORES_MOCK.filter(a => !asignadosIds.includes(a.id))

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b">
        <p className="text-sm font-semibold">{esquema.nombre}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant="outline"
            className="text-xs gap-1 font-medium bg-primary/5 border-primary/20 text-primary"
          >
            <HugeiconsIcon icon={PercentCircleIcon} strokeWidth={2} className="size-3" />
            {esquema.porcentaje}%
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "text-xs gap-1 font-medium",
              esquema.estado === "activo"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            )}
          >
            <HugeiconsIcon
              icon={esquema.estado === "activo" ? CheckmarkCircle02Icon : Cancel01Icon}
              strokeWidth={2}
              className="size-3"
            />
            {esquema.estado === "activo" ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        {esquema.condiciones && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{esquema.condiciones}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Asesores asignados */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Asesores asignados ({asignados.length})
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
                        <p className="text-xs text-muted-foreground">
                          Desde {formatFecha(asig.fechaAsignacion)}
                        </p>
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

        {/* Asesores disponibles para asignar */}
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground truncate">{asesor.nombre}</p>
                  </div>
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

  function handleNuevo() {
    setEditando(null)
    setDialogOpen(true)
  }

  function handleEditar(e: EsquemaComision) {
    setEditando(e)
    setDialogOpen(true)
  }

  function handleEliminar(e: EsquemaComision) {
    setConfirmEliminar(e)
  }

  function confirmarEliminar() {
    if (!confirmEliminar) return
    setEsquemas(prev => prev.filter(e => e.id !== confirmEliminar.id))
    setAsignaciones(prev => prev.filter(a => a.esquemaId !== confirmEliminar.id))
    if (seleccionado?.id === confirmEliminar.id) setSeleccionado(null)
    setConfirmEliminar(null)
  }

  function handleGuardar(data: Omit<EsquemaComision, "id">) {
    if (editando) {
      const actualizado = { ...editando, ...data }
      setEsquemas(prev => prev.map(e => e.id === editando.id ? actualizado : e))
      if (seleccionado?.id === editando.id) setSeleccionado(actualizado)
    } else {
      const nuevo: EsquemaComision = { ...data, id: `ec-${Date.now()}` }
      setEsquemas(prev => [...prev, nuevo])
    }
    setDialogOpen(false)
  }

  function handleAsignar(usuarioId: string) {
    if (!seleccionado) return
    const nueva: AsesorComision = {
      usuarioId,
      esquemaId: seleccionado.id,
      fechaAsignacion: new Date().toISOString().split("T")[0],
    }
    setAsignaciones(prev => [...prev, nueva])
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
        {/* Toolbar */}
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

        {/* Listado */}
        <div className="flex-1 overflow-y-auto py-2">
          {esquemas.map(esquema => {
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
                {/* Ícono porcentaje */}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium truncate">{esquema.nombre}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-semibold shrink-0",
                        esquema.estado === "activo"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      )}
                    >
                      {esquema.porcentaje}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {esquema.condiciones || "Sin descripción"}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {asignadosCount} asesor{asignadosCount !== 1 ? "es" : ""} asignado{asignadosCount !== 1 ? "s" : ""}
                    {esquema.estado === "inactivo" && " · Inactivo"}
                  </p>
                </div>

                {/* Acciones (visibles en hover o selección) */}
                <div
                  className={cn(
                    "flex items-center gap-0.5 shrink-0 self-center transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => handleEditar(esquema)}
                    title="Editar"
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 hover:text-red-600"
                    onClick={() => handleEliminar(esquema)}
                    title="Eliminar"
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
                  </Button>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Panel derecho: asesores ── */}
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
            <p className="text-sm">Selecciona un esquema para ver sus asesores asignados</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
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
              Se eliminará <strong>{confirmEliminar?.nombre}</strong> y se removerán todas sus asignaciones a asesores.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarEliminar}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
