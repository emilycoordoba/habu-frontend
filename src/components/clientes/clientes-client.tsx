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
import { CLIENTES_MOCK } from "@/lib/mock/clientes"
import type { TipoCliente } from "@/types/cliente.types"
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

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function ClientesClient() {
  const [busqueda, setBusqueda] = React.useState("")
  const [tipoFiltro, setTipoFiltro] = React.useState<TipoCliente | "todos">("todos")

  const clientes = CLIENTES_MOCK

  const filtrados = clientes.filter(c => {
    if (tipoFiltro !== "todos" && !c.tipos.includes(tipoFiltro)) return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (
        !c.nombre.toLowerCase().includes(q) &&
        !c.documento.replace(/\./g, "").includes(q.replace(/\./g, "")) &&
        !c.email.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  const totalPropietarios  = clientes.filter(c => c.tipos.includes("propietario")).length
  const totalArrendatarios = clientes.filter(c => c.tipos.includes("arrendatario")).length
  const totalProspectos    = clientes.filter(c => c.tipos.includes("prospecto")).length
  const totalCodeudores    = clientes.filter(c => c.tipos.includes("codeudor")).length

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {clientes.length} clientes registrados
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
            label="Propietarios"
            value={totalPropietarios}
            icon={ShieldUserIcon}
            className="border-blue-200 bg-blue-50"
            valueClassName="text-blue-700"
            iconClassName="text-blue-400"
          />
          <SummaryCard
            label="Arrendatarios"
            value={totalArrendatarios}
            icon={UserIcon}
            className="border-green-200 bg-green-50"
            valueClassName="text-green-700"
            iconClassName="text-green-400"
          />
          <SummaryCard
            label="Prospectos"
            value={totalProspectos}
            icon={Search01Icon}
            className="border-amber-200 bg-amber-50"
            valueClassName="text-amber-700"
            iconClassName="text-amber-400"
          />
          <SummaryCard
            label="Codeudores"
            value={totalCodeudores}
            icon={UserAdd01Icon}
            className="border-purple-200 bg-purple-50"
            valueClassName="text-purple-700"
            iconClassName="text-purple-400"
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
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.5} className="size-4 text-muted-foreground" />
            <Select value={tipoFiltro} onValueChange={v => setTipoFiltro(v as TipoCliente | "todos")}>
              <SelectTrigger className="h-9 w-[180px] text-sm">
                <SelectValue placeholder="Tipo de cliente" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TIPO_FILTRO_LABEL) as (TipoCliente | "todos")[]).map(key => (
                  <SelectItem key={key} value={key}>
                    {TIPO_FILTRO_LABEL[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla */}
        {filtrados.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay clientes que coincidan con la búsqueda.</p>
          </div>
        ) : (
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
                {filtrados.map(cliente => (
                  <tr key={cliente.id} className="hover:bg-muted/30 transition-colors">

                    {/* Cliente */}
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

                    {/* Documento */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground mr-1">{cliente.tipoDocumento}</span>
                      <span className="tabular-nums">{cliente.documento}</span>
                    </td>

                    {/* Contacto */}
                    <td className="px-4 py-3">
                      <p className="truncate max-w-[180px]">{cliente.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cliente.telefono}</p>
                    </td>

                    {/* Roles */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {cliente.tipos.map(tipo => {
                          const cfg = TIPO_CLIENTE_CONFIG[tipo]
                          return (
                            <Badge
                              key={tipo}
                              variant="outline"
                              className={cn("text-xs", cfg.className)}
                            >
                              {cfg.label}
                            </Badge>
                          )
                        })}
                      </div>
                    </td>

                    {/* Acción */}
                    <td className="px-4 py-3 text-right">
                      <Link href={`/clientes/${cliente.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Ver detalle
                        </Button>
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-right">
          {filtrados.length} de {clientes.length} clientes
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
  icon,
  className,
  valueClassName,
  iconClassName,
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
