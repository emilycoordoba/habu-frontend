"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  PencilEdit01Icon,
  UserIcon,
  Building04Icon,
  Location01Icon,
  Mail01Icon,
  Clock01Icon,
  FileManagementIcon,
  Home01Icon,
  Store01Icon,
  ChimneyIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  CLIENTES_MOCK,
  INTERACCIONES_MOCK,
  CONTRATOS_POR_CLIENTE,
} from "@/lib/mock/clientes"
import { INMUEBLES_MOCK } from "@/lib/mock/inmuebles"
import { TIPO_CLIENTE_CONFIG } from "@/types/cliente.types"
import { ESTADO_CONTRATO_CONFIG, LABELS_POR_TIPO } from "@/types/contrato.types"
import type { TipoInmueble } from "@/types/inmueble.types"

// ---------------------------------------------------------------------------
// Config visual
// ---------------------------------------------------------------------------

const TIPO_INMUEBLE_LABELS: Record<TipoInmueble, string> = {
  casa: "Casa", apartamento: "Apartamento", local: "Local", otro: "Otro",
}

const TIPO_INMUEBLE_ICON: Record<TipoInmueble, typeof Home01Icon> = {
  casa: ChimneyIcon, apartamento: Building04Icon, local: Store01Icon, otro: Home01Icon,
}

const ESTADO_INMUEBLE_CONFIG = {
  disponible:       { label: "Disponible",          className: "bg-green-100 text-green-700 border-green-200" },
  arrendado:        { label: "Arrendado",            className: "bg-blue-100 text-blue-700 border-blue-200" },
  en_proceso_venta: { label: "En proceso de venta",  className: "bg-purple-100 text-purple-700 border-purple-200" },
  vendido:          { label: "Vendido",               className: "bg-gray-100 text-gray-500 border-gray-200" },
  en_mantenimiento: { label: "En mantenimiento",      className: "bg-amber-100 text-amber-700 border-amber-200" },
} as const

