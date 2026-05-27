const stats = [
  {
    valor: "6",
    etiqueta: "Módulos integrados",
    descripcion: "Contratos, pagos, inmuebles, clientes, mantenimiento y chatbot IA",
  },
  {
    valor: "100%",
    etiqueta: "Digital",
    descripcion: "Sin papeles, sin hojas de cálculo, sin archivos dispersos",
  },
  {
    valor: "24/7",
    etiqueta: "Chatbot activo",
    descripcion: "Tus inquilinos pueden consultar sin que tú estés disponible",
  },
  {
    valor: "0",
    etiqueta: "Doble entrada de datos",
    descripcion: "Todo se conecta: un contrato genera los cobros automáticamente",
  },
]

export function LandingStats() {
  return (
    <section id="por-que-habu" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Cabecera */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Por qué Habu
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Diseñado para la realidad colombiana
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            No es un software genérico. Está construido con los flujos reales
            de las inmobiliarias locales.
          </p>
        </div>

        {/* Grid de stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ valor, etiqueta, descripcion }) => (
            <div
              key={etiqueta}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <p className="text-5xl font-black text-primary mb-1 leading-none">
                {valor}
              </p>
              <p className="font-semibold text-foreground mb-2">{etiqueta}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
