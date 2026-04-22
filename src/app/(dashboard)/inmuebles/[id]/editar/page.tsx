import { notFound } from "next/navigation"
import {
  RegistrarInmuebleClient,
  type RegistrarInmuebleInitialData,
} from "@/components/inmuebles/registrar-inmueble-client"
import { INMUEBLES_MOCK } from "@/lib/mock/inmuebles"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarInmueblePage({ params }: Props) {
  const { id } = await params
  const inmueble = INMUEBLES_MOCK[id]
  if (!inmueble) notFound()

  const initialData: RegistrarInmuebleInitialData = {
    tipo:              inmueble.tipo,
    modalidad:         inmueble.modalidad,
    estado:            inmueble.estado,
    publicado:         inmueble.publicado,
    direccion:         inmueble.direccion,
    ubicacion:         inmueble.ubicacion,
    area:              inmueble.area,
    precio:            inmueble.precio,
    propietarioId:     inmueble.propietarioId,
    propietarioNombre: inmueble.propietario,
    coordenadas:       inmueble.coordenadas,
    fotos:             inmueble.fotos,
  }

  return (
    <RegistrarInmuebleClient
      mode="editar"
      inmuebleId={id}
      initialData={initialData}
    />
  )
}
