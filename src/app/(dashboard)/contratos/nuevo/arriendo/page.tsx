import { FormularioArriendoClient } from "@/components/contratos/formulario-arriendo-client"

interface PageProps {
  searchParams: Promise<{ inmueble?: string; tipo?: string }>
}

export default async function NuevoContratoArriendoPage({ searchParams }: PageProps) {
  const { inmueble = "", tipo = "" } = await searchParams
  return <FormularioArriendoClient inmuebleId={inmueble} tipo={tipo} />
}
