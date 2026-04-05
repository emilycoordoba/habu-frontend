import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, FilterIcon } from "@hugeicons/core-free-icons"

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
    fechaInicio: "2025-01-01",
    fechaFin: "2026-01-01",
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
    fechaInicio: "2025-03-15",
    fechaFin: "2025-09-15",
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
    fechaInicio: "2024-06-01",
    fechaFin: "2025-06-01",
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

function formatCurrency(value: number) {
  if (value === 0) return "—"
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: string) {
  if (date === "—") return "—"
  return new Date(date + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function ContratosPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contratos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {CONTRATOS_MOCK.length} contratos en total
          </p>
        </div>
        <Button asChild>
          <Link href="/contratos/nuevo">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4" />
            Nuevo contrato
          </Link>
        </Button>
      </div>

      {/* Tarjetas de resumen por estado */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {(["activo", "en_firmas", "por_vencer", "vencido_con_saldos", "borrador"] as EstadoContrato[]).map(
          (estado) => {
            const count = CONTRATOS_MOCK.filter((c) => c.estado === estado).length
            const config = ESTADO_CONTRATO_CONFIG[estado]
            return (
              <div key={estado} className="rounded-lg border bg-card p-3 flex flex-col gap-1">
                <span className="text-2xl font-bold">{count}</span>
                <Badge variant="outline" className={config.className + " w-fit text-xs"}>
                  {config.label}
                </Badge>
              </div>
            )
          }
        )}
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
        />
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
              <TableHead className="text-right">Canon / Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONTRATOS_MOCK.map((contrato) => {
              const labels = LABELS_POR_TIPO[contrato.tipo]
              return (
                <TableRow key={contrato.id} className="hover:bg-muted/30 cursor-pointer">
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
                  <TableCell className="text-xs text-muted-foreground">
                    <div>{formatDate(contrato.fechaInicio)}</div>
                    <div>{formatDate(contrato.fechaFin)}</div>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(contrato.valorCanon)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
