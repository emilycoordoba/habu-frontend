import type { Metadata } from "next"
import { ContratosClient } from "@/components/contratos/contratos-client"

export const metadata: Metadata = { title: "Contratos" }

export default function ContratosPage() {
  return <ContratosClient />
}
