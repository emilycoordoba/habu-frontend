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
  Home11Icon,
  FileManagementIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// --- Mock: en producción vendría de la API según inmuebleId ---
const INMUEBLES_MOCK: Record<string, { nombre: string; direccion: string; propietario: string; tipo: string }> = {
  i1: { nombre: "Apto 502 Torres del Norte", direccion: "Cll 127 #15-40, Bogotá", propietario: "Jorge Herrera", tipo: "Apartamento" },
  i2: { nombre: "Local 8 CC Bulevar", direccion: "Av. El Dorado #68C-61, Bogotá", propietario: "Inversiones XYZ", tipo: "Local" },
  i3: { nombre: "Casa 5 Urb. Los Pinos", direccion: "Cll 12 #45-30, Medellín", propietario: "María Ospina", tipo: "Casa" },
  i4: { nombre: "Oficina 301 Ed. Empresarial", direccion: "Cra 43 #11-61, Medellín", propietario: "Rodrigo Castaño", tipo: "Oficina" },
}

interface FormularioArriendoClientProps {
  inmuebleId: string
  tipo: string
}

function formatCOP(value: string): string {
  const num = parseInt(value.replace(/\D/g, ""), 10)
  if (isNaN(num)) return ""
  return new Intl.NumberFormat("es-CO").format(num)
}

function parseCOP(value: string): number {
  return parseInt(value.replace(/\D/g, ""), 10) || 0
}

