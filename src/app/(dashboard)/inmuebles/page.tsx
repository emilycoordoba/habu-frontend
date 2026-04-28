import type { Metadata } from "next"
import { InmueblesClient } from "@/components/inmuebles/inmuebles-client"

export const metadata: Metadata = { title: "Inmuebles" }

export default function InmueblesPage() {
  return <InmueblesClient />
}
