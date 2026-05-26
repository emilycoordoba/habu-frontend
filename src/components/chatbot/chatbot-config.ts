import {
  CheckmarkCircle01Icon,
  Clock01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"
import type { EstadoSolicitud } from "@/types/chatbot.types"

export const ESTADO_CONFIG: Record<EstadoSolicitud, { label: string; icon: typeof Clock01Icon; className: string }> = {
  nueva:      { label: "Nueva",       icon: AlertCircleIcon,       className: "bg-blue-50 text-blue-700 border-blue-200"       },
  en_gestion: { label: "En gestión",  icon: Clock01Icon,           className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  atendida:   { label: "Atendida",    icon: CheckmarkCircle01Icon, className: "bg-green-50 text-green-700 border-green-200"    },
}
