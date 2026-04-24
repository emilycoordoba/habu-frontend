import { DetalleClienteClient } from "@/components/clientes/detalle-cliente-client"

export default async function DetalleClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DetalleClienteClient clienteId={id} />
}
