"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  DollarCircleIcon,
  Upload01Icon,
  Delete02Icon,
  Alert01Icon,
  CheckmarkCircle01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { obtenerMantenimiento, registrarCosto } from "@/lib/api/mantenimiento"
import type { SolicitudMantenimiento } from "@/types/mantenimiento.types"

interface ArchivoPreview {
  file: File
  url: string
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function CostoSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-y-auto animate-pulse">
      <div className="border-b px-6 py-4 h-16 bg-muted/20" />
      <div className="px-6 py-6 max-w-2xl mx-auto w-full space-y-6">
        <div className="h-20 bg-muted/20 rounded-lg" />
        <div className="h-12 bg-muted/20 rounded w-1/2" />
        <div className="h-24 bg-muted/20 rounded" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function RegistrarCostoClient({ solicitudId }: { solicitudId: string }) {
  const router = useRouter()

  const [solicitud,   setSolicitud]   = React.useState<SolicitudMantenimiento | null>(null)
  const [isLoading,   setIsLoading]   = React.useState(true)
  const [error,       setError]       = React.useState<string | null>(null)
  const [retryKey,    setRetryKey]    = React.useState(0)

  const [costo,       setCosto]       = React.useState("")
  const [factura,     setFactura]     = React.useState<ArchivoPreview | null>(null)
  const [errorCosto,  setErrorCosto]  = React.useState<string>()
  const [guardando,   setGuardando]   = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    let cancelado = false
    setIsLoading(true)
    setError(null)
    obtenerMantenimiento(solicitudId)
      .then(res => { if (!cancelado) setSolicitud(res.data) })
      .catch(() => { if (!cancelado) setError("No se pudo cargar la solicitud.") })
      .finally(() => { if (!cancelado) setIsLoading(false) })
    return () => { cancelado = true }
  }, [solicitudId, retryKey])

  React.useEffect(() => {
    return () => { if (factura) URL.revokeObjectURL(factura.url) }
  }, [factura])

  function handleFactura(files: FileList | null) {
    if (!files || files.length === 0) return
    if (factura) URL.revokeObjectURL(factura.url)
    const file = files[0]
    setFactura({ file, url: URL.createObjectURL(file) })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const valor = parseFloat(costo)
    if (!costo || isNaN(valor) || valor <= 0) {
      setErrorCosto("Ingresa un costo válido mayor a cero.")
      return
    }
    setGuardando(true)
    try {
      await registrarCosto(solicitudId, valor, factura?.file)
      toast.success("Costo registrado correctamente")
      router.push(`/mantenimiento/${solicitudId}`)
    } catch {
      toast.error("No se pudo registrar el costo. Intenta de nuevo.")
      setGuardando(false)
    }
  }

  const costoFormateado = costo && !isNaN(parseFloat(costo))
    ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(parseFloat(costo))
    : null

  if (isLoading) return <CostoSkeleton />

  if (error || !solicitud) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <p className="text-sm">{error ?? "Solicitud no encontrada."}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setRetryKey(k => k + 1)} className="gap-2">
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
            Reintentar
          </Button>
          <Link href={`/mantenimiento/${solicitudId}`}>
            <Button variant="outline" size="sm">Volver</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <Link href={`/mantenimiento/${solicitudId}`}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Registrar costo</h1>
          <p className="text-sm text-muted-foreground">Solicitud #{solicitud.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 max-w-2xl mx-auto w-full space-y-6">

        {/* Resumen */}
        <div className="rounded-lg border bg-muted/30 px-4 py-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4 text-green-600 shrink-0" />
            <span className="text-sm font-medium">Solicitud finalizada</span>
          </div>
          <p className="text-sm text-muted-foreground leading-snug pl-6">{solicitud.descripcion}</p>
          {solicitud.proveedorNombre && (
            <p className="text-xs text-muted-foreground pl-6">Proveedor: {solicitud.proveedorNombre}</p>
          )}
        </div>

        <hr className="border-border" />

        {/* Costo */}
        <section className="space-y-3">
          <SectionTitle>Costo del mantenimiento</SectionTitle>

          <div className="space-y-1.5">
            <Label htmlFor="costo">Costo total (COP) <span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">$</span>
                <Input
                  id="costo"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  value={costo}
                  onChange={e => {
                    setCosto(e.target.value)
                    setErrorCosto(undefined)
                  }}
                  className={cn("pl-7 h-9 w-48 tabular-nums", errorCosto && "border-destructive")}
                />
              </div>
              {costoFormateado && (
                <span className="text-sm text-muted-foreground">{costoFormateado}</span>
              )}
            </div>
            {errorCosto && <p className="text-xs text-destructive">{errorCosto}</p>}
          </div>
        </section>

        <hr className="border-border" />

        {/* Factura */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionTitle>Factura del proveedor</SectionTitle>
            <span className="text-xs text-muted-foreground">Opcional</span>
          </div>

          {factura ? (
            <div className="flex items-center gap-3 border rounded-lg px-4 py-3">
              <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{factura.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(factura.file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  URL.revokeObjectURL(factura.url)
                  setFactura(null)
                }}
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-muted-foreground/25 rounded-lg py-5 flex flex-col items-center gap-2 hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors"
            >
              <HugeiconsIcon icon={Upload01Icon} strokeWidth={1.5} className="size-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Adjuntar factura del proveedor</span>
              <span className="text-xs text-muted-foreground">PDF, JPG, PNG · máx. 10 MB</span>
            </button>
          )}
          <Input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={e => handleFactura(e.target.files)}
          />
        </section>

        {/* Nota informativa */}
        <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Una vez registrado, el costo no podrá modificarse desde esta pantalla.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2 pb-6">
          <Link href={`/mantenimiento/${solicitudId}`}>
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={guardando}>
            <HugeiconsIcon icon={DollarCircleIcon} strokeWidth={2} className="size-4" />
            {guardando ? "Registrando…" : "Registrar costo"}
          </Button>
        </div>

      </form>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  )
}
