"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Building04Icon,
  FileManagementIcon,
  Invoice03Icon,
  UserIcon,
  Wrench01Icon,
  UserSettings01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Definición de permisos por módulo
// ---------------------------------------------------------------------------

type RolKey = "administrador" | "asesor"

interface Permiso {
  nombre: string
  roles: Record<RolKey, boolean>
}

interface ModuloPermisos {
  modulo: string
  icon: typeof Building04Icon
  permisos: Permiso[]
}

const MATRIZ: ModuloPermisos[] = [
  {
    modulo: "Inmuebles",
    icon: Building04Icon,
    permisos: [
      { nombre: "Ver lista de inmuebles",       roles: { administrador: true,  asesor: true  } },
      { nombre: "Registrar inmueble",           roles: { administrador: true,  asesor: true  } },
      { nombre: "Editar inmueble",              roles: { administrador: true,  asesor: true  } },
      { nombre: "Publicar / despublicar",       roles: { administrador: true,  asesor: true  } },
    ],
  },
  {
    modulo: "Contratos",
    icon: FileManagementIcon,
    permisos: [
      { nombre: "Ver lista de contratos",       roles: { administrador: true,  asesor: true  } },
      { nombre: "Iniciar contrato",             roles: { administrador: true,  asesor: true  } },
      { nombre: "Gestionar documentos",         roles: { administrador: true,  asesor: true  } },
      { nombre: "Registrar escrituración",      roles: { administrador: true,  asesor: true  } },
      { nombre: "Registrar terminación anticipada", roles: { administrador: true, asesor: true } },
      { nombre: "Gestionar renovación",         roles: { administrador: true,  asesor: true  } },
    ],
  },
  {
    modulo: "Pagos y Mora",
    icon: Invoice03Icon,
    permisos: [
      { nombre: "Ver cobros de un contrato",    roles: { administrador: true,  asesor: true  } },
      { nombre: "Registrar pago",               roles: { administrador: true,  asesor: true  } },
      { nombre: "Ver estado de cuenta",         roles: { administrador: true,  asesor: true  } },
      { nombre: "Ver cobros en mora",           roles: { administrador: true,  asesor: true  } },
      { nombre: "Generar reporte de ingresos",  roles: { administrador: true,  asesor: true  } },
    ],
  },
  {
    modulo: "Clientes",
    icon: UserIcon,
    permisos: [
      { nombre: "Ver lista de clientes",        roles: { administrador: true,  asesor: true  } },
      { nombre: "Registrar cliente",            roles: { administrador: true,  asesor: true  } },
      { nombre: "Editar cliente",               roles: { administrador: true,  asesor: true  } },
      { nombre: "Ver historial de interacciones", roles: { administrador: true, asesor: true } },
    ],
  },
  {
    modulo: "Mantenimiento",
    icon: Wrench01Icon,
    permisos: [
      { nombre: "Ver solicitudes",              roles: { administrador: true,  asesor: true  } },
      { nombre: "Crear solicitud",              roles: { administrador: true,  asesor: true  } },
      { nombre: "Asignar técnico / proveedor",  roles: { administrador: true,  asesor: false } },
      { nombre: "Actualizar estado",            roles: { administrador: true,  asesor: false } },
      { nombre: "Registrar costo",              roles: { administrador: true,  asesor: false } },
    ],
  },
  {
    modulo: "Administración",
    icon: UserSettings01Icon,
    permisos: [
      { nombre: "Gestionar usuarios",           roles: { administrador: true,  asesor: false } },
      { nombre: "Ver roles y permisos",         roles: { administrador: true,  asesor: false } },
      { nombre: "Configurar comisiones",        roles: { administrador: true,  asesor: false } },
      { nombre: "Configurar documentos requeridos", roles: { administrador: true, asesor: false } },
      { nombre: "Configurar parámetros del sistema", roles: { administrador: true, asesor: false } },
    ],
  },
]

const ROLES: { key: RolKey; label: string; descripcion: string; className: string }[] = [
  {
    key: "administrador",
    label: "Administrador",
    descripcion: "Control total del sistema",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    key: "asesor",
    label: "Asesor",
    descripcion: "Operación diaria de la inmobiliaria",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
]

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

function CeldaPermiso({ tiene }: { tiene: boolean }) {
  return (
    <div className="flex justify-center">
      <HugeiconsIcon
        icon={tiene ? CheckmarkCircle02Icon : Cancel01Icon}
        strokeWidth={2}
        className={cn(
          "size-4",
          tiene ? "text-green-600" : "text-muted-foreground/30"
        )}
      />
    </div>
  )
}

export function RolesClient() {
  const totalPermisos = MATRIZ.reduce((acc, m) => acc + m.permisos.length, 0)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 py-4 max-w-3xl w-full mx-auto">

        {/* Cabecera informativa */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Los roles del sistema son fijos en esta versión. La asignación de roles a usuarios
            se gestiona desde la sección{" "}
            <span className="font-medium text-foreground">Usuarios</span>.
          </p>
        </div>

        {/* Cards de roles */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {ROLES.map(rol => {
            const totalRol = MATRIZ.reduce(
              (acc, m) => acc + m.permisos.filter(p => p.roles[rol.key]).length,
              0
            )
            return (
              <div
                key={rol.key}
                className={cn(
                  "rounded-lg border-2 p-4",
                  rol.key === "administrador"
                    ? "border-purple-200 bg-purple-50/50"
                    : "border-blue-200 bg-blue-50/50"
                )}
              >
                <p className={cn("text-sm font-semibold", rol.key === "administrador" ? "text-purple-700" : "text-blue-700")}>
                  {rol.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{rol.descripcion}</p>
                <p className="text-xs font-medium mt-2 text-foreground">
                  {totalRol} de {totalPermisos} permisos
                </p>
              </div>
            )
          })}
        </div>

        {/* Matriz de permisos */}
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b">
                <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground w-full">
                  Permiso
                </th>
                {ROLES.map(rol => (
                  <th
                    key={rol.key}
                    className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-center whitespace-nowrap w-32"
                  >
                    {rol.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIZ.map((modulo, mi) => (
                <>
                  {/* Fila de módulo */}
                  <tr key={`mod-${mi}`} className="bg-muted/20 border-t">
                    <td
                      colSpan={ROLES.length + 1}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={modulo.icon} strokeWidth={2} className="size-3.5" />
                        {modulo.modulo}
                      </div>
                    </td>
                  </tr>
                  {/* Filas de permisos */}
                  {modulo.permisos.map((permiso, pi) => (
                    <tr
                      key={`perm-${mi}-${pi}`}
                      className="border-t hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-sm">{permiso.nombre}</td>
                      {ROLES.map(rol => (
                        <td key={rol.key} className="px-4 py-2.5">
                          <CeldaPermiso tiene={permiso.roles[rol.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          La gestión dinámica de roles y permisos estará disponible en una versión futura,
          una vez implementado el módulo de autenticación.
        </p>
      </div>
    </div>
  )
}
