"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ExpandIcon,
  ArrowShrink01Icon,
  Building04Icon,
  UserIcon,
  UserCheck01Icon,
  FileManagementIcon,
  ArrowDown01Icon,
  Tick01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TipoContrato } from "@/types/contrato.types"
import { RegistrarClienteDialog } from "./registrar-cliente-dialog"
import { ASESORES_MOCK } from "@/lib/mock/usuarios"

// --- Datos mock (se reemplazarán con la API) ---
const INMUEBLES_DISPONIBLES = [
  { id: "i1", nombre: "Apto 502 Torres del Norte", direccion: "Cll 127 #15-40, Bogotá", propietario: "Jorge Herrera", propietarioId: "p1" },
  { id: "i2", nombre: "Local 8 CC Bulevar", direccion: "Av. El Dorado #68C-61, Bogotá", propietario: "Inversiones XYZ", propietarioId: "p2" },
  { id: "i3", nombre: "Casa 5 Urb. Los Pinos", direccion: "Cll 12 #45-30, Medellín", propietario: "María Ospina", propietarioId: "p3" },
  { id: "i4", nombre: "Oficina 301 Ed. Empresarial", direccion: "Cra 43 #11-61, Medellín", propietario: "Rodrigo Castaño", propietarioId: "p4" },
]

const CLIENTES_DISPONIBLES = [
  { id: "c1", nombre: "Andrés Ramírez", identificacion: "CC 1020304050" },
  { id: "c2", nombre: "Laura Gómez", identificacion: "CC 1234567890" },
  { id: "c3", nombre: "Constructora Cementos S.A.S.", identificacion: "NIT 900123456-7" },
  { id: "c4", nombre: "Felipe Morales", identificacion: "CE 987654321" },
  { id: "c5", nombre: "Inversiones del Valle Ltda.", identificacion: "NIT 800987654-3" },
]

interface IniciarContratoSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IniciarContratoSheet({ open, onOpenChange }: IniciarContratoSheetProps) {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [inmuebleComboOpen, setInmuebleComboOpen] = React.useState(false)
  const [contraparteComboOpen, setContraparteComboOpen] = React.useState(false)
  const [asesorComboOpen, setAsesorComboOpen] = React.useState(false)
  const [registrarClienteOpen, setRegistrarClienteOpen] = React.useState(false)

  const [inmuebleId, setInmuebleId] = React.useState("")
  const [tipo, setTipo] = React.useState<TipoContrato | "">("")
  const [contraparteId, setContraparteId] = React.useState("")
  const [contraparteNombre, setContraparteNombre] = React.useState("")
  const [contraparteIdentificacion, setContraparteIdentificacion] = React.useState("")
  const [asesorId, setAsesorId] = React.useState("")
  const [asesorNombre, setAsesorNombre] = React.useState("")

  const inmuebleSeleccionado = INMUEBLES_DISPONIBLES.find((i) => i.id === inmuebleId)
  const labelContraparte = tipo === "arriendo" ? "Arrendatario" : tipo === "promesa_compraventa" ? "Comprador" : "Contraparte"
  const contraparteSeleccionada = !!contraparteId || !!contraparteNombre
  const puedeConfirmar = !!inmuebleId && !!tipo && contraparteSeleccionada && !!asesorId

  function handleClienteRegistrado(cliente: { nombre: string; identificacion: string }) {
    // El cliente recién registrado se selecciona automáticamente como contraparte
    setContraparteId("nuevo")
    setContraparteNombre(cliente.nombre)
    setContraparteIdentificacion(cliente.identificacion)
  }

  function handleConfirmar() {
    if (!puedeConfirmar) return
    const ruta = tipo === "arriendo" ? "/contratos/nuevo/arriendo" : "/contratos/nuevo/promesa"
    router.push(`${ruta}?inmueble=${inmuebleId}&tipo=${tipo}&asesor=${asesorId}`)
    onOpenChange(false)
  }

