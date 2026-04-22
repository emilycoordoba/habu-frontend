"use client"

import * as React from "react"
import dynamic from "next/dynamic"
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
  ArrowDown01Icon,
  CheckmarkCircle02Icon,
  UserAdd01Icon,
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { TipoInmueble, ModalidadInmueble, EstadoInmueble } from "@/types/inmueble.types"
import { RegistrarClienteDialog } from "@/components/contratos/registrar-cliente-dialog"

// Carga el mapa solo en el cliente (Leaflet no funciona con SSR)
const MapaInmueble = dynamic(
  () => import("./mapa-inmueble").then(m => m.MapaInmueble),
  {
    ssr: false,
    loading: () => <div className="w-full h-48 rounded-lg bg-muted animate-pulse" />,
  }
)

// ---------------------------------------------------------------------------
// Mock propietarios
// ---------------------------------------------------------------------------

const PROPIETARIOS_INICIALES = [
  { id: "p-1", nombre: "Ana Martínez" },
  { id: "p-2", nombre: "Inversiones Pedraza S.A.S." },
  { id: "p-3", nombre: "Luis Gómez" },
  { id: "p-4", nombre: "María Ospina" },
  { id: "p-5", nombre: "Carlos Reyes" },
  { id: "p-6", nombre: "Fondos Cali S.A." },
  { id: "p-7", nombre: "Hernando Castro" },
]

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

// Una foto puede ser existente (cargada del backend, tiene id) o nueva (File local).
// Ambas comparten `url` — la existente apunta al recurso remoto, la nueva es un ObjectURL.
type FotoPreview =
  | { kind: "existente"; id: string; url: string; descripcion?: string }
  | { kind: "nueva"; file: File; url: string }

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

export interface RegistrarInmuebleInitialData {
  tipo: TipoInmueble
  modalidad: ModalidadInmueble
  estado: EstadoInmueble
  publicado: boolean
  direccion: string
  ubicacion: string
  area: number
  precio: number
  propietarioId: string
  propietarioNombre: string
  coordenadas?: [number, number]
  fotos: Array<{ id: string; url: string; descripcion?: string }>
}

