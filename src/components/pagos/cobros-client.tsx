"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Alert02Icon,
  MoneyReceive02Icon,
  EyeIcon,
  FileAttachmentIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TipoCobro } from "@/types/contrato.types"
import type { IconSvgElement } from "@hugeicons/react"

// ---------------------------------------------------------------------------
// Tipos y mocks
// ---------------------------------------------------------------------------

type EstadoCobro = "pendiente" | "pagado" | "en_mora"

interface Cobro {
  id: string
  tipo: TipoCobro
  periodo?: string        // e.g. "Mayo 2025" — solo para cobros mensuales
  fechaLimite: string
  valor: number
  estado: EstadoCobro
  diasMora?: number       // solo si en_mora
  tieneComprobante?: boolean
  pagadoConMora?: number  // días de mora al momento del pago — solo si estado === "pagado"
}

interface ContratoResumen {
  id: string
  referencia: string
  inmueble: string
  tipo: "arriendo" | "promesa_compraventa"
  esComercial: boolean    // determina si aplican intereses de mora
}

const CONTRATO_MOCK: ContratoResumen = {
  id: "1",
  referencia: "CTR-2025-001",
  inmueble: "Apto 301 Torre A — Cra 15 #93-47, Bogotá",
  tipo: "arriendo",
  esComercial: false,
}

