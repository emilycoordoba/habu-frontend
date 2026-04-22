"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  FileValidationIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Tipos y mock
// ---------------------------------------------------------------------------

type TipoPersona   = "natural" | "juridica" | "ambos"
type TipoInmueble  = "residencial" | "comercial" | "ambos"

interface TipoDocumento {
  id: string
  nombre: string
  tipoPersona: TipoPersona
  tipoInmueble: TipoInmueble
  requiereCodeudor: boolean
  obligatorio: boolean
}

const TIPOS_MOCK: TipoDocumento[] = [
  { id: "td-1",  nombre: "Cédula de ciudadanía",          tipoPersona: "natural",   tipoInmueble: "ambos",        requiereCodeudor: false, obligatorio: true  },
  { id: "td-2",  nombre: "RUT persona natural",           tipoPersona: "natural",   tipoInmueble: "ambos",        requiereCodeudor: false, obligatorio: true  },
  { id: "td-3",  nombre: "Certificado de ingresos",       tipoPersona: "natural",   tipoInmueble: "ambos",        requiereCodeudor: false, obligatorio: true  },
  { id: "td-4",  nombre: "Desprendible de nómina",        tipoPersona: "natural",   tipoInmueble: "ambos",        requiereCodeudor: false, obligatorio: false },
  { id: "td-5",  nombre: "Cédula del codeudor",           tipoPersona: "natural",   tipoInmueble: "residencial",  requiereCodeudor: true,  obligatorio: true  },
  { id: "td-6",  nombre: "Certificado de ingresos codeudor", tipoPersona: "natural", tipoInmueble: "residencial", requiereCodeudor: true,  obligatorio: true  },
  { id: "td-7",  nombre: "NIT empresa",                   tipoPersona: "juridica",  tipoInmueble: "ambos",        requiereCodeudor: false, obligatorio: true  },
  { id: "td-8",  nombre: "Cámara de comercio",            tipoPersona: "juridica",  tipoInmueble: "ambos",        requiereCodeudor: false, obligatorio: true  },
  { id: "td-9",  nombre: "Estados financieros",           tipoPersona: "juridica",  tipoInmueble: "comercial",    requiereCodeudor: false, obligatorio: true  },
  { id: "td-10", nombre: "Paz y salvo predial",           tipoPersona: "ambos",     tipoInmueble: "ambos",        requiereCodeudor: false, obligatorio: true  },
]

// ---------------------------------------------------------------------------
// Helpers de etiquetas
// ---------------------------------------------------------------------------

const PERSONA_LABEL: Record<TipoPersona, string> = {
  natural:  "Natural",
  juridica: "Jurídica",
  ambos:    "Ambos",
}

const INMUEBLE_LABEL: Record<TipoInmueble, string> = {
  residencial: "Residencial",
  comercial:   "Comercial",
  ambos:       "Ambos",
}

// ---------------------------------------------------------------------------
// Dialog crear/editar
// ---------------------------------------------------------------------------

interface TipoDocumentoDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  tipo: TipoDocumento | null
  onGuardar: (data: Omit<TipoDocumento, "id">) => void
}

