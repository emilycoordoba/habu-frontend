import type { Metadata } from "next"
import { DetalleSolicitudClient } from "@/components/chatbot/detalle-solicitud-client"

export const metadata: Metadata = { title: "Detalle solicitud | Habu" }

export default async function DetalleSolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DetalleSolicitudClient id={id} />
}
