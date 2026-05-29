"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  UserIcon,
  Building04Icon,
  FileAttachmentIcon,
  Tick02Icon,
  Clock01Icon,
  Cancel01Icon,
  FileManagementIcon,
  PencilEdit01Icon,
  CheckmarkCircle02Icon,
  EyeIcon,
  MoneyReceive02Icon,
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
import { EstadoBadge } from "@/components/contratos/estado-badge"
import { LABELS_POR_TIPO, ESTADO_CONTRATO_CONFIG } from "@/types/contrato.types"
import type { TipoContrato, EstadoContrato } from "@/types/contrato.types"
import type { ContratoDetalle, DocumentoContrato, FirmaContrato, EventoHistorial } from "@/types/contrato.types"
import { obtenerContrato } from "@/lib/api/contratos"
import { cn } from "@/lib/utils"
import { RefreshIcon } from "@hugeicons/core-free-icons"

// Acciones disponibles según estado
function getAccionPrincipal(estado: EstadoContrato, id: string) {
  switch (estado) {
    case "borrador":
      return { label: "Gestionar documentos", href: `/contratos/${id}/documentos`, icon: FileAttachmentIcon }
    case "en_firmas":
      return { label: "Ver estado de firmas", href: null, icon: PencilEdit01Icon }
    case "activo":
      return { label: "Registrar pago", href: `/contratos/${id}/cobros`, icon: CheckmarkCircle02Icon }
    case "por_vencer":
      return { label: "Gestionar renovación", href: `/contratos/${id}/renovacion`, icon: ArrowRight01Icon }
    case "en_escrituracion":
      return { label: "Registrar escrituración", href: `/contratos/${id}/escrituracion`, icon: FileManagementIcon }
    default:
      return null
  }
}

interface DetalleContratoClientProps {
  contratoId: string
}

