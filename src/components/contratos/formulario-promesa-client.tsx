"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Building04Icon,
  UserIcon,
  UserCheck01Icon,
  Calendar01Icon,
  MoneyReceive02Icon,
  FileManagementIcon,
  Tick02Icon,
  Home11Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ASESORES_MOCK } from "@/lib/mock/usuarios"

// --- Mock: en producción vendría de la API según inmuebleId ---
const INMUEBLES_MOCK: Record<string, { nombre: string; direccion: string; propietario: string; tipo: string }> = {
  i1: { nombre: "Apto 502 Torres del Norte", direccion: "Cll 127 #15-40, Bogotá", propietario: "Jorge Herrera", tipo: "Apartamento" },
  i2: { nombre: "Local 8 CC Bulevar", direccion: "Av. El Dorado #68C-61, Bogotá", propietario: "Inversiones XYZ", tipo: "Local" },
  i3: { nombre: "Casa 5 Urb. Los Pinos", direccion: "Cll 12 #45-30, Medellín", propietario: "María Ospina", tipo: "Casa" },
  i4: { nombre: "Oficina 301 Ed. Empresarial", direccion: "Cra 43 #11-61, Medellín", propietario: "Rodrigo Castaño", tipo: "Oficina" },
}

type FormaPago = "contado" | "credito_hipotecario" | "mixto"

interface FormularioPromesaClientProps {
  inmuebleId: string
  tipo: string
  asesorId?: string
}

function formatCOP(value: string): string {
  const num = parseInt(value.replace(/\D/g, ""), 10)
  if (isNaN(num)) return ""
  return new Intl.NumberFormat("es-CO").format(num)
}

function parseCOP(value: string): number {
  return parseInt(value.replace(/\D/g, ""), 10) || 0
}

