import type { Metadata } from "next"
import { ChatbotClient } from "@/components/chatbot/chatbot-client"

export const metadata: Metadata = { title: "Asistente virtual | Habu" }

export default function ChatPage() {
  return <ChatbotClient />
}
