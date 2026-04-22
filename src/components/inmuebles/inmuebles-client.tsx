"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building04Icon,
  Location01Icon,
  FilterIcon,
  Search01Icon,
  Add01Icon,
  Home01Icon,
  Store01Icon,
  ChimneyIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type {
  TipoInmueble,
  ModalidadInmueble,
  EstadoInmueble,
} from "@/types/inmueble.types"

// ---------------------------------------------------------------------------
// Mock
// ---------------------------------------------------------------------------

interface Inmueble {
  id: string
  tipo: TipoInmueble
  modalidad: ModalidadInmueble
  direccion: string
  ubicacion: string
  area: number
  precio: number
  estado: EstadoInmueble
  publicado: boolean
  propietario: string
  fechaRegistro: string
  fotos: number
}

const INMUEBLES_MOCK: Inmueble[] = [
  {
    id: "1", tipo: "apartamento", modalidad: "arriendo",
    direccion: "Cra 15 #93-47, Apto 301 Torre A", ubicacion: "Bogotá — Chapinero",
    area: 68, precio: 2800000, estado: "arrendado",
    publicado: true, propietario: "Ana Martínez",
    fechaRegistro: "2025-01-15", fotos: 6,
  },
  {
    id: "2", tipo: "local", modalidad: "arriendo",
    direccion: "CC Plaza, Local 3", ubicacion: "Medellín — El Poblado",
    area: 120, precio: 4800000, estado: "arrendado",
    publicado: true, propietario: "Inversiones Pedraza S.A.S.",
    fechaRegistro: "2025-01-20", fotos: 4,
  },
  {
    id: "3", tipo: "apartamento", modalidad: "venta",
    direccion: "Cll 80 #45-12, Apto 502", ubicacion: "Bogotá — Barrios Unidos",
    area: 54, precio: 320000000, estado: "en_proceso_venta",
    publicado: true, propietario: "Luis Gómez",
    fechaRegistro: "2025-02-03", fotos: 8,
  },
  {
    id: "4", tipo: "casa", modalidad: "ambos",
    direccion: "Cra 7 #120-30", ubicacion: "Bogotá — Usaquén",
    area: 180, precio: 5200000, estado: "disponible",
    publicado: true, propietario: "María Ospina",
    fechaRegistro: "2025-03-10", fotos: 10,
  },
  {
    id: "5", tipo: "apartamento", modalidad: "arriendo",
    direccion: "Av. Suba #91-20, Apto 204", ubicacion: "Bogotá — Suba",
    area: 52, precio: 1900000, estado: "disponible",
    publicado: false, propietario: "Carlos Reyes",
    fechaRegistro: "2025-03-18", fotos: 0,
  },
  {
    id: "6", tipo: "local", modalidad: "arriendo",
    direccion: "Cll 50 #10-15, Local 2", ubicacion: "Cali — Granada",
    area: 90, precio: 3200000, estado: "en_mantenimiento",
    publicado: false, propietario: "Fondos Cali S.A.",
    fechaRegistro: "2025-04-01", fotos: 3,
  },
  {
    id: "7", tipo: "casa", modalidad: "venta",
    direccion: "Cra 45 #60-10", ubicacion: "Medellín — Laureles",
    area: 240, precio: 850000000, estado: "disponible",
    publicado: true, propietario: "Hernando Castro",
    fechaRegistro: "2025-04-05", fotos: 12,
  },
]

// ---------------------------------------------------------------------------
// Helpers y config
// ---------------------------------------------------------------------------

