"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Building04Icon,
  Location01Icon,
  Image01Icon,
  Delete02Icon,
  Upload01Icon,
  UserIcon,
  SquareIcon,
  Money01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { TipoInmueble, ModalidadInmueble, EstadoInmueble } from "@/types/inmueble.types"

// ---------------------------------------------------------------------------
// Mock propietarios
// ---------------------------------------------------------------------------

const PROPIETARIOS_MOCK = [
  { id: "p-1", nombre: "Ana Martínez" },
  { id: "p-2", nombre: "Inversiones Pedraza S.A.S." },
  { id: "p-3", nombre: "Luis Gómez" },
  { id: "p-4", nombre: "María Ospina" },
  { id: "p-5", nombre: "Carlos Reyes" },
  { id: "p-6", nombre: "Fondos Cali S.A." },
  { id: "p-7", nombre: "Hernando Castro" },
]

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

interface FotoPreview {
  file: File
  url: string
}

interface FormState {
  tipo: TipoInmueble | ""
  modalidad: ModalidadInmueble | ""
  estado: EstadoInmueble
  publicado: boolean
  direccion: string
  ubicacion: string
  area: string
  precio: string
  propietarioId: string
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function RegistrarInmuebleClient() {
  const [form, setForm] = React.useState<FormState>({
    tipo:          "",
    modalidad:     "",
    estado:        "disponible",
    publicado:     true,
    direccion:     "",
    ubicacion:     "",
    area:          "",
    precio:        "",
    propietarioId: "",
  })

  const [fotos, setFotos] = React.useState<FotoPreview[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Limpia las URLs de objeto al desmontar para evitar memory leaks
  React.useEffect(() => {
    return () => fotos.forEach(f => URL.revokeObjectURL(f.url))
  }, [fotos])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const nuevas = files.map(file => ({ file, url: URL.createObjectURL(file) }))
    setFotos(prev => [...prev, ...nuevas])
    e.target.value = ""
  }

  function eliminarFoto(url: string) {
    URL.revokeObjectURL(url)
    setFotos(prev => prev.filter(f => f.url !== url))
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
    const nuevas = files.map(file => ({ file, url: URL.createObjectURL(file) }))
    setFotos(prev => [...prev, ...nuevas])
  }

  const precioLabel = form.modalidad === "venta" ? "Precio de venta" : form.modalidad === "arriendo" ? "Canon mensual" : "Precio"
  const precioHint  = form.modalidad === "venta" ? "Precio total pactado" : form.modalidad === "arriendo" ? "Valor mensual del arriendo" : "Ingresa la modalidad para saber el tipo de precio"

  const puedeGuardar =
    form.tipo !== "" &&
    form.modalidad !== "" &&
    form.direccion.trim() !== "" &&
    form.ubicacion.trim() !== "" &&
    form.area.trim() !== "" &&
    form.precio.trim() !== "" &&
    form.propietarioId !== ""

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <Link href="/inmuebles">
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Registrar inmueble</h1>
          <p className="text-sm text-muted-foreground">Completa la información del inmueble</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/inmuebles">
            <Button variant="outline" size="sm">Cancelar</Button>
          </Link>
          <Button size="sm" disabled={!puedeGuardar}>Guardar inmueble</Button>
        </div>
      </div>

      {/* Cuerpo — dos columnas */}
      <div className="flex flex-1 overflow-hidden">

        {/* Columna izquierda — formulario */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 max-w-2xl">

          {/* Sección: Información básica */}
          <section className="space-y-4">
            <SectionHeader icon={Building04Icon} title="Información básica" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo de inmueble <Required /></Label>
                <Select value={form.tipo} onValueChange={v => setField("tipo", v as TipoInmueble)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Modalidad <Required /></Label>
                <Select value={form.modalidad} onValueChange={v => setField("modalidad", v as ModalidadInmueble)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arriendo">Arriendo</SelectItem>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="ambos">Arriendo y venta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Estado inicial</Label>
                <Select value={form.estado} onValueChange={v => setField("estado", v as EstadoInmueble)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="en_mantenimiento">En mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">El sistema cambia el estado al activar un contrato.</p>
              </div>

              {/* Toggle publicado */}
              <div className="space-y-1.5">
                <Label>Publicación en portal</Label>
                <button
                  type="button"
                  onClick={() => setField("publicado", !form.publicado)}
                  className={cn(
                    "w-full h-9 rounded-md border px-3 text-sm text-left flex items-center gap-2 transition-colors",
                    form.publicado
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-gray-200 bg-muted/30 text-muted-foreground"
                  )}
                >
                  <span className={cn(
                    "size-2 rounded-full shrink-0",
                    form.publicado ? "bg-green-500" : "bg-gray-300"
                  )} />
                  {form.publicado ? "Publicado en el portal" : "No publicado"}
                </button>
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección: Ubicación */}
          <section className="space-y-4">
            <SectionHeader icon={Location01Icon} title="Ubicación" />

            <div className="space-y-1.5">
              <Label>Dirección <Required /></Label>
              <Input
                placeholder="Ej: Cra 15 #93-47, Apto 301 Torre A"
                value={form.direccion}
                onChange={e => setField("direccion", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ciudad / Barrio <Required /></Label>
              <Input
                placeholder="Ej: Bogotá — Chapinero"
                value={form.ubicacion}
                onChange={e => setField("ubicacion", e.target.value)}
              />
            </div>
          </section>

          <Separator />

          {/* Sección: Detalles */}
          <section className="space-y-4">
            <SectionHeader icon={SquareIcon} title="Detalles del inmueble" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Área (m²) <Required /></Label>
                <Input
                  type="number"
                  placeholder="Ej: 68"
                  min={1}
                  value={form.area}
                  onChange={e => setField("area", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{precioLabel} <Required /></Label>
                <div className="relative">
                  <HugeiconsIcon icon={Money01Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    value={form.precio}
                    onChange={e => setField("precio", e.target.value)}
                    className="pl-9"
                  />
                </div>
                {precioHint && (
                  <p className="text-xs text-muted-foreground">{precioHint}</p>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección: Propietario */}
          <section className="space-y-4">
            <SectionHeader icon={UserIcon} title="Propietario" />

            <div className="space-y-1.5">
              <Label>Propietario <Required /></Label>
              <Select value={form.propietarioId} onValueChange={v => setField("propietarioId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el propietario" />
                </SelectTrigger>
                <SelectContent>
                  {PROPIETARIOS_MOCK.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Si el propietario no está registrado, puedes{" "}
                <Link href="/clientes/nuevo" className="underline underline-offset-2">registrarlo aquí</Link>.
              </p>
            </div>
          </section>

        </div>

        {/* Divider vertical */}
        <div className="w-px bg-border shrink-0" />

        {/* Columna derecha — fotos */}
        <div className="w-80 shrink-0 overflow-y-auto px-5 py-6 space-y-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Image01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Fotografías</p>
            {fotos.length > 0 && (
              <span className="ml-auto text-xs text-muted-foreground">{fotos.length} foto{fotos.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {/* Zona de drop */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-5 flex flex-col items-center gap-2 text-center cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arrastra fotos aquí o <span className="underline underline-offset-2">haz clic para subir</span>
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG · máx. 10 MB por archivo</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={handleFotos}
          />

          {/* Grilla de previews */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {fotos.map((foto, idx) => (
                <div key={foto.url} className="relative group rounded-md overflow-hidden aspect-square bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto.url}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => eliminarFoto(foto.url)}
                    className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {fotos.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">
              La primera foto cargada será la imagen principal del inmueble.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function Required() {
  return <span className="text-red-500 ml-0.5">*</span>
}

function SectionHeader({ icon, title }: { icon: IconSvgElement; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 text-muted-foreground" />
      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
  )
}
