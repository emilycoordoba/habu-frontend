import { DetalleContratoClient } from "@/components/contratos/detalle-contrato-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ContratoDetallePage({ params }: PageProps) {
  const { id } = await params
  return <DetalleContratoClient contratoId={id} />
}
