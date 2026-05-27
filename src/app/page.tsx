import { LandingNavbar } from "@/components/landing/navbar"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingHowItWorks } from "@/components/landing/how-it-works"
import { LandingStats } from "@/components/landing/stats"
import { LandingCta } from "@/components/landing/cta"
import { LandingFooter } from "@/components/landing/footer"

export const metadata = {
  title: "Habu · Software inmobiliario moderno",
  description:
    "Sistema de gestión inmobiliaria: contratos, pagos, inmuebles, clientes, mantenimiento y chatbot IA en un solo lugar.",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingStats />
      <LandingCta />
      <LandingFooter />
    </div>
  )
}
