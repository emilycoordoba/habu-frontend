"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  UserIcon,
  Building04Icon,
  Alert02Icon,
  Calendar01Icon,
  MoneyReceive02Icon,
  Tick02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { obtenerContrato, terminarContrato, listarCobros } from "@/lib/api/contratos"
import type { TerminarContratoBody } from "@/lib/api/contratos"
import { toast } from "sonner"

interface SaldoPendiente {
  concepto: string
  valor: number
  diasMora: number
}

interface ContratoMock {
  id: string
  referencia: string
  tipo: "arriendo" | "promesa_compraventa"
  inmueble: string
  direccion: string
  propietario: string
  contraparte: string
  canon?: number
  deposito?: number
  arras?: number
  saldosPendientes: SaldoPendiente[]
}

function formatCOP(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

function formatInput(raw: string): string {
  const num = parseInt(raw.replace(/\D/g, ""), 10)
  if (isNaN(num)) return ""
  return new Intl.NumberFormat("es-CO").format(num)
}

function parseInput(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, ""), 10) || 0
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function SectionHeader({
  numero,
  titulo,
  completa,
}: {
  numero: number
  titulo: string
  completa: boolean
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={cn(
          "size-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors",
          completa
            ? "bg-green-600 text-white"
            : "bg-muted text-muted-foreground"
        )}
      >
        {completa ? (
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} className="size-4" />
        ) : (
          numero
        )}
      </div>
      <h2 className="font-semibold text-base">{titulo}</h2>
    </div>
  )
}

