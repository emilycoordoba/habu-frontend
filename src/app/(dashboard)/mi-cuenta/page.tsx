import type { Metadata } from "next"
import { MiCuentaClient } from "@/components/cuenta/mi-cuenta-client"

export const metadata: Metadata = { title: "Mi cuenta" }

export default function MiCuentaPage() {
  return <MiCuentaClient />
}
