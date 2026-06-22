import { HugeiconsIcon } from "@hugeicons/react"
import {
  FileManagementIcon,
  Invoice03Icon,
  AiChat01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons"

const valores = [
  {
    icon: FileManagementIcon,
    titulo: "Todo conectado",
    descripcion:
      "Un contrato genera sus cobros, vincula el inmueble y al cliente. No vuelves a digitar lo mismo en tres lugares.",
  },
  {
    icon: Invoice03Icon,
    titulo: "Mora en tiempo real",
    descripcion:
      "Sabes quién debe y cuánto al instante, sin cuadrar planillas a fin de mes ni perseguir recibos.",
  },
  {
    icon: AiChat01Icon,
    titulo: "Chatbot 24/7",
    descripcion:
      "Tus inquilinos consultan pagos y reportan mantenimiento por chat, sin que tengas que estar disponible.",
  },
  {
    icon: Home01Icon,
    titulo: "Hecho para Colombia",
    descripcion:
      "Arriendo, promesa de compraventa, canon, mora: los flujos reales de una inmobiliaria local, no un software importado.",
  },
]

export function LandingStats() {
  return (
    <section id="por-que-habu" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Por qué Habu
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            No es un software genérico
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Está construido sobre los flujos reales de las inmobiliarias locales
            — no adaptado a la fuerza desde otro mercado.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {valores.map(({ icon, titulo, descripcion }) => (
            <div
              key={titulo}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={icon} size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="mb-1.5 font-semibold text-foreground">{titulo}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
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
