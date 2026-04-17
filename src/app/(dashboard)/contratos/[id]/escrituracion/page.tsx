import { EscrituracionClient } from "@/components/contratos/escrituracion-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EscrituracionPage({ params }: PageProps) {
  const { id } = await params
  return <EscrituracionClient contratoId={id} />
}
