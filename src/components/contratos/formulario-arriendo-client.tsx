"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowDown01Icon,
  Building04Icon,
  UserIcon,
  UserCheck01Icon,
  Calendar01Icon,
  MoneyReceive02Icon,
  Home11Icon,
  FileManagementIcon,
  Tick01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import { ASESORES_MOCK } from "@/lib/mock/usuarios"
import { obtenerInmueble } from "@/lib/api/inmuebles"
import { listarClientes } from "@/lib/api/clientes"
import { crearArriendo } from "@/lib/api/contratos"
import type { ClienteResumen } from "@/types/cliente.types"
import { toast } from "sonner"

interface InmuebleInfo { nombre: string; direccion: string; propietario: string }

interface FormularioArriendoClientProps {
  inmuebleId: string
  tipo: string
  asesorId?: string
  contraparteId?: string
}

function formatCOP(value: string): string {
  const num = parseInt(value.replace(/\D/g, ""), 10)
  if (isNaN(num)) return ""
  return new Intl.NumberFormat("es-CO").format(num)
}

function parseCOP(value: string): number {
  return parseInt(value.replace(/\D/g, ""), 10) || 0
}

export function FormularioArriendoClient({ inmuebleId, tipo, asesorId = "", contraparteId = "" }: FormularioArriendoClientProps) {
  const router = useRouter()
  const asesor = ASESORES_MOCK.find((a) => a.id === asesorId)

  const [inmuebleInfo, setInmuebleInfo]   = React.useState<InmuebleInfo | null>(null)
  const [codeudores, setCodeudores]       = React.useState<ClienteResumen[]>([])
  const [isSubmitting, setIsSubmitting]   = React.useState(false)

  React.useEffect(() => {
    if (!inmuebleId) return
    obtenerInmueble(inmuebleId)
      .then(res => {
        const d = res.data
        setInmuebleInfo({ nombre: d.direccion, direccion: d.ubicacion, propietario: d.propietario })
      })
      .catch(() => {})
  }, [inmuebleId])

  React.useEffect(() => {
    listarClientes({ tipo: "codeudor", limit: 100 })
      .then(res => setCodeudores(res.data))
      .catch(() => {})
  }, [])

  // — Sección 1: Vigencia
  const [fechaInicio, setFechaInicio] = React.useState("")
  const [duracionMeses, setDuracionMeses] = React.useState("12")

  // — Sección 2: Canon y pagos
  const [canonRaw, setCanonRaw] = React.useState("")
  const [diaCorte, setDiaCorte] = React.useState("1")
  const [incluyeAdmin, setIncluyeAdmin] = React.useState(false)
  const [adminRaw, setAdminRaw] = React.useState("")

  // — Sección 3: Depósito
  const [tieneDeposito, setTieneDeposito] = React.useState(false)
  const [tipoDeposito, setTipoDeposito] = React.useState<"meses" | "valor_fijo">("meses")
  const [mesesDeposito, setMesesDeposito] = React.useState("1")
  const [depositoFijoRaw, setDepositoFijoRaw] = React.useState("")

  // — Sección 4: Codeudor
  const [tieneCodudor, setTieneCodudor] = React.useState(false)
  const [codeudorId, setCodeudorId] = React.useState("")
  const [codeudorComboOpen, setCodeudorComboOpen] = React.useState(false)
  const codeudorSeleccionado = codeudores.find((c) => c.id === codeudorId)

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
    !!fechaInicio && !!duracionMeses && canon > 0 &&
    (!incluyeAdmin || adminValor > 0) &&
    (!tieneDeposito || (tipoDeposito === "meses" ? parseInt(mesesDeposito) > 0 : depositoValor > 0)) &&
    (!tieneCodudor || !!codeudorId)

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
            {inmuebleInfo ? inmuebleInfo.nombre : inmuebleId ? "Cargando inmueble…" : "Inmueble no especificado"} · Borrador
          </p>
        </div>
        <Badge variant="outline" className="ml-auto badge-gray">
          Borrador
        </Badge>
      </div>

      {/* Body — dos columnas centradas */}
      <div className="flex flex-1 overflow-hidden justify-center">

        {/* Columna izquierda — formulario */}
        <div className="w-full max-w-2xl overflow-y-auto px-6 py-6 flex flex-col gap-8">

          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
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
              <div className="flex flex-col gap-1.5 pl-6">
                <Label>Codeudor <Req /></Label>
                <Popover open={codeudorComboOpen} onOpenChange={setCodeudorComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={codeudorComboOpen}
                      className="w-full justify-between font-normal"
                    >
                      {codeudorSeleccionado ? (
                        <span className="truncate">{codeudorSeleccionado.nombre}</span>
                      ) : (
                        <span className="text-muted-foreground">Buscar codeudor registrado...</span>
                      )}
                      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                    <Command>
                      <CommandInput placeholder="Buscar por nombre o documento..." />
                      <CommandList>
                        <CommandEmpty>No hay clientes con tipo codeudor registrados.</CommandEmpty>
                        <CommandGroup>
                          {codeudores.map((c) => (
                            <CommandItem
                              key={c.id}
                              value={`${c.nombre} ${c.documento}`}
                              onSelect={() => {
                                setCodeudorId(c.id)
                                setCodeudorComboOpen(false)
                              }}
                              className="flex items-start gap-2 py-2"
                            >
                              <HugeiconsIcon
                                icon={Tick01Icon}
                                strokeWidth={2}
                                className={cn(
                                  "size-4 mt-0.5 shrink-0",
                                  codeudorId === c.id ? "opacity-100 text-primary" : "opacity-0"
                                )}
                              />
                              <div>
                                <div className="font-medium text-sm">{c.nombre}</div>
                                <div className="text-xs text-muted-foreground">{c.tipoDocumento} {c.documento}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </section>

          {/* Acciones */}
          <div className="flex items-center gap-3 pt-2 pb-8">
            <Link href="/contratos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button
              disabled={!puedeGuardar || isSubmitting}
              onClick={async () => {
                if (!puedeGuardar || isSubmitting) return
                setIsSubmitting(true)
                try {
                  const res = await crearArriendo({
                    inmuebleId,
                    contraparteId,
                    asesor: asesor?.nombre ?? asesorId,
                    fechaInicio,
                    duracionMeses: parseInt(duracionMeses, 10),
                    valorCanon: canon,
                    diaCorte: parseInt(diaCorte, 10),
                    incluyeAdministracion: incluyeAdmin,
                    ...(incluyeAdmin && adminValor > 0 ? { valorAdministracion: adminValor } : {}),
                    tieneDeposito,
                    ...(tieneDeposito ? {
                      tipoDeposito: tipoDeposito === "meses" ? "meses_canon" : "valor_fijo",
                      ...(tipoDeposito === "meses"
                        ? { mesesDeposito: parseInt(mesesDeposito, 10) }
                        : { valorDeposito: depositoValor }),
                    } : {}),
                    tieneCodeudor: tieneCodudor,
                    ...(tieneCodudor && codeudorSeleccionado ? {
                      codeudor: { nombre: codeudorSeleccionado.nombre, documento: codeudorSeleccionado.documento },
                    } : {}),
                  })
                  toast.success("Contrato creado como borrador")
                  router.push(`/contratos/${res.data.id}/documentos`)
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Error al crear el contrato")
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <HugeiconsIcon icon={FileManagementIcon} strokeWidth={2} className="size-4" />
              {isSubmitting ? "Guardando…" : "Guardar y continuar"}
            </Button>
          </div>
        </div>

        {/* Columna derecha — preview */}
        <aside className="w-80 shrink-0 border-l bg-muted/30 overflow-y-auto px-5 py-6 flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Resumen</h2>

          {/* Partes */}
          <div className="flex flex-col gap-3">
            <PreviewCard
              icon={Building04Icon}
              label="Inmueble"
              value={inmuebleInfo?.nombre ?? "—"}
              sub={inmuebleInfo?.direccion}
            />
            {inmuebleInfo && (
              <PreviewCard
                icon={UserIcon}
                label="Arrendador"
                value={inmuebleInfo.propietario}
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

          {tieneCodudor && codeudorSeleccionado && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">Codeudor</p>
                <PreviewRow label="Nombre" value={codeudorSeleccionado.nombre} />
                <PreviewRow label="Documento" value={`${codeudorSeleccionado.tipoDocumento} ${codeudorSeleccionado.documento}`} />
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

function SectionHeader({ icon, title, number }: { icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]; title: string; number: number }) {
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

function PreviewCard({ icon, label, value, sub }: { icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]; label: string; value: string; sub?: string }) {
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
