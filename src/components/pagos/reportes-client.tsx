"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FilterIcon,
  Calendar01Icon,
  MoneyReceive02Icon,
  Building04Icon,
  UserIcon,
  RefreshIcon,
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
import { listarReportePagos } from "@/lib/api/pagos"
import type { PagoReporte } from "@/types/pago.types"
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
  const [pagos, setPagos]             = React.useState<PagoReporte[]>([])
  const [totalRecibido, setTotalRecibido] = React.useState(0)
  const [isLoading, setIsLoading]     = React.useState(false)
  const [error, setError]             = React.useState<string | null>(null)
  const [retryKey, setRetryKey]       = React.useState(0)

  // Filtros enviados a la API
  const [desde, setDesde]         = React.useState("")
  const [hasta, setHasta]         = React.useState("")
  const [tipoCobro, setTipoCobro] = React.useState<TipoCobro | "todos">("todos")

  // Filtros de texto — aplicados en cliente sobre los resultados
  const [clienteTexto, setClienteTexto]   = React.useState("")
  const [inmuebleTexto, setInmuebleTexto] = React.useState("")

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)
    listarReportePagos({
      desde:  desde    || undefined,
      hasta:  hasta    || undefined,
      tipo:   tipoCobro !== "todos" ? tipoCobro : undefined,
      limit:  200,
    })
      .then(res => {
        if (cancelado) return
        setPagos(res.data)
        setTotalRecibido(res.resumen.totalRecibido)
      })
      .catch(() => {
        if (!cancelado) setError("No se pudo cargar el reporte de pagos.")
      })
      .finally(() => {
        if (!cancelado) setIsLoading(false)
      })
    return () => { cancelado = true }
  }, [desde, hasta, tipoCobro, retryKey])

  // Filtrado de texto en cliente
  const pagosFiltrados = pagos.filter(p => {
    if (clienteTexto  && !p.cliente.nombre.toLowerCase().includes(clienteTexto.toLowerCase())) return false
    if (inmuebleTexto && !p.inmueble.nombre.toLowerCase().includes(inmuebleTexto.toLowerCase())) return false
    return true
  })

  const totalFiltrado = pagosFiltrados.reduce((s, p) => s + p.valor, 0)
  const contratosUnicos = new Set(pagosFiltrados.map(p => p.contrato.id)).size

  const desglose = pagosFiltrados.reduce<Record<string, number>>((acc, p) => {
    const label = TIPO_LABELS[p.tipoCobro]
    acc[label] = (acc[label] ?? 0) + p.valor
    return acc
  }, {})

  function limpiarFiltros() {
    setDesde("")
    setHasta("")
    setClienteTexto("")
    setInmuebleTexto("")
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
                  value={clienteTexto}
                  onChange={e => setClienteTexto(e.target.value)}
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
                  value={inmuebleTexto}
                  onChange={e => setInmuebleTexto(e.target.value)}
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
            <div className="border rounded-lg px-4 py-3 alert-green">
              <p className="text-xs text-muted-foreground mb-1">Total recibido</p>
              <p className="text-xl font-semibold tabular-nums text-green-700 dark:text-green-300">
                {formatCOP(totalFiltrado)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {pagosFiltrados.length} pago{pagosFiltrados.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="border rounded-lg px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Total en período</p>
              <p className="text-xl font-semibold tabular-nums">{formatCOP(totalRecibido)}</p>
              <p className="text-xs text-muted-foreground mt-1">Antes de filtros de texto</p>
            </div>
            <div className="border rounded-lg px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Contratos únicos</p>
              <p className="text-xl font-semibold tabular-nums">{contratosUnicos}</p>
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

          {/* Estado de carga / error */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground animate-pulse">
              <p className="text-sm">Cargando reporte…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={() => setRetryKey(k => k + 1)} className="gap-2">
                <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
                Reintentar
              </Button>
            </div>
          ) : (
            /* Tabla */
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
                        <tr key={pago.pagoId} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-muted-foreground tabular-nums">{pago.fecha}</td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                              {pago.contrato.referencia}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">
                            {pago.inmueble.nombre}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate">
                            {pago.cliente.nombre}
                          </td>
                          <td className="px-4 py-3">
                            {TIPO_LABELS[pago.tipoCobro]}
                            {pago.periodo && (
                              <span className="text-xs text-muted-foreground ml-1">— {pago.periodo}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">
                            {formatCOP(pago.valor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t bg-muted/30">
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-right">Total</td>
                        <td className="px-4 py-3 text-right font-bold tabular-nums text-green-700">
                          {formatCOP(totalFiltrado)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