function PreviewRow({ label, value, destacado }: { label: string; value: string; destacado?: boolean }) {
  return (
    <div className={cn("flex justify-between text-sm py-1", destacado && "font-semibold")}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Flujo Arriendo
// ---------------------------------------------------------------------------

const CAUSAS_ARRIENDO = [
  { value: "mutuo_acuerdo", label: "Mutuo acuerdo" },
  { value: "incumplimiento_arrendatario", label: "Incumplimiento del arrendatario" },
  { value: "incumplimiento_arrendador", label: "Incumplimiento del arrendador" },
  { value: "caso_fortuito", label: "Caso fortuito o fuerza mayor" },
  { value: "otro", label: "Otro" },
]

function FlujoArriendo({ contrato, onTerminar }: { contrato: ContratoMock; onTerminar: (body: TerminarContratoBody) => Promise<void> }) {
  const router = useRouter()

  // Sección 1
  const [iniciador, setIniciador] = React.useState("")
  const [causa, setCausa] = React.useState("")
  const [causaDetalle, setCausaDetalle] = React.useState("")
  const [fechaEntrega, setFechaEntrega] = React.useState("")

  // Sección 2 (solo lectura)
  const totalPendiente = contrato.saldosPendientes.reduce((s, c) => s + c.valor, 0)

  // Sección 3
  const [aplicaPenalizacion, setAplicaPenalizacion] = React.useState(false)
  const [penalizacionValor, setPenalizacionValor] = React.useState<string>("")
  const [penalizacionACargo, setPenalizacionACargo] = React.useState("")
  const [retenerDeposito, setRetenerDeposito] = React.useState(false)

  // Cálculos
  const penVal = parseInput(penalizacionValor)
  const depositoOriginal = contrato.deposito ?? 0
  const retencion = aplicaPenalizacion && retenerDeposito ? Math.min(penVal, depositoOriginal) : 0
  const depositoADevolver = Math.max(0, depositoOriginal - retencion - totalPendiente)

  // Validaciones por sección
  const s1Completa = !!iniciador && !!causa && !!fechaEntrega
  const s2Completa = true // siempre completa — es solo lectura
  const s3Completa = !aplicaPenalizacion || (penVal > 0 && !!penalizacionACargo)
  const todoCorrecto = s1Completa && s3Completa

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-start gap-4">
        <Link href={`/contratos/${contrato.id}`}>
          <Button variant="ghost" size="icon" className="size-8 mt-0.5">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Registrar terminación anticipada</h1>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {contrato.referencia} · {contrato.inmueble}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3.5 text-amber-600 shrink-0" />
          <span className="text-xs text-amber-700 font-medium">Acción irreversible</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Panel principal */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="w-full max-w-2xl mx-auto space-y-8">

            {/* Sección 1: Causa y fecha */}
            <div>
              <SectionHeader numero={1} titulo="Causa de terminación" completa={s1Completa} />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Quién inicia</Label>
                    <Select value={iniciador} onValueChange={setIniciador}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arrendador">Arrendador (propietario)</SelectItem>
                        <SelectItem value="arrendatario">Arrendatario</SelectItem>
                        <SelectItem value="mutuo_acuerdo">Mutuo acuerdo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Motivo</Label>
                    <Select value={causa} onValueChange={setCausa}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar…" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAUSAS_ARRIENDO.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {causa === "otro" && (
                  <div className="space-y-1.5">
                    <Label>Descripción del motivo</Label>
                    <Textarea
                      placeholder="Describe brevemente la causa de terminación…"
                      value={causaDetalle}
                      onChange={(e) => setCausaDetalle(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-1.5 max-w-xs">
                  <Label>Fecha efectiva de entrega</Label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                    />
                    <Input
                      type="date"
                      value={fechaEntrega}
                      onChange={(e) => setFechaEntrega(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Sección 2: Saldos pendientes */}
            <div>
              <SectionHeader numero={2} titulo="Saldos pendientes" completa={s2Completa} />
              {contrato.saldosPendientes.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2.5">
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4 shrink-0" />
                  No hay saldos pendientes — el contrato está al día.
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Los siguientes cobros deben quedar registrados como pendientes de cobro al finalizar.
                  </p>
                  {contrato.saldosPendientes.map((s, i) => (
                    <div key={i} className="flex items-center justify-between border rounded-md px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium">{s.concepto}</p>
                        {s.diasMora > 0 && (
                          <p className="text-xs text-red-600 mt-0.5">{s.diasMora} días en mora</p>
                        )}
                      </div>
                      <span className="font-semibold">{formatCOP(s.valor)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold border-t pt-2 mt-1">
                    <span>Total pendiente</span>
                    <span className="text-red-600">{formatCOP(totalPendiente)}</span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Sección 3: Penalización */}
            <div>
              <SectionHeader numero={3} titulo="Penalización" completa={s3Completa} />
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setAplicaPenalizacion(!aplicaPenalizacion)}
                  className={cn(
                    "w-full flex items-center justify-between border rounded-md px-4 py-3 text-sm transition-colors",
                    aplicaPenalizacion
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-dashed text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="font-medium">
                    {aplicaPenalizacion ? "Sí aplica penalización" : "¿Aplica penalización?"}
                  </span>
                  <HugeiconsIcon
                    icon={aplicaPenalizacion ? Tick02Icon : Cancel01Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </button>

                {aplicaPenalizacion && (
                  <div className="space-y-4 pl-4 border-l-2 border-red-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Valor de la penalización</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                          <Input
                            className="pl-6"
                            placeholder="0"
                            value={penalizacionValor}
                            onChange={(e) => setPenalizacionValor(formatInput(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>A cargo de</Label>
                        <Select value={penalizacionACargo} onValueChange={setPenalizacionACargo}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar…" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arrendatario">Arrendatario</SelectItem>
                            <SelectItem value="arrendador">Arrendador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {penalizacionACargo === "arrendatario" && depositoOriginal > 0 && (
                      <button
                        type="button"
                        onClick={() => setRetenerDeposito(!retenerDeposito)}
                        className={cn(
                          "w-full flex items-center gap-3 border rounded-md px-4 py-3 text-sm transition-colors text-left",
                          retenerDeposito
                            ? "border-amber-300 bg-amber-50"
                            : "border-dashed text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "size-4 rounded border-2 flex items-center justify-center shrink-0",
                          retenerDeposito ? "border-amber-500 bg-amber-500" : "border-gray-400"
                        )}>
                          {retenerDeposito && <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-2.5 text-white" />}
                        </div>
                        <span>Retener del depósito de garantía ({formatCOP(depositoOriginal)})</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Sección 4: Devolución del depósito */}
            {depositoOriginal > 0 && (
              <div>
                <SectionHeader numero={4} titulo="Devolución del depósito" completa={true} />
                <div className="border rounded-md px-4 py-4 space-y-2 bg-muted/30">
                  <PreviewRow label="Depósito original" value={formatCOP(depositoOriginal)} />
                  {retencion > 0 && (
                    <PreviewRow label="− Retención por penalización" value={`−${formatCOP(retencion)}`} />
                  )}
                  {totalPendiente > 0 && (
                    <PreviewRow label="− Saldos pendientes" value={`−${formatCOP(totalPendiente)}`} />
                  )}
                  <Separator className="my-1" />
                  <PreviewRow
                    label="Neto a devolver al arrendatario"
                    value={formatCOP(depositoADevolver)}
                    destacado
                  />
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex justify-end gap-3 pt-2 pb-8">
              <Link href={`/contratos/${contrato.id}`}>
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button
                disabled={!todoCorrecto}
                onClick={async () => {
                  await onTerminar({
                    motivo: causa === "otro" ? causaDetalle || "Otro" : causa,
                    fechaTerminacion: fechaEntrega,
                    enDisputa: causa === "incumplimiento_arrendatario" || causa === "incumplimiento_arrendador",
                  })
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Registrar terminación anticipada
              </Button>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="w-72 shrink-0 border-l bg-muted/20 px-5 py-6 overflow-y-auto hidden lg:block">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Resumen</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Arrendador</p>
                <p className="text-sm font-medium truncate">{contrato.propietario}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Arrendatario</p>
                <p className="text-sm font-medium truncate">{contrato.contraparte}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-4" />

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Valores</p>
          <div className="space-y-1">
            <PreviewRow label="Canon mensual" value={formatCOP(contrato.canon ?? 0)} />
            <PreviewRow label="Depósito" value={formatCOP(depositoOriginal)} />
            {totalPendiente > 0 && (
              <PreviewRow label="Saldo pendiente" value={formatCOP(totalPendiente)} />
            )}
            {aplicaPenalizacion && penVal > 0 && (
              <PreviewRow label="Penalización" value={formatCOP(penVal)} />
            )}
            {depositoOriginal > 0 && (
              <>
                <Separator className="my-2" />
                <PreviewRow label="Depósito a devolver" value={formatCOP(depositoADevolver)} destacado />
              </>
            )}
          </div>

          <Separator className="my-4" />

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Progreso</p>
          <div className="space-y-2">
            {[
              { label: "Causa y fecha", ok: s1Completa },
              { label: "Penalización definida", ok: s3Completa },
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

// ---------------------------------------------------------------------------
// Flujo Promesa de Compraventa
// ---------------------------------------------------------------------------

type QuienDesiste = "comprador" | "vendedor" | "mutuo_acuerdo" | ""

function calcularArras(arras: number, quienDesiste: QuienDesiste): {
  label: string
  valor: number
  receptor: string
  descripcion: string
  color: string
} {
  switch (quienDesiste) {
    case "comprador":
      return {
        label: "Arras perdidas",
        valor: arras,
        receptor: "Vendedor",
        descripcion: "El comprador pierde las arras. El vendedor las retiene como indemnización.",
        color: "red",
      }
    case "vendedor":
      return {
        label: "Arras a devolver (doble)",
        valor: arras * 2,
        receptor: "Comprador",
        descripcion: "El vendedor devuelve el doble de las arras como indemnización al comprador.",
        color: "red",
      }
    case "mutuo_acuerdo":
      return {
        label: "Arras a devolver",
        valor: arras,
        receptor: "Comprador",
        descripcion: "Las arras se devuelven íntegras al comprador.",
        color: "green",
      }
    default:
      return { label: "", valor: 0, receptor: "", descripcion: "", color: "gray" }
  }
}

function FlujoPromesa({ contrato, onTerminar }: { contrato: ContratoMock; onTerminar: (body: TerminarContratoBody) => Promise<void> }) {
  const router = useRouter()

  const [quienDesiste, setQuienDesiste] = React.useState<QuienDesiste>("")
  const [causaDetalle, setCausaDetalle] = React.useState("")
  const [fechaEntrega, setFechaEntrega] = React.useState("")

  const arras = contrato.arras ?? 0
  const resultado = calcularArras(arras, quienDesiste)
  const todoCorrecto = !!quienDesiste && !!fechaEntrega

  const opcionColor: Record<QuienDesiste, string> = {
    comprador: "border-red-300 bg-red-50 text-red-800",
    vendedor: "border-red-300 bg-red-50 text-red-800",
    mutuo_acuerdo: "border-green-300 bg-green-50 text-green-800",
    "": "border-dashed text-muted-foreground",
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-start gap-4">
        <Link href={`/contratos/${contrato.id}`}>
          <Button variant="ghost" size="icon" className="size-8 mt-0.5">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Registrar terminación anticipada</h1>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {contrato.referencia} · {contrato.inmueble}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3.5 text-amber-600 shrink-0" />
          <span className="text-xs text-amber-700 font-medium">Acción irreversible</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Panel principal */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="w-full max-w-2xl mx-auto space-y-8">

            {/* Sección 1: Quién desiste */}
            <div>
              <SectionHeader numero={1} titulo="¿Quién desiste?" completa={!!quienDesiste} />
              <p className="text-sm text-muted-foreground mb-4">
                Esto determina el tratamiento de las arras según el Código Civil colombiano.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "comprador", label: "El comprador desiste", sublabel: "Pierde las arras" },
                  { value: "vendedor", label: "El vendedor desiste", sublabel: "Devuelve el doble" },
                  { value: "mutuo_acuerdo", label: "Mutuo acuerdo", sublabel: "Arras devueltas íntegras" },
                ] as const).map((op) => (
                  <button
                    key={op.value}
                    type="button"
                    onClick={() => setQuienDesiste(op.value)}
                    className={cn(
                      "border rounded-md px-3 py-3 text-left transition-colors",
                      quienDesiste === op.value
                        ? opcionColor[op.value]
                        : "hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <p className="text-sm font-medium leading-tight">{op.label}</p>
                    <p className="text-xs mt-1 opacity-80">{op.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sección 2: Consecuencia automática de arras */}
            <div>
              <SectionHeader numero={2} titulo="Consecuencia sobre las arras" completa={!!quienDesiste} />
              {!quienDesiste ? (
                <p className="text-sm text-muted-foreground">
                  Selecciona quién desiste para ver el cálculo automático.
                </p>
              ) : (
                <div className={cn(
                  "border rounded-md px-4 py-4 space-y-3",
                  resultado.color === "red" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                )}>
                  <p className={cn(
                    "text-sm",
                    resultado.color === "red" ? "text-red-700" : "text-green-700"
                  )}>
                    {resultado.descripcion}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-current/10">
                    <div>
                      <p className="text-xs text-muted-foreground">{resultado.label}</p>
                      <p className="text-sm font-semibold">{formatCOP(resultado.valor)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Recibe</p>
                      <p className="text-sm font-semibold">{resultado.receptor}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Sección 3: Detalle y fecha */}
            <div>
              <SectionHeader numero={3} titulo="Detalle y fecha" completa={!!fechaEntrega} />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Observaciones (opcional)</Label>
                  <Textarea
                    placeholder="Contexto adicional sobre la terminación…"
                    value={causaDetalle}
                    onChange={(e) => setCausaDetalle(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <Label>Fecha efectiva de entrega del inmueble</Label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                    />
                    <Input
                      type="date"
                      value={fechaEntrega}
                      onChange={(e) => setFechaEntrega(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end gap-3 pt-2 pb-8">
              <Link href={`/contratos/${contrato.id}`}>
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button
                disabled={!todoCorrecto}
                onClick={async () => {
                  await onTerminar({
                    motivo: `Desiste: ${quienDesiste}`,
                    fechaTerminacion: fechaEntrega,
                    enDisputa: quienDesiste !== "mutuo_acuerdo",
                  })
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Registrar terminación anticipada
              </Button>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="w-72 shrink-0 border-l bg-muted/20 px-5 py-6 overflow-y-auto hidden lg:block">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Resumen</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Building04Icon} strokeWidth={1.5} className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Vendedor</p>
                <p className="text-sm font-medium truncate">{contrato.propietario}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Comprador</p>
                <p className="text-sm font-medium truncate">{contrato.contraparte}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-4" />

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Arras pactadas</p>
          <div className="space-y-1">
            <PreviewRow label="Valor arras" value={formatCOP(arras)} />
            {quienDesiste && (
              <>
                <Separator className="my-2" />
                <PreviewRow
                  label={resultado.label}
                  value={formatCOP(resultado.valor)}
                  destacado
                />
                <p className="text-xs text-muted-foreground mt-1">Recibe: {resultado.receptor}</p>
              </>
            )}
          </div>

          <Separator className="my-4" />

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Progreso</p>
          <div className="space-y-2">
            {[
              { label: "Quién desiste", ok: !!quienDesiste },
              { label: "Fecha de entrega", ok: !!fechaEntrega },
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

// ---------------------------------------------------------------------------
// Componente raíz — despacha al flujo correcto según tipo de contrato
// ---------------------------------------------------------------------------

interface TerminacionClientProps {
  contratoId: string
}

export function TerminacionClient({ contratoId }: TerminacionClientProps) {
  const router = useRouter()
  const [contrato, setContrato] = React.useState<ContratoMock | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelado = false
    Promise.all([
      obtenerContrato(contratoId),
      listarCobros(contratoId, { limit: 100 }),
    ])
      .then(([c, cobros]) => {
        if (cancelado) return
        const d = c.data
        const saldosPendientes = cobros.data
          .filter(co => co.estado === "pendiente" || co.estado === "en_mora")
          .map(co => ({
            concepto: co.periodo ?? co.tipo,
            valor: co.valor,
            diasMora: co.diasMora ?? 0,
          }))
        setContrato({
          id: d.id,
          referencia: d.referencia,
          tipo: d.tipo,
          inmueble: d.inmueble.nombre,
          direccion: d.inmueble.direccion,
          propietario: d.propietario.nombre,
          contraparte: d.contraparte.nombre,
          canon: d.condicionesArriendo?.valorCanon,
          deposito: d.condicionesArriendo?.valorDeposito,
          arras: d.condicionesPromesa?.valorArras,
          saldosPendientes,
        })
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
    return () => { cancelado = true }
  }, [contratoId])

  async function handleTerminar(body: TerminarContratoBody) {
    try {
      await terminarContrato(contratoId, body)
      toast.success("Terminación registrada")
      router.push(`/contratos/${contratoId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al registrar")
    }
  }

  if (isLoading || !contrato) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="animate-pulse text-sm">Cargando contrato…</div>
      </div>
    )
  }

  if (contrato.tipo === "promesa_compraventa") {
    return <FlujoPromesa contrato={contrato} onTerminar={handleTerminar} />
  }

  return <FlujoArriendo contrato={contrato} onTerminar={handleTerminar} />
}
