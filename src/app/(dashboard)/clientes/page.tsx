import type { Metadata } from "next"
import { ClientesClient } from "@/components/clientes/clientes-client"

export const metadata: Metadata = { title: "Clientes" }

export default function ClientesPage() {
  return <ClientesClient />
}
