"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  EyeIcon,
  PencilEdit01Icon,
  Call02Icon,
  BubbleChatIcon,
  UserIcon,
  Calendar01Icon,
  Clock01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import type { Interaccion, TipoInteraccion } from "@/types/cliente.types"
import { registrarInteraccion } from "@/lib/api/clientes"
import { listarInmuebles } from "@/lib/api/inmuebles"

// ---------------------------------------------------------------------------

interface Props {
  clienteId: string
  clienteNombre: string
  onRegistrar: (interaccion: Interaccion) => void
  children: React.ReactNode
}

interface FormState {
  tipo: TipoInteraccion
  inmuebleId: string
  fecha: string
  hora: string
  descripcion: string
}

interface InmuebleItem {
  id: string
  label: string
  sub: string
}

const TIPOS: {
  value: TipoInteraccion
  label: string
  icon: typeof EyeIcon
}[] = [
  { value: "visita",  label: "Visita",   icon: EyeIcon },
  { value: "llamada", label: "Llamada",  icon: Call02Icon },
  { value: "mensaje", label: "Mensaje",  icon: BubbleChatIcon },
  { value: "nota",    label: "Nota",     icon: PencilEdit01Icon },
]

const hoy = () => new Date().toISOString().split("T")[0]
const ahoraHora = () => new Date().toTimeString().slice(0, 5)

// ---------------------------------------------------------------------------

export function RegistrarVisitaSheet({ clienteId, clienteNombre, onRegistrar, children }: Props) {
  const [open, setOpen]           = React.useState(false)
  const [comboOpen, setComboOpen] = React.useState(false)
  const [form, setForm]           = React.useState<FormState>({
    tipo: "visita",
    inmuebleId: "",
    fecha: hoy(),
    hora: ahoraHora(),
    descripcion: "",
  })
  const [errors, setErrors]           = React.useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [inmuebles, setInmuebles]     = React.useState<InmuebleItem[]>([])

  // Carga la lista de inmuebles para el combobox de visitas
  React.useEffect(() => {
    listarInmuebles({ limit: 100 })
      .then(res => {
        setInmuebles(res.data.map(i => ({ id: i.id, label: i.direccion, sub: i.ubicacion })))
      })
      .catch(() => { /* el combobox queda vacío */ })
  }, [])

  function reset() {
    setForm({ tipo: "visita", inmuebleId: "", fecha: hoy(), hora: ahoraHora(), descripcion: "" })
    setErrors({})
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.fecha) e.fecha = "La fecha es requerida."
    if (!form.hora) e.hora = "La hora es requerida."
    if (form.tipo === "visita" && !form.inmuebleId) e.inmuebleId = "Selecciona el inmueble visitado."
    if (!form.descripcion.trim()) e.descripcion = "La descripción es requerida."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)

    try {
      const res = await registrarInteraccion(clienteId, {
        tipo: form.tipo,
        fecha: form.fecha,
        hora: form.hora,
        descripcion: form.descripcion.trim(),
        ...(form.inmuebleId ? { inmuebleId: form.inmuebleId } : {}),
      })

      onRegistrar(res.data)
      toast.success(
        form.tipo === "visita"   ? "Visita registrada" :
        form.tipo === "llamada"  ? "Llamada registrada" :
        form.tipo === "mensaje"  ? "Mensaje registrado" :
                                   "Nota guardada"
      )
      setOpen(false)
      reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al registrar")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) reset()
  }

  const tipoActual          = TIPOS.find(t => t.value === form.tipo)!
  const inmuebleSeleccionado = inmuebles.find(i => i.id === form.inmuebleId) ?? null

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="text-base">Registrar interacción</SheetTitle>
          <p className="text-sm text-muted-foreground">{clienteNombre}</p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 px-6 py-6 flex-1">

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="grid grid-cols-2 gap-2">
                {TIPOS.map(tipo => (
                  <button
                    key={tipo.value}
                    type="button"
                    onClick={() => {
                      setForm(f => ({ ...f, tipo: tipo.value, inmuebleId: "" }))
                      setErrors(e => ({ ...e, inmuebleId: undefined }))
                    }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm transition-colors text-left",
                      form.tipo === tipo.value
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={tipo.icon} strokeWidth={2} className="size-4 shrink-0" />
                    {tipo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inmueble — solo para visitas */}
            {form.tipo === "visita" && (
              <div className="space-y-2">
                <Label htmlFor="inmueble">Inmueble visitado</Label>
                <Popover open={comboOpen} onOpenChange={setComboOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id="inmueble"
                      type="button"
                      role="combobox"
                      aria-expanded={comboOpen}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted/30",
                        errors.inmuebleId ? "border-destructive" : "border-input",
                        !inmuebleSeleccionado && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate text-left">
                        {inmuebleSeleccionado ? inmuebleSeleccionado.label : "Seleccionar inmueble…"}
                      </span>
                      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 shrink-0 ml-2 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar por dirección…" />
                      <CommandList>
                        <CommandEmpty>
                          {inmuebles.length === 0 ? "Cargando inmuebles…" : "Sin resultados."}
                        </CommandEmpty>
                        <CommandGroup>
                          {inmuebles.map(inm => (
                            <CommandItem
                              key={inm.id}
                              value={inm.label}
                              data-checked={form.inmuebleId === inm.id}
                              onSelect={() => {
                                setForm(f => ({ ...f, inmuebleId: inm.id }))
                                setErrors(e => ({ ...e, inmuebleId: undefined }))
                                setComboOpen(false)
                              }}
                            >
                              <span className="flex-1 min-w-0">
                                <span className="block truncate">{inm.label}</span>
                                <span className="block text-xs text-muted-foreground truncate">{inm.sub}</span>
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.inmuebleId && <p className="text-xs text-destructive">{errors.inmuebleId}</p>}
              </div>
            )}

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <div className="relative">
                  <HugeiconsIcon icon={Calendar01Icon} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fecha"
                    type="date"
                    value={form.fecha}
                    max={hoy()}
                    onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                    className={cn("pl-9", errors.fecha && "border-destructive")}
                  />
                </div>
                {errors.fecha && <p className="text-xs text-destructive">{errors.fecha}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <div className="relative">
                  <HugeiconsIcon icon={Clock01Icon} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="hora"
                    type="time"
                    value={form.hora}
                    onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                    className={cn("pl-9", errors.hora && "border-destructive")}
                  />
                </div>
                {errors.hora && <p className="text-xs text-destructive">{errors.hora}</p>}
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder={
                  form.tipo === "visita"   ? "¿Cómo fue la visita? Reacciones del cliente, preguntas, próximos pasos…" :
                  form.tipo === "llamada"  ? "Resumen de la llamada, acuerdos, compromisos…" :
                  form.tipo === "mensaje"  ? "Contenido o resumen del mensaje enviado/recibido…" :
                                            "Nota interna sobre el cliente, seguimiento pendiente…"
                }
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                rows={4}
                className={cn(errors.descripcion && "border-destructive")}
              />
              {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion}</p>}
            </div>

            {/* Asesor */}
            <div className="space-y-2">
              <Label>Asesor</Label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5">
                <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">Emily Perea</span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <HugeiconsIcon icon={tipoActual.icon} strokeWidth={2} className="size-4" />
              {isSubmitting ? "Guardando…" :
               form.tipo === "visita"  ? "Registrar visita" :
               form.tipo === "llamada" ? "Registrar llamada" :
               form.tipo === "mensaje" ? "Registrar mensaje" :
               "Guardar nota"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
