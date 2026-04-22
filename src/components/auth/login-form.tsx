"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { EyeIcon, ViewOffSlashIcon, AlertCircleIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HabuLogoHouse } from "@/components/habu-logo"
import { cn } from "@/lib/utils"

type Estado = "idle" | "loading" | "error_credenciales" | "error_inactivo"

const MENSAJES: Record<string, string> = {
  error_credenciales: "Correo o contraseña incorrectos.",
  error_inactivo: "Tu cuenta está desactivada. Contacta al administrador.",
}

export function LoginForm() {
  const [correo, setCorreo] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [mostrarPassword, setMostrarPassword] = React.useState(false)
  const [estado, setEstado] = React.useState<Estado>("idle")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEstado("loading")
    // TODO: conectar con API de autenticación
    setTimeout(() => setEstado("error_credenciales"), 1200)
  }

  const error = estado === "error_credenciales" || estado === "error_inactivo"
    ? MENSAJES[estado]
    : null

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
          <HabuLogoHouse className="size-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold tracking-tight">Habu</p>
          <p className="text-sm text-muted-foreground">Sistema de gestión inmobiliaria</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="correo">Correo electrónico</Label>
          <Input
            id="correo"
            type="email"
            autoComplete="email"
            placeholder="usuario@habu.com.co"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            disabled={estado === "loading"}
            className={cn(error && "border-destructive focus-visible:ring-destructive")}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/recuperar-password"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={estado === "loading"}
              className={cn("pr-10", error && "border-destructive focus-visible:ring-destructive")}
              required
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setMostrarPassword(v => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <HugeiconsIcon
                icon={mostrarPassword ? ViewOffSlashIcon : EyeIcon}
                strokeWidth={2}
                className="size-4"
              />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4 shrink-0" />
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={estado === "loading"}>
          {estado === "loading" ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </div>
  )
}
