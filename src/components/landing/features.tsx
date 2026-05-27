import { HugeiconsIcon } from "@hugeicons/react"
import {
  FileManagementIcon,
  Home01Icon,
  Invoice03Icon,
  AiChat01Icon,
  TaskDone01Icon,
  UserMultiple02Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"

const modulos = [
  {
    icon: FileManagementIcon,
    label: "Contratos",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    features: [
      "Contratos de arriendo y promesa de compraventa",
      "Renovaciones y terminaciones anticipadas",
      "Generación de documentos legales",
      "Historial completo de modificaciones",
    ],
  },
  {
    icon: Invoice03Icon,
    label: "Pagos y mora",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    features: [
      "Registro de cobros mensuales por contrato",
      "Seguimiento de mora en tiempo real",
      "Reportes de ingresos consolidados",
      "Estado de cuenta por inquilino",
    ],
  },
  {
    icon: Home01Icon,
    label: "Inmuebles",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    features: [
      "Catálogo con filtros por tipo y estado",
      "Ficha técnica y galería de fotos",
      "Estados: disponible, arrendado, en mantenimiento",
      "Historial de ocupación",
    ],
  },
  {
    icon: UserMultiple02Icon,
    label: "Clientes",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    features: [
      "Registro de propietarios e inquilinos",
      "Documentos de identidad y referencias",
      "Contratos activos por cliente",
      "Historial de pagos y comportamiento",
    ],
  },
  {
    icon: TaskDone01Icon,
    label: "Mantenimiento",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    features: [
      "Solicitudes de reparación y seguimiento",
      "Asignación a proveedores externos",
      "Registro de costos por intervención",
      "Estados: pendiente, en curso, finalizado",
    ],
  },
  {
    icon: AiChat01Icon,
    label: "Chatbot IA",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    features: [
      "Consultas de inquilinos 24/7 sin intervención",
      "Estado de pagos y próximos vencimientos",
      "Solicitudes de mantenimiento por chat",
      "Historial de conversaciones por usuario",
    ],
  },
]

export function LandingFeatures() {
  return (
    <section id="caracteristicas" className="relative py-24 px-6">
      {/* Cabecera */}
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Características
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Todo lo que necesita tu inmobiliaria
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Seis módulos especializados, completamente integrados entre sí.
          </p>
        </div>

        {/* Grid de módulos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modulos.map(({ icon, label, color, bg, border, features }) => (
            <div
              key={label}
              className={`rounded-2xl border ${border} bg-card p-6 transition-shadow hover:shadow-md`}
            >
              {/* Cabecera de la card */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`flex size-10 items-center justify-center rounded-xl ${bg} ${color}`}>
                  <HugeiconsIcon icon={icon} size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-foreground">{label}</h3>
              </div>

              {/* Lista de features */}
              <ul className="space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className={`mt-0.5 shrink-0 ${color}`}>
                      <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={2} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
