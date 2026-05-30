"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowDown01Icon,
  Calendar03Icon,
  UserIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  TelephoneIcon,
  Mail01Icon,
  MessageMultiple01Icon,
  House01Icon,
  Tick01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { obtenerSolicitudChatbot, asignarAsesorChatbot, marcarAtendidaChatbot } from "@/lib/api/chatbot"
import { listarUsuarios } from "@/lib/api/administracion"
import { ESTADO_CONFIG } from "@/components/chatbot/chatbot-config"
import type { SolicitudChatbot } from "@/types/chatbot.types"

const TIPO_LABEL: Record<SolicitudChatbot["tipo"], string> = {
  visita:   "Visita agendada",
  contacto: "Solicitud de contacto",
  asesor:   "Solicitud de asesor",
}

function formatFechaLarga(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function DetalleSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-y-auto animate-pulse">
      <div className="border-b px-6 py-4 h-16 bg-muted/20" />
      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        <div className="space-y-4">
          <div className="border rounded-lg h-48 bg-muted/20" />
          <div className="border rounded-lg h-24 bg-muted/20" />
        </div>
        <div className="lg:col-span-2 border rounded-lg h-80 bg-muted/20" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function DetalleSolicitudClient({ id }: { id: string }) {
  const router = useRouter()

  const [solicitud, setSolicitud] = React.useState<SolicitudChatbot | null>(null)
  const [asesores, setAsesores] = React.useState<{ id: string; nombre: string; correo: string }[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)
  const [guardando, setGuardando] = React.useState(false)
  const [asesorComboOpen, setAsesorComboOpen] = React.useState(false)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)
    Promise.all([
      obtenerSolicitudChatbot(id),
      listarUsuarios({ rol: "asesor", estado: "activo", limit: 100 }),
    ])
      .then(([solRes, asesorRes]) => {
        if (cancelado) return
        setSolicitud(solRes.data)
        setAsesores((asesorRes.data ?? []).map(u => ({ id: u.id, nombre: u.nombre, correo: u.correo })))
      })
      .catch(() => { if (!cancelado) setError("No se pudo cargar la solicitud.") })
      .finally(() => { if (!cancelado) setIsLoading(false) })
    return () => { cancelado = true }
  }, [id, retryKey])

  async function handleAsignarAsesor(asesorNombre: string) {
    if (!solicitud) return
    setGuardando(true)
    try {
      const res = await asignarAsesorChatbot(solicitud.id, asesorNombre)
      setSolicitud(s => s ? { ...s, asesorAsignado: res.data.asesorAsignado, estado: res.data.estado } : s)
      toast.success(`Asesor ${asesorNombre} asignado`)
    } catch {
      toast.error("No se pudo asignar el asesor.")
    } finally {
      setGuardando(false)
    }
  }

  async function handleMarcarAtendida() {
    if (!solicitud) return
    setGuardando(true)
    try {
      await marcarAtendidaChatbot(solicitud.id)
      setSolicitud(s => s ? { ...s, estado: "atendida" } : s)
      toast.success("Solicitud marcada como atendida")
    } catch {
      toast.error("No se pudo actualizar la solicitud.")
    } finally {
      setGuardando(false)
    }
  }

  if (isLoading) return <DetalleSkeleton />

  if (error || !solicitud) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={1.5} className="size-10 opacity-30" />
        <p className="text-sm">{error ?? "Solicitud no encontrada."}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setRetryKey(k => k + 1)} className="gap-2">
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
            Reintentar
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    )
  }

  const estadoConf = ESTADO_CONFIG[solicitud.estado]

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-semibold">{solicitud.nombre}</h1>
            <Badge variant="outline" className={cn("text-xs gap-1 py-0", estadoConf.className)}>
              <HugeiconsIcon icon={estadoConf.icon} strokeWidth={2} className="size-3" />
              {estadoConf.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{TIPO_LABEL[solicitud.tipo]} · {formatFechaLarga(solicitud.fecha)}</p>
        </div>
        {solicitud.estado !== "atendida" && (
          <Button size="sm" className="gap-1.5 shrink-0" onClick={handleMarcarAtendida} disabled={guardando}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
            Marcar atendida
          </Button>
        )}
      </div>

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">

        {/* ── Columna izquierda: datos del prospecto ── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Datos de contacto */}
          <div className="border rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold">Datos del prospecto</h2>
            <Separator />
            <DataRow icon={UserIcon} label="Nombre" value={solicitud.nombre} />
            <DataRow icon={TelephoneIcon} label="Teléfono" value={solicitud.telefono || "—"} />
            <DataRow icon={Mail01Icon} label="Correo" value={solicitud.correo || "—"} />
            {solicitud.inmuebleInteres && (
              <DataRow icon={House01Icon} label="Inmueble de interés" value={solicitud.inmuebleInteres} />
            )}
            {solicitud.fechaVisita && (
              <DataRow
                icon={Calendar03Icon}
                label="Visita agendada"
                value={`${new Date(solicitud.fechaVisita).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}${solicitud.horaVisita ? ` a las ${solicitud.horaVisita}` : ""}`}
              />
            )}
            {solicitud.mensaje && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Mensaje</p>
                <p className="text-sm bg-muted/50 rounded-md p-2.5 italic">"{solicitud.mensaje}"</p>
              </div>
            )}
          </div>

          {/* Asignación de asesor */}
          <div className="border rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold">Asesor asignado</h2>
            <Separator />
            {solicitud.estado === "atendida" ? (
              <p className="text-sm text-muted-foreground">{solicitud.asesorAsignado ?? "Sin asignar"}</p>
            ) : (
              <Popover open={asesorComboOpen} onOpenChange={setAsesorComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={asesorComboOpen}
                    disabled={guardando}
                    className="w-full justify-between font-normal h-9"
                  >
                    {solicitud.asesorAsignado ? (
                      <div className="flex items-center gap-2 truncate">
                        <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{solicitud.asesorAsignado}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Seleccionar asesor…</span>
                    )}
                    <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                  <Command>
                    <CommandInput placeholder="Buscar asesor…" />
                    <CommandList>
                      <CommandEmpty>No se encontraron asesores.</CommandEmpty>
                      <CommandGroup>
                        {asesores.map(asesor => (
                          <CommandItem
                            key={asesor.id}
                            value={asesor.nombre}
                            onSelect={() => {
                              handleAsignarAsesor(asesor.nombre)
                              setAsesorComboOpen(false)
                            }}
                            className="flex items-start gap-2 py-2"
                          >
                            <HugeiconsIcon
                              icon={Tick01Icon}
                              strokeWidth={2}
                              className={cn(
                                "size-4 mt-0.5 shrink-0",
                                solicitud.asesorAsignado === asesor.nombre ? "opacity-100 text-primary" : "opacity-0",
                              )}
                            />
                            <div>
                              <div className="font-medium text-sm">{asesor.nombre}</div>
                              <div className="text-xs text-muted-foreground">{asesor.correo}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

        </div>

        {/* ── Columna derecha: historial de conversación ── */}
        <div className="lg:col-span-2 border rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center gap-2">
            <HugeiconsIcon icon={MessageMultiple01Icon} strokeWidth={1.5} className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Historial de conversación</h2>
            <span className="text-xs text-muted-foreground ml-auto">{solicitud.historial.length} mensajes</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[520px]">
            {solicitud.historial.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sin historial de conversación.</p>
            ) : (
              solicitud.historial.map((msg, i) => (
                <div key={i} className={cn("flex gap-2", msg.tipo === "usuario" && "justify-end")}>
                  {msg.tipo === "bot" && (
                    <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary">H</span>
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                    msg.tipo === "bot"
                      ? "bg-muted text-foreground rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm",
                  )}>
                    <p>{msg.texto}</p>
                    <p className={cn("text-[10px] mt-1 opacity-70", msg.tipo === "usuario" && "text-right")}>
                      {formatHora(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componente
// ---------------------------------------------------------------------------

function DataRow({ icon, label, value }: { icon: typeof UserIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm break-words">{value}</p>
      </div>
    </div>
  )
}
