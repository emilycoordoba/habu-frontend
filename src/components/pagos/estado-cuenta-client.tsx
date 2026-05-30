"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Alert02Icon,
  InformationCircleIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { obtenerContrato, obtenerEstadoCuenta, listarCobros } from "@/lib/api/contratos"
import type { EventoCuenta, TipoEventoCuenta } from "@/types/pago.types"
import type { IconSvgElement } from "@hugeicons/react"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCOP(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(Math.abs(value))}`
}

const EVENTO_CONFIG: Record<TipoEventoCuenta, {
  icon: IconSvgElement
  colorIcono: string
  colorMonto: string
}> = {
  cobro_generado: {
    icon: Clock01Icon,
    colorIcono: "bg-gray-100 text-gray-500",
    colorMonto: "text-gray-800",
  },
  pago_recibido: {
    icon: CheckmarkCircle02Icon,
    colorIcono: "bg-green-100 text-green-600",
    colorMonto: "text-green-700",
  },
  mora_iniciada: {
    icon: Alert02Icon,
    colorIcono: "bg-red-100 text-red-500",
    colorMonto: "text-red-600",
  },
  interes_mora: {
    icon: Alert02Icon,
    colorIcono: "bg-red-200 text-red-700",
    colorMonto: "text-red-700",
  },
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function EstadoCuentaSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-y-auto animate-pulse">
      <div className="border-b px-6 py-4 h-16 bg-muted/30" />
      <div className="px-6 py-6 max-w-3xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => <div key={i} className="border rounded-lg h-20 bg-muted/40" />)}
        </div>
        <div className="space-y-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-muted/40 rounded" />
              {[0, 1].map(j => <div key={j} className="h-12 bg-muted/20 rounded" />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

interface EstadoCuentaClientProps {
  contratoId: string
}

interface ContratoInfo {
  referencia: string
  inmueble: string
  esResidencial: boolean
}

export function EstadoCuentaClient({ contratoId }: EstadoCuentaClientProps) {
  const [eventos, setEventos] = React.useState<EventoCuenta[]>([])
  const [saldoActual, setSaldoActual] = React.useState(0)
  const [contratoInfo, setContratoInfo] = React.useState<ContratoInfo>({
    referencia: "",
    inmueble: "",
    esResidencial: true,
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)

    Promise.all([
      obtenerContrato(contratoId),
      obtenerEstadoCuenta(contratoId),
      listarCobros(contratoId, { limit: 1 }),
    ])
      .then(([contratoRes, estadoRes, cobrosRes]) => {
        if (cancelado) return
        const c = contratoRes.data
        setContratoInfo({
          referencia: c.referencia,
          inmueble: `${c.inmueble.nombre} — ${c.inmueble.direccion}`,
          esResidencial: cobrosRes.data[0]?.esInmuebleResidencial ?? true,
        })
        setEventos(estadoRes.data)
        setSaldoActual(estadoRes.saldoActual)
      })
      .catch(() => {
        if (!cancelado) setError("No se pudo cargar el estado de cuenta.")
      })
      .finally(() => {
        if (!cancelado) setIsLoading(false)
      })

    return () => { cancelado = true }
  }, [contratoId, retryKey])

  if (isLoading) return <EstadoCuentaSkeleton />

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

  const totalCargos = eventos.filter(e => e.monto > 0).reduce((s, e) => s + e.monto, 0)
  const totalAbonos = eventos.filter(e => e.monto < 0).reduce((s, e) => s + Math.abs(e.monto), 0)
  const tieneMora   = eventos.some(e => e.tipo === "mora_iniciada")

  // Agrupa eventos por mes
  const eventosPorMes = eventos.reduce<Record<string, EventoCuenta[]>>((acc, e) => {
    const mes = e.fecha.slice(0, 7)
    if (!acc[mes]) acc[mes] = []
    acc[mes].push(e)
    return acc
  }, {})

  function labelMes(mesKey: string) {
    const [y, m] = mesKey.split("-")
    return new Date(Number(y), Number(m) - 1).toLocaleDateString("es-CO", { month: "long", year: "numeric" })
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <Link href={`/contratos/${contratoId}/cobros`}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Estado de cuenta</h1>
          <p className="text-sm text-muted-foreground truncate">
            {contratoInfo.referencia} · {contratoInfo.inmueble}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Imprimir / PDF
        </Button>
      </div>

      <div className="px-6 py-6 max-w-3xl mx-auto w-full space-y-6">

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg px-4 py-4">
            <p className="text-xs text-muted-foreground mb-1">Total cobrado</p>
            <p className="text-xl font-semibold tabular-nums">{formatCOP(totalCargos)}</p>
          </div>
          <div className="border rounded-lg px-4 py-4 alert-green">
            <p className="text-xs text-muted-foreground mb-1">Total pagado</p>
            <p className="text-xl font-semibold tabular-nums text-green-700 dark:text-green-300">{formatCOP(totalAbonos)}</p>
          </div>
          <div className={cn(
            "border rounded-lg px-4 py-4",
            saldoActual > 0 ? "alert-red" : ""
          )}>
            <p className="text-xs text-muted-foreground mb-1">Saldo pendiente</p>
            <p className={cn(
              "text-xl font-semibold tabular-nums",
              saldoActual > 0 ? "text-red-700 dark:text-red-300" : "text-foreground"
            )}>
              {formatCOP(saldoActual)}
            </p>
          </div>
        </div>

        {/* Aviso residencial */}
        {contratoInfo.esResidencial && tieneMora && (
          <div className="flex items-start gap-2 text-sm alert-blue border rounded-md px-3 py-2.5">
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 shrink-0 mt-0.5" />
            <span>Inmueble residencial — los cobros en mora no generan intereses (Ley 820 de 2003).</span>
          </div>
        )}

        {/* Timeline por mes */}
        {Object.keys(eventosPorMes).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No hay eventos registrados aún.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(eventosPorMes).map(([mesKey, evs]) => (
              <div key={mesKey}>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider capitalize">
                    {labelMes(mesKey)}
                  </p>
                  <div className="flex-1 border-t" />
                </div>

                <div className="relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

                  <div className="space-y-1">
                    {evs.map((evento, idx) => {
                      const cfg = EVENTO_CONFIG[evento.tipo]
                      const esAbono = evento.monto < 0
                      const esNeutro = evento.monto === 0

                      return (
                        <div key={evento.id} className="flex gap-4 relative">
                          <div className={cn(
                            "size-10 rounded-full flex items-center justify-center shrink-0 z-10",
                            cfg.colorIcono
                          )}>
                            <HugeiconsIcon icon={cfg.icon} strokeWidth={2} className="size-4" />
                          </div>

                          <div className={cn(
                            "flex-1 flex items-start justify-between py-2.5",
                            idx < evs.length - 1 && "border-b"
                          )}>
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{evento.descripcion}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{evento.fecha}</p>
                              {evento.notas && (
                                <p className="text-xs text-muted-foreground italic mt-0.5">{evento.notas}</p>
                              )}
                            </div>

                            {!esNeutro && (
                              <div className="text-right ml-4 shrink-0">
                                <p className={cn(
                                  "text-sm font-semibold tabular-nums",
                                  esAbono ? "text-green-700" : cfg.colorMonto
                                )}>
                                  {esAbono ? "−" : "+"}{formatCOP(evento.monto)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Saldo: {formatCOP(evento.saldoAcumulado)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saldo final */}
        <div className={cn(
          "border rounded-lg px-4 py-4 flex items-center justify-between",
          saldoActual > 0 ? "alert-red" : "alert-green"
        )}>
          <p className="text-sm font-semibold">Saldo total al día de hoy</p>
          <p className={cn(
            "text-lg font-bold tabular-nums",
            saldoActual > 0 ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"
          )}>
            {saldoActual > 0 ? `${formatCOP(saldoActual)} pendiente` : "Al día"}
          </p>
        </div>

      </div>
    </div>
  )
}