  function handleClose() {
    setInmuebleId("")
    setTipo("")
    setContraparteId("")
    setContraparteNombre("")
    setContraparteIdentificacion("")
    setAsesorId("")
    setAsesorNombre("")
    setIsFullscreen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent
          side="right"
          className={
            isFullscreen
              ? "w-screen max-w-none h-screen sm:max-w-none rounded-none transition-all duration-300"
              : "w-full sm:max-w-lg transition-all duration-300"
          }
        >
          <SheetHeader className="flex flex-row items-start justify-between pr-8">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={FileManagementIcon} strokeWidth={2} className="size-5 text-primary" />
                Iniciar contrato
              </SheetTitle>
              <SheetDescription>
                Selecciona el inmueble, el tipo y las partes del contrato.
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => setIsFullscreen((v) => !v)}
              title={isFullscreen ? "Reducir" : "Expandir a pantalla completa"}
            >
              <HugeiconsIcon
                icon={isFullscreen ? ArrowShrink01Icon : ExpandIcon}
                strokeWidth={2}
                className="size-4"
              />
            </Button>
          </SheetHeader>

          <div className="flex flex-col gap-6 p-6 overflow-y-auto flex-1">

            {/* Paso 1 — Inmueble */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</div>
                <span className="text-sm font-medium">Seleccionar inmueble</span>
              </div>

              <Popover open={inmuebleComboOpen} onOpenChange={setInmuebleComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={inmuebleComboOpen}
                    className="w-full justify-between font-normal"
                  >
                    {inmuebleSeleccionado ? (
                      <span className="truncate">{inmuebleSeleccionado.nombre}</span>
                    ) : (
                      <span className="text-muted-foreground">Buscar inmueble disponible...</span>
                    )}
                    <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0"
                  style={{ width: "var(--radix-popover-trigger-width)" }}
                >
                  <Command>
                    <CommandInput placeholder="Buscar por nombre o dirección..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron inmuebles.</CommandEmpty>
                      <CommandGroup>
                        {INMUEBLES_DISPONIBLES.map((inmueble) => (
                          <CommandItem
                            key={inmueble.id}
                            value={`${inmueble.nombre} ${inmueble.direccion}`}
                            onSelect={() => {
                              setInmuebleId(inmueble.id)
                              setInmuebleComboOpen(false)
                            }}
                            className="flex items-start gap-2 py-2"
                          >
                            <HugeiconsIcon
                              icon={Tick01Icon}
                              strokeWidth={2}
                              className={cn(
                                "size-4 mt-0.5 shrink-0",
                                inmuebleId === inmueble.id ? "opacity-100 text-primary" : "opacity-0"
                              )}
                            />
                            <div>
                              <div className="font-medium text-sm">{inmueble.nombre}</div>
                              <div className="text-xs text-muted-foreground">{inmueble.direccion}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Propietario cargado automáticamente */}
              {inmuebleSeleccionado && (
                <div className="rounded-lg border bg-muted/40 p-3 flex items-center gap-3">
                  <HugeiconsIcon icon={Building04Icon} strokeWidth={2} className="size-4 text-muted-foreground shrink-0" />
                  <div className="text-sm">
                    <div className="text-muted-foreground text-xs">Propietario (cargado automáticamente)</div>
                    <div className="font-medium">{inmuebleSeleccionado.propietario}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Paso 2 — Tipo de contrato */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                  inmuebleId ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>2</div>
                <span className={cn("text-sm font-medium", !inmuebleId && "text-muted-foreground")}>
                  Tipo de contrato
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["arriendo", "promesa_compraventa"] as TipoContrato[]).map((t) => (
                  <button
                    key={t}
                    disabled={!inmuebleId}
                    onClick={() => setTipo(t)}
                    className={cn(
                      "rounded-lg border-2 p-4 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                      tipo === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="font-medium text-sm">
                      {t === "arriendo" ? "Arriendo" : "Promesa C/V"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t === "arriendo" ? "Canon mensual, depósito, administración" : "Precio, arras, escrituración"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 3 — Contraparte */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                  tipo ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>3</div>
                <span className={cn("text-sm font-medium", !tipo && "text-muted-foreground")}>
                  {labelContraparte}
                </span>
                {tipo && (
                  <Badge variant="outline" className="text-xs ml-auto">
                    {tipo === "arriendo" ? "Arrendatario" : "Comprador"}
                  </Badge>
                )}
              </div>

              <Popover open={contraparteComboOpen} onOpenChange={setContraparteComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={contraparteComboOpen}
                    disabled={!tipo}
                    className="w-full justify-between font-normal"
                  >
                    {contraparteNombre ? (
                      <div className="flex items-center gap-2 truncate">
                        <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{contraparteNombre}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Buscar {tipo ? labelContraparte.toLowerCase() : "contraparte"}...
                      </span>
                    )}
                    <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0"
                  style={{ width: "var(--radix-popover-trigger-width)" }}
                >
                  <Command>
                    <CommandInput placeholder="Buscar por nombre o documento..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                      <CommandGroup heading="Clientes registrados">
                        {CLIENTES_DISPONIBLES.map((cliente) => (
                          <CommandItem
                            key={cliente.id}
                            value={`${cliente.nombre} ${cliente.identificacion}`}
                            onSelect={() => {
                              setContraparteId(cliente.id)
                              setContraparteNombre(cliente.nombre)
                              setContraparteIdentificacion(cliente.identificacion)
                              setContraparteComboOpen(false)
                            }}
                            className="flex items-start gap-2 py-2"
                          >
                            <HugeiconsIcon
                              icon={Tick01Icon}
                              strokeWidth={2}
                              className={cn(
                                "size-4 mt-0.5 shrink-0",
                                contraparteId === cliente.id ? "opacity-100 text-primary" : "opacity-0"
                              )}
                            />
                            <div>
                              <div className="font-medium text-sm">{cliente.nombre}</div>
                              <div className="text-xs text-muted-foreground">{cliente.identificacion}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  {/* Fuera del filtro de Command para que siempre sea visible */}
                  <div className="border-t p-1">
                    <button
                      onClick={() => {
                        setContraparteComboOpen(false)
                        setRegistrarClienteOpen(true)
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-primary hover:bg-accent transition-colors"
                    >
                      <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4 shrink-0" />
                      <span className="font-medium">Registrar nuevo cliente</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Chip del cliente seleccionado */}
              {contraparteNombre && (
                <div className="rounded-lg border bg-muted/40 p-3 flex items-center gap-3">
                  <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4 text-muted-foreground shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">{contraparteNombre}</div>
                    <div className="text-xs text-muted-foreground">{contraparteIdentificacion}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Paso 4 — Asesor responsable */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                  contraparteSeleccionada ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>4</div>
                <span className={cn("text-sm font-medium", !contraparteSeleccionada && "text-muted-foreground")}>
                  Asesor responsable
                </span>
              </div>

              <Popover open={asesorComboOpen} onOpenChange={setAsesorComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={asesorComboOpen}
                    disabled={!contraparteSeleccionada}
                    className="w-full justify-between font-normal"
                  >
                    {asesorNombre ? (
                      <div className="flex items-center gap-2 truncate">
                        <HugeiconsIcon icon={UserCheck01Icon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{asesorNombre}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Seleccionar asesor...</span>
                    )}
                    <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0"
                  style={{ width: "var(--radix-popover-trigger-width)" }}
                >
                  <Command>
                    <CommandInput placeholder="Buscar asesor..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron asesores.</CommandEmpty>
                      <CommandGroup>
                        {ASESORES_MOCK.map((asesor) => (
                          <CommandItem
                            key={asesor.id}
                            value={asesor.nombre}
                            onSelect={() => {
                              setAsesorId(asesor.id)
                              setAsesorNombre(asesor.nombre)
                              setAsesorComboOpen(false)
                            }}
                            className="flex items-start gap-2 py-2"
                          >
                            <HugeiconsIcon
                              icon={Tick01Icon}
                              strokeWidth={2}
                              className={cn(
                                "size-4 mt-0.5 shrink-0",
                                asesorId === asesor.id ? "opacity-100 text-primary" : "opacity-0"
                              )}
                            />
                            <div>
                              <div className="font-medium text-sm">{asesor.nombre}</div>
                              <div className="text-xs text-muted-foreground">{asesor.email}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {asesorNombre && (
                <div className="rounded-lg border bg-muted/40 p-3 flex items-center gap-3">
                  <HugeiconsIcon icon={UserCheck01Icon} strokeWidth={2} className="size-4 text-muted-foreground shrink-0" />
                  <div className="text-sm">
                    <div className="text-muted-foreground text-xs">Asesor responsable</div>
                    <div className="font-medium">{asesorNombre}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmar} disabled={!puedeConfirmar}>
              Continuar
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <RegistrarClienteDialog
        open={registrarClienteOpen}
        onOpenChange={setRegistrarClienteOpen}
        labelRol={labelContraparte}
        onClienteRegistrado={handleClienteRegistrado}
      />
    </>
  )
}
