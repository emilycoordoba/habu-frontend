import Link from "next/link"
import { HabuLogoHouse } from "@/components/habu-logo"

const seccionesLanding = [
  { label: "Inicio", href: "#" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Por qué Habu", href: "#por-que-habu" },
]

const modulos = [
  "Contratos",
  "Pagos y mora",
  "Inmuebles",
  "Clientes",
  "Mantenimiento",
  "Chatbot IA",
]

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/20 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground mb-3">
              <HabuLogoHouse className="size-6 text-primary" />
              <span className="text-xl tracking-tight">Habu</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Sistema de gestión inmobiliaria diseñado para simplificar contratos,
              pagos y seguimiento de inmuebles en Colombia.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-4">Navegación</p>
            <ul className="space-y-2.5">
              {seccionesLanding.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Módulos (solo texto, sin links a rutas protegidas) */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-4">Módulos</p>
            <ul className="space-y-2.5">
              {modulos.map((m) => (
                <li key={m} className="text-sm text-muted-foreground">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Habu · Todos los derechos reservados
          </p>
          <p className="text-xs text-muted-foreground">
            Diseñado para inmobiliarias colombianas
          </p>
        </div>
      </div>
    </footer>
  )
}