function TipoDocumentoDialog({ open, onOpenChange, tipo, onGuardar }: TipoDocumentoDialogProps) {
  const [nombre, setNombre] = React.useState("")
  const [tipoPersona, setTipoPersona] = React.useState<TipoPersona>("natural")
  const [tipoInmueble, setTipoInmueble] = React.useState<TipoInmueble>("ambos")
  const [requiereCodeudor, setRequiereCodeudor] = React.useState(false)
  const [obligatorio, setObligatorio] = React.useState(true)

  React.useEffect(() => {
    if (open) {
      setNombre(tipo?.nombre ?? "")
      setTipoPersona(tipo?.tipoPersona ?? "natural")
      setTipoInmueble(tipo?.tipoInmueble ?? "ambos")
      setRequiereCodeudor(tipo?.requiereCodeudor ?? false)
      setObligatorio(tipo?.obligatorio ?? true)
    }
  }, [open, tipo])

  const puedeGuardar = nombre.trim().length > 0

  function handleGuardar() {
    if (!puedeGuardar) return
    onGuardar({ nombre: nombre.trim(), tipoPersona, tipoInmueble, requiereCodeudor, obligatorio })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tipo ? "Editar tipo de documento" : "Nuevo tipo de documento"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="td-nombre">Nombre del documento</Label>
            <Input
              id="td-nombre"
              placeholder="Ej. Cédula de ciudadanía"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Tipo de persona</Label>
              <Select value={tipoPersona} onValueChange={v => setTipoPersona(v as TipoPersona)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="juridica">Jurídica</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Tipo de inmueble</Label>
              <Select value={tipoInmueble} onValueChange={v => setTipoInmueble(v as TipoInmueble)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Obligatorio</p>
                <p className="text-xs text-muted-foreground">El contrato no avanza sin este documento</p>
              </div>
              <Switch checked={obligatorio} onCheckedChange={setObligatorio} />
            </div>

            <div className="border-t pt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Solo con codeudor</p>
                <p className="text-xs text-muted-foreground">Solo se solicita cuando hay codeudor</p>
              </div>
              <Switch checked={requiereCodeudor} onCheckedChange={setRequiereCodeudor} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleGuardar} disabled={!puedeGuardar}>
            {tipo ? "Guardar cambios" : "Agregar documento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function DocumentosClient() {
  const [tipos, setTipos] = React.useState<TipoDocumento[]>(TIPOS_MOCK)
  const [busqueda, setBusqueda] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editando, setEditando] = React.useState<TipoDocumento | null>(null)
  const [confirmEliminar, setConfirmEliminar] = React.useState<TipoDocumento | null>(null)

  const filtrados = tipos.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  function handleNuevo() {
    setEditando(null)
    setDialogOpen(true)
  }

  function handleGuardar(data: Omit<TipoDocumento, "id">) {
    if (editando) {
      setTipos(prev => prev.map(t => t.id === editando.id ? { ...t, ...data } : t))
    } else {
      setTipos(prev => [...prev, { ...data, id: `td-${Date.now()}` }])
    }
    setDialogOpen(false)
  }

  function handleToggleObligatorio(id: string) {
    setTipos(prev =>
      prev.map(t => t.id === id ? { ...t, obligatorio: !t.obligatorio } : t)
    )
  }

  const obligatorios = tipos.filter(t => t.obligatorio).length

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Toolbar */}
      <div className="px-6 py-3.5 flex items-center gap-3 border-b shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Input
            placeholder="Buscar documento…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {obligatorios} obligatorio{obligatorios !== 1 ? "s" : ""} · {tipos.length} tipos
          </span>
          <Button size="sm" onClick={handleNuevo}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
            Nuevo tipo
          </Button>
        </div>
      </div>

      <div className="px-6 py-2 text-xs text-muted-foreground border-b bg-muted/20">
        Configura qué documentos se solicitan según el tipo de persona, inmueble y si hay codeudor.
        Estos documentos se usarán como checklist al gestionar contratos.
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="text-left font-medium pb-3">Documento</th>
              <th className="text-left font-medium pb-3">Persona</th>
              <th className="text-left font-medium pb-3">Inmueble</th>
              <th className="text-center font-medium pb-3">Con codeudor</th>
              <th className="text-center font-medium pb-3">Obligatorio</th>
              <th className="pb-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  No se encontraron documentos con ese criterio.
                </td>
              </tr>
            ) : (
              filtrados.map(tipo => (
                <tr key={tipo.id} className="hover:bg-muted/30 transition-colors group">
                  {/* Nombre */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={FileValidationIcon} strokeWidth={2} className="size-3.5 text-primary" />
                      </div>
                      <span className="font-medium">{tipo.nombre}</span>
                    </div>
                  </td>

                  {/* Tipo persona */}
                  <td className="py-3 pr-4">
                    <Badge variant="outline" className="text-xs font-medium">
                      {PERSONA_LABEL[tipo.tipoPersona]}
                    </Badge>
                  </td>

                  {/* Tipo inmueble */}
                  <td className="py-3 pr-4">
                    <Badge variant="outline" className="text-xs font-medium">
                      {INMUEBLE_LABEL[tipo.tipoInmueble]}
                    </Badge>
                  </td>

                  {/* Requiere codeudor */}
                  <td className="py-3 pr-4 text-center">
                    <div className="flex justify-center">
                      <HugeiconsIcon
                        icon={tipo.requiereCodeudor ? CheckmarkCircle02Icon : Cancel01Icon}
                        strokeWidth={2}
                        className={cn(
                          "size-4",
                          tipo.requiereCodeudor ? "text-amber-600" : "text-muted-foreground/30"
                        )}
                      />
                    </div>
                  </td>

                  {/* Obligatorio — toggle directo */}
                  <td className="py-3 pr-4 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={tipo.obligatorio}
                        onCheckedChange={() => handleToggleObligatorio(tipo.id)}
                        className="scale-90"
                      />
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="py-3">
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => { setEditando(tipo); setDialogOpen(true) }}
                        title="Editar"
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 hover:text-red-600"
                        onClick={() => setConfirmEliminar(tipo)}
                        title="Eliminar"
                      >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TipoDocumentoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tipo={editando}
        onGuardar={handleGuardar}
      />

      <AlertDialog open={!!confirmEliminar} onOpenChange={open => !open && setConfirmEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tipo de documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <strong>{confirmEliminar?.nombre}</strong> de la configuración.
              Los documentos ya cargados en contratos existentes no se verán afectados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmEliminar) return
                setTipos(prev => prev.filter(t => t.id !== confirmEliminar.id))
                setConfirmEliminar(null)
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
