import { FormularioPromesaClient } from "@/components/contratos/formulario-promesa-client"

interface PageProps {
  searchParams: Promise<{ inmueble?: string; tipo?: string }>
}

export default async function NuevoContratoPromesaPage({ searchParams }: PageProps) {
  const { inmueble = "", tipo = "" } = await searchParams
  return <FormularioPromesaClient inmuebleId={inmueble} tipo={tipo} />
}
