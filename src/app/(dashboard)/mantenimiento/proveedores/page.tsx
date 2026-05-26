import type { Metadata } from "next"
import { ProveedoresClient } from "@/components/mantenimiento/proveedores-client"

export const metadata: Metadata = { title: "Proveedores de mantenimiento" }

export default function ProveedoresPage() {
  return <ProveedoresClient />
}
