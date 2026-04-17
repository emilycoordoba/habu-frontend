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
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TipoCobro } from "@/types/contrato.types"

// ---------------------------------------------------------------------------
// Mock
// ---------------------------------------------------------------------------

interface CobroMora {
  id: string
  contratoId: string
  contratoReferencia: string
  inmueble: string
  cliente: string
  tipo: TipoCobro
  periodo?: string
  fechaLimite: string
  valor: number
  diasMora: number
  esComercial: boolean
  interesesAcumulados?: number  // solo para inmuebles comerciales
}

const COBROS_EN_MORA: CobroMora[] = [
  {
    id: "c-07", contratoId: "1", contratoReferencia: "CTR-2025-001",
    inmueble: "Apto 301 Torre A", cliente: "Carlos Mendoza",
    tipo: "canon", periodo: "Abril 2025",
    fechaLimite: "2025-04-05", valor: 2800000,
    diasMora: 10, esComercial: false,
  },
  {
    id: "c-08", contratoId: "1", contratoReferencia: "CTR-2025-001",
    inmueble: "Apto 301 Torre A", cliente: "Carlos Mendoza",
    tipo: "comision_administracion", periodo: "Abril 2025",
    fechaLimite: "2025-04-05", valor: 320000,
    diasMora: 10, esComercial: false,
  },
  {
    id: "c-20", contratoId: "2", contratoReferencia: "CTR-2025-002",
    inmueble: "Local 3 CC Plaza", cliente: "Tienda Éxito",
    tipo: "canon", periodo: "Marzo 2025",
    fechaLimite: "2025-03-05", valor: 4800000,
    diasMora: 42, esComercial: true, interesesAcumulados: 134400,
  },
  {
    id: "c-21", contratoId: "2", contratoReferencia: "CTR-2025-002",
    inmueble: "Local 3 CC Plaza", cliente: "Tienda Éxito",
    tipo: "canon", periodo: "Abril 2025",
    fechaLimite: "2025-04-05", valor: 4800000,
    diasMora: 10, esComercial: true, interesesAcumulados: 32000,
  },
]

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

function urgenciaMora(dias: number): { label: string; className: string } {
  if (dias >= 30) return { label: `${dias} días`, className: "bg-red-100 text-red-700 border-red-200" }
  if (dias >= 15) return { label: `${dias} días`, className: "bg-orange-100 text-orange-700 border-orange-200" }
  return { label: `${dias} días`, className: "bg-amber-100 text-amber-700 border-amber-200" }
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function MoraClient() {
  const cobros = COBROS_EN_MORA

  const totalEnMora    = cobros.reduce((s, c) => s + c.valor, 0)
  const totalIntereses = cobros.reduce((s, c) => s + (c.interesesAcumulados ?? 0), 0)
  const contratosAfectados = new Set(cobros.map(c => c.contratoId)).size

  // Agrupa por contrato para mostrar todos sus cobros juntos
  const porContrato = cobros.reduce<Record<string, CobroMora[]>>((acc, c) => {
    if (!acc[c.contratoId]) acc[c.contratoId] = []
    acc[c.contratoId].push(c)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5 text-red-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Cobros en mora</h1>
          <p className="text-sm text-muted-foreground">
            {cobros.length} cobro{cobros.length !== 1 ? "s" : ""} en mora en {contratosAfectados} contrato{contratosAfectados !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-5xl mx-auto w-full">

        {/* Cards de resumen */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg px-4 py-4 border-red-200 bg-red-50">
            <p className="text-xs text-muted-foreground mb-1">Total en mora</p>
            <p className="text-xl font-semibold tabular-nums text-red-700">{formatCOP(totalEnMora)}</p>
            <p className="text-xs text-muted-foreground mt-1">{cobros.length} cobros</p>
          </div>
          <div className="border rounded-lg px-4 py-4 border-orange-200 bg-orange-50">
            <p className="text-xs text-muted-foreground mb-1">Intereses acumulados</p>
            <p className="text-xl font-semibold tabular-nums text-orange-700">{formatCOP(totalIntereses)}</p>
            <p className="text-xs text-muted-foreground mt-1">Solo inmuebles comerciales</p>
          </div>
          <div className="border rounded-lg px-4 py-4">
            <p className="text-xs text-muted-foreground mb-1">Contratos afectados</p>
            <p className="text-xl font-semibold tabular-nums">{contratosAfectados}</p>
            <p className="text-xs text-muted-foreground mt-1">Con al menos 1 cobro en mora</p>
          </div>
        </div>

        {/* Listado agrupado por contrato */}
        <div className="space-y-4">
          {Object.entries(porContrato).map(([contratoId, cobrosCont]) => {
            const primer = cobrosCont[0]
            const totalContrato = cobrosCont.reduce((s, c) => s + c.valor, 0)
            const maxDias = Math.max(...cobrosCont.map(c => c.diasMora))

            return (
              <div key={contratoId} className="border rounded-lg overflow-hidden">

                {/* Header del contrato */}
                <div className="bg-muted/40 px-4 py-3 flex items-center gap-3 border-b">
                  <div className="flex-1 min-w-0 flex items-center gap-4 flex-wrap">
                    <span className="font-mono text-xs bg-background border px-1.5 py-0.5 rounded shrink-0">
                      {primer.contratoReferencia}
                    </span>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                      <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                      <span className="truncate">{primer.inmueble}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                      <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-3.5 shrink-0" />
                      <span className="truncate">{primer.cliente}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={cn("text-xs", urgenciaMora(maxDias).className)}>
                      <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3 mr-1" />
                      Máx. {urgenciaMora(maxDias).label}
                    </Badge>
                    <Link href={`/contratos/${contratoId}/cobros`}>
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
                    {cobrosCont.map(cobro => {
                      const urg = urgenciaMora(cobro.diasMora)
                      return (
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
                            <Badge variant="outline" className={cn("text-xs", urg.className)}>
                              {urg.label} de mora
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p className="font-semibold tabular-nums">{formatCOP(cobro.valor)}</p>
                            {cobro.interesesAcumulados != null && cobro.interesesAcumulados > 0 && (
                              <p className="text-xs text-orange-600 mt-0.5">
                                + {formatCOP(cobro.interesesAcumulados)} intereses
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link href={`/contratos/${cobro.contratoId}/cobros/${cobro.id}/pagar`}>
                              <Button size="sm" className="h-7 text-xs gap-1.5">
                                <HugeiconsIcon icon={MoneyReceive02Icon} strokeWidth={2} className="size-3.5" />
                                Registrar pago
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="border-t bg-muted/20">
                    <tr>
                      <td colSpan={3} className="px-4 py-2.5 text-xs text-muted-foreground text-right font-medium">
                        Total en mora de este contrato
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold tabular-nums text-red-700">
                        {formatCOP(totalContrato)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
