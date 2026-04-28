import { FormularioPromesaClient } from "@/components/contratos/formulario-promesa-client"

interface PageProps {
  searchParams: Promise<{ inmueble?: string; tipo?: string; asesor?: string }>
}

export default async function NuevoContratoPromesaPage({ searchParams }: PageProps) {
  const { inmueble = "", tipo = "", asesor = "" } = await searchParams
  return <FormularioPromesaClient inmuebleId={inmueble} tipo={tipo} asesorId={asesor} />
}
