import { FormularioArriendoClient } from "@/components/contratos/formulario-arriendo-client"

interface PageProps {
  searchParams: Promise<{ inmueble?: string; tipo?: string; asesor?: string; contraparte?: string }>
}

export default async function NuevoContratoArriendoPage({ searchParams }: PageProps) {
  const { inmueble = "", tipo = "", asesor = "", contraparte = "" } = await searchParams
  return <FormularioArriendoClient inmuebleId={inmueble} tipo={tipo} asesorId={asesor} contraparteId={contraparte} />
}
