"use client"

import * as React from "react"
import DOMPurify from "dompurify"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  EyeIcon,
  FileManagementIcon,
  Building04Icon,
  Home01Icon,
  TextBoldIcon,
  TextItalicIcon,
  ListViewIcon,
  TextAlignLeftIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Variables disponibles por grupo
// ---------------------------------------------------------------------------

interface Variable {
  key: string
  label: string
}

interface GrupoVariables {
  grupo: string
  variables: Variable[]
}

const VARIABLES: GrupoVariables[] = [
  {
    grupo: "Contrato",
    variables: [
      { key: "contrato.referencia",     label: "Referencia" },
      { key: "contrato.fecha_creacion", label: "Fecha de creación" },
      { key: "contrato.fecha_inicio",   label: "Fecha de inicio" },
      { key: "contrato.fecha_fin",      label: "Fecha de vencimiento" },
    ],
  },
  {
    grupo: "Propietario",
    variables: [
      { key: "propietario.nombre",    label: "Nombre completo" },
      { key: "propietario.documento", label: "Número de documento" },
      { key: "propietario.telefono",  label: "Teléfono" },
      { key: "propietario.correo",    label: "Correo" },
      { key: "propietario.direccion", label: "Dirección" },
    ],
  },
  {
    grupo: "Arrendatario / Comprador",
    variables: [
      { key: "contraparte.nombre",    label: "Nombre completo" },
      { key: "contraparte.documento", label: "Número de documento" },
      { key: "contraparte.telefono",  label: "Teléfono" },
      { key: "contraparte.correo",    label: "Correo" },
      { key: "contraparte.direccion", label: "Dirección" },
    ],
  },
  {
    grupo: "Codeudor",
    variables: [
      { key: "codeudor.nombre",    label: "Nombre completo" },
      { key: "codeudor.documento", label: "Número de documento" },
      { key: "codeudor.telefono",  label: "Teléfono" },
    ],
  },
  {
    grupo: "Inmueble",
    variables: [
      { key: "inmueble.direccion", label: "Dirección" },
      { key: "inmueble.ubicacion", label: "Ciudad / Barrio" },
      { key: "inmueble.tipo",      label: "Tipo (casa, apto…)" },
      { key: "inmueble.area",      label: "Área (m²)" },
    ],
  },
  {
    grupo: "Valores",
    variables: [
      { key: "contrato.canon",    label: "Canon mensual" },
      { key: "contrato.deposito", label: "Depósito" },
      { key: "contrato.precio",   label: "Precio de venta" },
      { key: "contrato.arras",    label: "Valor de arras" },
      { key: "contrato.comision", label: "Comisión de administración" },
    ],
  },
  {
    grupo: "Asesor",
    variables: [
      { key: "asesor.nombre",  label: "Nombre del asesor" },
      { key: "asesor.correo",  label: "Correo del asesor" },
    ],
  },
]

// Datos de ejemplo para el preview
const PREVIEW_DATA: Record<string, string> = {
  "contrato.referencia":     "CTR-2025-001",
  "contrato.fecha_creacion": "01 de abril de 2025",
  "contrato.fecha_inicio":   "01 de mayo de 2025",
  "contrato.fecha_fin":      "30 de abril de 2026",
  "contrato.canon":          "$2.800.000",
  "contrato.deposito":       "$5.600.000",
  "contrato.precio":         "$280.000.000",
  "contrato.arras":          "$14.000.000",
  "contrato.comision":       "$224.000",
  "propietario.nombre":      "Lucía Torres Vargas",
  "propietario.documento":   "43.123.456",
  "propietario.telefono":    "310 456 7890",
  "propietario.correo":      "lucia@correo.com",
  "propietario.direccion":   "Carrera 10 # 45-20, Medellín",
  "contraparte.nombre":      "Carlos Andrés Mejía Ríos",
  "contraparte.documento":   "71.234.567",
  "contraparte.telefono":    "315 678 9012",
  "contraparte.correo":      "carlos@correo.com",
  "contraparte.direccion":   "Calle 50 # 30-15, Medellín",
  "codeudor.nombre":         "Ana María Rodríguez",
  "codeudor.documento":      "43.987.654",
  "codeudor.telefono":       "312 345 6789",
  "inmueble.direccion":      "Carrera 43A # 18-55, El Poblado",
  "inmueble.ubicacion":      "Medellín, El Poblado",
  "inmueble.tipo":           "Apartamento",
  "inmueble.area":           "72",
  "asesor.nombre":           "Emily Perea Córdoba",
  "asesor.correo":           "emily@habu.com.co",
}

