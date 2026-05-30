"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AiChat01Icon,
  ArrowLeft01Icon,
  Location01Icon,
  RulerIcon,
  Calendar01Icon,
  UserIcon,
  TelephoneIcon,
  Mail01Icon,
  CheckmarkCircle01Icon,
  House01Icon,
  Building04Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { enviarSolicitudChatbot } from "@/lib/api/chatbot"
import { listarInmuebles } from "@/lib/api/inmuebles"

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type Paso =
  | "bienvenida"
  | "buscar_tipo" | "buscar_ciudad" | "buscar_resultados"
  | "inmueble_interes"
  | "requisitos_modalidad" | "requisitos_info"
  | "agendar_inicio" | "agendar_fecha" | "agendar_datos" | "agendar_ok"
  | "contacto_datos" | "contacto_ok"
  | "asesor_datos" | "asesor_ok"

interface InmuebleResumen {
  id: string
  tipo: string
  direccion: string
  ubicacion: string
  precio: number
  area: number
  modalidad: "arriendo" | "venta" | "ambos"
  foto?: string
}

interface Mensaje {
  id: string
  tipo: "bot" | "usuario" | "resultados"
  texto?: string
  lista?: string[]
  inmuebles?: InmuebleResumen[]
}

interface Contexto {
  tipoBuscado: string
  ciudadBuscada: string
  inmuebleId: string
  inmuebleDireccion: string
}

