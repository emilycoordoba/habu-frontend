import type { Metadata } from "next"
import { RegistrarSolicitudClient } from "@/components/mantenimiento/registrar-solicitud-client"

export const metadata: Metadata = { title: "Nueva solicitud de mantenimiento" }

export default function NuevaSolicitudPage() {
  return <RegistrarSolicitudClient />
}
