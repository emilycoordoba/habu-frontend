import { DetalleInmuebleClient } from "@/components/inmuebles/detalle-inmueble-client"

interface Props {
  params: Promise<{ id: string }>
}

export default async function DetalleInmueblePage({ params }: Props) {
  const { id } = await params
  return <DetalleInmuebleClient inmuebleId={id} />
}
