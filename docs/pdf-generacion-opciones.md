# Opciones de generación de PDF para plantillas de contratos

## Contexto

La UI de plantillas (UI-A07) actualmente genera PDFs abriendo el preview HTML en una ventana nueva y llamando `window.print()`. Este documento resume las alternativas para cuando se conecte la API y se necesite una solución más robusta.

---

## Comparativa de enfoques

### 1. `window.print()` + CSS `@media print` ← implementación actual
- Control limitado: márgenes, saltos de página, ocultar elementos
- El resultado depende del navegador y la impresora del usuario
- Sin control sobre metadatos, numeración, encabezados/pies de página consistentes
- **Adecuado para**: previews rápidos durante desarrollo / mocks

### 2. `jsPDF` + `html2canvas` (cliente, npm)
- Convierte HTML → canvas → PDF usando JavaScript en el browser
- **Problema grave**: renderiza píxeles, no texto — el PDF no es seleccionable ni buscable
- Útil solo para contenido muy visual (gráficas, badges), no para contratos legales

### 3. `@react-pdf/renderer` (cliente, npm)
- Define el documento con componentes React (`<Document>`, `<Page>`, `<Text>`)
- Genera PDF real con texto seleccionable, fuentes embebidas, márgenes exactos
- **Trade-off**: hay que abandonar el HTML del TipTap y redefinir la estructura en su propio DSL — más trabajo, pero control total sobre el layout
- **Adecuado para**: si se quiere mantener todo en el frontend sin backend

### 4. Puppeteer / Playwright en el servidor (Node.js)
- El servidor lanza un Chrome headless, carga la página y exporta PDF
- Control perfecto: exactamente lo que se ve en el browser, pero reproducible para todos los usuarios
- **Trade-off**: requiere backend, lento (~2–3 s por PDF), costoso en entornos serverless

### 5. Librería server-side: `pdfkit`, `PDFLib` (Node.js) o WeasyPrint (Python)
- Construye el PDF programáticamente desde el backend
- PDF semántico, accesible, con metadatos, firmas digitales posibles
- **Trade-off**: máximo trabajo de implementación, pero es el estándar para documentos legales formales

---

## Recomendación para este proyecto

Para la fase actual (mocks, sin API) la solución Blob URL + `window.print()` es correcta.

Cuando se conecte la API, lo más pragmático para contratos legales es **opción 4 o 5 en el backend**: el servidor genera el PDF a partir del contenido de la plantilla + datos reales del contrato, y el frontend solo descarga el archivo. Esto garantiza que el PDF sea idéntico para todos los usuarios, independiente del browser.

`@react-pdf/renderer` (opción 3) es un punto medio si se quiere mantener todo en el frontend, pero requeriría parsear el HTML del TipTap y traducirlo al sistema de layout de la librería.
