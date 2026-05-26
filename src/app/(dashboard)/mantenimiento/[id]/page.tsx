import type { Metadata } from "next"
import { DetalleMantenimientoClient } from "@/components/mantenimiento/detalle-mantenimiento-client"

export const metadata: Metadata = { title: "Detalle de solicitud" }

export default async function DetalleSolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DetalleMantenimientoClient solicitudId={id} />
}
