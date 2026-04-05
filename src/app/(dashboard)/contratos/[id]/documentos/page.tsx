import { GestionDocumentosClient } from "@/components/contratos/gestion-documentos-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ContratoDocumentosPage({ params }: PageProps) {
  const { id } = await params
  return <GestionDocumentosClient contratoId={id} />
}