interface FormDatos {
  nombre: string
  telefono: string
  correo: string
  mensaje: string
  fecha: string
  hora: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function filtrarInmuebles(lista: InmuebleResumen[], tipo: string, ciudad: string): InmuebleResumen[] {
  return lista.filter(i => {
    const coincideTipo = tipo === "todos" || tipo === "" || i.tipo === tipo
    const ciudadInm = i.ubicacion.split("—")[0].trim().toLowerCase()
    const coincideCiudad = ciudad === "todas" || ciudad === "" || ciudadInm.includes(ciudad.toLowerCase())
    return coincideTipo && coincideCiudad
  })
}

const HORAS = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function ChatbotClient() {
  const [mensajes, setMensajes] = React.useState<Mensaje[]>([])
  const [paso, setPaso]         = React.useState<Paso>("bienvenida")
  const [escribiendo, setEscribiendo] = React.useState(false)
  const [ctx, setCtx] = React.useState<Contexto>({ tipoBuscado: "", ciudadBuscada: "", inmuebleId: "", inmuebleDireccion: "" })
  const [form, setForm] = React.useState<FormDatos>({ nombre: "", telefono: "", correo: "", mensaje: "", fecha: "", hora: "" })
  const [formErrors, setFormErrors] = React.useState<Partial<FormDatos>>({})
  const [inmueblesList, setInmueblesList] = React.useState<InmuebleResumen[]>([])
  // Preserva fecha/hora de visita tras limpiar el form en submitFecha
  const visitaRef = React.useRef<{ fecha: string; hora: string }>({ fecha: "", hora: "" })
  const bottomRef = React.useRef<HTMLDivElement>(null)

  // Carga inmuebles desde la API al montar — silencioso si falla
  React.useEffect(() => {
    listarInmuebles({ limit: 100 })
      .then(res => setInmueblesList(
        (res.data ?? []).map(i => ({
          id: i.id,
          tipo: i.tipo,
          direccion: i.direccion,
          ubicacion: i.ubicacion,
          precio: i.precio,
          area: i.area,
          modalidad: i.modalidad,
          foto: i.fotoPrincipal,
        }))
      ))
      .catch(() => { /* chatbot funciona sin resultados de búsqueda si la API no está disponible */ })
  }, [])

  // Auto-scroll
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes, escribiendo])

  // Mensaje inicial
  React.useEffect(() => {
    setEscribiendo(true)
    const t = setTimeout(() => {
      setEscribiendo(false)
      setMensajes([{ id: uid(), tipo: "bot", texto: "¡Hola! Soy el asistente virtual de Habu Inmobiliaria. ¿En qué puedo ayudarte hoy?" }])
    }, 900)
    return () => clearTimeout(t)
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────

  function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2)}` }

  function addBot(texto: string, lista?: string[]) {
    setMensajes(p => [...p, { id: uid(), tipo: "bot", texto, lista }])
  }

  function addUser(texto: string) {
    setMensajes(p => [...p, { id: uid(), tipo: "usuario", texto }])
  }

  function addResultados(inmuebles: InmuebleResumen[]) {
    setMensajes(p => [...p, { id: uid(), tipo: "resultados", inmuebles }])
  }

  function responder(fn: () => void, delay = 750) {
    setEscribiendo(true)
    const t = setTimeout(() => { setEscribiendo(false); fn() }, delay)
    return t
  }

  function setField<K extends keyof FormDatos>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setFormErrors(e => ({ ...e, [key]: undefined }))
  }

  // ── Manejador principal de opciones ──────────────────────────────────────

  function elegir(valor: string, label: string) {
    if (escribiendo) return
    addUser(label)

    // Tarjetas de inmueble: "interesa_[id]"
    if (valor.startsWith("interesa_")) {
      const id = valor.slice("interesa_".length)
      const inm = inmueblesList.find(i => i.id === id)
      setCtx(c => ({ ...c, inmuebleId: id, inmuebleDireccion: inm?.direccion ?? "" }))
      responder(() => {
        addBot(`¡Excelente elección! ¿Qué deseas hacer con ${inm?.direccion ?? "este inmueble"}?`)
        setPaso("inmueble_interes")
      })
      return
    }

    switch (valor) {

      // ── Menú principal ──
      case "buscar":
        responder(() => { addBot("¿Qué tipo de inmueble estás buscando?"); setPaso("buscar_tipo") })
        break
      case "requisitos":
        responder(() => { addBot("¿Estás interesado en arrendar o comprar?"); setPaso("requisitos_modalidad") })
        break
      case "agendar":
        responder(() => { addBot("¿Tienes algún inmueble en mente o prefieres ver las opciones disponibles?"); setPaso("agendar_inicio") })
        break
      case "asesor":
        responder(() => { addBot("Entendido, te conectaré con un asesor. Por favor déjanos tus datos de contacto:"); setPaso("asesor_datos") })
        break

      // ── Buscar: tipo ──
      case "tipo_apartamento":
      case "tipo_casa":
      case "tipo_local":
      case "tipo_todos": {
        const tipo = valor === "tipo_todos" ? "todos" : valor.replace("tipo_", "")
        setCtx(c => ({ ...c, tipoBuscado: tipo }))
        responder(() => { addBot("¿En qué ciudad buscas?"); setPaso("buscar_ciudad") })
        break
      }

      // ── Buscar: ciudad ──
      case "ciudad_bogota":
      case "ciudad_medellin":
      case "ciudad_cali":
      case "ciudad_todas": {
        const ciudadMap: Record<string, string> = {
          ciudad_bogota: "Bogotá", ciudad_medellin: "Medellín",
          ciudad_cali: "Cali", ciudad_todas: "todas",
        }
        const ciudad = ciudadMap[valor]
        const results = filtrarInmuebles(inmueblesList, ctx.tipoBuscado, ciudad)
        setCtx(c => ({ ...c, ciudadBuscada: ciudad }))
        responder(() => {
          if (results.length === 0) {
            addBot("No encontré inmuebles con esos criterios. ¿Quieres que un asesor te busque opciones personalizadas?")
            setPaso("contacto_datos")
          } else {
            addBot(`Encontré ${results.length} inmueble${results.length !== 1 ? "s" : ""} disponible${results.length !== 1 ? "s" : ""}:`)
            addResultados(results)
            setPaso("buscar_resultados")
          }
        })
        break
      }

      // ── Inmueble de interés ──
      case "agendar_desde_interes":
        responder(() => { addBot("Perfecto. ¿Qué fecha y hora te viene mejor para la visita?"); setPaso("agendar_fecha") })
        break
      case "info_desde_interes":
        responder(() => { addBot("Con gusto. Déjanos tus datos y un asesor te contactará pronto con más información:"); setPaso("contacto_datos") })
        break

      // ── Requisitos ──
      case "req_arriendo":
        responder(() => {
          addBot("Para arrendar un inmueble necesitas:", [
            "Carta laboral o certificado de ingresos (últimos 3 meses)",
            "Extractos bancarios (últimos 3 meses)",
            "Copia de cédula de ciudadanía",
            "Codeudor con finca raíz (según el caso)",
            "Depósito equivalente a 1 mes de canon",
          ])
          setPaso("requisitos_info")
        })
        break
      case "req_compra":
        responder(() => {
          addBot("Para comprar un inmueble necesitas:", [
            "Preaprobación de crédito hipotecario (si financias)",
            "Copia de cédula de ciudadanía",
            "Declaración de renta (si aplica)",
            "Recursos para gastos notariales (~2–3% del valor)",
            "Promesa de compraventa firmada ante notaría",
          ])
          setPaso("requisitos_info")
        })
        break

      // ── Agendar inicio ──
      case "ver_disponibles":
        responder(() => { addBot("¿Qué tipo de inmueble estás buscando?"); setPaso("buscar_tipo") })
        break
      case "continuar_agendar":
        responder(() => { addBot("Perfecto. ¿Qué fecha y hora te viene mejor para la visita?"); setPaso("agendar_fecha") })
        break

      // ── Nuevos filtros / volver ──
      case "nuevos_filtros":
        responder(() => { addBot("¿Qué tipo de inmueble estás buscando?"); setPaso("buscar_tipo") })
        break
      case "otra_consulta":
        setCtx({ tipoBuscado: "", ciudadBuscada: "", inmuebleId: "", inmuebleDireccion: "" })
        responder(() => { addBot("¡Claro! ¿En qué más puedo ayudarte?"); setPaso("bienvenida") })
        break
      case "volver":
        responder(() => { addBot("¿En qué más puedo ayudarte?"); setPaso("bienvenida") })
        break
    }
  }

  // ── Submit: fecha y hora ──────────────────────────────────────────────────

  function submitFecha() {
    const e: Partial<FormDatos> = {}
    if (!form.fecha) e.fecha = "Selecciona una fecha."
    if (!form.hora)  e.hora  = "Selecciona una hora."
    if (Object.keys(e).length > 0) { setFormErrors(e); return }
    // Guarda antes de limpiar el form para usarlos al enviar la solicitud
    visitaRef.current = { fecha: form.fecha, hora: form.hora }
    addUser(`Fecha: ${formatFechaLocal(form.fecha)} · ${form.hora}`)
    responder(() => { addBot("¡Perfecto! Ya casi terminamos. ¿Cómo podemos contactarte?"); setPaso("agendar_datos") })
    setForm(f => ({ ...f, fecha: "", hora: "" }))
  }

  // ── Submit: datos de contacto ─────────────────────────────────────────────

  function submitDatos(tipoPaso: "agendar_datos" | "contacto_datos" | "asesor_datos") {
    const e: Partial<FormDatos> = {}
    if (!form.nombre.trim())   e.nombre   = "Campo obligatorio."
    if (!form.telefono.trim()) e.telefono = "Campo obligatorio."
    if (tipoPaso === "contacto_datos" && !form.mensaje.trim()) e.mensaje = "Campo obligatorio."
    if (Object.keys(e).length > 0) { setFormErrors(e); return }

    const resumen = tipoPaso === "contacto_datos"
      ? `${form.nombre} · ${form.telefono}${form.correo ? ` · ${form.correo}` : ""} · "${form.mensaje}"`
      : `${form.nombre} · ${form.telefono}${form.correo ? ` · ${form.correo}` : ""}`
    addUser(resumen)

    const confirmaciones: Record<typeof tipoPaso, string> = {
      agendar_datos:   "¡Visita agendada! 🎉 Te confirmaremos la cita por teléfono pronto. ¡Hasta pronto!",
      contacto_datos:  "¡Solicitud recibida! ✅ Un asesor se pondrá en contacto contigo en las próximas horas.",
      asesor_datos:    "¡Listo! ✅ Un asesor te contactará pronto para atenderte personalmente.",
    }
    const siguientePaso: Record<typeof tipoPaso, Paso> = {
      agendar_datos:  "agendar_ok",
      contacto_datos: "contacto_ok",
      asesor_datos:   "asesor_ok",
    }

    const tipoMap: Record<typeof tipoPaso, "visita" | "contacto" | "asesor"> = {
      agendar_datos:  "visita",
      contacto_datos: "contacto",
      asesor_datos:   "asesor",
    }

    // Captura historial y datos antes de limpiar el estado
    const historialParaApi = mensajes
      .filter(m => (m.tipo === "bot" || m.tipo === "usuario") && m.texto)
      .map(m => ({ tipo: m.tipo as "bot" | "usuario", texto: m.texto!, timestamp: new Date().toISOString() }))

    const body = {
      tipo: tipoMap[tipoPaso],
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      correo: form.correo.trim() || undefined,
      inmuebleInteres: ctx.inmuebleDireccion || undefined,
      mensaje: tipoPaso === "contacto_datos" ? form.mensaje.trim() : undefined,
      fechaVisita: tipoPaso === "agendar_datos" ? visitaRef.current.fecha || undefined : undefined,
      horaVisita:  tipoPaso === "agendar_datos" ? visitaRef.current.hora  || undefined : undefined,
      historial: historialParaApi,
    }

    // Envía al API en background — el usuario ve la confirmación sin esperar
    enviarSolicitudChatbot(body).catch(() => {
      // Silencioso: el flujo conversacional ya avanzó; log en consola para debugging
      console.error("[chatbot] No se pudo registrar la solicitud en el servidor.")
    })

    responder(() => {
      addBot(confirmaciones[tipoPaso])
      setPaso(siguientePaso[tipoPaso])
    })
    setForm({ nombre: "", telefono: "", correo: "", mensaje: "", fecha: "", hora: "" })
  }

  // ── Cancelar formulario ───────────────────────────────────────────────────

  function cancelarFormulario() {
    addUser("Cancelar")
    setForm({ nombre: "", telefono: "", correo: "", mensaje: "", fecha: "", hora: "" })
    setFormErrors({})
    responder(() => {
      addBot("Entendido. ¿En qué más puedo ayudarte?")
      setPaso("bienvenida")
    })
  }

  // ── Quick replies por paso ────────────────────────────────────────────────

  const OPCIONES: Record<Paso, { valor: string; label: string }[]> = {
    bienvenida: [
      { valor: "buscar",      label: "Buscar inmuebles" },
      { valor: "requisitos",  label: "Conocer requisitos" },
      { valor: "agendar",     label: "Agendar una visita" },
      { valor: "asesor",      label: "Hablar con un asesor" },
    ],
    buscar_tipo: [
      { valor: "tipo_apartamento", label: "Apartamento" },
      { valor: "tipo_casa",        label: "Casa" },
      { valor: "tipo_local",       label: "Local comercial" },
      { valor: "tipo_todos",       label: "Ver todos" },
    ],
    buscar_ciudad: [
      { valor: "ciudad_bogota",   label: "Bogotá" },
      { valor: "ciudad_medellin", label: "Medellín" },
      { valor: "ciudad_cali",     label: "Cali" },
      { valor: "ciudad_todas",    label: "Todas las ciudades" },
    ],
    buscar_resultados: [
      { valor: "nuevos_filtros", label: "Buscar con otros filtros" },
      { valor: "volver",         label: "Volver al inicio" },
    ],
    inmueble_interes: [
      { valor: "agendar_desde_interes", label: "Agendar visita" },
      { valor: "info_desde_interes",    label: "Solicitar información" },
      { valor: "nuevos_filtros",        label: "Ver otros inmuebles" },
    ],
    requisitos_modalidad: [
      { valor: "req_arriendo", label: "Arrendar" },
      { valor: "req_compra",   label: "Comprar" },
    ],
    requisitos_info: [
      { valor: "agendar",       label: "Agendar una visita" },
      { valor: "otra_consulta", label: "Hacer otra consulta" },
    ],
    agendar_inicio: [
      { valor: "ver_disponibles",   label: "Ver inmuebles disponibles" },
      { valor: "continuar_agendar", label: "Ya tengo uno en mente" },
    ],
    agendar_fecha:   [],
    agendar_datos:   [],
    agendar_ok: [
      { valor: "otra_consulta", label: "Hacer otra consulta" },
    ],
    contacto_datos:  [],
    contacto_ok: [
      { valor: "otra_consulta", label: "Hacer otra consulta" },
    ],
    asesor_datos: [],
    asesor_ok: [
      { valor: "otra_consulta", label: "Hacer otra consulta" },
    ],
  }

  const esFormPaso = ["agendar_fecha", "agendar_datos", "contacto_datos", "asesor_datos"].includes(paso)
  const opciones = OPCIONES[paso] ?? []

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-muted/20">

      {/* Header */}
      <div className="shrink-0 border-b bg-background px-4 py-3 flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div className="size-9 rounded-full bg-primary flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={AiChat01Icon} strokeWidth={2} className="size-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Habu Inmobiliaria</p>
          <p className="text-xs text-muted-foreground">Asistente virtual · Responde al instante</p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-2xl mx-auto w-full space-y-4">

          {mensajes.map(m => {
            if (m.tipo === "usuario") return <UserBubble key={m.id} texto={m.texto ?? ""} />
            if (m.tipo === "resultados") return (
              <div key={m.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(m.inmuebles ?? []).map(inm => (
                  <InmuebleChatCard
                    key={inm.id}
                    inmueble={inm}
                    onMeInteresa={() => elegir(`interesa_${inm.id}`, inm.direccion)}
                  />
                ))}
              </div>
            )
            return (
              <BotBubble key={m.id} texto={m.texto ?? ""} lista={m.lista} />
            )
          })}

          {escribiendo && <TypingDots />}
          <div ref={bottomRef} />

        </div>
      </div>

      {/* Área de entrada */}
      <div className="shrink-0 border-t bg-background px-4 py-4">
        <div className="max-w-2xl mx-auto w-full">

          {/* Quick replies */}
          {!esFormPaso && opciones.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {opciones.map(op => (
                <button
                  key={op.valor}
                  disabled={escribiendo}
                  onClick={() => elegir(op.valor, op.label)}
                  className="border rounded-full px-4 py-2 text-sm hover:bg-muted hover:border-muted-foreground/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {op.label}
                </button>
              ))}
            </div>
          )}

          {/* Formulario: fecha y hora */}
          {paso === "agendar_fecha" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fecha">
                    <HugeiconsIcon icon={Calendar01Icon} strokeWidth={1.5} className="size-3.5 inline mr-1" />
                    Fecha de visita
                  </Label>
                  <Input
                    id="fecha"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.fecha}
                    onChange={e => setField("fecha", e.target.value)}
                    className={cn("h-9", formErrors.fecha && "border-destructive")}
                  />
                  {formErrors.fecha && <p className="text-xs text-destructive">{formErrors.fecha}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Hora preferida</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {HORAS.map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setField("hora", h)}
                        className={cn(
                          "border rounded px-3 py-1.5 text-xs transition-all",
                          form.hora === h
                            ? "border-primary bg-primary text-primary-foreground"
                            : "hover:border-muted-foreground/40",
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                  {formErrors.hora && <p className="text-xs text-destructive">{formErrors.hora}</p>}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button type="button" onClick={cancelarFormulario} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  ← Cancelar
                </button>
                <Button size="sm" onClick={submitFecha}>
                  Continuar
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Formulario: datos de contacto (agendar + asesor) */}
          {(paso === "agendar_datos" || paso === "asesor_datos") && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <InlineField
                  id="nombre" label="Nombre" icon={UserIcon}
                  value={form.nombre} onChange={v => setField("nombre", v)}
                  error={formErrors.nombre} placeholder="Tu nombre completo"
                />
                <InlineField
                  id="telefono" label="Teléfono" icon={TelephoneIcon}
                  value={form.telefono} onChange={v => setField("telefono", v)}
                  error={formErrors.telefono} placeholder="300 000 0000"
                />
              </div>
              <InlineField
                id="correo" label="Correo electrónico (opcional)" icon={Mail01Icon}
                value={form.correo} onChange={v => setField("correo", v)}
                placeholder="tucorreo@email.com"
              />
              <div className="flex justify-between items-center">
                <button type="button" onClick={cancelarFormulario} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  ← Cancelar
                </button>
                <Button size="sm" onClick={() => submitDatos(paso as "agendar_datos" | "asesor_datos")}>
                  Enviar
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Formulario: solicitud de información */}
          {paso === "contacto_datos" && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <InlineField
                  id="nombre" label="Nombre" icon={UserIcon}
                  value={form.nombre} onChange={v => setField("nombre", v)}
                  error={formErrors.nombre} placeholder="Tu nombre completo"
                />
                <InlineField
                  id="telefono" label="Teléfono" icon={TelephoneIcon}
                  value={form.telefono} onChange={v => setField("telefono", v)}
                  error={formErrors.telefono} placeholder="300 000 0000"
                />
              </div>
              <InlineField
                id="correo" label="Correo (opcional)" icon={AiChat01Icon}
                value={form.correo} onChange={v => setField("correo", v)}
                placeholder="tucorreo@email.com"
              />
              <div className="space-y-1.5">
                <Label htmlFor="mensaje" className="text-xs text-muted-foreground">
                  ¿Qué información necesitas? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="mensaje"
                  placeholder="Cuéntanos qué inmueble te interesa o qué consulta tienes…"
                  rows={2}
                  value={form.mensaje}
                  onChange={e => setField("mensaje", e.target.value)}
                  className={cn("resize-none text-sm", formErrors.mensaje && "border-destructive")}
                />
                {formErrors.mensaje && <p className="text-xs text-destructive">{formErrors.mensaje}</p>}
              </div>
              <div className="flex justify-between items-center">
                <button type="button" onClick={cancelarFormulario} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  ← Cancelar
                </button>
                <Button size="sm" onClick={() => submitDatos("contacto_datos")}>
                  Enviar solicitud
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function BotBubble({ texto, lista }: { texto: string; lista?: string[] }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="size-7 rounded-full bg-primary shrink-0 flex items-center justify-center mt-0.5">
        <HugeiconsIcon icon={AiChat01Icon} strokeWidth={2} className="size-3.5 text-primary-foreground" />
      </div>
      <div className="bg-background border rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] space-y-2 shadow-xs">
        <p className="text-sm leading-relaxed">{texto}</p>
        {lista && lista.length > 0 && (
          <ul className="space-y-1">
            {lista.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function UserBubble({ texto }: { texto: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
        <p className="text-sm leading-relaxed">{texto}</p>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="size-7 rounded-full bg-primary shrink-0 flex items-center justify-center mt-0.5">
        <HugeiconsIcon icon={AiChat01Icon} strokeWidth={2} className="size-3.5 text-primary-foreground" />
      </div>
      <div className="bg-background border rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function InmuebleChatCard({
  inmueble,
  onMeInteresa,
}: {
  inmueble: InmuebleResumen
  onMeInteresa: () => void
}) {
  const tipoLabel = inmueble.tipo === "local" ? "Local comercial" : inmueble.tipo.charAt(0).toUpperCase() + inmueble.tipo.slice(1)
  const TipoIcon = inmueble.tipo === "casa" ? House01Icon : Building04Icon
  const precioLabel = inmueble.modalidad === "venta"
    ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(inmueble.precio)
    : `${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(inmueble.precio)}/mes`

  return (
    <div className="border rounded-xl overflow-hidden bg-background hover:shadow-sm transition-shadow">
      <div className="aspect-video bg-muted relative">
        {inmueble.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={inmueble.foto} alt={inmueble.direccion} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HugeiconsIcon icon={TipoIcon} strokeWidth={1.5} className="size-8 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1">
          <HugeiconsIcon icon={TipoIcon} strokeWidth={2} className="size-3" />
          {tipoLabel}
        </div>
      </div>
      <div className="px-3 py-3 space-y-2">
        <div>
          <p className="text-sm font-medium leading-snug line-clamp-1">{inmueble.direccion}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <HugeiconsIcon icon={Location01Icon} strokeWidth={1.5} className="size-3 shrink-0" />
            {inmueble.ubicacion}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{precioLabel}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <HugeiconsIcon icon={RulerIcon} strokeWidth={1.5} className="size-3" />
              {inmueble.area} m²
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onMeInteresa}>
            Me interesa
          </Button>
        </div>
      </div>
    </div>
  )
}

function InlineField({
  id, label, icon, value, onChange, error, placeholder,
}: {
  id: string
  label: string
  icon: typeof UserIcon
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground flex items-center gap-1">
        <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-3" />
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("h-8 text-sm", error && "border-destructive")}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFechaLocal(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })
}
