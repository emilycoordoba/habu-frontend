"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  EyeIcon,
  PencilEdit01Icon,
  Home01Icon,
  UserIcon,
  Calendar01Icon,
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
import { cn } from "@/lib/utils"
import type { Interaccion, TipoInteraccion } from "@/lib/mock/clientes"

interface Props {
  clienteNombre: string
  onRegistrar: (interaccion: Interaccion) => void
  children: React.ReactNode
}

interface FormState {
  tipo: TipoInteraccion
  inmueble: string
  fecha: string
  descripcion: string
}

const hoy = () => new Date().toISOString().split("T")[0]

export function RegistrarVisitaSheet({ clienteNombre, onRegistrar, children }: Props) {
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState<FormState>({
    tipo: "visita",
    inmueble: "",
    fecha: hoy(),
    descripcion: "",
  })
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({})

  function reset() {
    setForm({ tipo: "visita", inmueble: "", fecha: hoy(), descripcion: "" })
    setErrors({})
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.fecha) e.fecha = "La fecha es requerida."
    if (!form.descripcion.trim()) e.descripcion = "La descripción es requerida."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const nueva: Interaccion = {
      id: `i${Date.now()}`,
      tipo: form.tipo,
      fecha: form.fecha,
      descripcion: form.descripcion.trim(),
      asesor: "Emily Perea",
      ...(form.tipo === "visita" && form.inmueble.trim() ? { inmueble: form.inmueble.trim() } : {}),
    }

    onRegistrar(nueva)
    toast.success(form.tipo === "visita" ? "Visita registrada" : "Nota registrada")
    setOpen(false)
    reset()
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) reset()
  }

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
                {(["visita", "nota"] as TipoInteraccion[]).map(tipo => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, tipo }))}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm transition-colors text-left",
                      form.tipo === tipo
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon
                      icon={tipo === "visita" ? EyeIcon : PencilEdit01Icon}
                      strokeWidth={2}
                      className="size-4 shrink-0"
                    />
                    {tipo === "visita" ? "Visita" : "Nota"}
                  </button>
                ))}
              </div>
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                />
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

            {/* Inmueble — solo visible en visitas */}
            {form.tipo === "visita" && (
              <div className="space-y-2">
                <Label htmlFor="inmueble">
                  Inmueble visitado
                  <span className="text-muted-foreground font-normal ml-1">(opcional)</span>
                </Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Home01Icon}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="inmueble"
                    placeholder="Ej. Cra 15 #93-47, Apto 301"
                    value={form.inmueble}
                    onChange={e => setForm(f => ({ ...f, inmueble: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder={
                  form.tipo === "visita"
                    ? "¿Cómo fue la visita? Reacciones del cliente, preguntas, próximos pasos…"
                    : "Nota sobre el cliente, acuerdo, seguimiento pendiente…"
                }
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                rows={4}
                className={cn(errors.descripcion && "border-destructive")}
              />
              {errors.descripcion && (
                <p className="text-xs text-destructive">{errors.descripcion}</p>
              )}
            </div>

            {/* Asesor (informativo) */}
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {form.tipo === "visita" ? "Registrar visita" : "Guardar nota"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
