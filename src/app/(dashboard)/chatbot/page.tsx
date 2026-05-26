import type { Metadata } from "next"
import { BandejaClient } from "@/components/chatbot/bandeja-client"

export const metadata: Metadata = { title: "Bandeja de solicitudes | Habu" }

export default function ChatbotBandejaPage() {
  return <BandejaClient />
}
