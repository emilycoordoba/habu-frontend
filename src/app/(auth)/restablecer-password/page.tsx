import { Suspense } from "react"
import { RestablecerPasswordForm } from "@/components/auth/restablecer-password-form"

// El formulario usa useSearchParams() (lee el token del enlace del correo), por lo
// que debe ir dentro de un <Suspense> para que Next pueda prerenderizar la página
// en el build de producción.
export default function RestablecerPasswordPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerPasswordForm />
    </Suspense>
  )
}
