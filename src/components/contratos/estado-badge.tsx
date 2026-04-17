import { Badge } from "@/components/ui/badge"
import { ESTADO_CONTRATO_CONFIG, type EstadoContrato } from "@/types/contrato.types"

export function EstadoBadge({ estado }: { estado: EstadoContrato }) {
  const config = ESTADO_CONTRATO_CONFIG[estado]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
