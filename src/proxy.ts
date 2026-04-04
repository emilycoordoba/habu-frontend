import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  // TODO: verificar JWT y redirigir a /login si no hay sesión
  return NextResponse.next()
}

export const proxyConfig = {
  matcher: ["/dashboard/:path*", "/contratos/:path*", "/pagos/:path*"],
}
