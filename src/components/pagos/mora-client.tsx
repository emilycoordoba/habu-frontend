"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  Building04Icon,
  UserIcon,
  MoneyReceive02Icon,
  FileManagementIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { listarMora } from "@/lib/api/pagos"
import type { ContratoEnMora } from "@/types/pago.types"
import type { TipoCobro } from "@/types/contrato.types"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TIPO_LABELS: Record<TipoCobro, string> = {
  canon:                   "Canon mensual",
  comision_administracion: "Comisión administración",
  comision_colocacion:     "Comisión de colocación",
  arras:                   "Arras",
  deposito:                "Depósito de garantía",
  penalizacion:            "Penalización",
  precio_venta:            "Precio de venta",
}

function formatCOP(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

const URGENCIA_CONFIG: Record<ContratoEnMora["urgencia"], { className: string; label: string }> = {
  alta:  { className: "badge-red",    label: "Urgencia alta" },
  media: { className: "badge-orange", label: "Urgencia media" },
  baja:  { className: "badge-amber",  label: "Urgencia baja" },
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function MoraSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-y-auto animate-pulse">
      <div className="border-b px-6 py-4 h-16 bg-muted/30" />
      <div className="px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => <div key={i} className="border rounded-lg h-20 bg-muted/40" />)}
        </div>
        {[0, 1].map(i => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div className="h-12 bg-muted/30 border-b" />
            {[0, 1].map(j => <div key={j} className="h-14 bg-muted/20 border-b" />)}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function MoraClient() {
  const [contratos, setContratos] = React.useState<ContratoEnMora[]>([])
  const [resumen, setResumen] = React.useState<{
    totalEnMora: number
    interesesAcumulados: number
    contratosAfectados: number
  } | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)
    listarMora({ limit: 100 })
      .then(res => {
        if (cancelado) return
        setContratos(res.data)
        setResumen(res.resumen)
      })
      .catch(() => {
        if (!cancelado) setError("No se pudieron cargar los cobros en mora.")
      })
      .finally(() => {
        if (!cancelado) setIsLoading(false)
      })
    return () => { cancelado = true }
  }, [retryKey])

  if (isLoading) return <MoraSkeleton />

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

  const totalCobros = contratos.reduce((s, c) => s + c.cobrosEnMora.length, 0)
  const contratosAfectados = resumen?.contratosAfectados ?? contratos.length

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5 text-red-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Cobros en mora</h1>
          <p className="text-sm text-muted-foreground">
            {totalCobros} cobro{totalCobros !== 1 ? "s" : ""} en mora en {contratosAfectados} contrato{contratosAfectados !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-5xl mx-auto w-full">

        {/* Cards de resumen */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg px-4 py-4 alert-red">
            <p className="text-xs text-muted-foreground mb-1">Total en mora</p>
            <p className="text-xl font-semibold tabular-nums text-red-700 dark:text-red-300">
              {formatCOP(resumen?.totalEnMora ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{totalCobros} cobros</p>
          </div>
          <div className="border rounded-lg px-4 py-4 alert-orange">
            <p className="text-xs text-muted-foreground mb-1">Intereses acumulados</p>
            <p className="text-xl font-semibold tabular-nums text-orange-700 dark:text-orange-300">
              {formatCOP(resumen?.interesesAcumulados ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Solo inmuebles comerciales</p>
          </div>
          <div className="border rounded-lg px-4 py-4">
            <p className="text-xs text-muted-foreground mb-1">Contratos afectados</p>
            <p className="text-xl font-semibold tabular-nums">{contratosAfectados}</p>
            <p className="text-xs text-muted-foreground mt-1">Con al menos 1 cobro en mora</p>
          </div>
        </div>

        {/* Listado agrupado por contrato */}
        {contratos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay cobros en mora en este momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contratos.map(contrato => {
              const { contrato: info, inmueble, cliente, cobrosEnMora, urgencia } = contrato
              const urgCfg = URGENCIA_CONFIG[urgencia]
              const totalContrato = cobrosEnMora.reduce((s, c) => s + c.valor, 0)
              const totalIntereses = cobrosEnMora.reduce((s, c) => s + c.interesesMora, 0)

              return (
                <div key={info.id} className="border rounded-lg overflow-hidden">

                  {/* Header del contrato */}
                  <div className="bg-muted/40 px-4 py-3 flex items-center gap-3 border-b">
                    <div className="flex-1 min-w-0 flex items-center gap-4 flex-wrap">
                      <span className="font-mono text-xs bg-background border px-1.5 py-0.5 rounded shrink-0">
                        {info.referencia}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                        <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                        <span className="truncate">{inmueble.nombre}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                        <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                        <span className="truncate">{cliente.nombre}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={cn("text-xs", urgCfg.className)}>
                        <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3 mr-1" />
                        {urgCfg.label}
                      </Badge>
                      <Link href={`/contratos/${info.id}/cobros`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
                          <HugeiconsIcon icon={FileManagementIcon} strokeWidth={2} className="size-3.5" />
                          Ver cobros
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Cobros del contrato */}
                  <table className="w-full text-sm">
                    <tbody className="divide-y">
                      {cobrosEnMora.map(cobro => (
                        <tr key={cobro.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium">{TIPO_LABELS[cobro.tipo]}</p>
                            {cobro.periodo && (
                              <p className="text-xs text-muted-foreground mt-0.5">{cobro.periodo}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Venció el {cobro.fechaLimite}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={cn("text-xs", URGENCIA_CONFIG[urgencia].className)}>
                              {cobro.diasMora} días de mora
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p className="font-semibold tabular-nums">{formatCOP(cobro.valor)}</p>
                            {!inmueble.esResidencial && cobro.interesesMora > 0 && (
                              <p className="text-xs text-orange-600 mt-0.5">
                                + {formatCOP(cobro.interesesMora)} intereses
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link href={`/contratos/${info.id}/cobros/${cobro.id}/pagar`}>
                              <Button size="sm" className="h-7 text-xs gap-1.5">
                                <HugeiconsIcon icon={MoneyReceive02Icon} strokeWidth={2} className="size-3.5" />
                                Registrar pago
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t bg-muted/20">
                      <tr>
                        <td colSpan={3} className="px-4 py-2.5 text-xs text-muted-foreground text-right font-medium">
                          Total en mora de este contrato
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold tabular-nums text-red-700">
                          {formatCOP(totalContrato + totalIntereses)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>

                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
