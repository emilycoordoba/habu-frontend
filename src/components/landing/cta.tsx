import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, SparklesIcon } from "@hugeicons/core-free-icons"

export function LandingCta() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center">
          {/* Decoración de fondo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-32 -right-32 size-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 size-48 rounded-full bg-white/5 blur-2xl" />
          </div>

          {/* Ícono decorativo */}
          <div className="relative flex justify-center mb-5">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10">
              <HugeiconsIcon icon={SparklesIcon} size={26} strokeWidth={1.5} className="text-white" />
            </div>
          </div>

          {/* Texto */}
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            ¿Listo para ordenar tu inmobiliaria?
          </h2>
          <p className="relative mt-4 text-lg text-white/70 max-w-xl mx-auto">
            Accede al sistema y empieza a gestionar contratos, pagos e inmuebles
            desde el primer día.
          </p>

          {/* Botón */}
          <div className="relative mt-8">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="px-8 gap-2 font-semibold"
            >
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
