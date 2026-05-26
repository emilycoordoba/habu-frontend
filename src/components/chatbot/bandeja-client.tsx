"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Calendar03Icon,
  UserIcon,
  FilterIcon,
  ArrowRight01Icon,
  TelephoneIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { SOLICITUDES_CHATBOT_MOCK } from "@/lib/mock/chatbot"
import { ESTADO_CONFIG } from "@/components/chatbot/chatbot-config"
import { ASESORES_MOCK } from "@/lib/mock/usuarios"
import type { SolicitudChatbot, EstadoSolicitud, TipoSolicitud } from "@/types/chatbot.types"

const TIPO_CONFIG: Record<TipoSolicitud, { label: string }> = {
  visita:   { label: "Visita agendada" },
  contacto: { label: "Solicitud de contacto" },
  asesor:   { label: "Solicitud de asesor" },
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function BandejaClient() {
  const [solicitudes] = React.useState<SolicitudChatbot[]>(SOLICITUDES_CHATBOT_MOCK)
  const [busqueda, setBusqueda]         = React.useState("")
  const [filtroEstado, setFiltroEstado] = React.useState<"todos" | EstadoSolicitud>("todos")
  const [filtroTipo, setFiltroTipo]     = React.useState<"todos" | TipoSolicitud>("todos")
  const [filtroAsesor, setFiltroAsesor] = React.useState<string>("todos")

  const filtradas = solicitudes.filter(s => {
    if (filtroEstado !== "todos" && s.estado !== filtroEstado) return false
    if (filtroTipo   !== "todos" && s.tipo   !== filtroTipo)   return false
    if (filtroAsesor === "sin_asignar" && s.asesorAsignado !== null) return false
    if (filtroAsesor !== "todos" && filtroAsesor !== "sin_asignar" && s.asesorAsignado !== filtroAsesor) return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      return (
        s.nombre.toLowerCase().includes(q) ||
        s.telefono.includes(q) ||
        s.correo.toLowerCase().includes(q) ||
        (s.inmuebleInteres ?? "").toLowerCase().includes(q)
      )
    }
    return true
  })

  const nuevas = solicitudes.filter(s => s.estado === "nueva").length

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold">Bandeja de solicitudes</h1>
          <p className="text-sm text-muted-foreground">
            {solicitudes.length} solicitudes
            {nuevas > 0 && <span className="ml-2 inline-flex items-center gap-1 text-blue-600 font-medium">· {nuevas} nuevas</span>}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4 max-w-5xl mx-auto w-full">

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por nombre, teléfono…"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.5} className="size-4 text-muted-foreground" />
            <Select value={filtroEstado} onValueChange={v => setFiltroEstado(v as typeof filtroEstado)}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="nueva">Nueva</SelectItem>
                <SelectItem value="en_gestion">En gestión</SelectItem>
                <SelectItem value="atendida">Atendida</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroTipo} onValueChange={v => setFiltroTipo(v as typeof filtroTipo)}>
              <SelectTrigger className="h-9 w-44">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="visita">Visita agendada</SelectItem>
                <SelectItem value="contacto">Solicitud de contacto</SelectItem>
                <SelectItem value="asesor">Solicitud de asesor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroAsesor} onValueChange={setFiltroAsesor}>
              <SelectTrigger className="h-9 w-44">
                <SelectValue placeholder="Asesor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los asesores</SelectItem>
                <SelectItem value="sin_asignar">Sin asignar</SelectItem>
                {ASESORES_MOCK.map(a => (
                  <SelectItem key={a.id} value={a.nombre}>{a.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista */}
        {filtradas.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay solicitudes que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden divide-y">
            {filtradas.map(s => (
              <SolicitudRow key={s.id} solicitud={s} />
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-right">
          {filtradas.length} de {solicitudes.length} solicitudes
        </p>

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Fila de solicitud
// ---------------------------------------------------------------------------

function SolicitudRow({ solicitud: s }: { solicitud: SolicitudChatbot }) {
  const estado = ESTADO_CONFIG[s.estado]
  const tipo   = TIPO_CONFIG[s.tipo]

  return (
    <Link href={`/chatbot/${s.id}`} className="flex items-start gap-4 px-4 py-4 hover:bg-muted/30 transition-colors group">

      {/* Ícono tipo */}
      <div className={cn(
        "mt-0.5 size-9 rounded-full flex items-center justify-center shrink-0",
        s.tipo === "visita"   && "bg-violet-100",
        s.tipo === "contacto" && "bg-sky-100",
        s.tipo === "asesor"   && "bg-amber-100",
      )}>
        <HugeiconsIcon
          icon={s.tipo === "visita" ? Calendar03Icon : s.tipo === "contacto" ? Mail01Icon : UserIcon}
          strokeWidth={1.5}
          className={cn(
            "size-4",
            s.tipo === "visita"   && "text-violet-600",
            s.tipo === "contacto" && "text-sky-600",
            s.tipo === "asesor"   && "text-amber-600",
          )}
        />
      </div>

      {/* Cuerpo */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{s.nombre}</span>
          <Badge variant="outline" className={cn("text-xs gap-1 py-0", estado.className)}>
            <HugeiconsIcon icon={estado.icon} strokeWidth={2} className="size-3" />
            {estado.label}
          </Badge>
          <span className="text-xs text-muted-foreground">{tipo.label}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          {s.telefono && (
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={TelephoneIcon} strokeWidth={1.5} className="size-3" />
              {s.telefono}
            </span>
          )}
          {s.correo && (
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.5} className="size-3" />
              {s.correo}
            </span>
          )}
        </div>

        {s.inmuebleInteres && (
          <p className="text-xs text-muted-foreground truncate">Inmueble: {s.inmuebleInteres}</p>
        )}
        {s.mensaje && (
          <p className="text-xs text-muted-foreground truncate italic">"{s.mensaje}"</p>
        )}
        {s.fechaVisita && (
          <p className="text-xs text-muted-foreground">
            Visita: {new Date(s.fechaVisita).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
            {s.horaVisita && ` a las ${s.horaVisita}`}
          </p>
        )}
        {s.asesorAsignado && (
          <p className="text-xs text-muted-foreground">Asesor: {s.asesorAsignado}</p>
        )}
      </div>

      {/* Fecha + flecha */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">{formatFecha(s.fecha)}</span>
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
      </div>

    </Link>
  )
}
