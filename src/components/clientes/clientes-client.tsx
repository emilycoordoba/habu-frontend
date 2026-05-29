"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  UserIcon,
  Building04Icon,
  Search01Icon,
  FilterIcon,
  Add01Icon,
  UserAdd01Icon,
  ShieldUserIcon,
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
import { listarClientes } from "@/lib/api/clientes"
import type { ClienteResumen, TipoCliente } from "@/types/cliente.types"
import { TIPO_CLIENTE_CONFIG } from "@/types/cliente.types"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TIPO_FILTRO_LABEL: Record<TipoCliente | "todos", string> = {
  todos:        "Todos los tipos",
  propietario:  "Propietarios",
  arrendatario: "Arrendatarios",
  prospecto:    "Prospectos",
  codeudor:     "Codeudores",
}

const POR_PAGINA = 10

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function ClientesClient() {
  const [busquedaInput,      setBusquedaInput]      = React.useState("")
  const [busqueda,           setBusqueda]            = React.useState("")
  const [tipoFiltro,         setTipoFiltro]          = React.useState<TipoCliente | "todos">("todos")
  const [tipoPersonaFiltro,  setTipoPersonaFiltro]   = React.useState<"todos" | "natural" | "juridica">("todos")
  const [pagina,             setPagina]              = React.useState(1)

  const [clientes,     setClientes]     = React.useState<ClienteResumen[]>([])
  const [total,        setTotal]        = React.useState(0)
  const [totalPaginas, setTotalPaginas] = React.useState(1)
  const [isLoading,    setIsLoading]    = React.useState(true)
  const [error,        setError]        = React.useState<string | null>(null)

  // Conteos para las cards de resumen — llamadas independientes al montar
  const [conteos, setConteos] = React.useState({ propietario: 0, arrendatario: 0, prospecto: 0, codeudor: 0 })

  React.useEffect(() => {
    Promise.all([
      listarClientes({ tipo: "propietario",  limit: 1 }),
      listarClientes({ tipo: "arrendatario", limit: 1 }),
      listarClientes({ tipo: "prospecto",    limit: 1 }),
      listarClientes({ tipo: "codeudor",     limit: 1 }),
    ]).then(([prop, arr, pros, cod]) => {
      setConteos({
        propietario:  prop.total ?? 0,
        arrendatario: arr.total ?? 0,
        prospecto:    pros.total ?? 0,
        codeudor:     cod.total ?? 0,
      })
    }).catch(() => {}) // los conteos son decorativos, un fallo no bloquea la tabla
  }, [])

  // Debounce búsqueda
  React.useEffect(() => {
    const t = setTimeout(() => { setBusqueda(busquedaInput); setPagina(1) }, 400)
    return () => clearTimeout(t)
  }, [busquedaInput])

  // Fetch al cambiar filtros o página
  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)

    listarClientes({
      page:  pagina,
      limit: POR_PAGINA,
      ...(busqueda                     && { busqueda }),
      ...(tipoFiltro !== "todos"       && { tipo: tipoFiltro }),
      ...(tipoPersonaFiltro !== "todos" && { tipoPersona: tipoPersonaFiltro }),
    })
      .then(res => {
        if (cancelado) return
        setClientes(res.data ?? [])
        setTotal(res.total ?? 0)
        setTotalPaginas(res.totalPaginas ?? 1)
      })
      .catch(err => { if (!cancelado) setError((err as Error).message) })
      .finally(() => { if (!cancelado) setIsLoading(false) })

    return () => { cancelado = true }
  }, [busqueda, tipoFiltro, tipoPersonaFiltro, pagina])

  const paginaActual = Math.min(pagina, Math.max(1, totalPaginas))

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Cargando…" : `${total} clientes registrados`}
          </p>
        </div>
        <Link href="/clientes/nuevo">
          <Button size="sm" className="gap-1.5">
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
            Registrar cliente
          </Button>
        </Link>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-6xl mx-auto w-full">

        {/* Cards de resumen */}
        <div className="grid grid-cols-4 gap-4">
          <SummaryCard
            label="Propietarios"  value={conteos.propietario}
            icon={ShieldUserIcon} className="alert-blue"
            valueClassName="text-blue-700 dark:text-blue-300"
            iconClassName="text-blue-400 dark:text-blue-500"
          />
          <SummaryCard
            label="Arrendatarios" value={conteos.arrendatario}
            icon={UserIcon}       className="alert-green"
            valueClassName="text-green-700 dark:text-green-300"
            iconClassName="text-green-400 dark:text-green-500"
          />
          <SummaryCard
            label="Prospectos"    value={conteos.prospecto}
            icon={Search01Icon}   className="alert-amber"
            valueClassName="text-amber-700 dark:text-amber-300"
            iconClassName="text-amber-400 dark:text-amber-500"
          />
          <SummaryCard
            label="Codeudores"    value={conteos.codeudor}
            icon={UserAdd01Icon}  className="alert-purple"
            valueClassName="text-purple-700 dark:text-purple-300"
            iconClassName="text-purple-400 dark:text-purple-500"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            />
            <Input
              placeholder="Buscar por nombre, documento o email…"
              value={busquedaInput}
              onChange={e => setBusquedaInput(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.5} className="size-4 text-muted-foreground" />

            <Select value={tipoPersonaFiltro} onValueChange={v => { setTipoPersonaFiltro(v as "todos" | "natural" | "juridica"); setPagina(1) }}>
              <SelectTrigger className="h-9 w-[160px] text-sm"><SelectValue placeholder="Tipo de persona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Natural y jurídica</SelectItem>
                <SelectItem value="natural">Persona natural</SelectItem>
                <SelectItem value="juridica">Persona jurídica</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tipoFiltro} onValueChange={v => { setTipoFiltro(v as TipoCliente | "todos"); setPagina(1) }}>
              <SelectTrigger className="h-9 w-[175px] text-sm"><SelectValue placeholder="Tipo de cliente" /></SelectTrigger>
              <SelectContent>
                {(Object.keys(TIPO_FILTRO_LABEL) as (TipoCliente | "todos")[]).map(key => (
                  <SelectItem key={key} value={key}>{TIPO_FILTRO_LABEL[key]}</SelectItem>
                ))}
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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Documento</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contacto</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Roles</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/3 mt-2" />
                    </td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-1/2" /></td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-1/3 mt-2" />
                    </td>
                    <td className="px-4 py-4"><div className="h-5 bg-muted rounded w-20" /></td>
                    <td className="px-4 py-4"><div className="h-7 bg-muted rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-muted-foreground">
                    <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No hay clientes que coincidan con la búsqueda.</p>
                  </td>
                </tr>
              ) : (
                clientes.map(cliente => (
                  <tr key={cliente.id} className="hover:bg-muted/30 transition-colors">

                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          <HugeiconsIcon
                            icon={cliente.tipoPersona === "natural" ? UserIcon : Building04Icon}
                            strokeWidth={1.5}
                            className="size-4 text-muted-foreground"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className={cn("font-medium truncate max-w-[220px]", !cliente.activo && "text-muted-foreground")}>
                            {cliente.nombre}
                            {!cliente.activo && (
                              <span className="ml-2 text-xs font-normal text-muted-foreground">(inactivo)</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {cliente.tipoPersona === "natural" ? "Persona natural" : "Persona jurídica"}
                            {cliente.representanteLegal && ` · Rep. legal: ${cliente.representanteLegal}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground mr-1">{cliente.tipoDocumento}</span>
                      <span className="tabular-nums">{cliente.documento}</span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="truncate max-w-[180px]">{cliente.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cliente.telefono}</p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {cliente.tipos.map(tipo => {
                          const cfg = TIPO_CLIENTE_CONFIG[tipo]
                          return (
                            <Badge key={tipo} variant="outline" className={cn("text-xs", cfg.className)}>
                              {cfg.label}
                            </Badge>
                          )
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link href={`/clientes/${cliente.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">Ver detalle</Button>
                      </Link>
                    </td>

                  </tr>
                ))
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
                  de <span className="font-medium">{total}</span> clientes
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
  label, value, icon, className, valueClassName, iconClassName,
}: {
  label: string
  value: number
  icon: IconSvgElement
  className?: string
  valueClassName?: string
  iconClassName?: string
}) {
  return (
    <div className={cn("border rounded-lg px-4 py-4 flex items-start justify-between", className)}>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={cn("text-2xl font-semibold tabular-nums", valueClassName)}>{value}</p>
      </div>
      <HugeiconsIcon icon={icon} strokeWidth={1.5} className={cn("size-5 mt-0.5", iconClassName)} />
    </div>
  )
}
