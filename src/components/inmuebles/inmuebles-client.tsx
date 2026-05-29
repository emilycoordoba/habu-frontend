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
import { listarInmuebles } from "@/lib/api/inmuebles"
import type { InmuebleResumen, TipoInmueble, ModalidadInmueble, EstadoInmueble } from "@/types/inmueble.types"
import { ESTADO_INMUEBLE_CONFIG, TIPO_INMUEBLE_LABELS, MODALIDAD_LABELS } from "@/types/inmueble.types"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const POR_PAGINA = 10

const RESUMEN_VACIO: Record<EstadoInmueble, number> = {
  disponible: 0, arrendado: 0, en_proceso_venta: 0, vendido: 0, en_mantenimiento: 0,
}

const TIPO_ICON: Record<TipoInmueble, React.ReactNode> = {
  casa:        <HugeiconsIcon icon={Home01Icon}     strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />,
  apartamento: <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />,
  local:       <HugeiconsIcon icon={Store01Icon}    strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />,
  otro:        <HugeiconsIcon icon={ChimneyIcon}    strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />,
}

function formatCOP(value: number) {
  if (value >= 1_000_000) {
    const m = value / 1_000_000
    return `$${m % 1 === 0 ? m : m.toFixed(1)}M`
  }
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function InmueblesClient() {
  const [busquedaInput, setBusquedaInput] = React.useState("")
  const [busqueda,      setBusqueda]      = React.useState("")
  const [tipo,          setTipo]          = React.useState<TipoInmueble | "todos">("todos")
  const [modalidad,     setModalidad]     = React.useState<ModalidadInmueble | "todos">("todos")
  const [estado,        setEstado]        = React.useState<EstadoInmueble | "todos">("todos")
  const [pagina,        setPagina]        = React.useState(1)

  const [inmuebles,      setInmuebles]      = React.useState<InmuebleResumen[]>([])
  const [total,          setTotal]          = React.useState(0)
  const [totalPaginas,   setTotalPaginas]   = React.useState(1)
  const [resumenEstados, setResumenEstados] = React.useState<Record<EstadoInmueble, number>>(RESUMEN_VACIO)
  const [isLoading,      setIsLoading]      = React.useState(true)
  const [error,          setError]          = React.useState<string | null>(null)

  // Debounce: espera 400 ms tras el último keystroke antes de actualizar el filtro real
  React.useEffect(() => {
    const t = setTimeout(() => { setBusqueda(busquedaInput); setPagina(1) }, 400)
    return () => clearTimeout(t)
  }, [busquedaInput])

  // Fetch al cambiar cualquier filtro o página
  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)

    listarInmuebles({
      page:  pagina,
      limit: POR_PAGINA,
      ...(busqueda         && { busqueda }),
      ...(tipo      !== "todos" && { tipo }),
      ...(modalidad !== "todos" && { modalidad }),
      ...(estado    !== "todos" && { estado }),
    })
      .then(res => {
        if (cancelado) return
        setInmuebles(res.data ?? [])
        setTotal(res.total ?? 0)
        setTotalPaginas(res.totalPaginas ?? 1)
        setResumenEstados(res.resumenEstados ?? RESUMEN_VACIO)
      })
      .catch(err => { if (!cancelado) setError((err as Error).message) })
      .finally(() => { if (!cancelado) setIsLoading(false) })

    return () => { cancelado = true }
  }, [busqueda, tipo, modalidad, estado, pagina])

  function cambiarFiltro<T>(setter: React.Dispatch<React.SetStateAction<T>>) {
    return (v: T) => { setter(v); setPagina(1) }
  }

  const paginaActual = Math.min(pagina, Math.max(1, totalPaginas))

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Inmuebles</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Cargando…" : `${total} inmuebles registrados`}
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

        {/* Cards de resumen — vienen de resumenEstados en la respuesta de la API */}
        <div className="grid grid-cols-4 gap-4">
          <SummaryCard label="Disponibles"        value={resumenEstados.disponible}       className="alert-green"  valueClassName="text-green-700  dark:text-green-300" />
          <SummaryCard label="Arrendados"          value={resumenEstados.arrendado}        className="alert-blue"   valueClassName="text-blue-700   dark:text-blue-300" />
          <SummaryCard label="En proceso de venta" value={resumenEstados.en_proceso_venta} className="alert-purple" valueClassName="text-purple-700 dark:text-purple-300" />
          <SummaryCard label="En mantenimiento"    value={resumenEstados.en_mantenimiento} className="alert-amber"  valueClassName="text-amber-700  dark:text-amber-300" />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por dirección, ciudad o propietario…"
              value={busquedaInput}
              onChange={e => setBusquedaInput(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.5} className="size-4 text-muted-foreground" />

            <Select value={tipo} onValueChange={cambiarFiltro<TipoInmueble | "todos">(setTipo)}>
              <SelectTrigger className="h-9 w-[140px] text-sm"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={modalidad} onValueChange={cambiarFiltro<ModalidadInmueble | "todos">(setModalidad)}>
              <SelectTrigger className="h-9 w-[160px] text-sm"><SelectValue placeholder="Modalidad" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="arriendo">Arriendo</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="ambos">Arriendo y venta</SelectItem>
              </SelectContent>
            </Select>

            <Select value={estado} onValueChange={cambiarFiltro<EstadoInmueble | "todos">(setEstado)}>
              <SelectTrigger className="h-9 w-[170px] text-sm"><SelectValue placeholder="Estado" /></SelectTrigger>
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

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Tabla */}
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                    </td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-2/3" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-1/2" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16 ml-auto" /></td>
                    <td className="px-4 py-4"><div className="h-5 bg-muted rounded w-20 mx-auto" /></td>
                    <td className="px-4 py-4"><div className="h-7 bg-muted rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : inmuebles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No hay inmuebles que coincidan con los filtros.</p>
                  </td>
                </tr>
              ) : (
                inmuebles.map(inmueble => {
                  const estadoCfg = ESTADO_INMUEBLE_CONFIG[inmueble.estado]
                  return (
                    <tr key={inmueble.id} className="hover:bg-muted/30 transition-colors">

                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          {TIPO_ICON[inmueble.tipo]}
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[220px]">{inmueble.direccion}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{TIPO_INMUEBLE_LABELS[inmueble.tipo]}</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">{inmueble.area} m²</span>
                              {!inmueble.publicado && (
                                <span className="text-xs text-amber-600 font-medium">No publicado</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <HugeiconsIcon icon={Location01Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                          <span className="truncate max-w-[160px]">{inmueble.ubicacion}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 pl-5">{inmueble.propietario}</p>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {MODALIDAD_LABELS[inmueble.modalidad]}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {formatCOP(inmueble.precio)}
                        <p className="text-xs text-muted-foreground font-normal mt-0.5">
                          {inmueble.modalidad === "venta" ? "precio" : "/ mes"}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={cn("text-xs", estadoCfg.className)}>
                          {estadoCfg.label}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Link href={`/inmuebles/${inmueble.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Ver detalle</Button>
                        </Link>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Cargando…" : total === 0 ? "Sin resultados" : (
                <>
                  Mostrando{" "}
                  <span className="font-medium">
                    {(paginaActual - 1) * POR_PAGINA + 1}–{Math.min(paginaActual * POR_PAGINA, total)}
                  </span>{" "}
                  de <span className="font-medium">{total}</span> inmuebles
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={paginaActual <= 1 || isLoading} onClick={() => setPagina(p => p - 1)}>
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {paginaActual} de {Math.max(1, totalPaginas)}
              </span>
              <Button variant="outline" size="sm" disabled={paginaActual >= totalPaginas || isLoading} onClick={() => setPagina(p => p + 1)}>
                Siguiente
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function SummaryCard({
  label, value, className, valueClassName,
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
