import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Invoice03Icon,
  FileManagementIcon,
  Home01Icon,
  TaskDone01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"

// Indicadores de ejemplo para el panel del hero. Son datos ilustrativos:
// reflejan los flujos reales del sistema (cobros, mora, vencimientos,
// mantenimiento) con cifras creíbles de una inmobiliaria mediana.
const indicadores = [
  {
    icon: Invoice03Icon,
    etiqueta: "Por cobrar este mes",
    valor: "$4.250.000",
    nota: "3 contratos en mora",
    estado: "badge-red",
  },
  {
    icon: FileManagementIcon,
    etiqueta: "Contratos por vencer",
    valor: "2",
    nota: "próximos 30 días",
    estado: "badge-amber",
  },
  {
    icon: Home01Icon,
    etiqueta: "Inmuebles",
    valor: "128",
    nota: "92% ocupados",
    estado: "badge-green",
  },
  {
    icon: TaskDone01Icon,
    etiqueta: "Mantenimiento",
    valor: "4",
    nota: "1 urgente",
    estado: "badge-red",
  },
]

const actividad = [
  { texto: "Apto 302 · Chapinero", detalle: "pago recibido", estado: "ok" as const },
  { texto: "Casa La Castellana", detalle: "contrato vence en 5 días", estado: "pendiente" as const },
  { texto: "Local 12 · Laureles", detalle: "solicitud de mantenimiento", estado: "pendiente" as const },
]

const modulos = ["Contratos", "Pagos", "Inmuebles", "Clientes", "Mantenimiento", "Chatbot IA"]

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-20 sm:pt-32">
      {/* Acento contenido detrás del panel — no un glow de pantalla completa */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-24 -z-10 hidden h-[420px] w-[520px] rounded-full bg-primary/5 blur-3xl lg:block"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* ─── Columna izquierda: la tesis ─── */}
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-medium tracking-wide text-muted-foreground">
            Software inmobiliario · hecho en Colombia
          </p>

          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Tu inmobiliaria, bajo control.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Contratos, pagos, inmuebles y mantenimiento en una sola vista —
            conectados entre sí, para que no vuelvas a digitar lo mismo dos
            veces ni perder un vencimiento.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2 px-7">
              <Link href="/login">
                Acceder al sistema
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-7">
              <Link href="#caracteristicas">Ver características</Link>
            </Button>
          </div>

          {/* Tira de módulos: qué cubre el sistema, en voz del usuario */}
          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {modulos.map((m, i) => (
              <span key={m} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-border">·</span>}
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Columna derecha: el producto como protagonista ─── */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
            {/* Barra superior — chrome de la app (oscura en ambos temas) */}
            <div className="flex items-center justify-between bg-neutral-900 px-5 py-3.5 text-white">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Resumen de hoy</span>
                <span className="text-xs text-white/55">Inmobiliaria · panel general</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-400" />
                </span>
                En vivo
              </span>
            </div>

            {/* Cuerpo del panel */}
            <div className="space-y-5 p-5">
              {/* Indicadores */}
              <div className="grid grid-cols-2 gap-3">
                {indicadores.map(({ icon, etiqueta, valor, nota, estado }) => (
                  <div key={etiqueta} className="rounded-xl border border-border bg-background/40 p-4">
                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} />
                      <span className="text-xs">{etiqueta}</span>
                    </div>
                    <p className="font-mono text-2xl font-semibold tracking-tight text-foreground">
                      {valor}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-md border px-2 py-0.5 text-[11px] font-medium ${estado}`}
                    >
                      {nota}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actividad reciente */}
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actividad reciente
                </p>
                <ul className="space-y-3">
                  {actividad.map(({ texto, detalle, estado }) => (
                    <li key={texto} className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                          estado === "ok" ? "badge-green" : "badge-amber"
                        }`}
                      >
                        <HugeiconsIcon
                          icon={estado === "ok" ? Tick01Icon : FileManagementIcon}
                          size={13}
                          strokeWidth={2}
                        />
                      </span>
                      <span className="font-medium text-foreground">{texto}</span>
                      <span className="ml-auto text-right text-xs text-muted-foreground">
                        {detalle}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