export function FormularioPromesaClient({ inmuebleId, asesorId = "" }: FormularioPromesaClientProps) {
  const router = useRouter()
  const inmueble = INMUEBLES_MOCK[inmuebleId]
  const asesor = ASESORES_MOCK.find((a) => a.id === asesorId)

  // — Sección 1: Precio y arras
  const [precioRaw, setPrecioRaw] = React.useState("")
  const [arrasRaw, setArrasRaw] = React.useState("")
  const [fechaLimiteArras, setFechaLimiteArras] = React.useState("")

  // — Sección 2: Forma de pago
  const [formaPago, setFormaPago] = React.useState<FormaPago | "">("")
  const [contadoRaw, setContadoRaw] = React.useState("")
  const [creditoRaw, setCreditoRaw] = React.useState("")
  const [entidadFinanciera, setEntidadFinanciera] = React.useState("")
  const [fechaAprobacionCredito, setFechaAprobacionCredito] = React.useState("")

  // — Sección 3: Escrituración
  const [fechaEscrituracion, setFechaEscrituracion] = React.useState("")
  const [notaria, setNotaria] = React.useState("")

  // — Cálculos derivados
  const precio = parseCOP(precioRaw)
  const arras = parseCOP(arrasRaw)
  const contado = parseCOP(contadoRaw)
  const credito = parseCOP(creditoRaw)

  const porcentajeArras = precio > 0 && arras > 0
    ? ((arras / precio) * 100).toFixed(1)
    : null

  const saldoMixto = formaPago === "mixto" && contado > 0 && credito > 0
    ? contado + credito
    : null

  const diferenciaMixto = saldoMixto !== null && precio > 0
    ? saldoMixto - precio
    : null

  const tieneCredito = formaPago === "credito_hipotecario" || formaPago === "mixto"

  const puedeGuardar =
    precio > 0 && arras > 0 && !!fechaLimiteArras && !!formaPago &&
    !!fechaEscrituracion &&
    (formaPago !== "mixto" || (contado > 0 && credito > 0)) &&
    (!tieneCredito || !!entidadFinanciera)

  function handleCurrencyChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "")
      setter(raw ? formatCOP(raw) : "")
    }
  }

  const FORMAS_PAGO: { value: FormaPago; label: string; desc: string }[] = [
    { value: "contado", label: "Contado", desc: "Pago total al momento de la escritura" },
    { value: "credito_hipotecario", label: "Crédito hipotecario", desc: "Financiado por entidad bancaria" },
    { value: "mixto", label: "Mixto", desc: "Parte de contado, parte con crédito" },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <Link href="/contratos">
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold leading-none">Promesa de compraventa</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {inmueble ? inmueble.nombre : "Inmueble no encontrado"} · Borrador
          </p>
        </div>
        <Badge variant="outline" className="ml-auto bg-gray-100 text-gray-600 border-gray-200">
          Borrador
        </Badge>
      </div>

      {/* Body — dos columnas centradas */}
      <div className="flex flex-1 overflow-hidden justify-center">

        {/* Columna izquierda — formulario */}
        <div className="w-full max-w-2xl overflow-y-auto px-6 py-6 flex flex-col gap-8">

          {/* Sección 1 — Precio y arras */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={MoneyReceive02Icon} title="Precio y arras" number={1} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="precio">Precio total del inmueble <Req /></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="precio"
                  className="pl-6"
                  placeholder="0"
                  value={precioRaw}
                  onChange={handleCurrencyChange(setPrecioRaw)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="arras">Valor de arras <Req /></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input
                    id="arras"
                    className="pl-6"
                    placeholder="0"
                    value={arrasRaw}
                    onChange={handleCurrencyChange(setArrasRaw)}
                  />
                </div>
                {porcentajeArras && (
                  <p className="text-xs text-muted-foreground">
                    Equivale al <span className="font-medium text-foreground">{porcentajeArras}%</span> del precio
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fecha-arras">Fecha límite de arras <Req /></Label>
                <Input
                  id="fecha-arras"
                  type="date"
                  value={fechaLimiteArras}
                  onChange={(e) => setFechaLimiteArras(e.target.value)}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección 2 — Forma de pago */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={Home11Icon} title="Forma de pago" number={2} />
            <div className="grid grid-cols-3 gap-3">
              {FORMAS_PAGO.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setFormaPago(value)}
                  className={cn(
                    "rounded-lg border-2 p-3 text-left transition-colors",
                    formaPago === value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{desc}</div>
                </button>
              ))}
            </div>

            {/* Campos adicionales solo para mixto */}
            {formaPago === "mixto" && (
              <div className="flex flex-col gap-3 pl-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="valor-contado">Valor de contado <Req /></Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        id="valor-contado"
                        className="pl-6"
                        placeholder="0"
                        value={contadoRaw}
                        onChange={handleCurrencyChange(setContadoRaw)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="valor-credito">Valor crédito hipotecario <Req /></Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        id="valor-credito"
                        className="pl-6"
                        placeholder="0"
                        value={creditoRaw}
                        onChange={handleCurrencyChange(setCreditoRaw)}
                      />
                    </div>
                  </div>
                </div>
                {saldoMixto !== null && precio > 0 && (
                  <p className={cn(
                    "text-xs",
                    diferenciaMixto === 0
                      ? "text-green-600"
                      : "text-destructive"
                  )}>
                    {diferenciaMixto === 0
                      ? "Los valores cuadran con el precio total."
                      : diferenciaMixto! > 0
                        ? `Excede el precio total en $${new Intl.NumberFormat("es-CO").format(diferenciaMixto!)}`
                        : `Falta $${new Intl.NumberFormat("es-CO").format(Math.abs(diferenciaMixto!))} para cubrir el precio total`
                    }
                  </p>
                )}
              </div>
            )}

            {/* Campos de crédito hipotecario (crédito puro o mixto) */}
            {tieneCredito && (
              <div className="grid grid-cols-2 gap-4 pl-1">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="entidad-financiera">Entidad financiera <Req /></Label>
                  <Input
                    id="entidad-financiera"
                    value={entidadFinanciera}
                    onChange={(e) => setEntidadFinanciera(e.target.value)}
                    placeholder="Bancolombia, Davivienda..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fecha-aprobacion">Fecha estimada de aprobación</Label>
                  <Input
                    id="fecha-aprobacion"
                    type="date"
                    value={fechaAprobacionCredito}
                    onChange={(e) => setFechaAprobacionCredito(e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>

          <Separator />

          {/* Sección 3 — Escrituración */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={Calendar01Icon} title="Escrituración" number={3} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fecha-escrituracion">Fecha acordada <Req /></Label>
                <Input
                  id="fecha-escrituracion"
                  type="date"
                  value={fechaEscrituracion}
                  onChange={(e) => setFechaEscrituracion(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notaria">Notaría</Label>
                <Input
                  id="notaria"
                  value={notaria}
                  onChange={(e) => setNotaria(e.target.value)}
                  placeholder="Notaría 12 de Bogotá"
                />
              </div>
            </div>
          </section>

          {/* Acciones */}
          <div className="flex items-center gap-3 pt-2 pb-8">
            <Link href="/contratos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button
              disabled={!puedeGuardar}
              onClick={() => router.push("/contratos/5/documentos")}
            >
              <HugeiconsIcon icon={FileManagementIcon} strokeWidth={2} className="size-4" />
              Guardar y continuar
            </Button>
          </div>
        </div>

        {/* Columna derecha — preview */}
        <aside className="w-80 shrink-0 border-l bg-muted/30 overflow-y-auto px-5 py-6 flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Resumen</h2>

          {/* Partes */}
          <div className="flex flex-col gap-3">
            {inmueble ? (
              <PreviewCard
                icon={Building04Icon}
                label="Inmueble"
                value={inmueble.nombre}
                sub={inmueble.direccion}
              />
            ) : (
              <PreviewCard icon={Building04Icon} label="Inmueble" value="—" />
            )}
            {inmueble && (
              <PreviewCard
                icon={UserIcon}
                label="Vendedor"
                value={inmueble.propietario}
              />
            )}
            {asesor && (
              <PreviewCard
                icon={UserCheck01Icon}
                label="Asesor responsable"
                value={asesor.nombre}
                sub={asesor.email}
              />
            )}
          </div>

          <Separator />

          {/* Precio y arras */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Precio y arras</p>
            <PreviewRow
              label="Precio total"
              value={precio > 0 ? `$${new Intl.NumberFormat("es-CO").format(precio)}` : "—"}
              highlight={precio > 0}
            />
            <PreviewRow
              label="Arras"
              value={arras > 0 ? `$${new Intl.NumberFormat("es-CO").format(arras)}${porcentajeArras ? ` (${porcentajeArras}%)` : ""}` : "—"}
            />
            <PreviewRow
              label="Fecha límite arras"
              value={fechaLimiteArras ? new Date(fechaLimiteArras).toLocaleDateString("es-CO") : "—"}
            />
          </div>

          <Separator />

          {/* Forma de pago */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Forma de pago</p>
            <PreviewRow
              label="Modalidad"
              value={
                formaPago === "contado" ? "Contado"
                : formaPago === "credito_hipotecario" ? "Crédito hipotecario"
                : formaPago === "mixto" ? "Mixto"
                : "—"
              }
            />
            {formaPago === "mixto" && (
              <>
                <PreviewRow label="De contado" value={contado > 0 ? `$${new Intl.NumberFormat("es-CO").format(contado)}` : "—"} />
                <PreviewRow label="Crédito" value={credito > 0 ? `$${new Intl.NumberFormat("es-CO").format(credito)}` : "—"} />
              </>
            )}
            {tieneCredito && (
              <>
                <PreviewRow label="Entidad financiera" value={entidadFinanciera || "—"} />
                {fechaAprobacionCredito && (
                  <PreviewRow label="Aprobación estimada" value={new Date(fechaAprobacionCredito).toLocaleDateString("es-CO")} />
                )}
              </>
            )}
          </div>

          <Separator />

          {/* Escrituración */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Escrituración</p>
            <PreviewRow
              label="Fecha acordada"
              value={fechaEscrituracion ? new Date(fechaEscrituracion).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
            />
            {notaria && <PreviewRow label="Notaría" value={notaria} />}
          </div>

          {/* Estado del formulario */}
          <div className={cn(
            "mt-auto rounded-lg border p-3",
            puedeGuardar ? "border-green-200 bg-green-50 text-green-700" : "border-border bg-muted/50 text-muted-foreground"
          )}>
            <div className="flex items-center gap-2">
              {puedeGuardar && <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4 shrink-0" />}
              <span className="text-xs">
                {puedeGuardar
                  ? "Listo para guardar como borrador"
                  : "Completa los campos requeridos para continuar"}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

// — Subcomponentes —

function Req() {
  return <span className="text-destructive">*</span>
}

function SectionHeader({ icon, title, number }: { icon: object; title: string; number: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
        {number}
      </div>
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 text-muted-foreground" />
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
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
