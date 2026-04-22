"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  EyeIcon,
  ViewOffSlashIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HabuLogoHouse } from "@/components/habu-logo"
import { cn } from "@/lib/utils"

type Estado = "idle" | "loading" | "guardado"

interface Regla {
  label: string
  cumple: (v: string) => boolean
}

const REGLAS: Regla[] = [
  { label: "Mínimo 8 caracteres",           cumple: v => v.length >= 8 },
  { label: "Al menos una letra mayúscula",  cumple: v => /[A-Z]/.test(v) },
  { label: "Al menos un número",            cumple: v => /[0-9]/.test(v) },
]

export function RestablecerPasswordForm() {
  const [password, setPassword] = React.useState("")
  const [confirmar, setConfirmar] = React.useState("")
  const [mostrar, setMostrar] = React.useState(false)
  const [estado, setEstado] = React.useState<Estado>("idle")

  const reglasOk = REGLAS.every(r => r.cumple(password))
  const coinciden = password === confirmar && confirmar.length > 0
  const puedeEnviar = reglasOk && coinciden

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!puedeEnviar) return
    setEstado("loading")
    // TODO: conectar con endpoint de restablecimiento usando el token de la URL
    setTimeout(() => setEstado("guardado"), 1000)
  }

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
          <HabuLogoHouse className="size-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold tracking-tight">Nueva contraseña</p>
          <p className="text-sm text-muted-foreground">Elige una contraseña segura</p>
        </div>
      </div>

      {estado === "guardado" ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-green-100">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Contraseña actualizada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Ya puedes ingresar con tu nueva contraseña.
            </p>
          </div>
          <Link href="/login">
            <Button className="mt-2">Ir al inicio de sesión</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Nueva contraseña */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={mostrar ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={estado === "loading"}
                className="pr-10"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setMostrar(v => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <HugeiconsIcon
                  icon={mostrar ? ViewOffSlashIcon : EyeIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </button>
            </div>

            {/* Indicadores de fortaleza */}
            {password.length > 0 && (
              <ul className="flex flex-col gap-1 mt-1">
                {REGLAS.map(r => (
                  <li key={r.label} className={cn(
                    "flex items-center gap-1.5 text-xs",
                    r.cumple(password) ? "text-green-600" : "text-muted-foreground"
                  )}>
                    <HugeiconsIcon
                      icon={r.cumple(password) ? CheckmarkCircle01Icon : Cancel01Icon}
                      strokeWidth={2}
                      className="size-3.5 shrink-0"
                    />
                    {r.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirmar */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmar">Confirmar contraseña</Label>
            <Input
              id="confirmar"
              type={mostrar ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              disabled={estado === "loading"}
              className={cn(
                confirmar.length > 0 && !coinciden && "border-destructive focus-visible:ring-destructive"
              )}
              required
            />
            {confirmar.length > 0 && !coinciden && (
              <p className="text-xs text-destructive">Las contraseñas no coinciden.</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!puedeEnviar || estado === "loading"}>
            {estado === "loading" ? "Guardando…" : "Guardar contraseña"}
          </Button>
        </form>
      )}
    </div>
  )
}