export function DetalleContratoClient({ contratoId }: DetalleContratoClientProps) {
  const [contrato, setContrato]   = React.useState<ContratoDetalle | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError]         = React.useState<string | null>(null)
  const [retryKey, setRetryKey]   = React.useState(0)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)

    obtenerContrato(contratoId)
      .then(res => {
        if (cancelado) return
        setContrato(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        if (cancelado) return
        setError(err instanceof Error ? err.message : "Error al cargar el contrato")
        setIsLoading(false)
      })

    return () => { cancelado = true }
  }, [contratoId, retryKey])

  if (isLoading) {
    return (
      <div className="flex flex-col h-full animate-pulse">
        <div className="border-b px-6 py-4 flex items-center gap-4">
          <div className="size-8 rounded-md bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 rounded bg-muted" />
            <div className="h-3.5 w-64 rounded bg-muted" />
          </div>
        </div>
        <div className="px-6 py-4 border-b flex gap-3">
          {[1,2,3].map(i => <div key={i} className="h-10 w-32 rounded-lg bg-muted" />)}
        </div>
        <div className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full space-y-4">
          {Array.from({length:5}).map((_,i) => <div key={i} className="h-4 rounded bg-muted" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={FileManagementIcon} strokeWidth={1.5} className="size-10 opacity-30" />
        <p className="text-sm font-medium">{error}</p>
        <Button variant="outline" size="sm" className="mt-1 gap-1.5" onClick={() => setRetryKey(k => k + 1)}>
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-3.5" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (!contrato) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={FileManagementIcon} strokeWidth={1.5} className="size-10 opacity-30" />
        <p className="text-sm font-medium">Contrato no encontrado</p>
        <Link href="/contratos">
          <Button variant="outline" size="sm" className="mt-1">Volver a contratos</Button>
        </Link>
      </div>
    )
  }

  // Campos planos extraídos del shape anidado de la API
  const inmuebleNombre = contrato.inmueble.nombre
  const inmuebleDireccion = contrato.inmueble.direccion
  const propietarioNombre = contrato.propietario.nombre
  const contraparteNombre = contrato.contraparte.nombre
  const codeudorNombre    = contrato.codeudor?.nombre
  const condArr           = contrato.condicionesArriendo
  const condProm          = contrato.condicionesPromesa
  const documentos: DocumentoContrato[] = contrato.documentos
  const firmas: FirmaContrato[]         = contrato.firmas
  const historial: EventoHistorial[]    = contrato.historial

  const labels = LABELS_POR_TIPO[contrato.tipo]
  const accion = getAccionPrincipal(contrato.estado, contrato.id)

  const docsRecibidos    = documentos.filter(d => d.estado === "recibido").length
  const firmasPendientes = firmas.filter(f => f.estado === "pendiente").length

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-start gap-4">
        <Link href="/contratos">
          <Button variant="ghost" size="icon" className="size-8 mt-0.5">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-semibold">{contrato.referencia}</h1>
            <EstadoBadge estado={contrato.estado} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {inmuebleNombre} · {inmuebleDireccion}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["activo", "por_vencer", "vencido_con_saldos"].includes(contrato.estado) && (
            <Link href={`/contratos/${contrato.id}/cobros`}>
              <Button size="sm" variant="outline">
                <HugeiconsIcon icon={MoneyReceive02Icon} strokeWidth={2} className="size-4" />
                Ver cobros
              </Button>
            </Link>
          )}
          {["activo", "por_vencer"].includes(contrato.estado) && (
            <Link href={`/contratos/${contrato.id}/terminacion`}>
              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" />
                Terminación anticipada
              </Button>
            </Link>
          )}
          {accion && (
            accion.href ? (
              <Link href={accion.href}>
                <Button size="sm">
                  <HugeiconsIcon icon={accion.icon} strokeWidth={2} className="size-4" />
                  {accion.label}
                </Button>
              </Link>
            ) : (
              <Button size="sm">
                <HugeiconsIcon icon={accion.icon} strokeWidth={2} className="size-4" />
                {accion.label}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Partes — siempre visibles */}
      <div className="px-6 py-4 flex gap-3 flex-wrap border-b bg-muted/20">
        <PartCard
          icon={Building04Icon}
          label={labels.propietario}
          nombre={propietarioNombre}
        />
        <PartCard
          icon={UserIcon}
          label={labels.contraparte}
          nombre={contraparteNombre}
        />
        {codeudorNombre && (
          <PartCard icon={UserIcon} label="Codeudor" nombre={codeudorNombre} />
        )}
        <div className="ml-auto self-center text-xs text-muted-foreground">
          Asesor: <span className="font-medium text-foreground">{contrato.asesor}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="condiciones" className="flex-1 flex flex-col min-h-0">
        <div className="border-b px-6">
          <div className="max-w-2xl mx-auto">
          <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none justify-start">
            <TabsTrigger value="condiciones" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">Condiciones</TabsTrigger>
            <TabsTrigger value="documentos" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">
              Documentos
              {docsRecibidos < documentos.length && (
                <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
                  {docsRecibidos}/{documentos.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="firmas" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">
              Firmas
              {firmasPendientes > 0 && (
                <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
                  {firmasPendientes} pendiente{firmasPendientes > 1 ? "s" : ""}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="historial" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 text-sm">Historial</TabsTrigger>
          </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto">

          {/* Tab — Condiciones */}
          <TabsContent value="condiciones" className="flex flex-col gap-6">
            {contrato.tipo === "arriendo" ? (
              <>
                <Section title="Vigencia">
                  <InfoRow label="Fecha de inicio" value={formatFecha(contrato.fechaInicio)} />
                  <InfoRow label="Fecha de vencimiento" value={formatFecha(contrato.fechaFin)} />
                  {condArr && <InfoRow label="Día de pago" value={`Día ${condArr.diaCorte}`} />}
                </Section>
                <Separator />
                <Section title="Canon y pagos">
                  <InfoRow label="Canon mensual" value={formatCOP(condArr?.valorCanon)} highlight />
                  {condArr?.incluyeAdministracion && (
                    <InfoRow label="Administración" value={formatCOP(condArr.valorAdministracion)} />
                  )}
                  {condArr?.incluyeAdministracion && condArr.valorCanon && condArr.valorAdministracion && (
                    <InfoRow label="Total mensual" value={formatCOP(condArr.valorCanon + condArr.valorAdministracion)} highlight />
                  )}
                </Section>
                {condArr?.tieneDeposito && condArr.valorDeposito !== undefined && (
                  <>
                    <Separator />
                    <Section title="Depósito de garantía">
                      <InfoRow label="Monto" value={formatCOP(condArr.valorDeposito)} />
                    </Section>
                  </>
                )}
              </>
            ) : (
              <>
                <Section title="Precio">
                  <InfoRow label="Precio total" value={formatCOP(condProm?.precioVenta)} highlight />
                  <InfoRow label="Valor de arras" value={formatCOP(condProm?.valorArras)} />
                  <InfoRow label="Fecha límite arras" value={formatFecha(condProm?.fechaLimiteArras)} />
                </Section>
                <Separator />
                <Section title="Forma de pago">
                  <InfoRow label="Modalidad" value={formatFormaPago(condProm?.formaPago)} />
                  {condProm?.entidadFinanciera && (
                    <InfoRow label="Entidad financiera" value={condProm.entidadFinanciera} />
                  )}
                </Section>
                <Separator />
                <Section title="Escrituración">
                  <InfoRow label="Fecha acordada" value={formatFecha(condProm?.fechaEscrituracion)} />
                </Section>
              </>
            )}
          </TabsContent>

          {/* Tab — Documentos */}
          <TabsContent value="documentos" className="flex flex-col gap-3">
            {documentos.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin documentos registrados.</p>
            ) : documentos.map((doc) => (
              <div key={doc.id} className={cn(
                "flex items-center gap-3 rounded-lg border p-3",
                doc.estado === "recibido" && "border-green-200 bg-green-50/40",
                doc.estado === "rechazado" && "border-destructive/30 bg-destructive/5",
              )}>
                <div className={cn(
                  "size-7 rounded-full flex items-center justify-center shrink-0",
                  doc.estado === "recibido" ? "bg-green-100" :
                  doc.estado === "rechazado" ? "bg-destructive/10" : "bg-muted"
                )}>
                  <HugeiconsIcon
                    icon={doc.estado === "recibido" ? Tick02Icon : doc.estado === "rechazado" ? Cancel01Icon : Clock01Icon}
                    strokeWidth={2}
                    className={cn(
                      "size-3.5",
                      doc.estado === "recibido" ? "text-green-600" :
                      doc.estado === "rechazado" ? "text-destructive" : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.nombre}</p>
                  {doc.fechaSubida && (
                    <p className="text-xs text-muted-foreground">Cargado el {doc.fechaSubida}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doc.urlArchivo && (
                    <a
                      href={doc.urlArchivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3" />
                      Ver
                    </a>
                  )}
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    doc.estado === "recibido" ? "border-green-200 text-green-700" :
                    doc.estado === "rechazado" ? "border-destructive/30 text-destructive" : ""
                  )}>
                    {doc.estado === "recibido" ? "Recibido" : doc.estado === "rechazado" ? "Rechazado" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            ))}
            {contrato.estado === "borrador" && (
              <Link href={`/contratos/${contrato.id}/documentos`} className="mt-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <HugeiconsIcon icon={FileAttachmentIcon} strokeWidth={2} className="size-4" />
                  Gestionar documentos
                </Button>
              </Link>
            )}
          </TabsContent>

          {/* Tab — Firmas */}
          <TabsContent value="firmas" className="flex flex-col gap-3">
            {firmas.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin firmas registradas.</p>
            )}
            {firmas.map((firma) => (
              <div key={firma.id} className={cn(
                "flex items-center gap-3 rounded-lg border p-4",
                firma.estado === "firmado" && "border-green-200 bg-green-50/40"
              )}>
                <div className={cn(
                  "size-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold",
                  firma.estado === "firmado" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                )}>
                  {firma.parte.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{firma.parte}</p>
                  <p className="text-xs text-muted-foreground">{firma.rol}</p>
                  {firma.fechaFirma && (
                    <p className="text-xs text-green-600 mt-0.5">Firmó el {firma.fechaFirma}</p>
                  )}
                </div>
                <Badge variant="outline" className={cn(
                  "text-xs shrink-0",
                  firma.estado === "firmado" ? "border-green-200 text-green-700" : ""
                )}>
                  {firma.estado === "firmado" ? "Firmado" : "Pendiente"}
                </Badge>
              </div>
            ))}
          </TabsContent>

          {/* Tab — Historial */}
          <TabsContent value="historial">
            {historial.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin eventos registrados.</p>
            ) : (
            <div className="flex flex-col gap-0">
              {historial.map((evento, i) => (
                <div key={evento.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "size-3 rounded-full border-2 mt-1 shrink-0",
                      i === 0 ? "border-primary bg-primary" : "border-muted-foreground bg-background"
                    )} />
                    {i < historial.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1 mb-1" />
                    )}
                  </div>
                  <div className={cn("pb-5", i === historial.length - 1 && "pb-0")}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground capitalize">
                        {evento.tipo.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-muted-foreground">{evento.fecha}</span>
                      {evento.usuario && (
                        <span className="text-xs text-muted-foreground">· {evento.usuario}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{evento.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

// --- Subcomponentes ---

function PartCard({ icon, label, nombre }: { icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]; label: string; nombre: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2">
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{nombre}</p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 border-b border-dashed border-border/60 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium tabular-nums", highlight && "text-primary")}>{value}</span>
    </div>
  )
}

function formatCOP(value?: number): string {
  if (value === undefined) return "—"
  return `$${new Intl.NumberFormat("es-CO").format(value)}`
}

function formatFecha(value?: string): string {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
}

function formatFormaPago(value?: string): string {
  const map: Record<string, string> = {
    contado: "Contado",
    credito_hipotecario: "Crédito hipotecario",
    mixto: "Mixto",
  }
  return value ? (map[value] ?? value) : "—"
}
