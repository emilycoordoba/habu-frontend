import type { Metadata } from "next"
import { RegistrarCostoClient } from "@/components/mantenimiento/registrar-costo-client"

export const metadata: Metadata = { title: "Registrar costo" }

export default async function RegistrarCostoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RegistrarCostoClient solicitudId={id} />
}
