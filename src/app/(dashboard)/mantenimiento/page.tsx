import type { Metadata } from "next"
import { MantenimientoClient } from "@/components/mantenimiento/mantenimiento-client"

export const metadata: Metadata = { title: "Mantenimiento" }

export default function MantenimientoPage() {
  return <MantenimientoClient />
}
