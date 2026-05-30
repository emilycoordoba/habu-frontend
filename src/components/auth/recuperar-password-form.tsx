"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Mail01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HabuLogoHouse } from "@/components/habu-logo"
import { recuperarPassword } from "@/lib/api/auth"

type Estado = "idle" | "loading" | "enviado"

export function RecuperarPasswordForm() {
  const [correo, setCorreo] = React.useState("")
  const [estado, setEstado] = React.useState<Estado>("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEstado("loading")
    try {
      await recuperarPassword(correo)
    } catch {
      // Siempre mostramos "enviado" para no revelar si el correo existe
    } finally {
      setEstado("enviado")
    }
  }

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
          <HabuLogoHouse className="size-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold tracking-tight">Recuperar contraseña</p>
          <p className="text-sm text-muted-foreground">
            Te enviaremos un enlace a tu correo
          </p>
        </div>
      </div>

      {estado === "enviado" ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-green-100">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Revisa tu correo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Si <strong>{correo}</strong> está registrado, recibirás las instrucciones en los próximos minutos.
            </p>
          </div>
          <Link href="/login" className="text-sm text-primary hover:underline mt-2">
            Volver al inicio de sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="correo">Correo electrónico</Label>
            <div className="relative">
              <HugeiconsIcon
                icon={Mail01Icon}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              />
              <Input
                id="correo"
                type="email"
                autoComplete="email"
                placeholder="usuario@habu.com.co"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                disabled={estado === "loading"}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={estado === "loading"}>
            {estado === "loading" ? "Enviando…" : "Enviar enlace"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}
