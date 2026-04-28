import { RegistrarClienteClient } from "@/components/clientes/registrar-cliente-client"

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RegistrarClienteClient clienteId={id} />
}
