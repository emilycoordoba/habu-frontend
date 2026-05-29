"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  UserIcon,
  Building04Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

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
import type { TipoPersona, TipoCliente, Cliente } from "@/types/cliente.types"
import { TIPO_CLIENTE_CONFIG } from "@/types/cliente.types"
import { obtenerCliente, crearCliente, editarCliente } from "@/lib/api/clientes"
import type { CrearClienteBody } from "@/lib/api/clientes"

// ---------------------------------------------------------------------------
// Tipos internos del form
// ---------------------------------------------------------------------------

interface FormState {
  tipoPersona: TipoPersona
  nombre: string
  tipoDocumento: Cliente["tipoDocumento"]
  documento: string
  telefono: string
  email: string
  ciudad: string
  representanteLegal: string
  tipos: TipoCliente[]
}

const TIPOS_CLIENTE: { value: TipoCliente; descripcion: string }[] = [
  { value: "propietario",  descripcion: "Dueño de uno o más inmuebles en administración" },
  { value: "arrendatario", descripcion: "Arrendatario activo o en proceso de contrato" },
  { value: "prospecto",    descripcion: "Interesado aún sin contrato vigente" },
  { value: "codeudor",     descripcion: "Codeudor solidario en un contrato de arriendo" },
]

const ESTADO_INICIAL: FormState = {
  tipoPersona: "natural",
  nombre: "",
  tipoDocumento: "CC",
  documento: "",
  telefono: "",
  email: "",
  ciudad: "",
  representanteLegal: "",
  tipos: [],
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function RegistrarClienteClient({ clienteId }: { clienteId?: string }) {
  const router = useRouter()
  const esEdicion = !!clienteId

  const [form, setForm]           = React.useState<FormState>(ESTADO_INICIAL)
  const [guardando, setGuardando] = React.useState(false)
  const [isLoadingData, setIsLoadingData] = React.useState(!!clienteId)

  // Carga datos en modo edición vía API
  React.useEffect(() => {
    if (!clienteId) return
    let cancelado = false
    setIsLoadingData(true)

    obtenerCliente(clienteId)
      .then(res => {
        if (cancelado) return
        const d = res.data
        setForm({
          tipoPersona:       d.tipoPersona,
          nombre:            d.nombre,
          tipoDocumento:     d.tipoDocumento,
          documento:         d.documento,
          telefono:          d.telefono,
          email:             d.email,
          ciudad:            d.ciudad,
          representanteLegal: d.representanteLegal ?? "",
          tipos:             d.tipos,
        })
        setIsLoadingData(false)
      })
      .catch(() => {
        if (cancelado) return
        toast.error("No se pudo cargar el cliente")
        setIsLoadingData(false)
      })

    return () => { cancelado = true }
  }, [clienteId])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleTipo(tipo: TipoCliente) {
    setForm(prev => ({
      ...prev,
      tipos: prev.tipos.includes(tipo)
        ? prev.tipos.filter(t => t !== tipo)
        : [...prev.tipos, tipo],
    }))
  }

  function switchTipoPersona(tipo: TipoPersona) {
    setForm(prev => ({
      ...prev,
      tipoPersona: tipo,
      tipoDocumento: tipo === "juridica" ? "NIT" : "CC",
      representanteLegal: "",
    }))
  }

  const puedeGuardar =
    form.nombre.trim() !== "" &&
    form.documento.trim() !== "" &&
    form.telefono.trim() !== "" &&
    form.email.trim() !== "" &&
    form.ciudad.trim() !== "" &&
    form.tipos.length > 0 &&
    (form.tipoPersona === "natural" || form.representanteLegal.trim() !== "")

  async function handleGuardar() {
    if (!puedeGuardar || guardando) return
    setGuardando(true)

    try {
      const base = {
        tipos:    form.tipos,
        telefono: form.telefono.trim(),
        email:    form.email.trim(),
        ciudad:   form.ciudad.trim(),
      }
      const body: CrearClienteBody = form.tipoPersona === "juridica"
        ? { ...base, tipoPersona: "juridica", nombre: form.nombre.trim(), documento: form.documento.trim(), tipoDocumento: "NIT", representanteLegal: form.representanteLegal.trim() }
        : { ...base, tipoPersona: "natural",  nombre: form.nombre.trim(), documento: form.documento.trim(), tipoDocumento: form.tipoDocumento as "CC" | "CE" | "PAS" }

      if (esEdicion && clienteId) {
        await editarCliente(clienteId, body)
      } else {
        await crearCliente(body)
      }

      toast.success(esEdicion ? "Cliente actualizado" : "Cliente registrado correctamente")
      router.push("/clientes")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setGuardando(false)
    }
  }

  const esNatural = form.tipoPersona === "natural"

  if (isLoadingData) {
    return (
      <div className="flex flex-col h-full animate-pulse">
        <div className="border-b px-6 py-4 flex items-center gap-3">
          <div className="size-8 rounded-md bg-muted" />
          <div className="flex-1 space-y-1.5">
            <div className="h-5 w-36 rounded bg-muted" />
            <div className="h-3.5 w-52 rounded bg-muted" />
          </div>
          <div className="h-8 w-28 rounded-md bg-muted" />
        </div>
        <div className="px-6 py-8 max-w-2xl mx-auto w-full space-y-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="space-y-4">
              <div className="h-3.5 w-32 rounded bg-muted" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-9 rounded-md bg-muted" />
                <div className="h-9 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <Link href="/clientes">
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">
            {esEdicion ? "Editar cliente" : "Registrar cliente"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {esEdicion ? "Modifica los datos del cliente." : "Completa los datos para registrar un nuevo cliente."}
          </p>
        </div>
        <Button onClick={handleGuardar} disabled={!puedeGuardar || guardando} size="sm">
          {guardando ? "Guardando…" : esEdicion ? "Guardar cambios" : "Registrar cliente"}
        </Button>
      </div>

      <div className="px-6 py-8 max-w-2xl mx-auto w-full space-y-8">

        {/* Tipo de persona */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Tipo de persona
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <TipoPersonaBtn
              activo={esNatural}
              icon={UserIcon}
              label="Persona natural"
              descripcion="Individuo con cédula, cédula de extranjería o pasaporte"
              onClick={() => switchTipoPersona("natural")}
            />
            <TipoPersonaBtn
              activo={!esNatural}
              icon={Building04Icon}
              label="Persona jurídica"
              descripcion="Empresa, sociedad o entidad con NIT"
              onClick={() => switchTipoPersona("juridica")}
            />
          </div>
        </section>

        <Separator />

        {/* Datos de identificación */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {esNatural ? "Datos personales" : "Datos de la empresa"}
          </h2>

          {/* Nombre / Razón social */}
          <Field label={esNatural ? "Nombre completo" : "Razón social"} required>
            <Input
              value={form.nombre}
              onChange={e => set("nombre", e.target.value)}
              placeholder={esNatural ? "Ana Lucía Martínez Ruiz" : "Inversiones Ejemplo S.A.S."}
            />
          </Field>

          {/* Documento */}
          <div className="grid grid-cols-[140px_1fr] gap-3">
            <Field label="Tipo" required>
              <Select
                value={form.tipoDocumento}
                onValueChange={v => set("tipoDocumento", v as Cliente["tipoDocumento"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {esNatural ? (
                    <>
                      <SelectItem value="CC">CC — Cédula</SelectItem>
                      <SelectItem value="CE">CE — Cédula extranjería</SelectItem>
                      <SelectItem value="PAS">PAS — Pasaporte</SelectItem>
                    </>
                  ) : (
                    <SelectItem value="NIT">NIT</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Número de documento" required>
              <Input
                value={form.documento}
                onChange={e => set("documento", e.target.value)}
                placeholder={esNatural ? "52.789.034" : "900.123.456-7"}
              />
            </Field>
          </div>

          {/* Representante legal — solo jurídica */}
          {!esNatural && (
            <Field label="Representante legal" required>
              <Input
                value={form.representanteLegal}
                onChange={e => set("representanteLegal", e.target.value)}
                placeholder="Nombre completo del representante"
              />
            </Field>
          )}
        </section>

        <Separator />

        {/* Contacto */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Contacto
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Teléfono / Celular" required>
              <Input
                value={form.telefono}
                onChange={e => set("telefono", e.target.value)}
                placeholder="310 456 7890"
              />
            </Field>
            <Field label="Ciudad" required>
              <Input
                value={form.ciudad}
                onChange={e => set("ciudad", e.target.value)}
                placeholder="Bogotá"
              />
            </Field>
          </div>

          <Field label="Correo electrónico" required>
            <Input
              type="email"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              placeholder={esNatural ? "ana.martinez@gmail.com" : "gerencia@empresa.co"}
            />
          </Field>
        </section>

        <Separator />

        {/* Rol(es) del cliente */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Rol en el sistema <span className="text-destructive">*</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Un cliente puede tener más de un rol simultáneamente.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TIPOS_CLIENTE.map(({ value, descripcion }) => {
              const cfg = TIPO_CLIENTE_CONFIG[value]
              const activo = form.tipos.includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleTipo(value)}
                  className={cn(
                    "rounded-lg border-2 p-3 text-left transition-colors",
                    activo ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox activo={activo} />
                    <span className="text-sm font-medium">{cfg.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">{descripcion}</p>
                </button>
              )
            })}
          </div>
          {form.tipos.length === 0 && (
            <p className="text-xs text-destructive">Selecciona al menos un rol.</p>
          )}
        </section>

        {/* Botón final */}
        <div className="flex justify-end pt-2 pb-8">
          <Button onClick={handleGuardar} disabled={!puedeGuardar || guardando}>
            {guardando ? "Guardando…" : esEdicion ? "Guardar cambios" : "Registrar cliente"}
          </Button>
        </div>

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}

function TipoPersonaBtn({
  activo,
  icon,
  label,
  descripcion,
  onClick,
}: {
  activo: boolean
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  label: string
  descripcion: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border-2 p-4 text-left transition-colors flex gap-3",
        activo ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      )}
    >
      <HugeiconsIcon
        icon={icon}
        strokeWidth={1.5}
        className={cn("size-5 shrink-0 mt-0.5", activo ? "text-primary" : "text-muted-foreground")}
      />
      <div>
        <p className={cn("text-sm font-medium", activo ? "text-primary" : "")}>{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{descripcion}</p>
      </div>
      {activo && (
        <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 text-primary ml-auto shrink-0 self-start" />
      )}
    </button>
  )
}

function Checkbox({ activo }: { activo: boolean }) {
  return (
    <div className={cn(
      "size-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
      activo ? "border-primary bg-primary" : "border-muted-foreground/40"
    )}>
      {activo && (
        <svg viewBox="0 0 10 8" fill="none" className="size-2.5">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}
