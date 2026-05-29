import { RegistrarInmuebleClient } from "@/components/inmuebles/registrar-inmueble-client"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarInmueblePage({ params }: Props) {
  const { id } = await params
  return <RegistrarInmuebleClient mode="editar" inmuebleId={id} />
}
