import { TerminacionClient } from "@/components/contratos/terminacion-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TerminacionPage({ params }: PageProps) {
  const { id } = await params
  return <TerminacionClient contratoId={id} />
}
