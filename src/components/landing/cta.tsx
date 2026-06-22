import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function LandingCta() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 px-8 py-14 shadow-2xl sm:px-14">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          {/* Mensaje */}
          <div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/70">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-400" />
              </span>
              Listo para usar
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Deja de perseguir pagos en hojas de cálculo.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/60">
              Entra al sistema y empieza a gestionar contratos, cobros e
              inmuebles desde una sola vista — con todo conectado.
            </p>
          </div>

          {/* Acción */}
          <div className="flex lg:justify-end">
            <Button asChild size="lg" className="gap-2 px-7">
              <Link href="/login">
                Acceder al sistema
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