interface RegistrarInmuebleClientProps {
  mode?: "crear" | "editar"
  inmuebleId?: string
  initialData?: RegistrarInmuebleInitialData
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function RegistrarInmuebleClient({
  mode = "crear",
  inmuebleId,
  initialData,
}: RegistrarInmuebleClientProps = {}) {
  const esEdicion = mode === "editar"

  const [form, setForm] = React.useState<FormState>(() =>
    initialData
      ? {
          tipo:          initialData.tipo,
          modalidad:     initialData.modalidad,
          estado:        initialData.estado,
          publicado:     initialData.publicado,
          direccion:     initialData.direccion,
          ubicacion:     initialData.ubicacion,
          area:          String(initialData.area),
          precio:        String(initialData.precio),
          propietarioId: initialData.propietarioId,
        }
      : {
          tipo:          "",
          modalidad:     "",
          estado:        "disponible",
          publicado:     true,
          direccion:     "",
          ubicacion:     "",
          area:          "",
          precio:        "",
          propietarioId: "",
        }
  )

  // Si estamos editando, inyectamos el propietario actual por si no está en la lista cargada
  const propietariosIniciales = React.useMemo(() => {
    if (!initialData) return PROPIETARIOS_INICIALES
    const yaEsta = PROPIETARIOS_INICIALES.some(p => p.id === initialData.propietarioId)
    return yaEsta
      ? PROPIETARIOS_INICIALES
      : [...PROPIETARIOS_INICIALES, { id: initialData.propietarioId, nombre: initialData.propietarioNombre }]
  }, [initialData])

  const [propietarios, setPropietarios]         = React.useState(propietariosIniciales)
  const [fotos, setFotos] = React.useState<FotoPreview[]>(() =>
    initialData?.fotos.map(f => ({ kind: "existente" as const, id: f.id, url: f.url, descripcion: f.descripcion })) ?? []
  )
  const [fotosEliminadas, setFotosEliminadas]   = React.useState<string[]>([])
  const [propietarioOpen, setPropietarioOpen]   = React.useState(false)
  const [registrarOpen, setRegistrarOpen]       = React.useState(false)
  const [fotoAmpliada, setFotoAmpliada]         = React.useState<string | null>(null)
  const [coordenadas, setCoordenadas]           = React.useState<[number, number] | null>(
    initialData?.coordenadas ?? null
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Limpia ObjectURLs solo de fotos NUEVAS al desmontar; las existentes son URLs remotas
  React.useEffect(() => {
    return () => fotos.forEach(f => { if (f.kind === "nueva") URL.revokeObjectURL(f.url) })
  }, [fotos])

  // Geocodifica la dirección con Nominatim cuando cambian dirección o ciudad (debounced 800ms)
  React.useEffect(() => {
    const query = [form.direccion, form.ubicacion].filter(Boolean).join(", ")
    if (!query) return

    const timeout = setTimeout(async () => {
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", Colombia")}&format=json&limit=1`,
          { headers: { "Accept-Language": "es" } }
        )
        const data = await res.json() as { lat: string; lon: string }[]
        if (data[0]) setCoordenadas([parseFloat(data[0].lat), parseFloat(data[0].lon)])
      } catch {
        // Falla silenciosamente — el mapa simplemente no mueve el pin
      }
    }, 800)

    return () => clearTimeout(timeout)
  }, [form.direccion, form.ubicacion])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setFotos(prev => [
      ...prev,
      ...files.map(file => ({ kind: "nueva" as const, file, url: URL.createObjectURL(file) })),
    ])
    e.target.value = ""
  }

  function eliminarFoto(url: string) {
    setFotos(prev => {
      const foto = prev.find(f => f.url === url)
      if (foto?.kind === "nueva") {
        URL.revokeObjectURL(foto.url)
      } else if (foto?.kind === "existente") {
        // Marca la foto para borrar en backend al guardar
        setFotosEliminadas(prevIds => [...prevIds, foto.id])
      }
      return prev.filter(f => f.url !== url)
    })
  }

  function handlePropietarioRegistrado({ nombre }: { nombre: string; identificacion: string }) {
    const nuevoId = `p-nuevo-${Date.now()}`
    setPropietarios(prev => [...prev, { id: nuevoId, nombre }])
    setField("propietarioId", nuevoId)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
    setFotos(prev => [
      ...prev,
      ...files.map(file => ({ kind: "nueva" as const, file, url: URL.createObjectURL(file) })),
    ])
  }

  const propietarioNombre = propietarios.find(p => p.id === form.propietarioId)?.nombre

  const precioLabel = form.modalidad === "venta"   ? "Precio de venta"
                    : form.modalidad === "arriendo" ? "Canon mensual"
                    : "Precio"
  const precioHint  = form.modalidad === "venta"   ? "Precio total pactado"
                    : form.modalidad === "arriendo" ? "Valor mensual del arriendo"
                    : "Ingresa la modalidad para saber el tipo de precio"

  const puedeGuardar =
    form.tipo !== "" && form.modalidad !== "" &&
    form.direccion.trim() !== "" && form.ubicacion.trim() !== "" &&
    form.area.trim() !== "" && form.precio.trim() !== "" &&
    form.propietarioId !== ""

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4 shrink-0">
        <Link href={esEdicion && inmuebleId ? `/inmuebles/${inmuebleId}` : "/inmuebles"}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">
            {esEdicion ? "Editar inmueble" : "Registrar inmueble"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {esEdicion ? "Actualiza la información del inmueble" : "Completa la información del inmueble"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={esEdicion && inmuebleId ? `/inmuebles/${inmuebleId}` : "/inmuebles"}>
            <Button variant="outline" size="sm">Cancelar</Button>
          </Link>
          <Button size="sm" disabled={!puedeGuardar}>
            {esEdicion ? "Guardar cambios" : "Guardar inmueble"}
          </Button>
        </div>
      </div>

      {/* Cuerpo — dos columnas centradas */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex max-w-[960px] mx-auto w-full">

          {/* Columna izquierda — formulario */}
          <div className="flex-1 px-6 py-6 pb-12 space-y-8 min-w-0">

            {/* Información básica */}
            <section className="space-y-4">
              <SectionHeader icon={Building04Icon} title="Información básica" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 w-full">
                  <Label>Tipo de inmueble <Required /></Label>
                  <Select value={form.tipo} onValueChange={v => setField("tipo", v as TipoInmueble)}>
                    <SelectTrigger className="w-full">
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

                <div className="space-y-1.5 w-full">
                  <Label>Modalidad <Required /></Label>
                  <Select value={form.modalidad} onValueChange={v => setField("modalidad", v as ModalidadInmueble)}>
                    <SelectTrigger className="w-full">
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
                <div className="space-y-1.5 w-full">
                  <Label>Estado inicial</Label>
                  <Select value={form.estado} onValueChange={v => {
                    const nuevoEstado = v as EstadoInmueble
                    setForm(prev => ({
                      ...prev,
                      estado: nuevoEstado,
                      publicado: nuevoEstado === "disponible" ? prev.publicado : false,
                    }))
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="en_mantenimiento">En mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">El sistema cambia el estado al activar un contrato.</p>
                </div>

                <div className="space-y-1.5 w-full">
                  <Label>Publicación en portal</Label>
                  <button
                    type="button"
                    disabled={form.estado !== "disponible"}
                    onClick={() => setField("publicado", !form.publicado)}
                    className={cn(
                      "w-full min-h-9 rounded-md border px-3 py-2 text-sm text-left flex items-center gap-2 transition-colors",
                      form.estado !== "disponible"
                        ? "border-gray-200 bg-muted/50 text-muted-foreground opacity-50 cursor-not-allowed"
                        : form.publicado
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-gray-200 bg-muted/30 text-muted-foreground"
                    )}
                  >
                    <span className={cn(
                      "size-2 rounded-full shrink-0",
                      form.estado !== "disponible" ? "bg-gray-300" : form.publicado ? "bg-green-500" : "bg-gray-300"
                    )} />
                    {form.estado !== "disponible"
                      ? "No disponible en este estado"
                      : form.publicado ? "Publicado en el portal" : "No publicado"}
                  </button>
                </div>
              </div>
            </section>

            <Separator />

            {/* Ubicación */}
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

              {/* Mapa */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">
                  {coordenadas
                    ? "Ubicación encontrada. Puedes verificar el pin en el mapa."
                    : "El pin aparecerá automáticamente al ingresar la dirección y ciudad."}
                </p>
                <MapaInmueble coordenadas={coordenadas} />
              </div>
            </section>

            <Separator />

            {/* Detalles */}
            <section className="space-y-4">
              <SectionHeader icon={SquareIcon} title="Detalles del inmueble" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 w-full">
                  <Label>Área (m²) <Required /></Label>
                  <Input
                    type="number"
                    placeholder="Ej: 68"
                    min={1}
                    value={form.area}
                    onChange={e => setField("area", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 w-full">
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
                  <p className="text-xs text-muted-foreground">{precioHint}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Propietario */}
            <section className="space-y-4">
              <SectionHeader icon={UserIcon} title="Propietario" />

              <div className="space-y-1.5">
                <Label>Propietario <Required /></Label>
                <Popover open={propietarioOpen} onOpenChange={setPropietarioOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between font-normal text-left">
                      <span className={cn("truncate", !propietarioNombre && "text-muted-foreground")}>
                        {propietarioNombre ?? "Buscar propietario…"}
                      </span>
                      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar propietario…" />
                      <CommandList>
                        <CommandEmpty>No se encontró ningún propietario.</CommandEmpty>
                        <CommandGroup>
                          {propietarios.map(p => (
                            <CommandItem
                              key={p.id}
                              value={p.nombre}
                              onSelect={() => { setField("propietarioId", p.id); setPropietarioOpen(false) }}
                            >
                              <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                strokeWidth={2}
                                className={cn("size-4 mr-2", form.propietarioId === p.id ? "opacity-100" : "opacity-0")}
                              />
                              {p.nombre}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <div className="border-t p-1">
                      <button
                        onClick={() => { setPropietarioOpen(false); setRegistrarOpen(true) }}
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-primary hover:bg-accent transition-colors"
                      >
                        <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4 shrink-0" />
                        <span className="font-medium">Registrar nuevo propietario</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </section>

          </div>

          {/* Divider vertical */}
          <div className="w-px bg-border shrink-0" />

          {/* Columna derecha — fotos */}
          <div className="w-80 shrink-0 px-5 py-6 pb-12 space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Image01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Fotografías</p>
              {fotos.length > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">{fotos.length} foto{fotos.length !== 1 ? "s" : ""}</span>
              )}
            </div>

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

            <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={handleFotos} />

            {fotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {fotos.map((foto, idx) => (
                  <div
                    key={foto.url}
                    className="relative group rounded-md overflow-hidden aspect-square bg-muted cursor-zoom-in"
                    onClick={() => setFotoAmpliada(foto.url)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={foto.url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); eliminarFoto(foto.url) }}
                      className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center">
                La primera foto cargada será la imagen principal del inmueble.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Modal registrar propietario */}
      <RegistrarClienteDialog
        open={registrarOpen}
        onOpenChange={setRegistrarOpen}
        labelRol="Propietario"
        onClienteRegistrado={handlePropietarioRegistrado}
      />

      {/* Lightbox */}
      <Dialog open={fotoAmpliada !== null} onOpenChange={() => setFotoAmpliada(null)}>
        <DialogContent className="max-w-3xl p-2 bg-black/90 border-0">
          {fotoAmpliada && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoAmpliada}
              alt="Vista ampliada"
              className="w-full rounded-md object-contain max-h-[85vh]"
            />
          )}
        </DialogContent>
      </Dialog>

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
