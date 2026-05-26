import type { Metadata } from "next"
import { ActualizarEstadoClient } from "@/components/mantenimiento/actualizar-estado-client"

export const metadata: Metadata = { title: "Actualizar estado" }

export default async function ActualizarEstadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ActualizarEstadoClient solicitudId={id} />
}
