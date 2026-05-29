"use client"

import * as React from "react"
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
import type { Contrato, EstadoContrato, TipoContrato } from "@/types/contrato.types"
import { ESTADO_CONTRATO_CONFIG, LABELS_POR_TIPO } from "@/types/contrato.types"
import { listarContratos } from "@/lib/api/contratos"
import { ASESORES_MOCK } from "@/lib/mock/usuarios"

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const POR_PAGINA = 10

const ESTADOS_PRINCIPALES: EstadoContrato[] = [
  "activo", "en_firmas", "por_vencer", "vencido_con_saldos", "borrador",
]
const ESTADOS_SECUNDARIOS: EstadoContrato[] = [
  "en_escrituracion", "pendiente_registro", "terminacion_en_disputa",
  "terminado_anticipadamente", "finalizado",
]
const ESTADOS_CRITICOS = new Set<EstadoContrato>(["vencido_con_saldos", "terminacion_en_disputa"])

const RESUMEN_VACIO: Record<EstadoContrato, number> = {
  borrador: 0, en_firmas: 0, activo: 0, en_escrituracion: 0, pendiente_registro: 0,
  por_vencer: 0, vencido_con_saldos: 0, terminacion_en_disputa: 0, terminado_anticipadamente: 0, finalizado: 0,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number) {
  if (value === 0) return "—"
  return new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  }).format(value)
}

function formatDuracion(inicio: string, fin: string): string {
  if (!inicio || !fin || inicio === "—" || fin === "—") return "—"
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

function tiempoRestante(fin: string): { texto: string; className: string } | null {
  if (!fin || fin === "—") return null
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
  const texto = mesesR > 0
    ? `${años} año${años > 1 ? "s" : ""} ${mesesR} mes${mesesR > 1 ? "es" : ""} restantes`
    : `${años} año${años > 1 ? "s" : ""} restante${años > 1 ? "s" : ""}`
  return { texto, className: "text-muted-foreground" }
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function AccionesMenu({ contrato }: { contrato: Contrato }) {
  const esActivo   = contrato.estado === "activo"
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
          <DropdownMenuItem asChild>
            <Link href={`/contratos/${contrato.id}/renovacion`}>
              <HugeiconsIcon icon={FileEditIcon} strokeWidth={2} className="size-4" />
              Renovar contrato
            </Link>
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

function TarjetaEstado({ estado, count }: { estado: EstadoContrato; count: number }) {
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

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function ContratosClient() {
  const [contratos, setContratos]         = React.useState<Contrato[]>([])
  const [total, setTotal]                 = React.useState(0)
  const [totalPaginas, setTotalPaginas]   = React.useState(1)
  const [pagina, setPagina]               = React.useState(1)
  const [resumenEstados, setResumenEstados] = React.useState(RESUMEN_VACIO)
  const [isLoading, setIsLoading]         = React.useState(true)
  const [busquedaInput, setBusquedaInput] = React.useState("")
  const [busqueda, setBusqueda]           = React.useState("")
  const [filtroEstado, setFiltroEstado]   = React.useState<EstadoContrato | "todos">("todos")
  const [filtroTipo, setFiltroTipo]       = React.useState<TipoContrato | "todos">("todos")
  const [filtroAsesor, setFiltroAsesor]   = React.useState("")

  // Debounce búsqueda
  React.useEffect(() => {
    const t = setTimeout(() => {
      setBusqueda(busquedaInput)
      setPagina(1)
    }, 400)
    return () => clearTimeout(t)
  }, [busquedaInput])

  // Resetear página al cambiar filtros
  React.useEffect(() => { setPagina(1) }, [filtroEstado, filtroTipo, filtroAsesor])

  // Fetch principal
  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)

    listarContratos({
      page:   pagina,
      limit:  POR_PAGINA,
      ...(busqueda                        && { busqueda }),
      ...(filtroEstado !== "todos"        && { estado: filtroEstado }),
      ...(filtroTipo   !== "todos"        && { tipo: filtroTipo }),
      ...(filtroAsesor                    && { asesor: filtroAsesor }),
    })
      .then(res => {
        if (cancelado) return
        setContratos(res.data ?? [])
        setTotal(res.total ?? 0)
        setTotalPaginas(res.totalPaginas ?? 1)
        setResumenEstados(res.resumenEstados ?? RESUMEN_VACIO)
        setIsLoading(false)
      })
      .catch(() => {
        if (cancelado) return
        setContratos([])
        setIsLoading(false)
      })

    return () => { cancelado = true }
  }, [pagina, busqueda, filtroEstado, filtroTipo, filtroAsesor])

  const inicio = (pagina - 1) * POR_PAGINA + 1
  const fin    = Math.min(pagina * POR_PAGINA, total)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contratos</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} contratos en total</p>
        </div>
        <NuevoContratoTrigger />
      </div>

      {/* Tarjetas de resumen */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {ESTADOS_PRINCIPALES.map((estado) => (
            <TarjetaEstado key={estado} estado={estado} count={resumenEstados[estado] ?? 0} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {ESTADOS_SECUNDARIOS.map((estado) => (
            <TarjetaEstado key={estado} estado={estado} count={resumenEstados[estado] ?? 0} />
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-4" />
          Filtrar por:
        </div>
        <Input
          placeholder="Buscar por inmueble, cliente o referencia..."
          className="max-w-xs h-9"
          value={busquedaInput}
          onChange={e => setBusquedaInput(e.target.value)}
        />
        <Select
          value={filtroEstado}
          onValueChange={v => setFiltroEstado(v as EstadoContrato | "todos")}
        >
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {(Object.entries(ESTADO_CONTRATO_CONFIG) as [EstadoContrato, { label: string; className: string }][]).map(
              ([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select
          value={filtroTipo}
          onValueChange={v => setFiltroTipo(v as TipoContrato | "todos")}
        >
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="arriendo">Arriendo</SelectItem>
            <SelectItem value="promesa_compraventa">Promesa compraventa</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filtroAsesor}
          onValueChange={v => setFiltroAsesor(v === "todos" ? "" : v)}
        >
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Asesor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los asesores</SelectItem>
            {ASESORES_MOCK.map(a => (
              <SelectItem key={a.id} value={a.nombre}>{a.nombre}</SelectItem>
            ))}
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
            {isLoading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <TableRow key={i}>
                  {[80, 160, 140, 96, 80, 100, 120, 72, 24].map((w, j) => (
                    <TableCell key={j}>
                      <div className="h-4 rounded bg-muted animate-pulse" style={{ width: w }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : contratos.length === 0 ? (
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
              contratos.map((contrato) => {
                const labels   = LABELS_POR_TIPO[contrato.tipo]
                const restante = tiempoRestante(contrato.fechaFin)
                const esCritico = ESTADOS_CRITICOS.has(contrato.estado)

                return (
                  <TableRow
                    key={contrato.id}
                    className={"hover:bg-muted/30" + (esCritico ? " border-l-2 border-l-red-400" : "")}
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
                      <div className="text-xs text-muted-foreground">
                        {contrato.valorCanon > 0 ? labels.canon : ""}
                      </div>
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
            {total === 0
              ? "Sin contratos"
              : `Mostrando ${inicio}–${fin} de ${total} contrato${total !== 1 ? "s" : ""}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagina <= 1 || isLoading}
              onClick={() => setPagina(p => p - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {pagina} de {totalPaginas}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagina >= totalPaginas || isLoading}
              onClick={() => setPagina(p => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
