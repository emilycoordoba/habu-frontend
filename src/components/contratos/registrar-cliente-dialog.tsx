"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserIcon, Building01Icon } from "@hugeicons/core-free-icons"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type TipoPersona = "natural" | "juridica"

interface ClienteRegistrado {
  nombre: string
  identificacion: string
}

interface RegistrarClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  labelRol: string // "Arrendatario", "Comprador", etc.
  onClienteRegistrado: (cliente: ClienteRegistrado) => void
}

export function RegistrarClienteDialog({
  open,
  onOpenChange,
  labelRol,
  onClienteRegistrado,
}: RegistrarClienteDialogProps) {
  const [tipoPersona, setTipoPersona] = React.useState<TipoPersona | "">("")

  // Campos persona natural
  const [nombre, setNombre] = React.useState("")
  const [apellidos, setApellidos] = React.useState("")
  const [tipoId, setTipoId] = React.useState("")
  const [numeroId, setNumeroId] = React.useState("")
  const [telefono, setTelefono] = React.useState("")
  const [correo, setCorreo] = React.useState("")

  // Campos persona jurídica
  const [razonSocial, setRazonSocial] = React.useState("")
  const [nit, setNit] = React.useState("")
  const [representante, setRepresentante] = React.useState("")
  const [cedulaRepresentante, setCedulaRepresentante] = React.useState("")

  const puedeGuardar =
    tipoPersona === "natural"
      ? nombre && apellidos && tipoId && numeroId && telefono
      : tipoPersona === "juridica"
      ? razonSocial && nit && representante && cedulaRepresentante && telefono
      : false

  function handleGuardar() {
    if (!puedeGuardar) return
    const nombreMostrado =
      tipoPersona === "natural"
        ? `${nombre} ${apellidos}`
        : razonSocial
    const identificacion =
      tipoPersona === "natural" ? `${tipoId} ${numeroId}` : `NIT ${nit}`
    onClienteRegistrado({ nombre: nombreMostrado, identificacion })
    handleClose()
  }

  function handleClose() {
    setTipoPersona("")
    setNombre(""); setApellidos(""); setTipoId(""); setNumeroId("")
    setTelefono(""); setCorreo("")
    setRazonSocial(""); setNit(""); setRepresentante(""); setCedulaRepresentante("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar {labelRol}</DialogTitle>
          <DialogDescription>
            Completa los datos básicos. Podrás completar el perfil completo desde el módulo de Clientes.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Selector tipo de persona */}
          <div className="grid grid-cols-2 gap-3">
            {(["natural", "juridica"] as TipoPersona[]).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setTipoPersona(tipo)}
                className={cn(
                  "rounded-lg border-2 p-3 text-left transition-colors",
                  tipoPersona === tipo
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <HugeiconsIcon
                    icon={tipo === "natural" ? UserIcon : Building01Icon}
                    strokeWidth={2}
                    className="size-4 text-muted-foreground"
                  />
                  <span className="text-sm font-medium">
                    {tipo === "natural" ? "Persona Natural" : "Persona Jurídica"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tipo === "natural" ? "CC, CE o Pasaporte" : "NIT y representante legal"}
                </p>
              </button>
            ))}
          </div>

          {/* Campos Persona Natural */}
          {tipoPersona === "natural" && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nombre">Nombre(s) <span className="text-destructive">*</span></Label>
                  <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="apellidos">Apellidos <span className="text-destructive">*</span></Label>
                  <Input id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} placeholder="Pérez García" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tipo-id">Tipo de documento <span className="text-destructive">*</span></Label>
                  <Select value={tipoId} onValueChange={setTipoId}>
                    <SelectTrigger id="tipo-id" className="w-full">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de ciudadanía</SelectItem>
                      <SelectItem value="CE">Cédula de extranjería</SelectItem>
                      <SelectItem value="PA">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="numero-id">Número de documento <span className="text-destructive">*</span></Label>
                  <Input id="numero-id" value={numeroId} onChange={(e) => setNumeroId(e.target.value)} placeholder="1234567890" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="telefono-n">Teléfono <span className="text-destructive">*</span></Label>
                  <Input id="telefono-n" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="3001234567" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="correo-n">Correo electrónico</Label>
                  <Input id="correo-n" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="juan@email.com" />
                </div>
              </div>
            </div>
          )}

          {/* Campos Persona Jurídica */}
          {tipoPersona === "juridica" && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="razon-social">Razón social <span className="text-destructive">*</span></Label>
                  <Input id="razon-social" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} placeholder="Empresa S.A.S." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nit">NIT <span className="text-destructive">*</span></Label>
                  <Input id="nit" value={nit} onChange={(e) => setNit(e.target.value)} placeholder="900123456-7" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="representante">Representante legal <span className="text-destructive">*</span></Label>
                  <Input id="representante" value={representante} onChange={(e) => setRepresentante(e.target.value)} placeholder="Nombre completo" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cedula-rep">Cédula representante <span className="text-destructive">*</span></Label>
                  <Input id="cedula-rep" value={cedulaRepresentante} onChange={(e) => setCedulaRepresentante(e.target.value)} placeholder="1234567890" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="telefono-j">Teléfono <span className="text-destructive">*</span></Label>
                  <Input id="telefono-j" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="6011234567" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="correo-j">Correo electrónico</Label>
                  <Input id="correo-j" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="contacto@empresa.com" />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleGuardar} disabled={!puedeGuardar}>
            Registrar y seleccionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
