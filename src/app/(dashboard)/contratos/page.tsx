import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FilterIcon,
  MoreHorizontalCircle01Icon,
  EyeIcon,
  FileEditIcon,
  Cancel01Icon,
  MoneyReceiveSquareIcon,
  FileNotFoundIcon,
  FileAttachmentIcon,
} from "@hugeicons/core-free-icons"

import { NuevoContratoTrigger } from "@/components/contratos/nuevo-contrato-trigger"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { EstadoBadge } from "@/components/contratos/estado-badge"
import type { Contrato, EstadoContrato } from "@/types/contrato.types"
import { ESTADO_CONTRATO_CONFIG, LABELS_POR_TIPO } from "@/types/contrato.types"

// --- Datos de ejemplo (se reemplazarán con la API) ---
const CONTRATOS_MOCK: Contrato[] = [
  {
    id: "1",
    referencia: "CTR-2025-001",
    tipo: "arriendo",
    estado: "activo",
    inmueble: "Apto 301 Torre A",
    direccion: "Cra 15 #80-20, Bogotá",
    propietario: "Carlos Méndez",
    contraparte: "Laura Gómez",
    asesor: "Ana Rodríguez",
    fechaInicio: "2025-04-01",
    fechaFin: "2027-04-01",
    valorCanon: 2500000,
  },
  {
    id: "2",
    referencia: "CTR-2025-002",
    tipo: "promesa_compraventa",
    estado: "en_firmas",
    inmueble: "Casa 12 Urb. El Prado",
    direccion: "Cll 50 #30-10, Medellín",
    propietario: "Pedro Vargas",
    contraparte: "Sofía Torres",
    asesor: "Luis Martínez",
    fechaInicio: "2026-03-15",
    fechaFin: "2026-09-15",
    valorCanon: 380000000,
  },
  {
    id: "3",
    referencia: "CTR-2025-003",
    tipo: "arriendo",
    estado: "por_vencer",
    inmueble: "Local 5 CC Bulevar",
    direccion: "Av. El Dorado #68C-61, Bogotá",
    propietario: "Inversiones XYZ",
    contraparte: "Tienda Moda Libre",
    asesor: "Ana Rodríguez",
    fechaInicio: "2025-05-01",
    fechaFin: "2026-05-15",
    valorCanon: 4800000,
  },
  {
    id: "4",
    referencia: "CTR-2024-018",
    tipo: "arriendo",
    estado: "vencido_con_saldos",
    inmueble: "Oficina 208 Ed. Centenario",
    direccion: "Cra 7 #32-16, Bogotá",
    propietario: "María López",
    contraparte: "Consultora ABC",
    asesor: "Luis Martínez",
    fechaInicio: "2024-01-01",
    fechaFin: "2025-01-01",
    valorCanon: 3200000,
  },
  {
    id: "5",
    referencia: "CTR-2025-004",
    tipo: "arriendo",
    estado: "borrador",
    inmueble: "Apto 502 Torres del Norte",
    direccion: "Cll 127 #15-40, Bogotá",
    propietario: "Jorge Herrera",
    contraparte: "—",
    asesor: "Ana Rodríguez",
    fechaInicio: "—",
    fechaFin: "—",
    valorCanon: 0,
  },
]

const ESTADOS_PRINCIPALES: EstadoContrato[] = [
  "activo", "en_firmas", "por_vencer", "vencido_con_saldos", "borrador",
]
const ESTADOS_SECUNDARIOS: EstadoContrato[] = [
  "en_escrituracion", "pendiente_registro", "terminacion_en_disputa",
  "terminado_anticipadamente", "finalizado",
]

// Filas con estado crítico que reciben resaltado visual
const ESTADOS_CRITICOS = new Set<EstadoContrato>(["vencido_con_saldos", "terminacion_en_disputa"])

// --- Helpers de formato ---

function formatCurrency(value: number) {
  if (value === 0) return "—"
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value)
}

