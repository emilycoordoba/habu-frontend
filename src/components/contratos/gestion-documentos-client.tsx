"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Upload01Icon,
  Tick02Icon,
  Cancel01Icon,
  Clock01Icon,
  FileAttachmentIcon,
  ArrowRight01Icon,
  PdfIcon,
  ImageIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { LABELS_POR_TIPO } from "@/types/contrato.types"
import type { TipoContrato } from "@/types/contrato.types"
import { obtenerContrato, listarDocumentos, subirDocumento } from "@/lib/api/contratos"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// --- Tipos ---
type EstadoDoc = "pendiente" | "recibido" | "rechazado"

interface TipoDocMock {
  id: string
  nombre: string
  obligatorio: boolean
  categoria: string
  requiereCodeudor?: boolean
}

interface DocCargado {
  tipoDocId: string
  nombreArchivo: string
  fechaCarga: string
  estado: EstadoDoc
  objectUrl: string
  apiDocId?: string
}

// --- Mock: en producción esta lista vendría del endpoint configurado en el
// módulo de Administración (CU-10 "Configurar documentos requeridos").
// Se filtra por tipo de contrato, tipo de persona e indicador de codeudor. ---
function getDocumentosPorTipo(tipo: TipoContrato, tieneCodudor: boolean): TipoDocMock[] {
  const labels = LABELS_POR_TIPO[tipo]

  const docsContraparte: TipoDocMock[] = [
    { id: "d1", nombre: `Cédula de ciudadanía (${labels.contraparte})`, obligatorio: true, categoria: labels.contraparte },
    { id: "d2", nombre: `Certificado laboral o declaración de renta (${labels.contraparte})`, obligatorio: true, categoria: labels.contraparte },
    { id: "d3", nombre: `Extractos bancarios 3 últimos meses (${labels.contraparte})`, obligatorio: true, categoria: labels.contraparte },
    { id: "d4", nombre: `Referencias personales (${labels.contraparte})`, obligatorio: false, categoria: labels.contraparte },
  ]

  const docsCodudor: TipoDocMock[] = tieneCodudor ? [
    { id: "d5", nombre: "Cédula de ciudadanía (Codeudor)", obligatorio: true, categoria: "Codeudor", requiereCodeudor: true },
    { id: "d6", nombre: "Certificado laboral o declaración de renta (Codeudor)", obligatorio: true, categoria: "Codeudor", requiereCodeudor: true },
  ] : []

  const docsPropietario: TipoDocMock[] = [
    { id: "d7", nombre: `Cédula de ciudadanía (${labels.propietario})`, obligatorio: true, categoria: labels.propietario },
    { id: "d8", nombre: `Certificado de tradición y libertad`, obligatorio: true, categoria: labels.propietario },
  ]

  // El PDF del contrato firmado lo genera DocuSign después de "Enviar a firmas"
  // y no es un documento que el asesor suba en este paso.
  // Aquí solo van los documentos de soporte previos a la firma.
  const docsContrato: TipoDocMock[] = tipo === "promesa_compraventa"
    ? [{ id: "d9", nombre: "Comprobante de pago de arras", obligatorio: true, categoria: "Contrato" }]
    : []

  return [...docsContraparte, ...docsCodudor, ...docsPropietario, ...docsContrato]
}

interface GestionDocumentosClientProps {
  contratoId: string
}

