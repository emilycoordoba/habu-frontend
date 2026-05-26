import {
  CheckmarkCircle01Icon,
  Clock01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"
import type { EstadoSolicitud } from "@/types/chatbot.types"

export const ESTADO_CONFIG: Record<EstadoSolicitud, { label: string; icon: typeof Clock01Icon; className: string }> = {
  nueva:      { label: "Nueva",       icon: AlertCircleIcon,       className: "badge-blue"   },
  en_gestion: { label: "En gestión",  icon: Clock01Icon,           className: "badge-yellow" },
  atendida:   { label: "Atendida",    icon: CheckmarkCircle01Icon, className: "badge-green"  },
}
