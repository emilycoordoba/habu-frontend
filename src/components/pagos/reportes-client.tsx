"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FilterIcon,
  Calendar01Icon,
  MoneyReceive02Icon,
  Building04Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { TipoCobro } from "@/types/contrato.types"

// ---------------------------------------------------------------------------
// Mock
// ---------------------------------------------------------------------------

interface PagoReporte {
  id: string
  fecha: string
  contratoReferencia: string
  contratoId: string
  inmueble: string
  cliente: string
  tipo: TipoCobro
  periodo?: string
  valor: number
}

const PAGOS_MOCK: PagoReporte[] = [
  { id: "p-01", fecha: "2025-02-01", contratoId: "1", contratoReferencia: "CTR-2025-001", inmueble: "Apto 301 Torre A", cliente: "Carlos Mendoza", tipo: "deposito",             valor: 5600000 },
  { id: "p-02", fecha: "2025-02-01", contratoId: "1", contratoReferencia: "CTR-2025-001", inmueble: "Apto 301 Torre A", cliente: "Carlos Mendoza", tipo: "comision_colocacion",  valor: 2800000 },
  { id: "p-03", fecha: "2025-02-07", contratoId: "1", contratoReferencia: "CTR-2025-001", inmueble: "Apto 301 Torre A", cliente: "Carlos Mendoza", tipo: "canon", periodo: "Febrero 2025", valor: 2800000 },
  { id: "p-04", fecha: "2025-02-07", contratoId: "1", contratoReferencia: "CTR-2025-001", inmueble: "Apto 301 Torre A", cliente: "Carlos Mendoza", tipo: "comision_administracion", periodo: "Febrero 2025", valor: 320000 },
  { id: "p-05", fecha: "2025-03-17", contratoId: "1", contratoReferencia: "CTR-2025-001", inmueble: "Apto 301 Torre A", cliente: "Carlos Mendoza", tipo: "canon", periodo: "Marzo 2025", valor: 2800000 },
  { id: "p-06", fecha: "2025-03-17", contratoId: "1", contratoReferencia: "CTR-2025-001", inmueble: "Apto 301 Torre A", cliente: "Carlos Mendoza", tipo: "comision_administracion", periodo: "Marzo 2025", valor: 320000 },
  { id: "p-07", fecha: "2025-02-10", contratoId: "2", contratoReferencia: "CTR-2025-002", inmueble: "Local 3 CC Plaza",  cliente: "Tienda Éxito", tipo: "deposito",              valor: 9600000 },
  { id: "p-08", fecha: "2025-02-10", contratoId: "2", contratoReferencia: "CTR-2025-002", inmueble: "Local 3 CC Plaza",  cliente: "Tienda Éxito", tipo: "canon", periodo: "Febrero 2025", valor: 4800000 },
  { id: "p-09", fecha: "2025-03-05", contratoId: "2", contratoReferencia: "CTR-2025-002", inmueble: "Local 3 CC Plaza",  cliente: "Tienda Éxito", tipo: "canon", periodo: "Marzo 2025", valor: 4800000 },
  { id: "p-10", fecha: "2025-04-05", contratoId: "2", contratoReferencia: "CTR-2025-002", inmueble: "Local 3 CC Plaza",  cliente: "Tienda Éxito", tipo: "canon", periodo: "Abril 2025", valor: 4800000 },
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

const TIPOS_FILTRO: { value: TipoCobro | "todos"; label: string }[] = [
  { value: "todos",                   label: "Todos los tipos" },
  { value: "canon",                   label: "Canon mensual" },
  { value: "comision_administracion", label: "Comisión administración" },
  { value: "comision_colocacion",     label: "Comisión de colocación" },
  { value: "deposito",                label: "Depósito de garantía" },
  { value: "penalizacion",            label: "Penalización" },
]

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function ReportesClient() {
  const [desde, setDesde]         = React.useState("2025-02-01")
  const [hasta, setHasta]         = React.useState("2025-04-30")
  const [cliente, setCliente]     = React.useState("")
  const [inmueble, setInmueble]   = React.useState("")
  const [tipoCobro, setTipoCobro] = React.useState<TipoCobro | "todos">("todos")

  // Filtrado reactivo
  const pagosFiltrados = PAGOS_MOCK.filter(p => {
    if (desde && p.fecha < desde) return false
    if (hasta && p.fecha > hasta) return false
    if (cliente  && !p.cliente.toLowerCase().includes(cliente.toLowerCase()))   return false
    if (inmueble && !p.inmueble.toLowerCase().includes(inmueble.toLowerCase())) return false
    if (tipoCobro !== "todos" && p.tipo !== tipoCobro) return false
    return true
  })

  const totalRecibido = pagosFiltrados.reduce((s, p) => s + p.valor, 0)

  // Desglose por tipo
  const desglose = pagosFiltrados.reduce<Record<string, number>>((acc, p) => {
    const label = TIPO_LABELS[p.tipo]
    acc[label] = (acc[label] ?? 0) + p.valor
    return acc
  }, {})

  // Pendientes del período (mock fijo)
  const pendientesPeriodo = 5600000

  function limpiarFiltros() {
    setDesde("2025-02-01")
    setHasta("2025-04-30")
    setCliente("")
    setInmueble("")
    setTipoCobro("todos")
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Reporte de ingresos</h1>
          <p className="text-sm text-muted-foreground">Pagos recibidos registrados en el sistema</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Imprimir / PDF
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Panel izquierdo — filtros */}
        <div className="w-64 shrink-0 border-r bg-muted/20 px-5 py-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-5">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Filtros</p>
          </div>

          <div className="space-y-5">
            {/* Rango de fechas */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Período</p>
              <div className="space-y-1.5">
                <Label className="text-xs">Desde</Label>
                <div className="relative">
                  <HugeiconsIcon icon={Calendar01Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="pl-8 h-8 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Hasta</Label>
                <div className="relative">
                  <HugeiconsIcon icon={Calendar01Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="pl-8 h-8 text-sm" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Tipo de cobro */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tipo de cobro</p>
              <Select value={tipoCobro} onValueChange={v => setTipoCobro(v as TipoCobro | "todos")}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_FILTRO.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Cliente */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Cliente</p>
              <div className="relative">
                <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Buscar cliente…"
                  value={cliente}
                  onChange={e => setCliente(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>

            {/* Inmueble */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Inmueble</p>
              <div className="relative">
                <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Buscar inmueble…"
                  value={inmueble}
                  onChange={e => setInmueble(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>

            <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">

          {/* Cards de resumen */}
          <div className="px-6 py-5 border-b grid grid-cols-3 gap-4">
            <div className="border rounded-lg px-4 py-3 border-green-200 bg-green-50">
              <p className="text-xs text-muted-foreground mb-1">Total recibido</p>
              <p className="text-xl font-semibold tabular-nums text-green-700">{formatCOP(totalRecibido)}</p>
              <p className="text-xs text-muted-foreground mt-1">{pagosFiltrados.length} pago{pagosFiltrados.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="border rounded-lg px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Pendiente del período</p>
              <p className="text-xl font-semibold tabular-nums text-amber-600">{formatCOP(pendientesPeriodo)}</p>
              <p className="text-xs text-muted-foreground mt-1">No incluido en el reporte</p>
            </div>
            <div className="border rounded-lg px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Contratos activos</p>
              <p className="text-xl font-semibold tabular-nums">{new Set(pagosFiltrados.map(p => p.contratoId)).size}</p>
              <p className="text-xs text-muted-foreground mt-1">En el período filtrado</p>
            </div>
          </div>

          {/* Desglose por tipo */}
          {Object.keys(desglose).length > 1 && (
            <div className="px-6 py-4 border-b flex gap-6 flex-wrap">
              {Object.entries(desglose).map(([label, valor]) => (
                <div key={label} className="text-sm">
                  <span className="text-muted-foreground">{label}: </span>
                  <span className="font-semibold tabular-nums">{formatCOP(valor)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tabla */}
          <div className="px-6 py-5">
            {pagosFiltrados.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <HugeiconsIcon icon={MoneyReceive02Icon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay pagos que coincidan con los filtros.</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contrato</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inmueble</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Concepto</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pagosFiltrados.map(pago => (
                      <tr key={pago.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground tabular-nums">{pago.fecha}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            {pago.contratoReferencia}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">{pago.inmueble}</td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate">{pago.cliente}</td>
                        <td className="px-4 py-3">
                          {TIPO_LABELS[pago.tipo]}
                          {pago.periodo && (
                            <span className="text-xs text-muted-foreground ml-1">— {pago.periodo}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCOP(pago.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t bg-muted/30">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-right">Total</td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-green-700">{formatCOP(totalRecibido)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
