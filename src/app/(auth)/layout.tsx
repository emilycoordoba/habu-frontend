export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panel izquierdo — formulario */}
      <div className="flex items-center justify-center px-6 py-12">
        {children}
      </div>

      {/* Panel derecho — decorativo (solo desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary/5 border-l px-12 gap-6">
        <div className="max-w-xs text-center">
          <p className="text-2xl font-semibold tracking-tight leading-snug">
            Gestión inmobiliaria eficiente
          </p>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Contratos, cobros, inmuebles y clientes en un solo lugar.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-4">
          {["Contratos", "Pagos", "Inmuebles", "Reportes"].map(item => (
            <div key={item} className="rounded-lg border bg-background/60 px-4 py-3 text-sm font-medium text-center shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
