import { RenovacionClient } from "@/components/contratos/renovacion-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RenovacionPage({ params }: PageProps) {
  const { id } = await params
  return <RenovacionClient contratoId={id} />
}
