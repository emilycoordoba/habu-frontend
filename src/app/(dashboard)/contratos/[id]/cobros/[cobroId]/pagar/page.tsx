import { RegistrarPagoClient } from "@/components/pagos/registrar-pago-client"

interface PageProps {
  params: Promise<{ id: string; cobroId: string }>
}

export default async function RegistrarPagoPage({ params }: PageProps) {
  const { id, cobroId } = await params
  return <RegistrarPagoClient contratoId={id} cobroId={cobroId} />
}
