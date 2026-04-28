import type { Metadata } from "next"
import { UsuariosClient } from "@/components/administracion/usuarios-client"

export const metadata: Metadata = { title: "Administración" }

export default function UsuariosPage() {
  return <UsuariosClient />
}