const COBROS_MOCK: Cobro[] = [
  { id: "c-01", tipo: "deposito",             fechaLimite: "2025-02-01", valor: 5600000,  estado: "pagado",    tieneComprobante: true },
  { id: "c-02", tipo: "comision_colocacion",  fechaLimite: "2025-02-01", valor: 2800000,  estado: "pagado",    tieneComprobante: true },
  { id: "c-03", tipo: "canon",  periodo: "Febrero 2025",  fechaLimite: "2025-02-05", valor: 2800000,  estado: "pagado",    tieneComprobante: true },
  { id: "c-04", tipo: "comision_administracion", periodo: "Febrero 2025", fechaLimite: "2025-02-05", valor: 320000, estado: "pagado", tieneComprobante: true },
  { id: "c-05", tipo: "canon",  periodo: "Marzo 2025",    fechaLimite: "2025-03-05", valor: 2800000,  estado: "pagado",    tieneComprobante: true, pagadoConMora: 12 },
  { id: "c-06", tipo: "comision_administracion", periodo: "Marzo 2025",  fechaLimite: "2025-03-05", valor: 320000, estado: "pagado", tieneComprobante: true, pagadoConMora: 12 },
  { id: "c-07", tipo: "canon",  periodo: "Abril 2025",    fechaLimite: "2025-04-05", valor: 2800000,  estado: "en_mora",   diasMora: 10 },
  { id: "c-08", tipo: "comision_administracion", periodo: "Abril 2025",  fechaLimite: "2025-04-05", valor: 320000, estado: "en_mora", diasMora: 10 },
  { id: "c-09", tipo: "canon",  periodo: "Mayo 2025",     fechaLimite: "2025-05-05", valor: 2800000,  estado: "pendiente" },
  { id: "c-10", tipo: "comision_administracion", periodo: "Mayo 2025",   fechaLimite: "2025-05-05", valor: 320000, estado: "pendiente" },
  { id: "c-11", tipo: "canon",  periodo: "Junio 2025",    fechaLimite: "2025-06-05", valor: 2800000,  estado: "pendiente" },
  { id: "c-12", tipo: "comision_administracion", periodo: "Junio 2025",  fechaLimite: "2025-06-05", valor: 320000, estado: "pendiente" },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCOP(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

const TIPO_LABELS: Record<TipoCobro, string> = {
  canon:                   "Canon mensual",
  comision_administracion: "Comisión administración",
  comision_colocacion:     "Comisión de colocación",
  arras:                   "Arras",
  deposito:                "Depósito de garantía",
  penalizacion:            "Penalización",
  precio_venta:            "Precio de venta",
}

const ESTADO_CONFIG: Record<EstadoCobro, { label: string; className: string; icon: IconSvgElement }> = {
  pendiente: { label: "Pendiente", className: "bg-gray-100 text-gray-600 border-gray-200",    icon: Clock01Icon },
  pagado:    { label: "Pagado",    className: "bg-green-100 text-green-700 border-green-200", icon: CheckmarkCircle02Icon },
  en_mora:   { label: "En mora",   className: "bg-red-100 text-red-700 border-red-200",       icon: Alert02Icon },
}

type FiltroEstado = "todos" | EstadoCobro

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

interface CobrosClientProps {
  contratoId: string
}

export function CobrosClient({ contratoId }: CobrosClientProps) {
  const contrato = { ...CONTRATO_MOCK, id: contratoId }
  const [filtro, setFiltro] = React.useState<FiltroEstado>("todos")

  const cobros = COBROS_MOCK

  // Totales para las cards de resumen
  const totalPendiente = cobros.filter(c => c.estado === "pendiente").reduce((s, c) => s + c.valor, 0)
  const totalPagado    = cobros.filter(c => c.estado === "pagado").reduce((s, c) => s + c.valor, 0)
  const totalMora      = cobros.filter(c => c.estado === "en_mora").reduce((s, c) => s + c.valor, 0)
  const countMora      = cobros.filter(c => c.estado === "en_mora").length

  const cobrosFiltrados = filtro === "todos" ? cobros : cobros.filter(c => c.estado === filtro)

  const FILTROS: { value: FiltroEstado; label: string; count: number }[] = [
    { value: "todos",     label: "Todos",      count: cobros.length },
    { value: "pendiente", label: "Pendientes", count: cobros.filter(c => c.estado === "pendiente").length },
    { value: "en_mora",   label: "En mora",    count: countMora },
    { value: "pagado",    label: "Pagados",    count: cobros.filter(c => c.estado === "pagado").length },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <Link href={`/contratos/${contrato.id}`}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Cobros del contrato</h1>
          <p className="text-sm text-muted-foreground truncate">{contrato.referencia} · {contrato.inmueble}</p>
        </div>
        <Link href={`/contratos/${contrato.id}/estado-cuenta`}>
          <Button variant="outline" size="sm">Estado de cuenta</Button>
        </Link>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-5xl mx-auto w-full">

        {/* Cards de resumen */}
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            label="Pendiente de pago"
            value={formatCOP(totalPendiente)}
            className="border-gray-200"
            valueClassName="text-gray-800"
          />
          <SummaryCard
            label={`En mora${countMora > 0 ? ` (${countMora} cobro${countMora > 1 ? "s" : ""})` : ""}`}
            value={formatCOP(totalMora)}
            className={countMora > 0 ? "border-red-200 bg-red-50" : "border-gray-200"}
            valueClassName={countMora > 0 ? "text-red-700" : "text-gray-800"}
          />
          <SummaryCard
            label="Total pagado"
            value={formatCOP(totalPagado)}
            className="border-green-200 bg-green-50"
            valueClassName="text-green-700"
          />
        </div>

        {/* Aviso inmueble residencial */}
        {!contrato.esComercial && countMora > 0 && (
          <div className="flex items-start gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2.5">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 shrink-0 mt-0.5" />
            <span>Inmueble residencial — los cobros en mora <strong>no generan intereses</strong> según la Ley 820 de 2003.</span>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-1 border-b">
          {FILTROS.map(f => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2",
                filtro === f.value
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              <span className={cn(
                "text-xs rounded-full px-1.5 py-0.5 font-normal",
                filtro === f.value ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Concepto</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Período</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha límite</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Valor</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {cobrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    No hay cobros en este estado.
                  </td>
                </tr>
              ) : (
                cobrosFiltrados.map(cobro => {
                  const estadoCfg = ESTADO_CONFIG[cobro.estado]
                  return (
                    <tr key={cobro.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        {TIPO_LABELS[cobro.tipo]}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {cobro.periodo ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {cobro.fechaLimite}
                        {cobro.diasMora != null && cobro.diasMora > 0 && (
                          <p className="text-xs text-red-600 mt-0.5">{cobro.diasMora} días en mora</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {formatCOP(cobro.valor)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                        <Badge
                          variant="outline"
                          className={cn("gap-1 text-xs", estadoCfg.className)}
                        >
                          <HugeiconsIcon icon={estadoCfg.icon} strokeWidth={2} className="size-3" />
                          {estadoCfg.label}
                        </Badge>
                        {cobro.pagadoConMora != null && cobro.pagadoConMora > 0 && (
                          <span className="text-xs text-amber-600 flex items-center gap-1">
                            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3" />
                            {cobro.pagadoConMora} días de mora
                          </span>
                        )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {cobro.estado === "pagado" ? (
                          cobro.tieneComprobante && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
                              <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3.5" />
                              Ver comprobante
                            </Button>
                          )
                        ) : (
                          <Link href={`/contratos/${contrato.id}/cobros/${cobro.id}/pagar`}>
                            <Button size="sm" className="h-7 text-xs gap-1.5">
                              <HugeiconsIcon icon={MoneyReceive02Icon} strokeWidth={2} className="size-3.5" />
                              Registrar pago
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

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
  value: string
  className?: string
  valueClassName?: string
}) {
  return (
    <div className={cn("border rounded-lg px-4 py-4", className)}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-xl font-semibold tabular-nums", valueClassName)}>{value}</p>
    </div>
  )
}
