"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Building04Icon,
  Alert01Icon,
  Upload01Icon,
  Delete02Icon,
  CheckmarkCircle01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { listarInmuebles } from "@/lib/api/inmuebles"
import { registrarMantenimiento } from "@/lib/api/mantenimiento"
import type { InmuebleResumen } from "@/types/inmueble.types"
import type { PrioridadMantenimiento } from "@/types/mantenimiento.types"

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface FormState {
  inmuebleId: string
  descripcion: string
  prioridad: PrioridadMantenimiento | ""
}

interface ArchivoPreview {
  file: File
  url: string
}

const PRIORIDAD_INFO: Record<PrioridadMantenimiento, { label: string; desc: string; className: string }> = {
  baja:  { label: "Baja",  desc: "No afecta la habitabilidad del inmueble.",       className: "border-gray-300 bg-gray-50 text-gray-700" },
  media: { label: "Media", desc: "Requiere atención en los próximos días.",         className: "border-yellow-300 bg-yellow-50 text-yellow-700" },
  alta:  { label: "Alta",  desc: "Urgente — afecta seguridad o habitabilidad.",    className: "border-red-300 bg-red-50 text-red-700" },
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function RegistrarSolicitudClient() {
  const router = useRouter()

  const [form, setForm]               = React.useState<FormState>({ inmuebleId: "", descripcion: "", prioridad: "" })
  const [archivos, setArchivos]       = React.useState<ArchivoPreview[]>([])
  const [errors, setErrors]           = React.useState<Partial<Record<keyof FormState, string>>>({})
  const [guardando, setGuardando]     = React.useState(false)
  const [comboOpen, setComboOpen]     = React.useState(false)
  const [inmuebles, setInmuebles]     = React.useState<InmuebleResumen[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    listarInmuebles({ limit: 100 })
      .then(res => setInmuebles(res.data ?? []))
      .catch(() => { /* selector vacío si falla — no es bloqueante */ })
  }, [])

  React.useEffect(() => {
    return () => archivos.forEach(a => URL.revokeObjectURL(a.url))
  }, [archivos])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const e: typeof errors = {}
    if (!form.inmuebleId)       e.inmuebleId  = "Selecciona un inmueble."
    if (!form.descripcion.trim()) e.descripcion = "Describe el problema."
    if (!form.prioridad)        e.prioridad   = "Selecciona la prioridad."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleArchivos(files: FileList | null) {
    if (!files) return
    const nuevos = Array.from(files)
      .filter(f => f.type.startsWith("image/") || f.type === "application/pdf")
      .slice(0, 5 - archivos.length)
      .map(file => ({ file, url: URL.createObjectURL(file) }))
    setArchivos(prev => [...prev, ...nuevos])
  }

  function removeArchivo(index: number) {
    setArchivos(prev => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !form.prioridad) return
    setGuardando(true)
    try {
      await registrarMantenimiento(
        form.inmuebleId,
        form.descripcion,
        form.prioridad,
        archivos.map(a => a.file),
      )
      toast.success("Solicitud registrada correctamente")
      router.push("/mantenimiento")
    } catch {
      toast.error("No se pudo registrar la solicitud. Intenta de nuevo.")
      setGuardando(false)
    }
  }

  const inmueble = inmuebles.find(i => i.id === form.inmuebleId)

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <Link href="/mantenimiento">
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Nueva solicitud de mantenimiento</h1>
          <p className="text-sm text-muted-foreground">Completa los datos del problema a reportar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 max-w-2xl mx-auto w-full space-y-6">

        {/* Sección: Inmueble */}
        <section className="space-y-4">
          <SectionTitle>Inmueble</SectionTitle>

          <div className="space-y-1.5">
            <Label>Inmueble <span className="text-destructive">*</span></Label>
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboOpen}
                  className={cn("w-full justify-between font-normal h-9", errors.inmuebleId && "border-destructive")}
                >
                  {inmueble ? (
                    <span className="truncate">{inmueble.direccion}</span>
                  ) : (
                    <span className="text-muted-foreground">Buscar inmueble…</span>
                  )}
                  <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                <Command>
                  <CommandInput placeholder="Buscar por dirección o ciudad…" />
                  <CommandList>
                    <CommandEmpty>No se encontraron inmuebles.</CommandEmpty>
                    <CommandGroup>
                      {inmuebles.map(i => (
                        <CommandItem
                          key={i.id}
                          value={`${i.direccion} ${i.ubicacion}`}
                          onSelect={() => {
                            set("inmuebleId", i.id)
                            setComboOpen(false)
                          }}
                        >
                          <HugeiconsIcon
                            icon={CheckmarkCircle01Icon}
                            strokeWidth={2}
                            className={cn("size-4 shrink-0 mr-2", form.inmuebleId === i.id ? "opacity-100 text-primary" : "opacity-0")}
                          />
                          <div>
                            <p className="text-sm font-medium">{i.direccion}</p>
                            <p className="text-xs text-muted-foreground">{i.ubicacion}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.inmuebleId && <p className="text-xs text-destructive">{errors.inmuebleId}</p>}
            {inmueble && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-3.5" />
                {inmueble.ubicacion}
              </div>
            )}
          </div>
        </section>

        <Divider />

        {/* Sección: Problema */}
        <section className="space-y-4">
          <SectionTitle>Descripción del problema</SectionTitle>

          <div className="space-y-1.5">
            <Label htmlFor="descripcion">Descripción <span className="text-destructive">*</span></Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el problema con detalle: qué ocurre, desde cuándo, qué área del inmueble afecta…"
              rows={4}
              value={form.descripcion}
              onChange={e => set("descripcion", e.target.value)}
              className={cn("resize-none", errors.descripcion && "border-destructive")}
            />
            {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion}</p>}
            <p className="text-xs text-muted-foreground text-right">{form.descripcion.length} / 500</p>
          </div>

          <div className="space-y-1.5">
            <Label>Prioridad <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-3 gap-3">
              {(["baja", "media", "alta"] as PrioridadMantenimiento[]).map(p => {
                const cfg = PRIORIDAD_INFO[p]
                const selected = form.prioridad === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set("prioridad", p)}
                    className={cn(
                      "border rounded-lg px-3 py-3 text-left transition-all",
                      selected ? cn("ring-2 ring-offset-1", cfg.className) : "border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{cfg.label}</span>
                      {selected && <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4 text-current" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">{cfg.desc}</p>
                  </button>
                )
              })}
            </div>
            {errors.prioridad && <p className="text-xs text-destructive">{errors.prioridad}</p>}
          </div>
        </section>

        <Divider />

        {/* Sección: Evidencias */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle>Evidencias fotográficas</SectionTitle>
            <span className="text-xs text-muted-foreground">Opcional · máx. 5 archivos</span>
          </div>

          {archivos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {archivos.map((a, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border bg-muted aspect-video">
                  {a.file.type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.url} alt={a.file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                      <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-6 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate w-full text-center">{a.file.name}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeArchivo(i)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {archivos.length < 5 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-muted-foreground/25 rounded-lg py-6 flex flex-col items-center gap-2 hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors"
            >
              <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Haz clic para adjuntar fotos o PDF</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, PDF · máx. 10 MB por archivo</span>
            </button>
          )}
          <Input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={e => handleArchivos(e.target.files)}
          />
        </section>

        {/* Nota informativa */}
        <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Al registrar la solicitud quedará en estado <strong>Pendiente</strong>. Un asesor deberá asignar un proveedor para que pase a <strong>En proceso</strong>.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2 pb-6">
          <Link href="/mantenimiento">
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={guardando}>
            {guardando ? "Registrando…" : "Registrar solicitud"}
          </Button>
        </div>

      </form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  )
}

function Divider() {
  return <hr className="border-border" />
}