/** Duración total entre dos fechas en texto legible: "2 años", "8 meses", "1 año 3 meses" */
function formatDuracion(inicio: string, fin: string): string {
  if (inicio === "—" || fin === "—") return "—"
  const d1 = new Date(inicio + "T00:00:00")
  const d2 = new Date(fin + "T00:00:00")
  let años = d2.getFullYear() - d1.getFullYear()
  let meses = d2.getMonth() - d1.getMonth()
  if (meses < 0) { años--; meses += 12 }
  const partes: string[] = []
  if (años > 0) partes.push(`${años} año${años > 1 ? "s" : ""}`)
  if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`)
  return partes.length > 0 ? partes.join(" ") : "< 1 mes"
}

/** Tiempo restante desde hoy hasta fechaFin, con color semántico */
function tiempoRestante(fin: string): { texto: string; className: string } | null {
  if (fin === "—") return null
  const hoy = new Date()
  const fechaFin = new Date(fin + "T00:00:00")
  const diffMs = fechaFin.getTime() - hoy.getTime()
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDias < 0) return { texto: "Vencido", className: "text-red-600" }
  if (diffDias <= 30) return { texto: `Vence en ${diffDias} día${diffDias !== 1 ? "s" : ""}`, className: "text-red-500" }
  if (diffDias <= 90) {
    const meses = Math.ceil(diffDias / 30)
    return { texto: `Vence en ${meses} mes${meses > 1 ? "es" : ""}`, className: "text-yellow-600" }
  }
  const meses = Math.floor(diffDias / 30)
  if (meses < 12) return { texto: `${meses} mes${meses > 1 ? "es" : ""} restantes`, className: "text-muted-foreground" }
  const años = Math.floor(meses / 12)
  const mesesR = meses % 12
  const texto = mesesR > 0 ? `${años} año${años > 1 ? "s" : ""} ${mesesR} mes${mesesR > 1 ? "es" : ""} restantes` : `${años} año${años > 1 ? "s" : ""} restante${años > 1 ? "s" : ""}`
  return { texto, className: "text-muted-foreground" }
}

// --- Subcomponentes ---

function AccionesMenu({ contrato }: { contrato: Contrato }) {
  const esActivo = contrato.estado === "activo"
  const esPorVencer = contrato.estado === "por_vencer"
  const tieneDeuda = contrato.estado === "vencido_con_saldos"
  const esBorrador = contrato.estado === "borrador"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} className="size-4" />
          <span className="sr-only">Acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/contratos/${contrato.id}`}>
            <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-4" />
            Ver detalle
          </Link>
        </DropdownMenuItem>
        {esBorrador && (
          <DropdownMenuItem asChild>
            <Link href={`/contratos/${contrato.id}/documentos`}>
              <HugeiconsIcon icon={FileAttachmentIcon} strokeWidth={2} className="size-4" />
              Gestionar documentos
            </Link>
          </DropdownMenuItem>
        )}
        {(esActivo || esPorVencer) && (
          <DropdownMenuItem>
            <HugeiconsIcon icon={FileEditIcon} strokeWidth={2} className="size-4" />
            Renovar contrato
          </DropdownMenuItem>
        )}
        {tieneDeuda && (
          <DropdownMenuItem>
            <HugeiconsIcon icon={MoneyReceiveSquareIcon} strokeWidth={2} className="size-4" />
            Gestionar saldos
          </DropdownMenuItem>
        )}
        {(esActivo || esPorVencer) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" asChild>
              <Link href={`/contratos/${contrato.id}/terminacion`}>
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" />
                Iniciar terminación
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TarjetaEstado({ estado }: { estado: EstadoContrato }) {
  const count = CONTRATOS_MOCK.filter((c) => c.estado === estado).length
  const config = ESTADO_CONTRATO_CONFIG[estado]
  return (
    <div className="rounded-lg border bg-card p-3 flex flex-col gap-1.5">
      <span className="text-xl font-bold">{count}</span>
      <Badge variant="outline" className={config.className + " w-fit text-xs"}>
        {config.label}
      </Badge>
    </div>
  )
}

const TOTAL = CONTRATOS_MOCK.length
const POR_PAGINA = 10
const PAGINA_ACTUAL = 1
const TOTAL_PAGINAS = Math.ceil(TOTAL / POR_PAGINA)

export default function ContratosPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contratos</h1>
          <p className="text-sm text-muted-foreground mt-1">{TOTAL} contratos en total</p>
        </div>
        <NuevoContratoTrigger />
      </div>

      {/* Tarjetas de resumen — 2 filas de 5 */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {ESTADOS_PRINCIPALES.map((estado) => (
            <TarjetaEstado key={estado} estado={estado} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {ESTADOS_SECUNDARIOS.map((estado) => (
            <TarjetaEstado key={estado} estado={estado} />
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-4" />
          Filtrar por:
        </div>
        <Input placeholder="Buscar por inmueble, cliente o referencia..." className="max-w-xs h-9" />
        <Select>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {(Object.entries(ESTADO_CONTRATO_CONFIG) as [EstadoContrato, { label: string; className: string }][]).map(
              ([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="arriendo">Arriendo</SelectItem>
            <SelectItem value="promesa_compraventa">Promesa compraventa</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Asesor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ana">Ana Rodríguez</SelectItem>
            <SelectItem value="luis">Luis Martínez</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-32">Referencia</TableHead>
              <TableHead>Inmueble</TableHead>
              <TableHead>Partes</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead className="w-28">Tipo</TableHead>
              <TableHead className="w-40">Estado</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONTRATOS_MOCK.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <HugeiconsIcon icon={FileNotFoundIcon} strokeWidth={1.5} className="size-10 opacity-40" />
                    <p className="text-sm font-medium">No se encontraron contratos</p>
                    <p className="text-xs">Intenta ajustar los filtros o crea un nuevo contrato</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              CONTRATOS_MOCK.map((contrato) => {
                const labels = LABELS_POR_TIPO[contrato.tipo]
                const restante = tiempoRestante(contrato.fechaFin)
                const esCritico = ESTADOS_CRITICOS.has(contrato.estado)

                return (
                  <TableRow
                    key={contrato.id}
                    className={
                      "hover:bg-muted/30" +
                      (esCritico ? " border-l-2 border-l-red-400" : "")
                    }
                  >
                    <TableCell>
                      <Link
                        href={`/contratos/${contrato.id}`}
                        className="font-mono text-sm font-medium text-primary hover:underline"
                      >
                        {contrato.referencia}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{contrato.inmueble}</div>
                      <div className="text-xs text-muted-foreground">{contrato.direccion}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{contrato.contraparte}</div>
                      <div className="text-xs text-muted-foreground">{labels.contraparte}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{contrato.asesor}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {contrato.tipo === "arriendo" ? "Arriendo" : "Promesa C/V"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <EstadoBadge estado={contrato.estado} />
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="font-medium text-foreground">
                        {formatDuracion(contrato.fechaInicio, contrato.fechaFin)}
                      </div>
                      {restante && (
                        <div className={restante.className}>{restante.texto}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <div className="font-medium">{formatCurrency(contrato.valorCanon)}</div>
                      <div className="text-xs text-muted-foreground">{contrato.valorCanon > 0 ? labels.canon : ""}</div>
                    </TableCell>
                    <TableCell>
                      <AccionesMenu contrato={contrato} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Paginación */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">{TOTAL}</span> de{" "}
            <span className="font-medium">{TOTAL}</span> contratos
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {PAGINA_ACTUAL} de {TOTAL_PAGINAS}
            </span>
            <Button variant="outline" size="sm" disabled={PAGINA_ACTUAL >= TOTAL_PAGINAS}>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
