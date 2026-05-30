"use client"

import * as React from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Search01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  StarIcon,
  UserIcon,
  TelephoneIcon,
  Wrench01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"
import {
  listarProveedores,
  crearProveedor,
  editarProveedor,
  eliminarProveedor,
} from "@/lib/api/mantenimiento"
import type { ProveedorOpcion } from "@/types/mantenimiento.types"

// ---------------------------------------------------------------------------
// Estado del formulario
// ---------------------------------------------------------------------------

interface FormProveedor {
  nombre: string
  especialidad: string
  telefono: string
  correo: string
  calificacion: string
}

const FORM_VACIO: FormProveedor = { nombre: "", especialidad: "", telefono: "", correo: "", calificacion: "" }

function validarForm(f: FormProveedor): Partial<Record<keyof FormProveedor, string>> {
  const e: Partial<Record<keyof FormProveedor, string>> = {}
  if (!f.nombre.trim())       e.nombre       = "El nombre es obligatorio."
  if (!f.especialidad.trim()) e.especialidad  = "La especialidad es obligatoria."
  if (!f.telefono.trim())     e.telefono      = "El teléfono es obligatorio."
  if (f.calificacion !== "") {
    const v = parseFloat(f.calificacion)
    if (isNaN(v) || v < 1 || v > 5) e.calificacion = "Debe ser un valor entre 1.0 y 5.0."
  }
  return e
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function ProveedoresSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-y-auto animate-pulse">
      <div className="border-b px-6 py-4 h-16 bg-muted/20" />
      <div className="px-6 py-6 space-y-4 max-w-4xl mx-auto w-full">
        <div className="h-9 bg-muted/20 rounded w-64" />
        <div className="border rounded-lg overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted/20 border-b" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function ProveedoresClient() {
  const [proveedores,    setProveedores]    = React.useState<ProveedorOpcion[]>([])
  const [isLoading,      setIsLoading]      = React.useState(true)
  const [error,          setError]          = React.useState<string | null>(null)
  const [retryKey,       setRetryKey]       = React.useState(0)
  const [busqueda,       setBusqueda]       = React.useState("")

  // Dialog add/edit
  const [dialogAbierto,  setDialogAbierto]  = React.useState(false)
  const [modo,           setModo]           = React.useState<"crear" | "editar">("crear")
  const [editandoId,     setEditandoId]     = React.useState<string | null>(null)
  const [form,           setForm]           = React.useState<FormProveedor>(FORM_VACIO)
  const [formErrors,     setFormErrors]     = React.useState<Partial<Record<keyof FormProveedor, string>>>({})
  const [guardando,      setGuardando]      = React.useState(false)

  // AlertDialog eliminar
  const [eliminarId,     setEliminarId]     = React.useState<string | null>(null)
  const [eliminando,     setEliminando]     = React.useState(false)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)
    listarProveedores()
      .then(res => { if (!cancelado) setProveedores(res.data ?? []) })
      .catch(() => { if (!cancelado) setError("No se pudieron cargar los proveedores.") })
      .finally(() => { if (!cancelado) setIsLoading(false) })
    return () => { cancelado = true }
  }, [retryKey])

  const filtrados = proveedores.filter(p => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.especialidad.toLowerCase().includes(q) ||
      p.telefono.toLowerCase().includes(q)
    )
  })

  // ── Abrir dialog ──────────────────────────────────────────────────────────

  function abrirCrear() {
    setModo("crear")
    setEditandoId(null)
    setForm(FORM_VACIO)
    setFormErrors({})
    setDialogAbierto(true)
  }

  function abrirEditar(p: ProveedorOpcion) {
    setModo("editar")
    setEditandoId(p.id)
    setForm({
      nombre:       p.nombre,
      especialidad: p.especialidad,
      telefono:     p.telefono,
      correo:       p.correo ?? "",
      calificacion: p.calificacion != null ? String(p.calificacion) : "",
    })
    setFormErrors({})
    setDialogAbierto(true)
  }

  // ── Guardar ───────────────────────────────────────────────────────────────

  async function handleGuardar() {
    const errors = validarForm(form)
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }

    setGuardando(true)
    const body = {
      nombre:       form.nombre.trim(),
      especialidad: form.especialidad.trim(),
      telefono:     form.telefono.trim(),
      correo:       form.correo.trim() || undefined,
      calificacion: form.calificacion !== "" ? parseFloat(form.calificacion) : undefined,
    }

    try {
      if (modo === "crear") {
        await crearProveedor(body)
        toast.success("Proveedor creado correctamente")
      } else if (editandoId) {
        await editarProveedor(editandoId, body)
        toast.success("Proveedor actualizado correctamente")
      }
      setDialogAbierto(false)
      setRetryKey(k => k + 1)
    } catch {
      toast.error("No se pudo guardar el proveedor. Intenta de nuevo.")
    } finally {
      setGuardando(false)
    }
  }

  // ── Eliminar ──────────────────────────────────────────────────────────────

  async function handleEliminar() {
    if (!eliminarId) return
    setEliminando(true)
    try {
      await eliminarProveedor(eliminarId)
      toast.success("Proveedor eliminado")
      setEliminarId(null)
      setRetryKey(k => k + 1)
    } catch {
      toast.error("No se pudo eliminar el proveedor. Puede tener solicitudes activas.")
      setEliminarId(null)
    } finally {
      setEliminando(false)
    }
  }

  // ── Helpers form ──────────────────────────────────────────────────────────

  function setField<K extends keyof FormProveedor>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setFormErrors(e => ({ ...e, [key]: undefined }))
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (isLoading) return <ProveedoresSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <p className="text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={() => setRetryKey(k => k + 1)} className="gap-2">
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Proveedores</h1>
          <p className="text-sm text-muted-foreground">{proveedores.length} proveedores registrados</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={abrirCrear}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
          Nuevo proveedor
        </Button>
      </div>

      <div className="px-6 py-6 space-y-4 max-w-4xl mx-auto w-full">

        {/* Buscador */}
        <div className="relative max-w-sm">
          <HugeiconsIcon icon={Search01Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por nombre, especialidad…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Tabla */}
        {filtrados.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay proveedores que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Proveedor</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Especialidad</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Teléfono</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Calificación</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtrados.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">

                    {/* Proveedor */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{p.nombre}</span>
                      </div>
                    </td>

                    {/* Especialidad */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <HugeiconsIcon icon={Wrench01Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                        {p.especialidad}
                      </div>
                    </td>

                    {/* Teléfono */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <HugeiconsIcon icon={TelephoneIcon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                        {p.telefono}
                      </div>
                    </td>

                    {/* Calificación */}
                    <td className="px-4 py-3 text-center">
                      {p.calificacion != null ? (
                        <CalificacionBadge valor={p.calificacion} />
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Sin calificar</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => abrirEditar(p)}
                        >
                          <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setEliminarId(p.id)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4" />
                        </Button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-right">
          {filtrados.length} de {proveedores.length} proveedores
        </p>

      </div>

      {/* ── Dialog crear / editar ─────────────────────────────────────────── */}
      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{modo === "crear" ? "Nuevo proveedor" : "Editar proveedor"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <FormField
              id="nombre"
              label="Nombre"
              required
              value={form.nombre}
              onChange={v => setField("nombre", v)}
              error={formErrors.nombre}
              placeholder="Nombre o razón social"
            />
            <FormField
              id="especialidad"
              label="Especialidad"
              required
              value={form.especialidad}
              onChange={v => setField("especialidad", v)}
              error={formErrors.especialidad}
              placeholder="Ej: Plomería, Electricidad…"
            />
            <FormField
              id="telefono"
              label="Teléfono"
              required
              value={form.telefono}
              onChange={v => setField("telefono", v)}
              error={formErrors.telefono}
              placeholder="300 000 0000"
            />
            <FormField
              id="correo"
              label="Correo electrónico"
              value={form.correo}
              onChange={v => setField("correo", v)}
              error={formErrors.correo}
              placeholder="contacto@proveedor.com (opcional)"
              type="email"
            />
            <FormField
              id="calificacion"
              label="Calificación"
              value={form.calificacion}
              onChange={v => setField("calificacion", v)}
              error={formErrors.calificacion}
              placeholder="1.0 – 5.0 (opcional)"
              type="number"
              min="1"
              max="5"
              step="0.1"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} disabled={guardando}>
              {guardando ? "Guardando…" : modo === "crear" ? "Crear proveedor" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── AlertDialog eliminar ──────────────────────────────────────────── */}
      <AlertDialog open={!!eliminarId} onOpenChange={open => { if (!open) setEliminarId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proveedor será removido del catálogo permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleEliminar}
              disabled={eliminando}
            >
              {eliminando ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function CalificacionBadge({ valor }: { valor: number }) {
  const color = valor >= 4.5
    ? "bg-green-100 text-green-700 border-green-200"
    : valor >= 3.5
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-red-100 text-red-700 border-red-200"

  return (
    <Badge variant="outline" className={cn("text-xs gap-1", color)}>
      <HugeiconsIcon icon={StarIcon} strokeWidth={2} className="size-3" />
      {valor.toFixed(1)}
    </Badge>
  )
}

function FormField({
  id, label, required, value, onChange, error, placeholder, type = "text", min, max, step,
}: {
  id: string
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder?: string
  type?: string
  min?: string
  max?: string
  step?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("h-9", error && "border-destructive")}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
