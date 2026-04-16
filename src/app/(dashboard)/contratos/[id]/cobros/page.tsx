import { CobrosClient } from "@/components/pagos/cobros-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CobrosPage({ params }: PageProps) {
  const { id } = await params
  return <CobrosClient contratoId={id} />
}
