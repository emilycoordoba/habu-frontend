import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  FileManagementIcon,
  Payment01Icon,
} from "@hugeicons/core-free-icons"

const pasos = [
  {
    numero: "01",
    icon: Home01Icon,
    titulo: "Registra tus inmuebles y clientes",
    descripcion:
      "Carga tu portafolio de propiedades y los datos de propietarios e inquilinos. Todo queda centralizado y accesible desde cualquier dispositivo.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    numero: "02",
    icon: FileManagementIcon,
    titulo: "Crea y gestiona contratos",
    descripcion:
      "Genera contratos de arriendo o promesas de compraventa con toda la información legal. Renueva, termina o modifica en pocos clics.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    numero: "03",
    icon: Payment01Icon,
    titulo: "Controla pagos y mantenimiento",
    descripcion:
      "Registra cobros, identifica moras y gestiona solicitudes de mantenimiento. Reportes claros para tomar decisiones con datos reales.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
]

export function LandingHowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        {/* Cabecera */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Cómo funciona
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Así de simple
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Tres pasos para tener tu inmobiliaria completamente ordenada y bajo control.
          </p>
        </div>

        {/* Pasos */}
        <div className="grid gap-8 md:grid-cols-3">
          {pasos.map(({ numero, icon, titulo, descripcion, color, bg, border }, index) => (
            <div key={numero} className="relative flex flex-col">
              {/* Conector entre pasos (solo en desktop) */}
              {index < pasos.length - 1 && (
                <div
                  aria-hidden
                  className="hidden md:block absolute top-5 left-[calc(100%_-_1rem)] w-8 h-px bg-border z-10"
                />
              )}

              <div className={`rounded-2xl border ${border} bg-card p-6 flex-1`}>
                {/* Número + ícono */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl font-black text-muted-foreground/20 leading-none">
                    {numero}
                  </span>
                  <div className={`flex size-12 items-center justify-center rounded-xl ${bg} ${color}`}>
                    <HugeiconsIcon icon={icon} size={22} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="font-semibold text-foreground mb-2 text-lg leading-snug">
                  {titulo}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
