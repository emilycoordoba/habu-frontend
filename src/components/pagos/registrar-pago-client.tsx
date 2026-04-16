"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  Upload01Icon,
  PdfIcon,
  Alert02Icon,
  Tick02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { TipoCobro } from "@/types/contrato.types"

// ---------------------------------------------------------------------------
// Mock — se reemplaza con la API
// ---------------------------------------------------------------------------

type EstadoCobro = "pendiente" | "en_mora"

interface CobroDetalle {
  id: string
  contratoId: string
  contratoReferencia: string
  tipo: TipoCobro
  periodo?: string
  fechaLimite: string
  valor: number
  estado: EstadoCobro
  diasMora?: number
  esComercial: boolean
}

const COBROS_MOCK: Record<string, CobroDetalle> = {
  "c-07": {
    id: "c-07", contratoId: "1", contratoReferencia: "CTR-2025-001",
    tipo: "canon", periodo: "Abril 2025",
    fechaLimite: "2025-04-05", valor: 2800000,
    estado: "en_mora", diasMora: 10, esComercial: false,
  },
  "c-09": {
    id: "c-09", contratoId: "1", contratoReferencia: "CTR-2025-001",
    tipo: "canon", periodo: "Mayo 2025",
    fechaLimite: "2025-05-05", valor: 2800000,
    estado: "pendiente", esComercial: false,
  },
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

function formatCOP(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

interface RegistrarPagoClientProps {
  contratoId: string
  cobroId: string
}

interface ArchivoSubido {
  nombre: string
  objectUrl: string
}

export function RegistrarPagoClient({ contratoId, cobroId }: RegistrarPagoClientProps) {
  const router = useRouter()
  const cobro = COBROS_MOCK[cobroId] ?? COBROS_MOCK["c-07"]

  const [fechaPago, setFechaPago] = React.useState(new Date().toISOString().split("T")[0])
  const [comprobante, setComprobante] = React.useState<ArchivoSubido | null>(null)
  const [notas, setNotas] = React.useState("")

  const inputRef = React.useRef<HTMLInputElement>(null)

  // Cleanup objectUrl al desmontar
  React.useEffect(() => {
    return () => {
      if (comprobante) URL.revokeObjectURL(comprobante.objectUrl)
    }
  }, [comprobante])

  function handleArchivoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (comprobante) URL.revokeObjectURL(comprobante.objectUrl)
    setComprobante({ nombre: file.name, objectUrl: URL.createObjectURL(file) })
  }

  const todoCorrecto = !!fechaPago && !!comprobante

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
          <h1 className="text-lg font-semibold">Registrar pago</h1>
          <p className="text-sm text-muted-foreground truncate">
            {cobro.contratoReferencia} · {TIPO_LABELS[cobro.tipo]}{cobro.periodo ? ` — ${cobro.periodo}` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Formulario */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="w-full max-w-lg mx-auto space-y-6">

            {/* Aviso mora */}
            {cobro.estado === "en_mora" && (
              <div className={cn(
                "flex items-start gap-2.5 rounded-md border px-3 py-3 text-sm",
                cobro.esComercial
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              )}>
                <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Cobro con {cobro.diasMora} días de mora</p>
                  {cobro.esComercial
                    ? <p className="text-xs mt-0.5">Inmueble comercial — pueden aplicar intereses de mora calculados por el sistema.</p>
                    : <p className="text-xs mt-0.5">Inmueble residencial — no aplican intereses de mora (Ley 820 de 2003).</p>
                  }
                </div>
              </div>
            )}

            {/* Valor */}
            <div className="space-y-1.5">
              <Label>Valor pagado</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  className="pl-6 bg-muted/50 font-semibold"
                  value={new Intl.NumberFormat("es-CO").format(cobro.valor)}
                  readOnly
                />
              </div>
              <p className="text-xs text-muted-foreground">El valor es fijo — no se admiten pagos parciales.</p>
            </div>

            {/* Fecha */}
            <div className="space-y-1.5">
              <Label>Fecha de pago</Label>
              <div className="relative max-w-xs">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                />
                <Input
                  type="date"
                  value={fechaPago}
                  onChange={(e) => setFechaPago(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Separator />

            {/* Comprobante */}
            <div className="space-y-3">
              <Label>Comprobante de pago <span className="text-red-500">*</span></Label>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleArchivoChange}
              />

              {!comprobante ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full border-2 border-dashed rounded-lg px-4 py-8 flex flex-col items-center gap-2 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/40 transition-colors"
                >
                  <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-8" />
                  <p className="text-sm font-medium">Subir comprobante</p>
                  <p className="text-xs">PDF, JPG o PNG — máx. 10 MB</p>
                </button>
              ) : (
                <div className="flex items-center gap-3 border rounded-lg px-4 py-3">
                  <HugeiconsIcon icon={PdfIcon} strokeWidth={1.5} className="size-8 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{comprobante.nombre}</p>
                    <a
                      href={comprobante.objectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Ver archivo
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-xs text-muted-foreground hover:text-foreground shrink-0"
                  >
                    Reemplazar
                  </button>
                </div>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-1.5">
              <Label>Notas <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Textarea
                placeholder="Ej: pago realizado en efectivo directamente al propietario…"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
              />
            </div>

            {/* CTA */}
            <div className="flex justify-end gap-3 pt-2 pb-8">
              <Link href={`/contratos/${contratoId}/cobros`}>
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button
                disabled={!todoCorrecto}
                onClick={() => router.push(`/contratos/${contratoId}/cobros`)}
              >
                <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
                Confirmar pago
              </Button>
            </div>

          </div>
        </div>

        {/* Panel derecho — resumen del cobro */}
        <div className="w-64 shrink-0 border-l bg-muted/20 px-5 py-6 overflow-y-auto hidden lg:block">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Cobro</p>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Concepto</p>
              <p className="font-medium">{TIPO_LABELS[cobro.tipo]}</p>
            </div>
            {cobro.periodo && (
              <div>
                <p className="text-xs text-muted-foreground">Período</p>
                <p className="font-medium">{cobro.periodo}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Fecha límite</p>
              <p className="font-medium">{cobro.fechaLimite}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Valor</p>
          <p className="text-2xl font-bold tabular-nums">{formatCOP(cobro.valor)}</p>

          {cobro.estado === "en_mora" && cobro.diasMora != null && (
            <>
              <Separator className="my-4" />
              <div className={cn(
                "rounded-md px-3 py-2.5 text-xs",
                cobro.esComercial ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
              )}>
                <p className="font-semibold mb-0.5">{cobro.diasMora} días en mora</p>
                <p>{cobro.esComercial ? "Pueden aplicar intereses." : "Sin intereses (residencial)."}</p>
              </div>
            </>
          )}

          <Separator className="my-4" />

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Progreso</p>
          <div className="space-y-2">
            {[
              { label: "Fecha de pago", ok: !!fechaPago },
              { label: "Comprobante adjunto", ok: !!comprobante },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <div className={cn(
                  "size-4 rounded-full border-2 flex items-center justify-center shrink-0",
                  ok ? "border-green-500 bg-green-500" : "border-gray-300"
                )}>
                  {ok && <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-2.5 text-white" />}
                </div>
                <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
