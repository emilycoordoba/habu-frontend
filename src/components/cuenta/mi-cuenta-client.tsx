"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserCircle02Icon,
  LockPasswordIcon,
  Notification03Icon,
  FloppyDiskIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  obtenerMiPerfil,
  actualizarMiPerfil,
  cambiarMiPassword,
  obtenerNotificaciones,
  actualizarNotificaciones,
} from "@/lib/api/cuenta"
import type { MiPerfil, NotificacionesConfig } from "@/lib/api/cuenta"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("")
}

const ROL_LABEL: Record<string, string> = {
  administrador: "Administrador",
  asesor: "Asesor",
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function CuentaSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="border-b px-6 h-28 bg-muted/20" />
      <div className="px-6 py-6 max-w-2xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-xl bg-muted/30" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-muted/30 rounded" />
            <div className="h-3 w-24 bg-muted/20 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 bg-muted/20 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab: Datos personales
// ---------------------------------------------------------------------------

interface DatosForm {
  nombre: string
  correo: string
  telefono: string
  ciudad: string
}

function TabDatos({ perfil }: { perfil: MiPerfil }) {
  const [form, setForm] = React.useState<DatosForm>({
    nombre:   perfil.nombre,
    correo:   perfil.correo,
    telefono: perfil.telefono ?? "",
    ciudad:   perfil.ciudad   ?? "",
  })
  const [guardando, setGuardando] = React.useState(false)
  const [guardado,  setGuardado]  = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    try {
      await actualizarMiPerfil({
        nombre:   form.nombre.trim(),
        correo:   form.correo.trim(),
        telefono: form.telefono.trim() || undefined,
        ciudad:   form.ciudad.trim()   || undefined,
      })
      toast.success("Datos actualizados correctamente")
      setGuardado(true)
      setTimeout(() => setGuardado(false), 3000)
    } catch {
      toast.error("No se pudieron guardar los cambios.")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="flex items-center gap-4">
        <Avatar className="size-16 rounded-xl">
          <AvatarFallback className="rounded-xl text-lg">{getInitials(form.nombre)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{form.nombre}</p>
          <p className="text-sm text-muted-foreground">{ROL_LABEL[perfil.rol] ?? perfil.rol}</p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="correo">Correo electrónico</Label>
          <Input
            id="correo"
            type="email"
            value={form.correo}
            onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={form.telefono}
              onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input
              id="ciudad"
              value={form.ciudad}
              onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="gap-2" disabled={guardando}>
          {guardado
            ? <><HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" /> Guardado</>
            : <><HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} className="size-4" /> {guardando ? "Guardando…" : "Guardar cambios"}</>
          }
        </Button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Tab: Seguridad
// ---------------------------------------------------------------------------

function strengthScore(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const STRENGTH_CONFIG = [
  { label: "Muy débil",  color: "bg-red-500" },
  { label: "Débil",      color: "bg-orange-500" },
  { label: "Regular",    color: "bg-yellow-500" },
  { label: "Fuerte",     color: "bg-green-400" },
  { label: "Muy fuerte", color: "bg-green-600" },
]

interface SeguridadForm {
  actual: string
  nueva: string
  confirmar: string
}

function TabSeguridad() {
  const [form, setForm]     = React.useState<SeguridadForm>({ actual: "", nueva: "", confirmar: "" })
  const [errors, setErrors] = React.useState<Partial<SeguridadForm>>({})
  const [guardando, setGuardando] = React.useState(false)

  const score    = strengthScore(form.nueva)
  const strength = form.nueva ? STRENGTH_CONFIG[score] : null

  function validate() {
    const e: Partial<SeguridadForm> = {}
    if (!form.actual)           e.actual    = "Ingresa tu contraseña actual."
    if (form.nueva.length < 8)  e.nueva     = "Mínimo 8 caracteres."
    if (form.nueva !== form.confirmar) e.confirmar = "Las contraseñas no coinciden."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setGuardando(true)
    try {
      await cambiarMiPassword({ actual: form.actual, nueva: form.nueva })
      toast.success("Contraseña actualizada correctamente")
      setForm({ actual: "", nueva: "", confirmar: "" })
      setErrors({})
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.toLowerCase().includes("actual") || msg.toLowerCase().includes("incorrecta")) {
        setErrors(e => ({ ...e, actual: "Contraseña actual incorrecta." }))
      } else {
        toast.error("No se pudo actualizar la contraseña.")
      }
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="actual">Contraseña actual</Label>
          <Input
            id="actual"
            type="password"
            value={form.actual}
            onChange={(e) => setForm((f) => ({ ...f, actual: e.target.value }))}
            className={cn(errors.actual && "border-destructive")}
          />
          {errors.actual && <p className="text-xs text-destructive">{errors.actual}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nueva">Nueva contraseña</Label>
          <Input
            id="nueva"
            type="password"
            value={form.nueva}
            onChange={(e) => setForm((f) => ({ ...f, nueva: e.target.value }))}
            className={cn(errors.nueva && "border-destructive")}
          />
          {form.nueva && strength && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-1 flex-1 rounded-full transition-colors", i < score ? strength.color : "bg-muted")}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{strength.label}</p>
            </div>
          )}
          {errors.nueva && <p className="text-xs text-destructive">{errors.nueva}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmar">Confirmar nueva contraseña</Label>
          <Input
            id="confirmar"
            type="password"
            value={form.confirmar}
            onChange={(e) => setForm((f) => ({ ...f, confirmar: e.target.value }))}
            className={cn(errors.confirmar && "border-destructive")}
          />
          {errors.confirmar && <p className="text-xs text-destructive">{errors.confirmar}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={guardando}>
          <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} className="size-4" />
          {guardando ? "Actualizando…" : "Actualizar contraseña"}
        </Button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Tab: Notificaciones
// ---------------------------------------------------------------------------

const NOTIF_DEFAULTS: NotificacionesConfig = {
  vencimientoContrato: true,
  cobroEnMora: true,
  nuevoContrato: false,
  pagoRegistrado: false,
}

function FilaNotificacion({
  label,
  descripcion,
  checked,
  onCheckedChange,
}: {
  label: string
  descripcion: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{descripcion}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

function TabNotificaciones({ inicial }: { inicial: NotificacionesConfig }) {
  const [notifs, setNotifs] = React.useState<NotificacionesConfig>(inicial)

  async function toggle(key: keyof NotificacionesConfig) {
    const nuevoValor = !notifs[key]
    setNotifs(n => ({ ...n, [key]: nuevoValor }))
    try {
      await actualizarNotificaciones({ [key]: nuevoValor })
      toast.success("Preferencia actualizada")
    } catch {
      setNotifs(n => ({ ...n, [key]: !nuevoValor }))
      toast.error("No se pudo guardar la preferencia.")
    }
  }

  return (
    <div className="max-w-lg">
      <p className="text-sm text-muted-foreground mb-2">
        Elige qué eventos generan una notificación en el sistema.
      </p>
      <Separator />
      <FilaNotificacion
        label="Vencimiento de contrato"
        descripcion="Alerta cuando un contrato está próximo a vencer según los días configurados en parámetros."
        checked={notifs.vencimientoContrato}
        onCheckedChange={() => toggle("vencimientoContrato")}
      />
      <Separator />
      <FilaNotificacion
        label="Cobro en mora"
        descripcion="Notificación cuando un cobro supera la fecha límite y entra en mora."
        checked={notifs.cobroEnMora}
        onCheckedChange={() => toggle("cobroEnMora")}
      />
      <Separator />
      <FilaNotificacion
        label="Nuevo contrato asignado"
        descripcion="Aviso cuando se te asigna un nuevo contrato como asesor."
        checked={notifs.nuevoContrato}
        onCheckedChange={() => toggle("nuevoContrato")}
      />
      <Separator />
      <FilaNotificacion
        label="Pago registrado"
        descripcion="Confirmación cuando se registra un pago en uno de tus contratos."
        checked={notifs.pagoRegistrado}
        onCheckedChange={() => toggle("pagoRegistrado")}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente raíz
// ---------------------------------------------------------------------------

export function MiCuentaClient() {
  const [perfil,   setPerfil]   = React.useState<MiPerfil | null>(null)
  const [notifs,   setNotifs]   = React.useState<NotificacionesConfig>(NOTIF_DEFAULTS)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelado = false
    Promise.all([obtenerMiPerfil(), obtenerNotificaciones()])
      .then(([perfilRes, notifsRes]) => {
        if (cancelado) return
        setPerfil(perfilRes.data)
        setNotifs(notifsRes.data ?? NOTIF_DEFAULTS)
      })
      .catch(() => {
        // Sin API todavía: mostramos la UI con campos vacíos — no bloquea
      })
      .finally(() => { if (!cancelado) setIsLoading(false) })
    return () => { cancelado = true }
  }, [])

  if (isLoading) return <CuentaSkeleton />

  const perfilParaTabs: MiPerfil = perfil ?? {
    id: "", nombre: "", correo: "", rol: "asesor",
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="datos" className="flex-1 flex flex-col min-h-0">
        <div className="border-b px-6">
          <div className="max-w-2xl mx-auto py-4">
            <h1 className="text-xl font-semibold">Mi cuenta</h1>
            <p className="text-sm text-muted-foreground">Administra tu perfil y preferencias</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none">
              {[
                { value: "datos",          label: "Datos personales", icon: UserCircle02Icon },
                { value: "seguridad",      label: "Seguridad",        icon: LockPasswordIcon },
                // { value: "notificaciones", label: "Notificaciones",   icon: Notification03Icon },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm gap-2"
                >
                  <HugeiconsIcon icon={tab.icon} strokeWidth={2} className="size-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto">
            <TabsContent value="datos" className="mt-0">
              <TabDatos perfil={perfilParaTabs} />
            </TabsContent>
            <TabsContent value="seguridad" className="mt-0">
              <TabSeguridad />
            </TabsContent>
            {/* <TabsContent value="notificaciones" className="mt-0">
              <TabNotificaciones inicial={notifs} />
            </TabsContent> */}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
