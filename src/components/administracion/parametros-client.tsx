"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface Parametros {
  // Mora
  moraGraciaDiasHabiles: number
  moraTasaResidencial: number        // % (generalmente 0 — ley 820)
  moraTasaComercial: number          // %
  moraAplicaResidencial: boolean

  // Contratos
  alertaVencimientoDias: number
  alertaRenovacionDias: number

}

const DEFAULTS: Parametros = {
  moraGraciaDiasHabiles: 5,
  moraTasaResidencial: 0,
  moraTasaComercial: 1.5,
  moraAplicaResidencial: false,

  alertaVencimientoDias: 30,
  alertaRenovacionDias: 60,

}

// ---------------------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------------------

function Seccion({ titulo, descripcion, children }: {
  titulo: string
  descripcion?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border">
      <div className="px-5 py-3.5 border-b bg-muted/20">
        <p className="text-sm font-semibold">{titulo}</p>
        {descripcion && <p className="text-xs text-muted-foreground mt-0.5">{descripcion}</p>}
      </div>
      <div className="px-5 py-4 space-y-4">
        {children}
      </div>
    </div>
  )
}

function Campo({ label, descripcion, children }: {
  label: string
  descripcion?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-medium">{label}</p>
        {descripcion && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{descripcion}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function NumericInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix,
  className,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
  className?: string
}) {
  return (
    <div className="relative flex items-center">
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className={cn("h-8 text-sm text-right pr-10 w-28", className)}
      />
      {suffix && (
        <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function ParametrosClient() {
  const [params, setParams] = React.useState<Parametros>(DEFAULTS)
  const [guardado, setGuardado] = React.useState(false)

  function set<K extends keyof Parametros>(key: K, value: Parametros[K]) {
    setParams(prev => ({ ...prev, [key]: value }))
    setGuardado(false)
  }

  function handleGuardar() {
    // TODO: llamar API al integrar backend
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 py-4 max-w-2xl w-full mx-auto space-y-5">

        {/* Aviso legal */}
        <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} className="size-4 shrink-0 mt-0.5 text-amber-600" />
          <p>
            Los parámetros de mora se rigen por la{" "}
            <strong>Ley 820 de 2003</strong> para arriendo residencial y por las tasas del{" "}
            <strong>Banco de la República</strong> para comercial. Verifica que los valores
            no superen los límites legales vigentes antes de guardar.
          </p>
        </div>

        {/* Mora */}
        <Seccion
          titulo="Mora y cobros vencidos"
          descripcion="Configura el comportamiento del cálculo de mora para contratos de arriendo."
        >
          <Campo
            label="Periodo de gracia"
            descripcion="Días hábiles después de la fecha límite antes de marcar un cobro en mora. Por defecto 5 según Ley 820/2003."
          >
            <NumericInput
              value={params.moraGraciaDiasHabiles}
              onChange={v => set("moraGraciaDiasHabiles", Math.max(0, Math.round(v)))}
              min={0}
              max={30}
              suffix="días"
            />
          </Campo>

          <Campo
            label="Mora en arriendo residencial"
            descripcion="La Ley 820/2003 no permite cobrar intereses de mora en contratos residenciales. Activa solo si cambios legales lo permiten."
          >
            <Switch
              checked={params.moraAplicaResidencial}
              onCheckedChange={v => set("moraAplicaResidencial", v)}
            />
          </Campo>

          <Campo
            label="Tasa de mora — residencial"
            descripcion="Porcentaje mensual de interés. Aplica solo si la opción anterior está activa."
          >
            <NumericInput
              value={params.moraTasaResidencial}
              onChange={v => set("moraTasaResidencial", v)}
              min={0}
              max={5}
              step={0.01}
              suffix="%"
              className={cn(!params.moraAplicaResidencial && "opacity-40 pointer-events-none")}
            />
          </Campo>

          <Campo
            label="Tasa de mora — comercial"
            descripcion="Porcentaje mensual de interés para arriendo de locales y oficinas."
          >
            <NumericInput
              value={params.moraTasaComercial}
              onChange={v => set("moraTasaComercial", v)}
              min={0}
              max={5}
              step={0.01}
              suffix="%"
            />
          </Campo>
        </Seccion>

        {/* Alertas de vencimiento */}
        <Seccion
          titulo="Alertas de contratos"
          descripcion="Define con cuánta anticipación el sistema notifica sobre vencimientos y renovaciones."
        >
          <Campo
            label="Alerta de vencimiento"
            descripcion="Días antes de que un contrato venza para enviar la primera alerta."
          >
            <NumericInput
              value={params.alertaVencimientoDias}
              onChange={v => set("alertaVencimientoDias", Math.max(1, Math.round(v)))}
              min={1}
              max={180}
              suffix="días"
            />
          </Campo>

          <Campo
            label="Alerta de renovación"
            descripcion="Días antes del vencimiento para iniciar el proceso de renovación o finalización."
          >
            <NumericInput
              value={params.alertaRenovacionDias}
              onChange={v => set("alertaRenovacionDias", Math.max(1, Math.round(v)))}
              min={1}
              max={180}
              suffix="días"
            />
          </Campo>
        </Seccion>

        {/* Botón guardar */}
        <div className="flex items-center justify-end gap-3 pb-6">
          {guardado && (
            <span className="flex items-center gap-1.5 text-xs text-green-700">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-3.5" />
              Cambios guardados
            </span>
          )}
          <Button onClick={handleGuardar}>
            Guardar parámetros
          </Button>
        </div>
      </div>
    </div>
  )
}
