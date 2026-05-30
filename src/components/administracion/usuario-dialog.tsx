"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Usuario, RolUsuario, EstadoUsuario } from "@/types/administracion.types"

export interface GuardarUsuarioData {
  nombre: string
  correo: string
  roles: RolUsuario[]
  estado: EstadoUsuario
  contrasena?: string
}

interface UsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario | null
  onGuardar: (data: GuardarUsuarioData) => Promise<void>
  isSubmitting?: boolean
}

const ROLES: { value: RolUsuario; label: string; descripcion: string }[] = [
  {
    value: "administrador",
    label: "Administrador",
    descripcion: "Acceso total: usuarios, roles, parámetros y configuración",
  },
  {
    value: "asesor",
    label: "Asesor",
    descripcion: "Gestión de inmuebles, clientes, contratos y pagos",
  },
]

export function UsuarioDialog({ open, onOpenChange, usuario, onGuardar, isSubmitting }: UsuarioDialogProps) {
  const esEdicion = !!usuario

  const [nombre, setNombre] = React.useState("")
  const [correo, setCorreo] = React.useState("")
  const [contrasena, setContrasena] = React.useState("")
  const [mostrarContrasena, setMostrarContrasena] = React.useState(false)
  const [roles, setRoles] = React.useState<RolUsuario[]>([])
  const [estado, setEstado] = React.useState<EstadoUsuario>("activo")

  React.useEffect(() => {
    if (open) {
      if (usuario) {
        setNombre(usuario.nombre)
        setCorreo(usuario.correo)
        setRoles(usuario.roles)
        setEstado(usuario.estado)
      } else {
        setNombre("")
        setCorreo("")
        setRoles([])
        setEstado("activo")
      }
      setContrasena("")
      setMostrarContrasena(false)
    }
  }, [open, usuario])

  function toggleRol(rol: RolUsuario) {
    setRoles(prev =>
      prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
    )
  }

  const puedeGuardar =
    nombre.trim() !== "" &&
    correo.trim() !== "" &&
    roles.length > 0 &&
    (esEdicion || contrasena.length >= 8)

  function handleGuardar() {
    if (!puedeGuardar) return
    onGuardar({
      nombre: nombre.trim(),
      correo: correo.trim(),
      roles,
      estado,
      contrasena: !esEdicion ? contrasena : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{esEdicion ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          <DialogDescription>
            {esEdicion
              ? "Modifica los datos del usuario. La contraseña solo se cambia desde la opción de reseteo."
              : "Completa los datos para crear el acceso al sistema."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="u-nombre">
              Nombre completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="u-nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ana Rodríguez"
            />
          </div>

          {/* Correo */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="u-correo">
              Correo electrónico <span className="text-destructive">*</span>
            </Label>
            <Input
              id="u-correo"
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="ana@inmobiliaria.co"
            />
          </div>

          {/* Contraseña — solo en creación */}
          {!esEdicion && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="u-contrasena">
                Contraseña <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="u-contrasena"
                  type={mostrarContrasena ? "text" : "password"}
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <HugeiconsIcon
                    icon={mostrarContrasena ? ViewOffIcon : EyeIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </button>
              </div>
              {contrasena.length > 0 && contrasena.length < 8 && (
                <p className="text-xs text-destructive">Mínimo 8 caracteres</p>
              )}
            </div>
          )}

          {/* Roles */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Rol(es) <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              {ROLES.map(({ value, label, descripcion }) => {
                const activo = roles.includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleRol(value)}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left transition-colors",
                      activo
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "size-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                        activo ? "border-primary bg-primary" : "border-muted-foreground/40"
                      )}>
                        {activo && (
                          <svg viewBox="0 0 10 8" fill="none" className="size-2.5">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">{descripcion}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Estado — solo en edición */}
          {esEdicion && (
            <div className="flex flex-col gap-1.5">
              <Label>Estado</Label>
              <div className="flex gap-2">
                {(["activo", "inactivo"] as EstadoUsuario[]).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEstado(e)}
                    className={cn(
                      "flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors capitalize",
                      estado === e
                        ? e === "activo"
                          ? "border-green-400 bg-green-50 text-green-700"
                          : "border-gray-300 bg-gray-50 text-gray-600"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {e === "activo" ? "Activo" : "Inactivo"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleGuardar} disabled={!puedeGuardar || isSubmitting}>
            {isSubmitting ? "Guardando…" : esEdicion ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
