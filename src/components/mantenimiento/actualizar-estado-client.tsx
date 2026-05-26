"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  PencilEdit01Icon,
  Upload01Icon,
  Delete02Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MANTENIMIENTO_MOCK } from "@/lib/mock/mantenimiento"
import type { EstadoMantenimiento } from "@/types/mantenimiento.types"

// Solo las transiciones posibles desde "en_proceso"
const TRANSICIONES: { valor: EstadoMantenimiento; label: string; desc: string; className: string; icon: React.ReactNode }[] = [
  {
    valor: "finalizado",
    label: "Finalizado",
    desc: "El trabajo fue completado satisfactoriamente.",
    className: "border-green-300 bg-green-50 text-green-700",
    icon: <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />,
  },
  {
    valor: "cancelado",
    label: "Cancelado",
    desc: "La solicitud no se llevará a cabo.",
    className: "border-gray-300 bg-gray-50 text-gray-600",
    icon: <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" />,
  },
]

interface ArchivoPreview {
  file: File
  url: string
}

export function ActualizarEstadoClient({ solicitudId }: { solicitudId: string }) {
  const router = useRouter()
  const solicitud = MANTENIMIENTO_MOCK[solicitudId] ?? MANTENIMIENTO_MOCK["1"]

  const [nuevoEstado, setNuevoEstado] = React.useState<EstadoMantenimiento | "">("")
  const [nota, setNota]               = React.useState("")
  const [archivos, setArchivos]       = React.useState<ArchivoPreview[]>([])
  const [errors, setErrors]           = React.useState<{ estado?: string; nota?: string }>({})
  const [guardando, setGuardando]     = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    return () => archivos.forEach(a => URL.revokeObjectURL(a.url))
  }, [archivos])

  function validate() {
    const e: typeof errors = {}
    if (!nuevoEstado) e.estado = "Selecciona el nuevo estado."
    if (!nota.trim()) e.nota   = "Añade una nota de avance."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleArchivos(files: FileList | null) {
    if (!files) return
    const nuevos = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .slice(0, 3 - archivos.length)
      .map(file => ({ file, url: URL.createObjectURL(file) }))
    setArchivos(prev => [...prev, ...nuevos])
  }

  function removeArchivo(index: number) {
    setArchivos(prev => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setGuardando(true)
    // TODO: PATCH /mantenimiento/:id/estado con { estado: nuevoEstado, nota, archivos }
    setTimeout(() => {
      setGuardando(false)
      const label = nuevoEstado === "finalizado" ? "finalizada" : "cancelada"
      toast.success(`Solicitud marcada como ${label}`)
      router.push(`/mantenimiento/${solicitudId}`)
    }, 600)
  }

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
          <h1 className="text-lg font-semibold">Actualizar estado</h1>
          <p className="text-sm text-muted-foreground">Solicitud #{solicitud.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 max-w-2xl mx-auto w-full space-y-6">

        {/* Resumen */}
        <div className="rounded-lg border bg-muted/30 px-4 py-4 space-y-1.5">
          <p className="text-sm font-medium">Solicitud #{solicitud.id}</p>
          <p className="text-sm text-muted-foreground leading-snug">{solicitud.descripcion}</p>
          {solicitud.proveedorNombre && (
            <p className="text-xs text-muted-foreground">Proveedor: {solicitud.proveedorNombre}</p>
          )}
        </div>

        <hr className="border-border" />

        {/* Nuevo estado */}
        <section className="space-y-3">
          <SectionTitle>Nuevo estado <span className="text-destructive">*</span></SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            {TRANSICIONES.map(t => {
              const selected = nuevoEstado === t.valor
              return (
                <button
                  key={t.valor}
                  type="button"
                  onClick={() => {
                    setNuevoEstado(t.valor)
                    setErrors(e => ({ ...e, estado: undefined }))
                  }}
                  className={cn(
                    "border rounded-lg px-4 py-3 text-left transition-all",
                    selected
                      ? cn("ring-2 ring-offset-1", t.className)
                      : "border-border hover:border-muted-foreground/40",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("transition-colors", selected ? "text-current" : "text-muted-foreground")}>
                      {t.icon}
                    </span>
                    <span className="text-sm font-medium">{t.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight">{t.desc}</p>
                </button>
              )
            })}
          </div>
          {errors.estado && <p className="text-xs text-destructive">{errors.estado}</p>}
        </section>

        <hr className="border-border" />

        {/* Nota de avance */}
        <section className="space-y-3">
          <SectionTitle>Nota de avance</SectionTitle>

          <div className="space-y-1.5">
            <Label htmlFor="nota">Observación <span className="text-destructive">*</span></Label>
            <Textarea
              id="nota"
              placeholder="Describe el estado del trabajo, qué se hizo, qué queda pendiente…"
              rows={4}
              value={nota}
              onChange={e => {
                setNota(e.target.value)
                setErrors(ev => ({ ...ev, nota: undefined }))
              }}
              className={cn("resize-none", errors.nota && "border-destructive")}
            />
            {errors.nota && <p className="text-xs text-destructive">{errors.nota}</p>}
          </div>
        </section>

        <hr className="border-border" />

        {/* Evidencias */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionTitle>Fotos de evidencia</SectionTitle>
            <span className="text-xs text-muted-foreground">Opcional · máx. 3 fotos</span>
          </div>

          {archivos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {archivos.map((a, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border bg-muted aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.url} alt={a.file.name} className="w-full h-full object-cover" />
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

          {archivos.length < 3 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-muted-foreground/25 rounded-lg py-5 flex flex-col items-center gap-2 hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors"
            >
              <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Adjuntar fotos del trabajo</span>
              <span className="text-xs text-muted-foreground">JPG, PNG · máx. 10 MB por foto</span>
            </button>
          )}
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleArchivos(e.target.files)}
          />
        </section>

        {/* Nota informativa solo si seleccionó finalizado */}
        {nuevoEstado === "finalizado" && (
          <div className="flex gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} className="size-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Una vez finalizada, podrás registrar el costo del mantenimiento desde el detalle de la solicitud.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2 pb-6">
          <Link href={`/mantenimiento/${solicitudId}`}>
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={guardando}>
            <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-4" />
            {guardando ? "Guardando…" : "Guardar cambio"}
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
