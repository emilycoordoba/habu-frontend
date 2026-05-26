"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Search01Icon,
  PencilEdit01Icon,
  UserIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  MoreVerticalCircle01Icon,
  ShieldUserIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { UsuarioDialog } from "@/components/administracion/usuario-dialog"

// ---------------------------------------------------------------------------
// Mock
// ---------------------------------------------------------------------------

type EstadoUsuario = "activo" | "inactivo"
type RolUsuario = "administrador" | "asesor"

interface Usuario {
  id: string
  nombre: string
  correo: string
  roles: RolUsuario[]
  estado: EstadoUsuario
  fechaCreacion: string
}

const USUARIOS_MOCK: Usuario[] = [
  {
    id: "u-1", nombre: "Emily Perea Córdoba", correo: "emily@inmobiliaria.co",
    roles: ["administrador", "asesor"], estado: "activo", fechaCreacion: "2025-01-10",
  },
  {
    id: "u-2", nombre: "Ana Rodríguez", correo: "ana@inmobiliaria.co",
    roles: ["asesor"], estado: "activo", fechaCreacion: "2025-02-01",
  },
  {
    id: "u-3", nombre: "Carlos Mejía", correo: "carlos@inmobiliaria.co",
    roles: ["asesor"], estado: "activo", fechaCreacion: "2025-02-15",
  },
  {
    id: "u-4", nombre: "Lucía Torres", correo: "lucia@inmobiliaria.co",
    roles: ["asesor"], estado: "inactivo", fechaCreacion: "2025-03-01",
  },
  {
    id: "u-5", nombre: "Marcos Salinas", correo: "marcos@inmobiliaria.co",
    roles: ["administrador"], estado: "activo", fechaCreacion: "2025-03-20",
  },
]

// ---------------------------------------------------------------------------
// Config visual
// ---------------------------------------------------------------------------

const ROL_CONFIG: Record<RolUsuario, { label: string; className: string }> = {
  administrador: { label: "Administrador", className: "badge-purple" },
  asesor:        { label: "Asesor",         className: "badge-blue" },
}

function formatFecha(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function UsuariosClient() {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>(USUARIOS_MOCK)
  const [busqueda, setBusqueda] = React.useState("")
  const [filtroRol, setFiltroRol] = React.useState<RolUsuario | "todos">("todos")
  const [filtroEstado, setFiltroEstado] = React.useState<EstadoUsuario | "todos">("todos")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [usuarioEditando, setUsuarioEditando] = React.useState<Usuario | null>(null)

  const filtrados = usuarios.filter((u) => {
    const matchBusqueda =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
    const matchRol = filtroRol === "todos" || u.roles.includes(filtroRol)
    const matchEstado = filtroEstado === "todos" || u.estado === filtroEstado
    return matchBusqueda && matchRol && matchEstado
  })

  function handleNuevo() {
    setUsuarioEditando(null)
    setDialogOpen(true)
  }

  function handleEditar(usuario: Usuario) {
    setUsuarioEditando(usuario)
    setDialogOpen(true)
  }

  function handleToggleEstado(id: string) {
    setUsuarios(prev =>
      prev.map(u =>
        u.id === id
          ? { ...u, estado: u.estado === "activo" ? "inactivo" : "activo" }
          : u
      )
    )
  }

  function handleGuardar(data: Omit<Usuario, "id" | "fechaCreacion">) {
    if (usuarioEditando) {
      setUsuarios(prev =>
        prev.map(u => u.id === usuarioEditando.id ? { ...u, ...data } : u)
      )
    } else {
      const nuevo: Usuario = {
        ...data,
        id: `u-${Date.now()}`,
        fechaCreacion: new Date().toISOString().split("T")[0],
      }
      setUsuarios(prev => [...prev, nuevo])
    }
    setDialogOpen(false)
  }

  const activos = usuarios.filter(u => u.estado === "activo").length

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center gap-3 border-b shrink-0">
        {/* Buscador */}
        <div className="relative flex-1 max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Buscar por nombre o correo…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Filtro rol */}
        <Select value={filtroRol} onValueChange={v => setFiltroRol(v as typeof filtroRol)}>
          <SelectTrigger className="h-8 w-36 text-sm">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            <SelectItem value="administrador">Administrador</SelectItem>
            <SelectItem value="asesor">Asesor</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro estado */}
        <Select value={filtroEstado} onValueChange={v => setFiltroEstado(v as typeof filtroEstado)}>
          <SelectTrigger className="h-8 w-32 text-sm">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {activos} activo{activos !== 1 ? "s" : ""} · {usuarios.length} total
          </span>
          <Button size="sm" onClick={handleNuevo}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
            Nuevo usuario
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="text-left font-medium pb-3 w-[260px]">Usuario</th>
              <th className="text-left font-medium pb-3">Correo</th>
              <th className="text-left font-medium pb-3">Roles</th>
              <th className="text-left font-medium pb-3">Estado</th>
              <th className="text-left font-medium pb-3">Desde</th>
              <th className="pb-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  No se encontraron usuarios con ese criterio.
                </td>
              </tr>
            ) : (
              filtrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-muted/30 transition-colors group">
                  {/* Nombre + avatar */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4 text-primary" />
                      </div>
                      <span className="font-medium truncate">{usuario.nombre}</span>
                    </div>
                  </td>

                  {/* Correo */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="size-3.5 shrink-0" />
                      <span className="truncate">{usuario.correo}</span>
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="py-3 pr-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {usuario.roles.map(rol => (
                        <Badge
                          key={rol}
                          variant="outline"
                          className={cn("text-xs font-medium gap-1", ROL_CONFIG[rol].className)}
                        >
                          <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} className="size-3" />
                          {ROL_CONFIG[rol].label}
                        </Badge>
                      ))}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-3 pr-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium gap-1",
                        usuario.estado === "activo" ? "badge-green" : "badge-gray"
                      )}
                    >
                      <HugeiconsIcon
                        icon={usuario.estado === "activo" ? CheckmarkCircle02Icon : Cancel01Icon}
                        strokeWidth={2}
                        className="size-3"
                      />
                      {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>

                  {/* Fecha */}
                  <td className="py-3 pr-4 text-muted-foreground">
                    {formatFecha(usuario.fechaCreacion)}
                  </td>

                  {/* Acciones */}
                  <td className="py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HugeiconsIcon icon={MoreVerticalCircle01Icon} strokeWidth={2} className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditar(usuario)}>
                          <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleEstado(usuario.id)}
                          className={usuario.estado === "activo" ? "text-red-600 focus:text-red-600" : "text-green-700 focus:text-green-700"}
                        >
                          <HugeiconsIcon
                            icon={usuario.estado === "activo" ? Cancel01Icon : CheckmarkCircle02Icon}
                            strokeWidth={2}
                            className="size-4 mr-2"
                          />
                          {usuario.estado === "activo" ? "Desactivar" : "Activar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog crear/editar */}
      <UsuarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        usuario={usuarioEditando}
        onGuardar={handleGuardar}
      />
    </div>
  )
}
