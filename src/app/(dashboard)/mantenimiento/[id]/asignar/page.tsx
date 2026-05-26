import type { Metadata } from "next"
import { AsignarProveedorClient } from "@/components/mantenimiento/asignar-proveedor-client"

export const metadata: Metadata = { title: "Asignar proveedor" }

export default async function AsignarProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AsignarProveedorClient solicitudId={id} />
}
