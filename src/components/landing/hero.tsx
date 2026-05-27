import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FileManagementIcon,
  Home01Icon,
  Invoice03Icon,
  AiChat01Icon,
  TaskDone01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"

const modulos = [
  {
    icon: FileManagementIcon,
    label: "Contratos",
    description: "Arriendos y promesas",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Invoice03Icon,
    label: "Pagos",
    description: "Cobros y mora",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Home01Icon,
    label: "Inmuebles",
    description: "Catálogo y estados",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: UserMultiple02Icon,
    label: "Clientes",
    description: "Propietarios e inquilinos",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: TaskDone01Icon,
    label: "Mantenimiento",
    description: "Solicitudes y seguimiento",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: AiChat01Icon,
    label: "Chatbot",
    description: "Consultas automatizadas",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
]

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
      {/* Fondo decorativo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Contenido */}
      <div className="mx-auto w-full max-w-4xl text-center">
        {/* Badge */}
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="inline-block size-1.5 rounded-full bg-primary" />
          Software inmobiliario moderno
        </Badge>

        {/* Título */}
        <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Gestiona tu inmobiliaria{" "}
          <span className="text-primary">con claridad</span>
        </h1>

        {/* Subtítulo */}
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          Contratos, pagos, inmuebles, clientes y mantenimiento en un solo
          lugar. Sin hojas de cálculo, sin papel, sin fricción.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="px-8">
            <Link href="/login">Acceder al sistema</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link href="#caracteristicas">Ver características</Link>
          </Button>
        </div>

        {/* Grid de módulos */}
        <div className="mt-20 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {modulos.map(({ icon, label, description, color, bg }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm transition-colors hover:border-border hover:bg-card"
            >
              <div className={`flex size-10 items-center justify-center rounded-lg ${bg} ${color}`}>
                <HugeiconsIcon icon={icon} size={20} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        {/* Línea inferior decorativa */}
        <p className="mt-10 text-xs text-muted-foreground/60">
          Todos los módulos integrados · Dark mode incluido · Diseñado para inmobiliarias colombianas
        </p>
      </div>
    </section>
  )
}