export function GestionDocumentosClient({ contratoId }: GestionDocumentosClientProps) {
  const router = useRouter()
  const [tipo, setTipo]           = React.useState<TipoContrato>("arriendo")
  const [contratoHeader, setContratoHeader] = React.useState({ referencia: "—", inmueble: "—", propietario: "—", contraparte: "—", tieneCodudor: false })
  const [docsCargados, setDocsCargados]     = React.useState<DocCargado[]>([])
  const [cargando, setCargando]             = React.useState<string | null>(null)

  React.useEffect(() => {
    Promise.all([
      obtenerContrato(contratoId),
      listarDocumentos(contratoId),
    ])
      .then(([c, d]) => {
        const cd = c.data
        setTipo(cd.tipo)
        setContratoHeader({
          referencia:   cd.referencia,
          inmueble:     cd.inmueble.nombre,
          propietario:  cd.propietario.nombre,
          contraparte:  cd.contraparte.nombre,
          tieneCodudor: !!cd.codeudor,
        })
        setDocsCargados(d.data.map(doc => ({
          tipoDocId:    doc.tipo,
          nombreArchivo: doc.nombre,
          fechaCarga:   doc.fechaSubida ?? "",
          estado:       doc.estado,
          objectUrl:    doc.urlArchivo ?? "",
          apiDocId:     doc.id,
        })))
      })
      .catch(() => {})
  }, [contratoId])

  const labels    = LABELS_POR_TIPO[tipo]
  const documentos = getDocumentosPorTipo(tipo, contratoHeader.tieneCodudor)

  const obligatorios = documentos.filter((d) => d.obligatorio)
  const recibidos = docsCargados.filter((d) => d.estado === "recibido")
  const obligatoriosCompletos = obligatorios.every((d) =>
    docsCargados.some((c) => c.tipoDocId === d.id && c.estado === "recibido")
  )
  const progreso = obligatorios.length > 0
    ? Math.round((recibidos.filter((r) => obligatorios.some((o) => o.id === r.tipoDocId)).length / obligatorios.length) * 100)
    : 0

  // Libera todas las object URLs al desmontar el componente
  React.useEffect(() => {
    return () => {
      docsCargados.forEach((d) => URL.revokeObjectURL(d.objectUrl))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getDoc(tipoDocId: string): DocCargado | undefined {
    return docsCargados.find((d) => d.tipoDocId === tipoDocId)
  }

  async function handleCargar(tipoDocId: string, archivo: File) {
    const formatosPermitidos = ["application/pdf", "image/jpeg", "image/png"]
    if (!formatosPermitidos.includes(archivo.type)) return
    if (archivo.size > 10 * 1024 * 1024) return

    const doc = documentos.find(d => d.id === tipoDocId)
    if (!doc) return

    setCargando(tipoDocId)
    try {
      const res = await subirDocumento(contratoId, tipoDocId, doc.nombre, archivo)
      setDocsCargados((prev) => {
        const anterior = prev.find((d) => d.tipoDocId === tipoDocId)
        if (anterior && !anterior.apiDocId) URL.revokeObjectURL(anterior.objectUrl)
        const sinEste = prev.filter((d) => d.tipoDocId !== tipoDocId)
        return [...sinEste, {
          tipoDocId,
          nombreArchivo: archivo.name,
          fechaCarga: new Date().toLocaleDateString("es-CO"),
          estado: "recibido" as EstadoDoc,
          objectUrl: res.data.urlArchivo ?? URL.createObjectURL(archivo),
          apiDocId: res.data.id,
        }]
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cargar el documento")
    } finally {
      setCargando(null)
    }
  }

  // Agrupa los documentos por categoría
  const categorias = Array.from(new Set(documentos.map((d) => d.categoria)))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4">
        <Link href={`/contratos/${contratoId}`}>
          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold leading-none">Documentos del contrato</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {contratoHeader.referencia} · {contratoHeader.inmueble}
          </p>
        </div>
        <Badge variant="outline" className="ml-auto bg-gray-100 text-gray-600 border-gray-200">
          Borrador
        </Badge>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden justify-center">

        {/* Columna izquierda — lista de chequeo */}
        <div className="w-full max-w-2xl overflow-y-auto px-6 py-6 flex flex-col gap-6">

          {categorias.map((categoria) => {
            const docsCategoria = documentos.filter((d) => d.categoria === categoria)
            return (
              <section key={categoria} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {categoria}
                </h3>
                <div className="flex flex-col gap-2">
                  {docsCategoria.map((doc) => {
                    const docCargado = getDoc(doc.id)
                    const estado = docCargado?.estado ?? null
                    const nombreArchivo = docCargado?.nombreArchivo ?? null
                    const esCargando = cargando === doc.id

                    return (
                      <div
                        key={doc.id}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                          estado === "recibido" && "border-green-200 bg-green-50/50",
                          estado === "rechazado" && "border-destructive/30 bg-destructive/5",
                          !estado && "bg-background"
                        )}
                      >
                        {/* Ícono de estado */}
                        <div className={cn(
                          "size-8 rounded-full flex items-center justify-center shrink-0",
                          estado === "recibido" ? "bg-green-100" :
                          estado === "rechazado" ? "bg-destructive/10" :
                          "bg-muted"
                        )}>
                          <HugeiconsIcon
                            icon={
                              estado === "recibido" ? Tick02Icon :
                              estado === "rechazado" ? Cancel01Icon :
                              Clock01Icon
                            }
                            strokeWidth={2}
                            className={cn(
                              "size-4",
                              estado === "recibido" ? "text-green-600" :
                              estado === "rechazado" ? "text-destructive" :
                              "text-muted-foreground"
                            )}
                          />
                        </div>

                        {/* Info del documento */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{doc.nombre}</span>
                            {!doc.obligatorio && (
                              <Badge variant="outline" className="text-xs shrink-0">Opcional</Badge>
                            )}
                          </div>
                          {nombreArchivo && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <HugeiconsIcon
                                icon={nombreArchivo.endsWith(".pdf") ? PdfIcon : ImageIcon}
                                strokeWidth={2}
                                className="size-3 text-muted-foreground"
                              />
                              <span className="text-xs text-muted-foreground truncate">{nombreArchivo}</span>
                            </div>
                          )}
                        </div>

                        {/* Botón cargar */}
                        <label className={cn(
                          "shrink-0 cursor-pointer",
                          esCargando && "opacity-50 pointer-events-none"
                        )}>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const archivo = e.target.files?.[0]
                              if (archivo) handleCargar(doc.id, archivo)
                              e.target.value = ""
                            }}
                          />
                          <span className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                            estado === "recibido"
                              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                              : "border-border bg-background hover:bg-muted"
                          )}>
                            {esCargando ? (
                              "Cargando..."
                            ) : (
                              <>
                                <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} className="size-3" />
                                {estado === "recibido" ? "Reemplazar" : "Cargar"}
                              </>
                            )}
                          </span>
                        </label>

                        {/* Botón ver — solo cuando hay archivo cargado */}
                        {docCargado && (
                          <a
                            href={docCargado.objectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                          >
                            <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3" />
                            Ver
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {/* Columna derecha — panel de estado */}
        <aside className="w-80 shrink-0 border-l bg-muted/30 overflow-y-auto px-5 py-6 flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Estado</h2>

          {/* Partes del contrato */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Partes</p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">{labels.propietario}</span>
                <span className="font-medium text-xs truncate max-w-40 text-right">{contratoHeader.propietario}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">{labels.contraparte}</span>
                <span className="font-medium text-xs truncate max-w-40 text-right">{contratoHeader.contraparte}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Progreso */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">Documentos obligatorios</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">
                {recibidos.filter((r) => obligatorios.some((o) => o.id === r.tipoDocId)).length}
                <span className="text-base font-normal text-muted-foreground"> / {obligatorios.length}</span>
              </span>
              <span className="text-sm font-medium text-muted-foreground">{progreso}%</span>
            </div>
            {/* Barra de progreso */}
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progreso === 100 ? "bg-green-500" : "bg-primary"
                )}
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>

          <Separator />

          {/* Lista de documentos recibidos */}
          {docsCargados.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">Cargados</p>
              <div className="flex flex-col gap-1.5">
                {docsCargados.map((doc) => {
                  const tipo = documentos.find((d) => d.id === doc.tipoDocId)
                  return (
                    <div key={doc.tipoDocId} className="flex items-start gap-2">
                      <HugeiconsIcon icon={FileAttachmentIcon} strokeWidth={2} className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{tipo?.nombre}</p>
                        <p className="text-xs text-muted-foreground">{doc.fechaCarga}</p>
                      </div>
                      <a
                        href={doc.objectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs text-primary hover:underline"
                      >
                        Ver
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA — Enviar a firmas */}
          <div className="mt-auto flex flex-col gap-3">
            {!obligatoriosCompletos && (
              <p className="text-xs text-muted-foreground text-center">
                Faltan {obligatorios.length - recibidos.filter((r) => obligatorios.some((o) => o.id === r.tipoDocId)).length} documento(s) obligatorio(s)
              </p>
            )}
            <Button
              disabled={!obligatoriosCompletos}
              className="w-full"
              onClick={() => router.push(`/contratos/${contratoId}`)}
            >
              Enviar a firmas
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