function formatFecha(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-CO", {
    day: "numeric", month: "long", year: "numeric",
  })
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function DetalleClienteClient({ clienteId }: { clienteId: string }) {
  const cliente = CLIENTES_MOCK.find(c => c.id === clienteId)

  if (!cliente) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-2">
        <HugeiconsIcon icon={UserIcon} strokeWidth={1.5} className="size-10 opacity-30" />
        <p className="text-sm">Cliente no encontrado.</p>
        <Link href="/clientes"><Button variant="outline" size="sm">Volver a clientes</Button></Link>
      </div>
    )
  }

  const inmueblesPropios = Object.values(INMUEBLES_MOCK).filter(
    i => i.propietarioId === clienteId
  )
  const contratos    = CONTRATOS_POR_CLIENTE[clienteId] ?? []
  const interacciones = (INTERACCIONES_MOCK[clienteId] ?? []).sort(
    (a, b) => b.fecha.localeCompare(a.fecha)
  )

  const esPropietario = cliente.tipos.includes("propietario")

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <Link href="/clientes">
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>

        <div className="flex-1 min-w-0 flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <HugeiconsIcon
              icon={cliente.tipoPersona === "natural" ? UserIcon : Building04Icon}
              strokeWidth={1.5}
              className="size-5 text-muted-foreground"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold leading-tight">{cliente.nombre}</h1>
              {!cliente.activo && (
                <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500 border-gray-200">
                  Inactivo
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-sm text-muted-foreground">
                {cliente.tipoPersona === "natural" ? "Persona natural" : "Persona jurídica"}
              </span>
              <span className="text-muted-foreground/40">·</span>
              {cliente.tipos.map(tipo => {
                const cfg = TIPO_CLIENTE_CONFIG[tipo]
                return (
                  <Badge key={tipo} variant="outline" className={cn("text-xs", cfg.className)}>
                    {cfg.label}
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>

        <Link href={`/clientes/${clienteId}/editar`}>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
            <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="datos" className="flex-1 flex flex-col">
        <div className="border-b px-6">
          <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none">
            {[
              { value: "datos",      label: "Datos" },
              { value: "inmuebles",  label: `Inmuebles${esPropietario ? ` (${inmueblesPropios.length})` : ""}` },
              { value: "contratos",  label: `Contratos${contratos.length ? ` (${contratos.length})` : ""}` },
              { value: "historial",  label: `Historial${interacciones.length ? ` (${interacciones.length})` : ""}` },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-3 text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── Tab: Datos ── */}
          <TabsContent value="datos" className="mt-0">
            <div className="max-w-2xl space-y-6">

              <Section title="Identificación">
                <InfoGrid>
                  <InfoField label="Tipo de persona">
                    {cliente.tipoPersona === "natural" ? "Persona natural" : "Persona jurídica"}
                  </InfoField>
                  <InfoField label="Tipo de documento">{cliente.tipoDocumento}</InfoField>
                  <InfoField label="Número de documento">{cliente.documento}</InfoField>
                  {cliente.representanteLegal && (
                    <InfoField label="Representante legal">{cliente.representanteLegal}</InfoField>
                  )}
                </InfoGrid>
              </Section>

              <Separator />

              <Section title="Contacto">
                <InfoGrid>
                  <InfoField label="Correo electrónico">
                    <a href={`mailto:${cliente.email}`} className="text-primary hover:underline flex items-center gap-1.5">
                      <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.5} className="size-3.5" />
                      {cliente.email}
                    </a>
                  </InfoField>
                  <InfoField label="Teléfono">{cliente.telefono}</InfoField>
                  <InfoField label="Ciudad">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Location01Icon} strokeWidth={1.5} className="size-3.5 text-muted-foreground" />
                      {cliente.ciudad}
                    </span>
                  </InfoField>
                </InfoGrid>
              </Section>

              <Separator />

              <Section title="Registro">
                <InfoGrid>
                  <InfoField label="Fecha de registro">{formatFecha(cliente.fechaRegistro)}</InfoField>
                  <InfoField label="Estado">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        cliente.activo
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      )}
                    >
                      {cliente.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </InfoField>
                </InfoGrid>
              </Section>

            </div>
          </TabsContent>

          {/* ── Tab: Inmuebles ── */}
          <TabsContent value="inmuebles" className="mt-0">
            {!esPropietario ? (
              <EmptyState
                icon={Home01Icon}
                mensaje="Este cliente no tiene el rol de propietario."
                sub="Los inmuebles se asocian al cliente al registrarlos."
              />
            ) : inmueblesPropios.length === 0 ? (
              <EmptyState
                icon={Home01Icon}
                mensaje="No hay inmuebles registrados para este propietario."
                sub="Al registrar un inmueble, se asocia automáticamente al propietario seleccionado."
              />
            ) : (
              <div className="border rounded-lg overflow-hidden max-w-4xl">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inmueble</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ubicación</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {inmueblesPropios.map(inmueble => {
                      const estadoCfg = ESTADO_INMUEBLE_CONFIG[inmueble.estado]
                      return (
                        <tr key={inmueble.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2.5">
                              <HugeiconsIcon
                                icon={TIPO_INMUEBLE_ICON[inmueble.tipo]}
                                strokeWidth={1.5}
                                className="size-4 shrink-0 mt-0.5 text-muted-foreground"
                              />
                              <div>
                                <p className="font-medium truncate max-w-[220px]">{inmueble.direccion}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {TIPO_INMUEBLE_LABELS[inmueble.tipo]} · {inmueble.area} m²
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">{inmueble.ubicacion}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className={cn("text-xs", estadoCfg.className)}>
                              {estadoCfg.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link href={`/inmuebles/${inmueble.id}`}>
                              <Button variant="ghost" size="sm" className="h-7 text-xs">Ver</Button>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* ── Tab: Contratos ── */}
          <TabsContent value="contratos" className="mt-0">
            {contratos.length === 0 ? (
              <EmptyState
                icon={FileManagementIcon}
                mensaje="Este cliente no tiene contratos registrados."
              />
            ) : (
              <div className="border rounded-lg overflow-hidden max-w-4xl">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Referencia</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inmueble</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rol</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {contratos.map(contrato => {
                      const estadoCfg = ESTADO_CONTRATO_CONFIG[contrato.estado]
                      const rolCfg    = TIPO_CLIENTE_CONFIG[contrato.rol]
                      return (
                        <tr key={`${contrato.id}-${contrato.rol}`} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium tabular-nums">{contrato.referencia}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {LABELS_POR_TIPO[contrato.tipo].propietario.replace("or", "o")} de {contrato.tipo === "arriendo" ? "arriendo" : "compraventa"}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="truncate max-w-[200px]">{contrato.inmueble}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{contrato.direccion}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={cn("text-xs", rolCfg.className)}>
                              {rolCfg.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className={cn("text-xs", estadoCfg.className)}>
                              {estadoCfg.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link href={`/contratos/${contrato.id}`}>
                              <Button variant="ghost" size="sm" className="h-7 text-xs">Ver</Button>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* ── Tab: Historial ── */}
          <TabsContent value="historial" className="mt-0">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {interacciones.length === 0
                    ? "Sin interacciones registradas."
                    : `${interacciones.length} interaccione${interacciones.length !== 1 ? "s" : ""} registrada${interacciones.length !== 1 ? "s" : ""}.`}
                </p>
                <Link href={`/clientes/${clienteId}/visita`}>
                  <Button size="sm" variant="outline">Registrar visita</Button>
                </Link>
              </div>

              {interacciones.length === 0 ? (
                <EmptyState
                  icon={Clock01Icon}
                  mensaje="No hay interacciones registradas aún."
                  sub="Las visitas y notas del asesor aparecerán aquí."
                />
              ) : (
                <div className="relative border-l ml-3 space-y-0">
                  {interacciones.map((item, idx) => (
                    <div key={item.id} className="relative pl-6 pb-6">
                      {/* Dot */}
                      <div className={cn(
                        "absolute -left-[9px] top-0.5 size-[18px] rounded-full border-2 border-background flex items-center justify-center",
                        item.tipo === "visita" ? "bg-blue-100" : "bg-amber-100"
                      )}>
                        <HugeiconsIcon
                          icon={item.tipo === "visita" ? EyeIcon : PencilEdit01Icon}
                          strokeWidth={2}
                          className={cn("size-2.5", item.tipo === "visita" ? "text-blue-600" : "text-amber-600")}
                        />
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(
                              "text-xs font-medium uppercase tracking-wide",
                              item.tipo === "visita" ? "text-blue-600" : "text-amber-600"
                            )}>
                              {item.tipo === "visita" ? "Visita" : "Nota"}
                            </span>
                            {item.inmueble && (
                              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                · {item.inmueble}
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-1 leading-relaxed">{item.descripcion}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.asesor}</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                          {formatFecha(item.fecha)}
                        </span>
                      </div>

                      {idx === interacciones.length - 1 && (
                        <div className="absolute -left-px bottom-0 h-6 w-px bg-gradient-to-b from-border to-transparent" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-8 gap-y-4">{children}</div>
}

function InfoField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <div className="text-sm font-medium">{children}</div>
    </div>
  )
}

function EmptyState({
  icon,
  mensaje,
  sub,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  mensaje: string
  sub?: string
}) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{mensaje}</p>
      {sub && <p className="text-xs mt-1 opacity-70">{sub}</p>}
    </div>
  )
}