export function FormularioArriendoClient({ inmuebleId, tipo }: FormularioArriendoClientProps) {
  const inmueble = INMUEBLES_MOCK[inmuebleId]

  // — Sección 1: Vigencia
  const [fechaInicio, setFechaInicio] = React.useState("")
  const [duracionMeses, setDuracionMeses] = React.useState("12")

  // — Sección 2: Canon y pagos
  const [canonRaw, setCanonRaw] = React.useState("")
  const [diaCorte, setDiaCorte] = React.useState("1")
  const [formaPago, setFormaPago] = React.useState("")
  const [incluyeAdmin, setIncluyeAdmin] = React.useState(false)
  const [adminRaw, setAdminRaw] = React.useState("")

  // — Sección 3: Depósito
  const [tieneDeposito, setTieneDeposito] = React.useState(false)
  const [tipoDeposito, setTipoDeposito] = React.useState<"meses" | "valor_fijo">("meses")
  const [mesesDeposito, setMesesDeposito] = React.useState("1")
  const [depositoFijoRaw, setDepositoFijoRaw] = React.useState("")

  // — Sección 4: Codeudor
  const [tieneCodudor, setTieneCodudor] = React.useState(false)
  const [codeudorNombre, setCodeudorNombre] = React.useState("")
  const [codeudorDoc, setCodeudorDoc] = React.useState("")

  // — Cálculos derivados
  const canon = parseCOP(canonRaw)
  const adminValor = parseCOP(adminRaw)
  const depositoValor = tipoDeposito === "meses"
    ? canon * parseInt(mesesDeposito || "0", 10)
    : parseCOP(depositoFijoRaw)

  const fechaFin = React.useMemo(() => {
    if (!fechaInicio || !duracionMeses) return null
    const d = new Date(fechaInicio)
    d.setMonth(d.getMonth() + parseInt(duracionMeses, 10))
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
  }, [fechaInicio, duracionMeses])

  const puedeGuardar =
    !!fechaInicio && !!duracionMeses && canon > 0 && !!formaPago &&
    (!incluyeAdmin || adminValor > 0) &&
    (!tieneDeposito || (tipoDeposito === "meses" ? parseInt(mesesDeposito) > 0 : depositoValor > 0)) &&
    (!tieneCodudor || (!!codeudorNombre && !!codeudorDoc))

  function handleCanonChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "")
    setCanonRaw(raw ? formatCOP(raw) : "")
  }

  function handleAdminChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "")
    setAdminRaw(raw ? formatCOP(raw) : "")
  }

  function handleDepositoFijoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "")
    setDepositoFijoRaw(raw ? formatCOP(raw) : "")
  }

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
          <h1 className="text-lg font-semibold leading-none">Contrato de arriendo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {inmueble ? inmueble.nombre : "Inmueble no encontrado"} · Borrador
          </p>
        </div>
        <Badge variant="outline" className="ml-auto bg-gray-100 text-gray-600 border-gray-200">
          Borrador
        </Badge>
      </div>

      {/* Body — dos columnas */}
      <div className="flex flex-1 overflow-hidden">

        {/* Columna izquierda — formulario */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8 max-w-2xl">

          {/* Sección 1 — Vigencia */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={Calendar01Icon} title="Vigencia del contrato" number={1} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fecha-inicio">Fecha de inicio <Req /></Label>
                <Input
                  id="fecha-inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="duracion">Duración <Req /></Label>
                <Select value={duracionMeses} onValueChange={setDuracionMeses}>
                  <SelectTrigger id="duracion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[6, 12, 18, 24, 36].map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {m} meses {m === 12 ? "(1 año)" : m === 24 ? "(2 años)" : m === 36 ? "(3 años)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {fechaFin && (
              <p className="text-xs text-muted-foreground">
                Fecha de vencimiento estimada: <span className="font-medium text-foreground">{fechaFin}</span>
              </p>
            )}
          </section>

          <Separator />

          {/* Sección 2 — Canon y pagos */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={MoneyReceive02Icon} title="Canon y pagos" number={2} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="canon">Canon mensual <Req /></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input
                    id="canon"
                    className="pl-6"
                    placeholder="0"
                    value={canonRaw}
                    onChange={handleCanonChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dia-corte">Día de pago <Req /></Label>
                <Select value={diaCorte} onValueChange={setDiaCorte}>
                  <SelectTrigger id="dia-corte">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 5, 10, 15, 20, 25, 30].map((d) => (
                      <SelectItem key={d} value={String(d)}>Día {d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="forma-pago">Forma de pago <Req /></Label>
              <Select value={formaPago} onValueChange={setFormaPago}>
                <SelectTrigger id="forma-pago">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transferencia">Transferencia bancaria</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="pse">PSE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggle administración */}
            <ToggleRow
              checked={incluyeAdmin}
              onChange={setIncluyeAdmin}
              label="Incluye cuota de administración"
              description="Se cobrará junto con el canon mensual"
            />
            {incluyeAdmin && (
              <div className="flex flex-col gap-1.5 pl-6">
                <Label htmlFor="admin">Valor administración <Req /></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input
                    id="admin"
                    className="pl-6"
                    placeholder="0"
                    value={adminRaw}
                    onChange={handleAdminChange}
                  />
                </div>
              </div>
            )}
          </section>

          <Separator />

          {/* Sección 3 — Depósito */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={Home11Icon} title="Depósito de garantía" number={3} />
            <ToggleRow
              checked={tieneDeposito}
              onChange={setTieneDeposito}
              label="Aplica depósito de garantía"
              description="Suma que el arrendatario entrega como garantía"
            />
            {tieneDeposito && (
              <div className="flex flex-col gap-4 pl-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTipoDeposito("meses")}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left text-sm transition-colors",
                      tipoDeposito === "meses" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="font-medium">Meses de canon</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Calculado automáticamente</div>
                  </button>
                  <button
                    onClick={() => setTipoDeposito("valor_fijo")}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left text-sm transition-colors",
                      tipoDeposito === "valor_fijo" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="font-medium">Valor fijo</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Ingresado manualmente</div>
                  </button>
                </div>

                {tipoDeposito === "meses" ? (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="meses-deposito">Número de meses <Req /></Label>
                    <Select value={mesesDeposito} onValueChange={setMesesDeposito}>
                      <SelectTrigger id="meses-deposito">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3].map((m) => (
                          <SelectItem key={m} value={String(m)}>{m} {m === 1 ? "mes" : "meses"}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {canon > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Total depósito: <span className="font-medium text-foreground">
                          ${new Intl.NumberFormat("es-CO").format(depositoValor)}
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="deposito-fijo">Valor del depósito <Req /></Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        id="deposito-fijo"
                        className="pl-6"
                        placeholder="0"
                        value={depositoFijoRaw}
                        onChange={handleDepositoFijoChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* Sección 4 — Codeudor */}
          <section className="flex flex-col gap-4">
            <SectionHeader icon={UserIcon} title="Codeudor" number={4} />
            <ToggleRow
              checked={tieneCodudor}
              onChange={setTieneCodudor}
              label="El contrato requiere codeudor"
              description="Persona que respalda el pago del arrendamiento"
            />
            {tieneCodudor && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="codeudor-nombre">Nombre completo <Req /></Label>
                  <Input
                    id="codeudor-nombre"
                    value={codeudorNombre}
                    onChange={(e) => setCodeudorNombre(e.target.value)}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="codeudor-doc">Documento <Req /></Label>
                  <Input
                    id="codeudor-doc"
                    value={codeudorDoc}
                    onChange={(e) => setCodeudorDoc(e.target.value)}
                    placeholder="CC 1234567890"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Acciones */}
          <div className="flex items-center gap-3 pt-2 pb-8">
            <Link href="/contratos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button disabled={!puedeGuardar}>
              <HugeiconsIcon icon={FileManagementIcon} strokeWidth={2} className="size-4" />
              Guardar borrador
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
                label="Arrendador"
                value={inmueble.propietario}
              />
            )}
          </div>

          <Separator />

          {/* Vigencia */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Vigencia</p>
            <PreviewRow label="Inicio" value={fechaInicio ? new Date(fechaInicio).toLocaleDateString("es-CO") : "—"} />
            <PreviewRow label="Duración" value={duracionMeses ? `${duracionMeses} meses` : "—"} />
            <PreviewRow label="Vencimiento" value={fechaFin ?? "—"} />
          </div>

          <Separator />

          {/* Valores */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Valores</p>
            <PreviewRow
              label="Canon"
              value={canon > 0 ? `$${new Intl.NumberFormat("es-CO").format(canon)}` : "—"}
              highlight={canon > 0}
            />
            <PreviewRow label="Día de pago" value={`Día ${diaCorte}`} />
            {incluyeAdmin && (
              <PreviewRow
                label="Administración"
                value={adminValor > 0 ? `$${new Intl.NumberFormat("es-CO").format(adminValor)}` : "—"}
              />
            )}
            {incluyeAdmin && canon > 0 && adminValor > 0 && (
              <PreviewRow
                label="Total mensual"
                value={`$${new Intl.NumberFormat("es-CO").format(canon + adminValor)}`}
                highlight
              />
            )}
          </div>

          {tieneDeposito && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">Depósito</p>
                <PreviewRow
                  label="Tipo"
                  value={tipoDeposito === "meses" ? `${mesesDeposito} mes(es) de canon` : "Valor fijo"}
                />
                <PreviewRow
                  label="Monto"
                  value={depositoValor > 0 ? `$${new Intl.NumberFormat("es-CO").format(depositoValor)}` : "—"}
                />
              </div>
            </>
          )}

          {tieneCodudor && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">Codeudor</p>
                <PreviewRow label="Nombre" value={codeudorNombre || "—"} />
                <PreviewRow label="Documento" value={codeudorDoc || "—"} />
              </div>
            </>
          )}

          {/* Estado del formulario */}
          <div className={cn(
            "mt-auto rounded-lg border p-3 text-sm",
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

// — Subcomponentes de apoyo —

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

function ToggleRow({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors w-full",
        checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      )}
    >
      <div className={cn(
        "mt-0.5 size-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
        checked ? "border-primary bg-primary" : "border-muted-foreground"
      )}>
        {checked && <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-2.5 text-primary-foreground" />}
      </div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
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
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={cn("font-medium text-xs tabular-nums", highlight && "text-primary")}>{value}</span>
    </div>
  )
}
