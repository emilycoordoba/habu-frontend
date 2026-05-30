"use client"

import * as React from "react"
import { toast } from "sonner"
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
  RefreshIcon,
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
import {
  listarUsuarios,
  crearUsuario,
  editarUsuario,
  cambiarEstadoUsuario,
} from "@/lib/api/administracion"
import type { Usuario, RolUsuario, EstadoUsuario } from "@/types/administracion.types"
import type { GuardarUsuarioData } from "@/components/administracion/usuario-dialog"

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
// Skeleton
// ---------------------------------------------------------------------------

function UsuariosSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-y-auto animate-pulse">
      <div className="px-6 py-4 border-b h-14 bg-muted/20" />
      <div className="flex-1 px-6 py-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted/30 rounded" />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function UsuariosClient() {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [busqueda, setBusqueda] = React.useState("")
  const [filtroRol, setFiltroRol] = React.useState<RolUsuario | "todos">("todos")
  const [filtroEstado, setFiltroEstado] = React.useState<EstadoUsuario | "todos">("todos")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [usuarioEditando, setUsuarioEditando] = React.useState<Usuario | null>(null)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)
    listarUsuarios({ limit: 100 })
      .then(res => { if (!cancelado) setUsuarios(res.data ?? []) })
      .catch(() => { if (!cancelado) setError("No se pudieron cargar los usuarios.") })
      .finally(() => { if (!cancelado) setIsLoading(false) })
    return () => { cancelado = true }
  }, [retryKey])

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

  async function handleToggleEstado(id: string, estadoActual: EstadoUsuario) {
    const nuevoEstado: EstadoUsuario = estadoActual === "activo" ? "inactivo" : "activo"
    try {
      await cambiarEstadoUsuario(id, nuevoEstado)
      setRetryKey(k => k + 1)
      toast.success(`Usuario ${nuevoEstado === "activo" ? "activado" : "desactivado"}`)
    } catch {
      toast.error("No se pudo cambiar el estado del usuario.")
    }
  }

  async function handleGuardar(data: GuardarUsuarioData) {
    setIsSubmitting(true)
    try {
      if (usuarioEditando) {
        await editarUsuario(usuarioEditando.id, {
          nombre: data.nombre,
          correo: data.correo,
          roles: data.roles,
        })
        toast.success("Usuario actualizado")
      } else {
        await crearUsuario({
          nombre: data.nombre,
          correo: data.correo,
          contrasena: data.contrasena!,
          roles: data.roles,
          estado: data.estado,
        })
        toast.success("Usuario creado correctamente")
      }
      setDialogOpen(false)
      setRetryKey(k => k + 1)
    } catch {
      toast.error(usuarioEditando ? "No se pudo actualizar el usuario." : "No se pudo crear el usuario.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <UsuariosSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={() => setRetryKey(k => k + 1)} className="gap-2">
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const activos = usuarios.filter(u => u.estado === "activo").length

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center gap-3 border-b shrink-0">
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
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4 text-primary" />
                      </div>
                      <span className="font-medium truncate">{usuario.nombre}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="size-3.5 shrink-0" />
                      <span className="truncate">{usuario.correo}</span>
                    </div>
                  </td>
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
                  <td className="py-3 pr-4 text-muted-foreground">
                    {formatFecha(usuario.fechaCreacion)}
                  </td>
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
                          onClick={() => handleToggleEstado(usuario.id, usuario.estado)}
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

      <UsuarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        usuario={usuarioEditando}
        onGuardar={handleGuardar}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