function formatCOP(value: number) {
  if (value >= 1_000_000) {
    const millones = value / 1_000_000
    return `$${millones % 1 === 0 ? millones : millones.toFixed(1)}M`
  }
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

const ESTADO_CONFIG: Record<EstadoInmueble, { label: string; className: string }> = {
  disponible:        { label: "Disponible",         className: "bg-green-100 text-green-700 border-green-200" },
  arrendado:         { label: "Arrendado",           className: "bg-blue-100 text-blue-700 border-blue-200" },
  en_proceso_venta:  { label: "En proceso de venta", className: "bg-purple-100 text-purple-700 border-purple-200" },
  vendido:           { label: "Vendido",             className: "bg-gray-100 text-gray-500 border-gray-200" },
  en_mantenimiento:  { label: "En mantenimiento",    className: "bg-amber-100 text-amber-700 border-amber-200" },
}

const TIPO_LABELS: Record<TipoInmueble, string> = {
  casa:         "Casa",
  apartamento:  "Apartamento",
  local:        "Local",
  otro:         "Otro",
}

const MODALIDAD_LABELS: Record<ModalidadInmueble, string> = {
  arriendo: "Arriendo",
  venta:    "Venta",
  ambos:    "Arriendo y venta",
}

const TIPO_ICON: Record<TipoInmueble, React.ReactNode> = {
  casa:        <HugeiconsIcon icon={Home01Icon}     strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />,
  apartamento: <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />,
  local:       <HugeiconsIcon icon={Store01Icon}    strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />,
  otro:        <HugeiconsIcon icon={ChimneyIcon}    strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />,
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function InmueblesClient() {
  const [busqueda,  setBusqueda]  = React.useState("")
  const [tipo,      setTipo]      = React.useState<TipoInmueble | "todos">("todos")
  const [modalidad, setModalidad] = React.useState<ModalidadInmueble | "todos">("todos")
  const [estado,    setEstado]    = React.useState<EstadoInmueble | "todos">("todos")

  const inmuebles = INMUEBLES_MOCK

  const filtrados = inmuebles.filter(i => {
    if (tipo      !== "todos" && i.tipo      !== tipo)      return false
    if (modalidad !== "todos" && i.modalidad !== modalidad) return false
    if (estado    !== "todos" && i.estado    !== estado)    return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (
        !i.direccion.toLowerCase().includes(q) &&
        !i.ubicacion.toLowerCase().includes(q) &&
        !i.propietario.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  // Cards de resumen
  const totalDisponibles   = inmuebles.filter(i => i.estado === "disponible").length
  const totalArrendados    = inmuebles.filter(i => i.estado === "arrendado").length
  const totalEnVenta       = inmuebles.filter(i => i.estado === "en_proceso_venta").length
  const totalMantenimiento = inmuebles.filter(i => i.estado === "en_mantenimiento").length

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Inmuebles</h1>
          <p className="text-sm text-muted-foreground">
            {inmuebles.length} inmuebles registrados
          </p>
        </div>
        <Link href="/inmuebles/nuevo">
          <Button size="sm" className="gap-1.5">
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
            Registrar inmueble
          </Button>
        </Link>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-6xl mx-auto w-full">

        {/* Cards de resumen */}
        <div className="grid grid-cols-4 gap-4">
          <SummaryCard label="Disponibles"        value={totalDisponibles}   className="border-green-200 bg-green-50"  valueClassName="text-green-700" />
          <SummaryCard label="Arrendados"          value={totalArrendados}    className="border-blue-200 bg-blue-50"    valueClassName="text-blue-700" />
          <SummaryCard label="En proceso de venta" value={totalEnVenta}       className="border-purple-200 bg-purple-50" valueClassName="text-purple-700" />
          <SummaryCard label="En mantenimiento"    value={totalMantenimiento} className="border-amber-200 bg-amber-50"  valueClassName="text-amber-700" />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por dirección, ciudad o propietario…"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.5} className="size-4 text-muted-foreground" />

            <Select value={tipo} onValueChange={v => setTipo(v as TipoInmueble | "todos")}>
              <SelectTrigger className="h-9 w-[140px] text-sm">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={modalidad} onValueChange={v => setModalidad(v as ModalidadInmueble | "todos")}>
              <SelectTrigger className="h-9 w-[160px] text-sm">
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="arriendo">Arriendo</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="ambos">Arriendo y venta</SelectItem>
              </SelectContent>
            </Select>

            <Select value={estado} onValueChange={v => setEstado(v as EstadoInmueble | "todos")}>
              <SelectTrigger className="h-9 w-[170px] text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="arrendado">Arrendado</SelectItem>
                <SelectItem value="en_proceso_venta">En proceso de venta</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="en_mantenimiento">En mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla */}
        {filtrados.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay inmuebles que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inmueble</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ubicación</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Modalidad</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Precio</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtrados.map(inmueble => {
                  const estadoCfg = ESTADO_CONFIG[inmueble.estado]
                  return (
                    <tr key={inmueble.id} className="hover:bg-muted/30 transition-colors">

                      {/* Inmueble */}
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          {TIPO_ICON[inmueble.tipo]}
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[220px]">{inmueble.direccion}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{TIPO_LABELS[inmueble.tipo]}</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">{inmueble.area} m²</span>
                              {!inmueble.publicado && (
                                <span className="text-xs text-amber-600 font-medium">No publicado</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Ubicación */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <HugeiconsIcon icon={Location01Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                          <span className="truncate max-w-[160px]">{inmueble.ubicacion}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 pl-5">{inmueble.propietario}</p>
                      </td>

                      {/* Modalidad */}
                      <td className="px-4 py-3 text-muted-foreground">
                        {MODALIDAD_LABELS[inmueble.modalidad]}
                      </td>

                      {/* Precio */}
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {formatCOP(inmueble.precio)}
                        <p className="text-xs text-muted-foreground font-normal mt-0.5">
                          {inmueble.modalidad === "venta" ? "precio" : "/ mes"}
                        </p>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={cn("text-xs", estadoCfg.className)}>
                          {estadoCfg.label}
                        </Badge>
                      </td>

                      {/* Acción */}
                      <td className="px-4 py-3 text-right">
                        <Link href={`/inmuebles/${inmueble.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            Ver detalle
                          </Button>
                        </Link>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-right">
          {filtrados.length} de {inmuebles.length} inmuebles
        </p>

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string
  value: number
  className?: string
  valueClassName?: string
}) {
  return (
    <div className={cn("border rounded-lg px-4 py-4", className)}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-2xl font-semibold tabular-nums", valueClassName)}>{value}</p>
    </div>
  )
}
