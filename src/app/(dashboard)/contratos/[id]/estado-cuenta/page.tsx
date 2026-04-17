import { EstadoCuentaClient } from "@/components/pagos/estado-cuenta-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EstadoCuentaPage({ params }: PageProps) {
  const { id } = await params
  return <EstadoCuentaClient contratoId={id} />
}
