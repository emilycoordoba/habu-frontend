"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  UserIcon,
  Building04Icon,
  Calendar01Icon,
  Tick02Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Mock — se reemplaza con la API
// ---------------------------------------------------------------------------

const CONTRATOS_MOCK: Record<string, ContratoMock> = {
  "1": {
    id: "1",
    referencia: "CTR-2025-001",
    inmueble: "Apto 302 Ed. Torres del Parque",
    direccion: "Cra 7 #32-16, Bogotá",
    propietario: "Carlos Ramírez",
    contraparte: "Laura Gómez",
    asesor: "Andrés López",
    canon: 2200000,
    deposito: 4400000,
    fechaInicio: "2024-05-01",
    fechaFin: "2025-05-01",
    diasRestantes: 18,
  },
}

interface ContratoMock {
  id: string
  referencia: string
  inmueble: string
  direccion: string
  propietario: string
  contraparte: string
  asesor: string
  canon: number
  deposito: number
  fechaInicio: string
  fechaFin: string
  diasRestantes: number
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

// Suma N meses a una fecha ISO (YYYY-MM-DD)
function sumarMeses(fecha: string, meses: number): string {
  const d = new Date(fecha)
  d.setMonth(d.getMonth() + meses)
  return d.toISOString().split("T")[0]
}

// Día siguiente a una fecha ISO
function diaSiguiente(fecha: string): string {
  const d = new Date(fecha)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
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

function CambioRow({
  label,
  anterior,
  nuevo,
  destacado,
}: {
  label: string
  anterior: string
  nuevo: string
  destacado?: boolean
}) {
  const cambio = anterior !== nuevo
  return (
    <div className={cn("flex items-center justify-between text-sm py-2", destacado && "font-semibold")}>
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className={cn("truncate", cambio ? "line-through text-muted-foreground/60" : "")}>{anterior}</span>
        {cambio && (
          <>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-green-700 font-medium truncate">{nuevo}</span>
          </>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

interface RenovacionClientProps {
  contratoId: string
}

export function RenovacionClient({ contratoId }: RenovacionClientProps) {
  const router = useRouter()
  const contrato = CONTRATOS_MOCK[contratoId] ?? CONTRATOS_MOCK["1"]

  // Sección 1: decisión
  type Decision = "renovar" | "no_renovar" | ""
  const [decision, setDecision] = React.useState<Decision>("")

  // Sección 2: nuevas condiciones (solo si renueva)
  const nuevaFechaInicio = diaSiguiente(contrato.fechaFin)
  const [nuevoCanon, setNuevoCanon] = React.useState(formatInput(String(contrato.canon)))
  const [nuevaFechaFin, setNuevaFechaFin] = React.useState(sumarMeses(nuevaFechaInicio, 12))
  const [mismoDeposito, setMismoDeposito] = React.useState(true)
  const [nuevoDeposito, setNuevoDeposito] = React.useState(formatInput(String(contrato.deposito)))
  const [fechaEntrega, setFechaEntrega] = React.useState("")

  // Validaciones
  const s1Completa = decision !== ""
  const s2Completa = decision === "no_renovar"
    ? !!fechaEntrega
    : !!nuevoCanon && !!nuevaFechaFin
  const todoCorrecto = s1Completa && s2Completa

  const canonNum = parseInput(nuevoCanon)
  const depositoFinal = mismoDeposito ? contrato.deposito : parseInput(nuevoDeposito)

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
          <h1 className="text-lg font-semibold">Vencimiento y renovación</h1>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {contrato.referencia} · {contrato.inmueble}
          </p>
        </div>
        {contrato.diasRestantes <= 30 && (
          <div className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1 border text-xs font-medium",
            contrato.diasRestantes <= 10
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          )}>
            <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} className="size-3.5 shrink-0" />
            Vence en {contrato.diasRestantes} días
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Panel principal */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="w-full max-w-2xl mx-auto space-y-8">

            {/* Sección 1: Decisión */}
            <div>
              <SectionHeader numero={1} titulo="¿Qué desea hacer?" completa={s1Completa} />
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDecision("renovar")}
                  className={cn(
                    "border rounded-md px-4 py-4 text-left transition-colors",
                    decision === "renovar"
                      ? "border-green-400 bg-green-50"
                      : "hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className={cn("size-4", decision === "renovar" ? "text-green-600" : "text-muted-foreground")} />
                    <p className="font-medium text-sm text-foreground">Renovar contrato</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Se crea un nuevo contrato en borrador con las condiciones actualizadas.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision("no_renovar")}
                  className={cn(
                    "border rounded-md px-4 py-4 text-left transition-colors",
                    decision === "no_renovar"
                      ? "border-red-300 bg-red-50"
                      : "hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className={cn("size-4", decision === "no_renovar" ? "text-red-500" : "text-muted-foreground")} />
                    <p className="font-medium text-sm text-foreground">No renovar</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    El contrato finaliza al vencimiento. Se registra la fecha de entrega.
                  </p>
                </button>
              </div>
            </div>

            {/* Sección 2a: Nuevas condiciones (si renueva) */}
            {decision === "renovar" && (
              <>
                <Separator />
                <div>
                  <SectionHeader numero={2} titulo="Nuevas condiciones" completa={s2Completa} />

                  <div className="flex items-start gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2.5 mb-5">
                    <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 shrink-0 mt-0.5" />
                    <span>La nueva vigencia inicia el <strong>{nuevaFechaInicio}</strong>, día siguiente al vencimiento del contrato actual.</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Nuevo canon mensual</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                          <Input
                            className="pl-6"
                            value={nuevoCanon}
                            onChange={(e) => setNuevoCanon(formatInput(e.target.value))}
                          />
                        </div>
                        {canonNum !== contrato.canon && (
                          <p className="text-xs text-amber-600">
                            Variación: {canonNum > contrato.canon ? "+" : ""}{formatCOP(canonNum - contrato.canon)} respecto al actual
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Nueva fecha de vencimiento</Label>
                        <div className="relative">
                          <HugeiconsIcon
                            icon={Calendar01Icon}
                            strokeWidth={1.5}
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                          />
                          <Input
                            type="date"
                            value={nuevaFechaFin}
                            min={nuevaFechaInicio}
                            onChange={(e) => setNuevaFechaFin(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Depósito */}
                    <div className="space-y-3">
                      <Label>Depósito de garantía</Label>
                      <button
                        type="button"
                        onClick={() => setMismoDeposito(!mismoDeposito)}
                        className={cn(
                          "w-full flex items-center gap-3 border rounded-md px-4 py-3 text-sm transition-colors text-left",
                          mismoDeposito
                            ? "border-green-300 bg-green-50"
                            : "border-dashed text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "size-4 rounded border-2 flex items-center justify-center shrink-0",
                          mismoDeposito ? "border-green-500 bg-green-500" : "border-gray-400"
                        )}>
                          {mismoDeposito && <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-2.5 text-white" />}
                        </div>
                        <span>Mantener el mismo depósito ({formatCOP(contrato.deposito)})</span>
                      </button>

                      {!mismoDeposito && (
                        <div className="space-y-1.5 max-w-xs">
                          <Label>Nuevo valor del depósito</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                            <Input
                              className="pl-6"
                              value={nuevoDeposito}
                              onChange={(e) => setNuevoDeposito(formatInput(e.target.value))}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sección 3: Resumen de cambios */}
                <Separator />
                <div>
                  <SectionHeader numero={3} titulo="Resumen de cambios" completa={s2Completa} />
                  <div className="border rounded-md px-4 py-3 divide-y">
                    <CambioRow
                      label="Fecha inicio"
                      anterior={contrato.fechaInicio}
                      nuevo={nuevaFechaInicio}
                    />
                    <CambioRow
                      label="Fecha fin"
                      anterior={contrato.fechaFin}
                      nuevo={nuevaFechaFin}
                    />
                    <CambioRow
                      label="Canon"
                      anterior={formatCOP(contrato.canon)}
                      nuevo={formatCOP(canonNum)}
                      destacado
                    />
                    <CambioRow
                      label="Depósito"
                      anterior={formatCOP(contrato.deposito)}
                      nuevo={formatCOP(depositoFinal)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
                    <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-3.5 shrink-0 mt-0.5" />
                    Se creará un contrato nuevo en borrador. El contrato actual pasará a finalizado al activarse el nuevo.
                  </p>
                </div>
              </>
            )}

            {/* Sección 2b: Fecha de entrega (si no renueva) */}
            {decision === "no_renovar" && (
              <>
                <Separator />
                <div>
                  <SectionHeader numero={2} titulo="Fecha de entrega" completa={s2Completa} />
                  <p className="text-sm text-muted-foreground mb-4">
                    El contrato vence el <strong>{contrato.fechaFin}</strong>. Registra la fecha en que el arrendatario hará entrega del inmueble.
                  </p>
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
              </>
            )}

            {/* CTA */}
            {decision && (
              <div className="flex justify-end gap-3 pt-2 pb-8">
                <Link href={`/contratos/${contrato.id}`}>
                  <Button variant="outline">Cancelar</Button>
                </Link>
                <Button
                  disabled={!todoCorrecto}
                  onClick={() => router.push("/contratos")}
                  className={cn(decision === "no_renovar" && "bg-red-600 hover:bg-red-700 text-white")}
                >
                  {decision === "renovar" ? "Crear contrato de renovación" : "Confirmar no renovación"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="w-72 shrink-0 border-l bg-muted/20 px-5 py-6 overflow-y-auto hidden lg:block">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contrato actual</p>

          <div className="space-y-3 mb-5">
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

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Canon</span>
              <span className="font-medium">{formatCOP(contrato.canon)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Depósito</span>
              <span className="font-medium">{formatCOP(contrato.deposito)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inicio</span>
              <span>{contrato.fechaInicio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vencimiento</span>
              <span>{contrato.fechaFin}</span>
            </div>
            <div className={cn(
              "flex justify-between font-semibold pt-1",
              contrato.diasRestantes <= 10 ? "text-red-600" : "text-amber-600"
            )}>
              <span>Días restantes</span>
              <span>{contrato.diasRestantes}</span>
            </div>
          </div>

          {decision === "renovar" && s2Completa && (
            <>
              <Separator className="my-4" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Nuevo contrato</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Canon</span>
                  <span className={cn("font-medium", canonNum !== contrato.canon && "text-green-700")}>{formatCOP(canonNum)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Depósito</span>
                  <span>{formatCOP(depositoFinal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inicio</span>
                  <span>{nuevaFechaInicio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vencimiento</span>
                  <span>{nuevaFechaFin}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
