"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Building04Icon,
  UserIcon,
  Calendar01Icon,
  MoneyReceive02Icon,
  Upload01Icon,
  Tick02Icon,
  CheckmarkCircle02Icon,
  PdfIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// --- Mock del contrato (se reemplaza con la API) ---
const CONTRATO_MOCK = {
  id: "promesa-1",
  referencia: "CTR-2025-005",
  inmueble: "Casa 5 Urb. Los Pinos",
  direccion: "Cll 12 #45-30, Medellín",
  vendedor: "María Ospina",
  comprador: "Felipe Morales",
  precio: 320000000,
  arras: 32000000,
  fechaEscrituracionPactada: "2025-06-15",
}

function formatCOP(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

interface ArchivoSubido {
  nombre: string
  objectUrl: string
}

interface EscrituracionClientProps {
  contratoId: string
}

export function EscrituracionClient({ contratoId }: EscrituracionClientProps) {
  const contrato = { ...CONTRATO_MOCK, id: contratoId }

  // — Sección 1: Escritura pública
  const [fechaEscritura, setFechaEscritura] = React.useState("")
  const [notaria, setNotaria] = React.useState("")
  const [escritura, setEscritura] = React.useState<ArchivoSubido | null>(null)

  // — Sección 2: Pagos
  const [arrasConfirmado, setArrasConfirmado] = React.useState(false)
  const [precioConfirmado, setPrecioConfirmado] = React.useState(false)
  const [comisionConfirmada, setComisionConfirmada] = React.useState(false)

  const comision = Math.round(contrato.precio * 0.03)

  // — Sección 3: Certificado de tradición
  const [certificado, setCertificado] = React.useState<ArchivoSubido | null>(null)

  // Limpieza de object URLs al desmontar
  React.useEffect(() => {
    return () => {
      if (escritura) URL.revokeObjectURL(escritura.objectUrl)
      if (certificado) URL.revokeObjectURL(certificado.objectUrl)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleArchivoChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: ArchivoSubido | null) => void,
    anterior: ArchivoSubido | null
  ) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (archivo.type !== "application/pdf") return
    if (archivo.size > 10 * 1024 * 1024) return
    if (anterior) URL.revokeObjectURL(anterior.objectUrl)
    setter({ nombre: archivo.name, objectUrl: URL.createObjectURL(archivo) })
    e.target.value = ""
  }

  const seccion1Completa = !!fechaEscritura && !!notaria && !!escritura
  const seccion2Completa = arrasConfirmado && precioConfirmado && comisionConfirmada
  const seccion3Completa = !!certificado
  const puedeFinalizarVenta = seccion1Completa && seccion2Completa && seccion3Completa

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <Link href={`/contratos/${contrato.id}`}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold leading-none">Registrar escrituración</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {contrato.referencia} · {contrato.inmueble}
          </p>
        </div>
        <Badge variant="outline" className="ml-auto bg-indigo-100 text-indigo-700 border-indigo-200">
          En escrituración
        </Badge>
      </div>

      {/* Body — dos columnas centradas */}
      <div className="flex flex-1 overflow-hidden justify-center">

        {/* Columna izquierda — formulario */}
        <div className="w-full max-w-2xl overflow-y-auto px-6 py-6 flex flex-col gap-8">

          {/* Sección 1 — Escritura pública */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={Calendar01Icon} title="Escritura pública" number={1} completa={seccion1Completa} />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fecha-escritura">Fecha de escrituración <Req /></Label>
                <Input
                  id="fecha-escritura"
                  type="date"
                  value={fechaEscritura}
                  onChange={(e) => setFechaEscritura(e.target.value)}
                />
                {contrato.fechaEscrituracionPactada && (
                  <p className="text-xs text-muted-foreground">
                    Pactada: <span className="font-medium text-foreground">
                      {new Date(contrato.fechaEscrituracionPactada).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notaria">Notaría <Req /></Label>
                <Input
                  id="notaria"
                  value={notaria}
                  onChange={(e) => setNotaria(e.target.value)}
                  placeholder="Notaría 12 de Medellín"
                />
              </div>
            </div>

            <FileUploadRow
              label="Escritura pública (PDF)"
              requerido
              archivo={escritura}
              onCargar={(e) => handleArchivoChange(e, setEscritura, escritura)}
            />
          </section>

          <Separator />

          {/* Sección 2 — Confirmación de pagos */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={MoneyReceive02Icon} title="Confirmación de pagos" number={2} completa={seccion2Completa} />
            <p className="text-xs text-muted-foreground -mt-1">
              Confirma que los siguientes pagos han sido recibidos por el vendedor.
            </p>

            <ConfirmPagoRow
              label="Arras"
              descripcion="Pago del comprador al vendedor"
              monto={contrato.arras}
              confirmado={arrasConfirmado}
              onChange={setArrasConfirmado}
            />
            <ConfirmPagoRow
              label="Precio total del inmueble"
              descripcion="Pago del comprador al vendedor"
              monto={contrato.precio}
              confirmado={precioConfirmado}
              onChange={setPrecioConfirmado}
            />
            <ConfirmPagoRow
              label="Comisión inmobiliaria (3%)"
              descripcion="Pago del vendedor a la inmobiliaria"
              monto={comision}
              confirmado={comisionConfirmada}
              onChange={setComisionConfirmada}
              destacado
            />
          </section>

          <Separator />

          {/* Sección 3 — Certificado de tradición */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={Building04Icon} title="Certificado de tradición" number={3} completa={seccion3Completa} />
            <p className="text-xs text-muted-foreground -mt-1">
              Sube el certificado de tradición y libertad actualizado que acredita el cambio de propietario.
            </p>

            <FileUploadRow
              label="Certificado de tradición y libertad (PDF)"
              requerido
              archivo={certificado}
              onCargar={(e) => handleArchivoChange(e, setCertificado, certificado)}
            />
          </section>

          {/* Acción final */}
          <div className="flex items-center gap-3 pt-2 pb-8">
            <Link href={`/contratos/${contrato.id}`}>
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button disabled={!puedeFinalizarVenta} className="gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />
              Finalizar venta
            </Button>
          </div>
        </div>

        {/* Columna derecha — resumen */}
        <aside className="w-80 shrink-0 border-l bg-muted/30 overflow-y-auto px-5 py-6 flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Resumen</h2>

          {/* Partes */}
          <div className="flex flex-col gap-3">
            <PreviewCard icon={Building04Icon} label="Inmueble" value={contrato.inmueble} sub={contrato.direccion} />
            <PreviewCard icon={UserIcon} label="Vendedor" value={contrato.vendedor} />
            <PreviewCard icon={UserIcon} label="Comprador" value={contrato.comprador} />
          </div>

          <Separator />

          {/* Valores del contrato */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Valores pactados</p>
            <PreviewRow label="Precio total" value={formatCOP(contrato.precio)} highlight />
            <PreviewRow label="Arras" value={formatCOP(contrato.arras)} />
            <PreviewRow label="Comisión (3%)" value={formatCOP(Math.round(contrato.precio * 0.03))} />
          </div>

          <Separator />

          {/* Estado de completitud por sección */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Progreso</p>
            <ProgresoItem label="Escritura pública" completa={seccion1Completa} />
            <ProgresoItem label="Pagos confirmados" completa={seccion2Completa} />
            <ProgresoItem label="Certificado de tradición" completa={seccion3Completa} />
          </div>

          {/* Estado del botón */}
          <div className={cn(
            "mt-auto rounded-lg border p-3",
            puedeFinalizarVenta
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-border bg-muted/50 text-muted-foreground"
          )}>
            <div className="flex items-center gap-2">
              {puedeFinalizarVenta && (
                <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4 shrink-0" />
              )}
              <span className="text-xs">
                {puedeFinalizarVenta
                  ? "Listo para finalizar la venta"
                  : "Completa las tres secciones para continuar"}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

// --- Subcomponentes ---

function Req() {
  return <span className="text-destructive">*</span>
}

function SectionHeader({
  icon, title, number, completa,
}: {
  icon: object; title: string; number: number; completa: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "flex size-7 items-center justify-center rounded-full text-xs font-bold shrink-0 transition-colors",
        completa ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
      )}>
        {completa
          ? <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-3.5" />
          : number
        }
      </div>
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 text-muted-foreground" />
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
  )
}

function FileUploadRow({
  label, requerido, archivo, onCargar,
}: {
  label: string
  requerido?: boolean
  archivo: { nombre: string; objectUrl: string } | null
  onCargar: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg border p-3 transition-colors",
      archivo ? "border-green-200 bg-green-50/50" : "bg-background"
    )}>
      <div className={cn(
        "size-8 rounded-full flex items-center justify-center shrink-0",
        archivo ? "bg-green-100" : "bg-muted"
      )}>
        <HugeiconsIcon
          icon={PdfIcon}
          strokeWidth={2}
          className={cn("size-4", archivo ? "text-green-600" : "text-muted-foreground")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{label}</span>
          {requerido && <Req />}
        </div>
        {archivo && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{archivo.nombre}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {archivo && (
          <a
            href={archivo.objectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors"
          >
            <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3" />
            Ver
          </a>
        )}
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={onCargar}
          />
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
            archivo
              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              : "border-border bg-background hover:bg-muted"
          )}>
            <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="size-3" />
            {archivo ? "Reemplazar" : "Cargar"}
          </span>
        </label>
      </div>
    </div>
  )
}

function ConfirmPagoRow({
  label, descripcion, monto, confirmado, onChange, destacado,
}: {
  label: string
  descripcion?: string
  monto: number
  confirmado: boolean
  onChange: (v: boolean) => void
  destacado?: boolean
}) {
  return (
    <button
      onClick={() => onChange(!confirmado)}
      className={cn(
        "flex items-center gap-3 rounded-lg border-2 p-3 w-full text-left transition-colors",
        confirmado ? "border-green-400 bg-green-50/60" : "border-border hover:border-primary/40",
        destacado && !confirmado && "border-dashed"
      )}
    >
      <div className={cn(
        "size-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
        confirmado ? "border-green-500 bg-green-500" : "border-muted-foreground"
      )}>
        {confirmado && (
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-3 text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {descripcion && (
          <p className="text-xs text-muted-foreground">{descripcion}</p>
        )}
        <p className={cn("text-sm tabular-nums mt-0.5", confirmado ? "text-green-700" : "text-muted-foreground")}>
          {formatCOP(monto)}
        </p>
      </div>
      {confirmado && (
        <Badge variant="outline" className="border-green-300 text-green-700 text-xs shrink-0">
          Confirmado
        </Badge>
      )}
    </button>
  )
}

function PreviewCard({ icon, label, value, sub }: { icon: object; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border bg-background p-3 flex items-start gap-3">
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
    </div>
  )
}

function PreviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={cn("font-medium text-xs tabular-nums", highlight && "text-primary")}>{value}</span>
    </div>
  )
}

function ProgresoItem({ label, completa }: { label: string; completa: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "size-4 rounded-full flex items-center justify-center shrink-0",
        completa ? "bg-green-500" : "bg-muted"
      )}>
        {completa && <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-2.5 text-white" />}
      </div>
      <span className={cn("text-xs", completa ? "text-foreground font-medium" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  )
}
