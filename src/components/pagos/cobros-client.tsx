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
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { listarCobros, obtenerContrato } from "@/lib/api/contratos"
import type { Cobro, EstadoCobro } from "@/types/pago.types"
import type { TipoCobro } from "@/types/contrato.types"
import type { IconSvgElement } from "@hugeicons/react"

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
  pendiente: { label: "Pendiente", className: "badge-gray",  icon: Clock01Icon },
  pagado:    { label: "Pagado",    className: "badge-green", icon: CheckmarkCircle02Icon },
  en_mora:   { label: "En mora",   className: "badge-red",   icon: Alert02Icon },
}

type FiltroEstado = "todos" | EstadoCobro

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function CobrosClientSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-y-auto animate-pulse">
      <div className="border-b px-6 py-4 h-16 bg-muted/30" />
      <div className="px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="border rounded-lg h-20 bg-muted/40" />
          ))}
        </div>
        <div className="h-8 bg-muted/40 rounded" />
        <div className="border rounded-lg overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-12 border-b bg-muted/20" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

interface CobrosClientProps {
  contratoId: string
}

export function CobrosClient({ contratoId }: CobrosClientProps) {
  const [cobros, setCobros] = React.useState<Cobro[]>([])
  const [resumen, setResumen] = React.useState({ totalPendiente: 0, totalEnMora: 0, totalPagado: 0 })
  const [contratoInfo, setContratoInfo] = React.useState({ referencia: "", inmueble: "" })
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)
  const [filtro, setFiltro] = React.useState<FiltroEstado>("todos")

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)

    Promise.all([
      listarCobros(contratoId, { limit: 100 }),
      obtenerContrato(contratoId),
    ])
      .then(([cobrosRes, contratoRes]) => {
        if (cancelado) return
        setCobros(cobrosRes.data)
        setResumen(cobrosRes.resumen)
        const c = contratoRes.data
        setContratoInfo({
          referencia: c.referencia,
          inmueble: `${c.inmueble.nombre} — ${c.inmueble.direccion}`,
        })
      })
      .catch(() => {
        if (!cancelado) setError("No se pudieron cargar los cobros del contrato.")
      })
      .finally(() => {
        if (!cancelado) setIsLoading(false)
      })

    return () => { cancelado = true }
  }, [contratoId, retryKey])

  if (isLoading) return <CobrosClientSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={() => setRetryKey(k => k + 1)} className="gap-2">
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const esResidencial = cobros.length > 0 ? cobros[0].esInmuebleResidencial : true
  const countMora = cobros.filter(c => c.estado === "en_mora").length
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
        <Link href={`/contratos/${contratoId}`}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Cobros del contrato</h1>
          <p className="text-sm text-muted-foreground truncate">
            {contratoInfo.referencia} · {contratoInfo.inmueble}
          </p>
        </div>
        <Link href={`/contratos/${contratoId}/estado-cuenta`}>
          <Button variant="outline" size="sm">Estado de cuenta</Button>
        </Link>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-5xl mx-auto w-full">

        {/* Cards de resumen */}
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            label="Pendiente de pago"
            value={formatCOP(resumen.totalPendiente)}
            className="border-gray-200"
            valueClassName="text-gray-800"
          />
          <SummaryCard
            label={`En mora${countMora > 0 ? ` (${countMora} cobro${countMora > 1 ? "s" : ""})` : ""}`}
            value={formatCOP(resumen.totalEnMora)}
            className={countMora > 0 ? "alert-red" : "border-gray-200"}
            valueClassName={countMora > 0 ? "text-red-700 dark:text-red-300" : "text-gray-800 dark:text-gray-200"}
          />
          <SummaryCard
            label="Total pagado"
            value={formatCOP(resumen.totalPagado)}
            className="alert-green"
            valueClassName="text-green-700 dark:text-green-300"
          />
        </div>

        {/* Aviso inmueble residencial */}
        {esResidencial && countMora > 0 && (
          <div className="flex items-start gap-2 text-sm alert-blue border rounded-md px-3 py-2.5">
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
                        <Badge
                          variant="outline"
                          className={cn("gap-1 text-xs", estadoCfg.className)}
                        >
                          <HugeiconsIcon icon={estadoCfg.icon} strokeWidth={2} className="size-3" />
                          {estadoCfg.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {cobro.estado === "pagado" ? (
                          cobro.comprobante && (
                            <a href={cobro.comprobante.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
                                <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3.5" />
                                Ver comprobante
                              </Button>
                            </a>
                          )
                        ) : (
                          <Link href={`/contratos/${contratoId}/cobros/${cobro.id}/pagar`}>
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
