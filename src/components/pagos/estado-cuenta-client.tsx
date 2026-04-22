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
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"

// ---------------------------------------------------------------------------
// Tipos y mock
// ---------------------------------------------------------------------------

type TipoEvento =
  | "cobro_generado"
  | "pago_recibido"
  | "mora_iniciada"
  | "interes_mora"

interface EventoCuenta {
  id: string
  fecha: string
  tipo: TipoEvento
  descripcion: string
  monto: number       // positivo = cargo al arrendatario, negativo = abono
  saldoAcumulado: number
  diasMora?: number
  notas?: string
}

interface ContratoResumen {
  id: string
  referencia: string
  inmueble: string
  propietario: string
  contraparte: string
  esComercial: boolean
  fechaInicio: string
  fechaFin: string
  canon: number
}

const CONTRATO_MOCK: ContratoResumen = {
  id: "1",
  referencia: "CTR-2025-001",
  inmueble: "Apto 301 Torre A — Cra 15 #93-47, Bogotá",
  propietario: "Ana Martínez",
  contraparte: "Carlos Mendoza",
  esComercial: false,
  fechaInicio: "2025-02-01",
  fechaFin: "2026-02-01",
  canon: 2800000,
}

// Extracto cronológico — saldo acumulado = suma de cargos no pagados
const EVENTOS_MOCK: EventoCuenta[] = [
  {
    id: "e-01", fecha: "2025-02-01", tipo: "cobro_generado",
    descripcion: "Depósito de garantía", monto: 5600000, saldoAcumulado: 5600000,
  },
  {
    id: "e-02", fecha: "2025-02-01", tipo: "pago_recibido",
    descripcion: "Pago depósito de garantía", monto: -5600000, saldoAcumulado: 0,
  },
  {
    id: "e-03", fecha: "2025-02-01", tipo: "cobro_generado",
    descripcion: "Comisión de colocación", monto: 2800000, saldoAcumulado: 2800000,
  },
  {
    id: "e-04", fecha: "2025-02-01", tipo: "pago_recibido",
    descripcion: "Pago comisión de colocación", monto: -2800000, saldoAcumulado: 0,
  },
  {
    id: "e-05", fecha: "2025-02-05", tipo: "cobro_generado",
    descripcion: "Canon — Febrero 2025", monto: 2800000, saldoAcumulado: 2800000,
  },
  {
    id: "e-06", fecha: "2025-02-07", tipo: "pago_recibido",
    descripcion: "Pago canon — Febrero 2025", monto: -2800000, saldoAcumulado: 0,
  },
  {
    id: "e-07", fecha: "2025-03-05", tipo: "cobro_generado",
    descripcion: "Canon — Marzo 2025", monto: 2800000, saldoAcumulado: 2800000,
  },
  {
    id: "e-08", fecha: "2025-03-17", tipo: "mora_iniciada",
    descripcion: "Canon Marzo entra en mora", monto: 0, saldoAcumulado: 2800000, diasMora: 1,
  },
  {
    id: "e-09", fecha: "2025-03-17", tipo: "pago_recibido",
    descripcion: "Pago canon — Marzo 2025", monto: -2800000, saldoAcumulado: 0,
    notas: "Pago tardío — 12 días de mora",
  },
  {
    id: "e-10", fecha: "2025-04-05", tipo: "cobro_generado",
    descripcion: "Canon — Abril 2025", monto: 2800000, saldoAcumulado: 2800000,
  },
  {
    id: "e-11", fecha: "2025-04-12", tipo: "mora_iniciada",
    descripcion: "Canon Abril entra en mora", monto: 0, saldoAcumulado: 2800000, diasMora: 10,
  },
  {
    id: "e-12", fecha: "2025-05-05", tipo: "cobro_generado",
    descripcion: "Canon — Mayo 2025", monto: 2800000, saldoAcumulado: 5600000,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCOP(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(Math.abs(value))}`
}

const EVENTO_CONFIG: Record<TipoEvento, {
  icon: IconSvgElement
  colorLinea: string
  colorIcono: string
  colorMonto: string
}> = {
  cobro_generado: {
    icon: Clock01Icon,
    colorLinea: "border-gray-200",
    colorIcono: "bg-gray-100 text-gray-500",
    colorMonto: "text-gray-800",
  },
  pago_recibido: {
    icon: CheckmarkCircle02Icon,
    colorLinea: "border-green-200",
    colorIcono: "bg-green-100 text-green-600",
    colorMonto: "text-green-700",
  },
  mora_iniciada: {
    icon: Alert02Icon,
    colorLinea: "border-red-200",
    colorIcono: "bg-red-100 text-red-500",
    colorMonto: "text-red-600",
  },
  interes_mora: {
    icon: Alert02Icon,
    colorLinea: "border-red-300",
    colorIcono: "bg-red-200 text-red-700",
    colorMonto: "text-red-700",
  },
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

interface EstadoCuentaClientProps {
  contratoId: string
}

export function EstadoCuentaClient({ contratoId }: EstadoCuentaClientProps) {
  const contrato = { ...CONTRATO_MOCK, id: contratoId }
  const eventos = EVENTOS_MOCK

  const totalCargos  = eventos.filter(e => e.monto > 0).reduce((s, e) => s + e.monto, 0)
  const totalAbonos  = eventos.filter(e => e.monto < 0).reduce((s, e) => s + Math.abs(e.monto), 0)
  const saldoPendiente = totalCargos - totalAbonos

  const saldoEnMora = eventos
    .filter(e => e.tipo === "mora_iniciada")
    .reduce((s, e) => s + e.saldoAcumulado, 0)

  // Agrupa eventos por mes para facilitar lectura
  const eventosPorMes = eventos.reduce<Record<string, EventoCuenta[]>>((acc, e) => {
    const mes = e.fecha.slice(0, 7) // "YYYY-MM"
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
        <Link href={`/contratos/${contrato.id}/cobros`}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Estado de cuenta</h1>
          <p className="text-sm text-muted-foreground truncate">{contrato.referencia} · {contrato.inmueble}</p>
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
          <div className="border rounded-lg px-4 py-4 border-green-200 bg-green-50">
            <p className="text-xs text-muted-foreground mb-1">Total pagado</p>
            <p className="text-xl font-semibold tabular-nums text-green-700">{formatCOP(totalAbonos)}</p>
          </div>
          <div className={cn(
            "border rounded-lg px-4 py-4",
            saldoPendiente > 0 ? "border-red-200 bg-red-50" : "border-gray-200"
          )}>
            <p className="text-xs text-muted-foreground mb-1">Saldo pendiente</p>
            <p className={cn(
              "text-xl font-semibold tabular-nums",
              saldoPendiente > 0 ? "text-red-700" : "text-gray-800"
            )}>
              {formatCOP(saldoPendiente)}
            </p>
          </div>
        </div>

        {/* Aviso residencial */}
        {!contrato.esComercial && saldoEnMora > 0 && (
          <div className="flex items-start gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2.5">
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 shrink-0 mt-0.5" />
            <span>Inmueble residencial — los cobros en mora no generan intereses (Ley 820 de 2003).</span>
          </div>
        )}

        {/* Timeline por mes */}
        <div className="space-y-8">
          {Object.entries(eventosPorMes).map(([mesKey, evs]) => (
            <div key={mesKey}>
              {/* Encabezado de mes */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider capitalize">
                  {labelMes(mesKey)}
                </p>
                <div className="flex-1 border-t" />
              </div>

              {/* Eventos del mes */}
              <div className="relative">
                {/* Línea vertical */}
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

                <div className="space-y-1">
                  {evs.map((evento, idx) => {
                    const cfg = EVENTO_CONFIG[evento.tipo]
                    const esAbono = evento.monto < 0
                    const esNeutro = evento.monto === 0

                    return (
                      <div key={evento.id} className="flex gap-4 relative">
                        {/* Ícono */}
                        <div className={cn(
                          "size-10 rounded-full flex items-center justify-center shrink-0 z-10",
                          cfg.colorIcono
                        )}>
                          <HugeiconsIcon icon={cfg.icon} strokeWidth={2} className="size-4" />
                        </div>

                        {/* Contenido */}
                        <div className={cn(
                          "flex-1 flex items-start justify-between py-2.5 border-b last:border-0",
                          idx === evs.length - 1 && "border-0"
                        )}>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{evento.descripcion}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{evento.fecha}</p>
                            {evento.diasMora != null && evento.diasMora > 0 && (
                              <p className="text-xs text-red-600 mt-0.5">{evento.diasMora} días de mora</p>
                            )}
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

        {/* Saldo final */}
        <div className={cn(
          "border rounded-lg px-4 py-4 flex items-center justify-between",
          saldoPendiente > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
        )}>
          <p className="text-sm font-semibold">Saldo total al día de hoy</p>
          <p className={cn(
            "text-lg font-bold tabular-nums",
            saldoPendiente > 0 ? "text-red-700" : "text-green-700"
          )}>
            {saldoPendiente > 0 ? `${formatCOP(saldoPendiente)} pendiente` : "Al día"}
          </p>
        </div>

      </div>
    </div>
  )
}