// ---------------------------------------------------------------------------
// Tipos y mock
// ---------------------------------------------------------------------------

type TipoPlantilla = "arriendo" | "promesa_compraventa" | "administracion"

interface Plantilla {
  id: string
  nombre: string
  tipo: TipoPlantilla
  contenido: string
  ultimaEdicion: string
}

const TIPO_CONFIG: Record<TipoPlantilla, {
  label: string
  icon: typeof FileManagementIcon
  className: string
}> = {
  arriendo: {
    label: "Arriendo",
    icon: Building04Icon,
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  promesa_compraventa: {
    label: "Promesa de compraventa",
    icon: Home01Icon,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  administracion: {
    label: "Administración",
    icon: FileManagementIcon,
    className: "bg-violet-100 text-violet-700 border-violet-200",
  },
}

const PLANTILLAS_MOCK: Plantilla[] = [
  {
    id: "p-1",
    nombre: "Contrato de arriendo residencial",
    tipo: "arriendo",
    ultimaEdicion: "2025-04-10",
    contenido: `<p>CONTRATO DE ARRENDAMIENTO DE INMUEBLE RESIDENCIAL</p><p>Entre los suscritos, <strong>{{propietario.nombre}}</strong>, identificado con cédula de ciudadanía No. {{propietario.documento}}, quien en adelante se denominará EL ARRENDADOR, y <strong>{{contraparte.nombre}}</strong>, identificado con cédula de ciudadanía No. {{contraparte.documento}}, quien en adelante se denominará EL ARRENDATARIO, se celebra el presente contrato de arrendamiento que se regirá por las siguientes cláusulas:</p><p><strong>PRIMERA – OBJETO:</strong> El ARRENDADOR entrega al ARRENDATARIO el inmueble ubicado en {{inmueble.direccion}}, {{inmueble.ubicacion}}, de tipo {{inmueble.tipo}} con área de {{inmueble.area}} m².</p><p><strong>SEGUNDA – VIGENCIA:</strong> El presente contrato tendrá una vigencia de doce (12) meses, con inicio el {{contrato.fecha_inicio}} y vencimiento el {{contrato.fecha_fin}}.</p><p><strong>TERCERA – CANON:</strong> El valor mensual del arriendo es de {{contrato.canon}}, pagadero dentro de los primeros cinco días hábiles de cada mes.</p><p><strong>CUARTA – DEPÓSITO:</strong> El ARRENDATARIO entrega en calidad de depósito la suma de {{contrato.deposito}}.</p>`,
  },
  {
    id: "p-2",
    nombre: "Promesa de compraventa",
    tipo: "promesa_compraventa",
    ultimaEdicion: "2025-03-22",
    contenido: `<p>PROMESA DE COMPRAVENTA</p><p>Entre <strong>{{propietario.nombre}}</strong>, cédula {{propietario.documento}}, como PROMITENTE VENDEDOR, y <strong>{{contraparte.nombre}}</strong>, cédula {{contraparte.documento}}, como PROMITENTE COMPRADOR, se celebra la presente promesa de compraventa:</p><p><strong>PRIMERA – OBJETO:</strong> El PROMITENTE VENDEDOR se obliga a vender y el PROMITENTE COMPRADOR a comprar el inmueble ubicado en {{inmueble.direccion}}.</p><p><strong>SEGUNDA – PRECIO:</strong> El precio acordado es de {{contrato.precio}}, del cual se entregan como arras la suma de {{contrato.arras}} a la firma del presente documento.</p><p><strong>TERCERA – ESCRITURACIÓN:</strong> Las partes se comprometen a suscribir la escritura pública de compraventa a más tardar el {{contrato.fecha_fin}}.</p>`,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFecha(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function buildPreviewHtml(html: string): string {
  const withVars = html.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const val = PREVIEW_DATA[key.trim()]
    const cls = val
      ? "background-color:#eff6ff;color:#1d4ed8;border-radius:3px;padding:0 2px"
      : "background-color:#fef2f2;color:#dc2626;border-radius:3px;padding:0 2px"
    return `<mark style="${cls}">${val ?? key}</mark>`
  })
  return DOMPurify.sanitize(withVars, { ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li", "br", "mark"], ALLOWED_ATTR: ["style"] })
}

function sanitizeEditorHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li", "br", "h1", "h2", "h3"],
    ALLOWED_ATTR: [],
  })
}

// ---------------------------------------------------------------------------
// Barra de herramientas
// ---------------------------------------------------------------------------

function ToolbarEditor({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null

  const btn = (active: boolean, onClick: () => void, title: string, icon: typeof TextBoldIcon) => (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      title={title}
      className={cn("size-7", active && "bg-muted")}
      onClick={onClick}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3.5" />
    </Button>
  )

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b bg-muted/20">
      {btn(editor.isActive("bold"),       () => editor.chain().focus().toggleBold().run(),       "Negrita", TextBoldIcon)}
      {btn(editor.isActive("italic"),     () => editor.chain().focus().toggleItalic().run(),     "Cursiva", TextItalicIcon)}
      <div className="w-px h-4 bg-border mx-1" />
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "Lista",   ListViewIcon)}
      {btn(editor.isActive("paragraph"),  () => editor.chain().focus().setParagraph().run(),     "Párrafo", TextAlignLeftIcon)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Panel de edición
// ---------------------------------------------------------------------------

interface PanelEditorProps {
  plantilla: Plantilla
  onGuardar: (contenido: string, nombre: string) => void
  onCancelar: () => void
}

function PanelEditor({ plantilla, onGuardar, onCancelar }: PanelEditorProps) {
  const [nombre, setNombre] = React.useState(plantilla.nombre)
  const [modo, setModo] = React.useState<"editar" | "preview">("editar")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Escribe el contenido de la plantilla…" }),
    ],
    content: plantilla.contenido,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-5 py-4 text-sm leading-relaxed",
      },
    },
  })

  function insertarVariable(key: string) {
    editor?.chain().focus().insertContent(`{{${key}}}`).run()
  }

  function handleGuardar() {
    if (!editor) return
    onGuardar(sanitizeEditorHtml(editor.getHTML()), nombre)
  }

  const previewHtml = React.useMemo(
    () => buildPreviewHtml(editor?.getHTML() ?? ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modo, editor?.getHTML()]
  )

  return (
    <div className="flex h-full overflow-hidden">
      {/* Editor */}
      <div className="flex flex-col flex-1 min-w-0 border-r overflow-hidden">
        {/* Nombre + toggle modo */}
        <div className="px-4 py-3 border-b flex items-center gap-3 shrink-0">
          <Input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="h-8 text-sm font-medium"
            placeholder="Nombre de la plantilla"
          />
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant={modo === "editar" ? "secondary" : "ghost"}
              size="sm" type="button"
              className="h-7 text-xs gap-1"
              onClick={() => setModo("editar")}
            >
              <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
              Editar
            </Button>
            <Button
              variant={modo === "preview" ? "secondary" : "ghost"}
              size="sm" type="button"
              className="h-7 text-xs gap-1"
              onClick={() => setModo("preview")}
            >
              <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3.5" />
              Preview
            </Button>
          </div>
        </div>

        {modo === "editar" ? (
          <>
            <ToolbarEditor editor={editor} />
            <div className="flex-1 overflow-y-auto">
              <EditorContent editor={editor} />
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 bg-muted/30 rounded px-3 py-2">
              <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-3.5 shrink-0" />
              Vista previa con datos de ejemplo — las variables resaltadas se reemplazarán con datos reales al generar el contrato.
            </div>
            {/* Sanitizado con DOMPurify antes de renderizar */}
            <div
              className="prose prose-sm max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        )}

        <div className="px-4 py-3 border-t flex justify-end gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onCancelar}>Cancelar</Button>
          <Button size="sm" onClick={handleGuardar} disabled={!nombre.trim()}>
            Guardar plantilla
          </Button>
        </div>
      </div>

      {/* Paleta de variables */}
      <div className="w-56 shrink-0 overflow-y-auto border-l">
        <div className="px-3 py-2.5 border-b bg-muted/20 sticky top-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variables</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Clic para insertar en el cursor</p>
        </div>
        {VARIABLES.map(({ grupo, variables }) => (
          <div key={grupo} className="mb-1">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 bg-muted/10">
              {grupo}
            </p>
            {variables.map(v => (
              <button
                key={v.key}
                type="button"
                onClick={() => insertarVariable(v.key)}
                className="w-full text-left px-3 py-1.5 hover:bg-muted/50 transition-colors group"
              >
                <span className="font-mono text-[10px] text-primary/70 group-hover:text-primary block leading-tight">
                  {`{{${v.key}}}`}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">{v.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Vista de solo lectura (preview de la plantilla seleccionada)
// ---------------------------------------------------------------------------

function PanelPreview({ plantilla, onEditar }: { plantilla: Plantilla; onEditar: () => void }) {
  const cfg = TIPO_CONFIG[plantilla.tipo]
  const previewHtml = React.useMemo(
    () => buildPreviewHtml(plantilla.contenido),
    [plantilla.contenido]
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-3.5 border-b flex items-center justify-between shrink-0">
        <div>
          <p className="text-sm font-semibold">{plantilla.nombre}</p>
          <Badge variant="outline" className={cn("text-[10px] font-medium mt-1", cfg.className)}>
            <HugeiconsIcon icon={cfg.icon} strokeWidth={2} className="size-2.5 mr-1" />
            {cfg.label}
          </Badge>
        </div>
        <Button size="sm" variant="outline" onClick={onEditar} className="gap-1.5">
          <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
          Editar
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 bg-muted/30 rounded px-3 py-2">
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-3.5 shrink-0" />
          Vista previa con datos de ejemplo
        </div>
        {/* Sanitizado con DOMPurify antes de renderizar */}
        <div
          className="prose prose-sm max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function PlantillasClient() {
  const [plantillas, setPlantillas] = React.useState<Plantilla[]>(PLANTILLAS_MOCK)
  const [seleccionada, setSeleccionada] = React.useState<Plantilla | null>(null)
  const [editando, setEditando] = React.useState(false)
  const [confirmEliminar, setConfirmEliminar] = React.useState<Plantilla | null>(null)

  function handleNueva() {
    const nueva: Plantilla = {
      id: `p-${Date.now()}`,
      nombre: "Nueva plantilla",
      tipo: "arriendo",
      contenido: "",
      ultimaEdicion: new Date().toISOString().split("T")[0],
    }
    setPlantillas(prev => [...prev, nueva])
    setSeleccionada(nueva)
    setEditando(true)
  }

  function handleGuardar(contenido: string, nombre: string) {
    if (!seleccionada) return
    const actualizada: Plantilla = {
      ...seleccionada,
      nombre,
      contenido,
      ultimaEdicion: new Date().toISOString().split("T")[0],
    }
    setPlantillas(prev => prev.map(p => p.id === seleccionada.id ? actualizada : p))
    setSeleccionada(actualizada)
    setEditando(false)
  }

  function handleEliminar() {
    if (!confirmEliminar) return
    setPlantillas(prev => prev.filter(p => p.id !== confirmEliminar.id))
    if (seleccionada?.id === confirmEliminar.id) setSeleccionada(null)
    setConfirmEliminar(null)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Lista de plantillas */}
      <div className="flex flex-col w-72 shrink-0 border-r h-full">
        <div className="px-4 py-3.5 flex items-center justify-between border-b shrink-0">
          <div>
            <p className="text-sm font-semibold">Plantillas</p>
            <p className="text-xs text-muted-foreground">
              {plantillas.length} plantilla{plantillas.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button size="sm" onClick={handleNueva}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
            Nueva
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {plantillas.map(p => {
            const cfg = TIPO_CONFIG[p.tipo]
            const isSelected = seleccionada?.id === p.id

            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => { setSeleccionada(p); setEditando(false) }}
                onKeyDown={e => e.key === "Enter" && (setSeleccionada(p), setEditando(false))}
                className={cn(
                  "w-full text-left px-4 py-3 flex flex-col gap-1 hover:bg-muted/40 transition-colors cursor-pointer",
                  isSelected && "bg-muted/60 border-l-2 border-primary"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-tight line-clamp-2">{p.nombre}</span>
                  {isSelected && (
                    <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost" size="icon" className="size-6"
                        onClick={() => setEditando(true)} title="Editar"
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-3" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="size-6 hover:text-red-600"
                        onClick={() => setConfirmEliminar(p)} title="Eliminar"
                      >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <Badge variant="outline" className={cn("text-[10px] w-fit font-medium", cfg.className)}>
                  <HugeiconsIcon icon={cfg.icon} strokeWidth={2} className="size-2.5 mr-1" />
                  {cfg.label}
                </Badge>
                <p className="text-[10px] text-muted-foreground/60">
                  Editado {formatFecha(p.ultimaEdicion)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 h-full overflow-hidden">
        {seleccionada && editando ? (
          <PanelEditor
            plantilla={seleccionada}
            onGuardar={handleGuardar}
            onCancelar={() => setEditando(false)}
          />
        ) : seleccionada ? (
          <PanelPreview plantilla={seleccionada} onEditar={() => setEditando(true)} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <HugeiconsIcon icon={FileManagementIcon} strokeWidth={2} className="size-8 opacity-30" />
            <p className="text-sm">Selecciona una plantilla o crea una nueva</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!confirmEliminar} onOpenChange={open => !open && setConfirmEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <strong>{confirmEliminar?.nombre}</strong>. Esta acción no se puede deshacer.
              Los contratos ya generados con esta plantilla no se verán afectados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEliminar}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
