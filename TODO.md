# TODO — Sistema de Gestión Inmobiliaria (Frontend)

## Módulo Contratos — UI
- [x] UI-C01 — Lista de contratos (vista general con filtros por estado, tipo y asesor)
- [x] UI-C02 — Iniciar contrato (selección de inmueble, tipo y partes involucradas)
- [x] UI-C03 — Formulario contrato de arriendo (canon, fechas, depósito, administración)
- [x] UI-C04 — Formulario promesa de compraventa (precio, arras, forma de pago, fecha escrituración)
- [x] UI-C05 — Gestión de documentos (lista de chequeo y carga de archivos)
- [x] UI-C06 — Detalle de contrato (estado actual, partes, documentos y firmas)
- [x] UI-C07 — Registrar escrituración (fecha, notaría, pagos pendientes, certificado de tradición)
- [x] UI-C08 — Registrar terminación anticipada (causa, penalizaciones, fecha de entrega)
- [x] UI-C09 — Gestionar vencimiento y renovación (alerta, decisión de renovar o finalizar)

### Pendientes de UI-C01 al conectar la API
- [ ] Conectar filtros a `searchParams` de Next.js para que sean persistentes en URL
- [ ] Conectar paginación a datos reales (pasar `page`, `pageSize`, `total` desde la API)
- [ ] Reemplazar `CONTRATOS_MOCK` con hook `useContratos()`
- [ ] Poblar filtro "Asesor" dinámicamente desde la API

## Módulo Pagos y Mora — UI
- [x] UI-P01 — Lista de cobros de un contrato (estado, fecha límite, valor)
- [x] UI-P02 — Registrar pago (selección de cobro, valor, fecha y comprobante)
- [x] UI-P03 — Estado de cuenta (historial cronológico de pagos, mora e intereses)
- [x] UI-P04 — Generar reporte de ingresos (filtros por periodo, cliente o inmueble)
- [x] UI-P05 — Vista de cobros en mora (listado con intereses acumulados)

## Módulo Inmuebles — UI
- [x] UI-I01 — Lista de inmuebles (filtros por tipo, estado, modalidad; cards de resumen)
- [x] UI-I02 — Registrar inmueble (página completa: datos + galería de fotos)
- [x] UI-I03 — Detalle del inmueble (tabs: Info / Fotos / Historial de cambios)
- [x] UI-I04 — Editar inmueble (misma página que UI-I02, modo edición)

## Módulo Administración — UI
- [x] UI-A01 — Lista de usuarios (tabla con filtros, activar/desactivar, crear/editar via dialog)
- [x] UI-A02 — incluido en UI-A01 (dialog crear/editar usuario)
- [x] UI-A03 — Roles y permisos (matriz de permisos por módulo, solo lectura)
- [x] UI-A04 — Esquemas de comisión (CRUD + panel de asignación a asesores)
- [x] UI-A05 — Documentos requeridos (tabla CRUD con toggle de obligatorio)
- [x] UI-A06 — Parámetros del sistema (mora, alertas, comisiones por defecto)
- [x] UI-A07 — Plantillas de documentos (editor TipTap + paleta de variables + preview)

## Módulo Clientes — UI
- [x] UI-CL01 — Lista de clientes (tabla con filtros por tipo y búsqueda por nombre/documento)
- [x] UI-CL02 — Registrar / Editar cliente (datos personales, tipo, persona natural o jurídica)
- [ ] UI-CL03 — Detalle del cliente (tabs: datos, inmuebles asociados, contratos, historial de interacciones)
- [ ] UI-CL04 — Registrar visita (cliente, inmueble, fecha/hora, notas)

## Módulos pendientes (UI)
- [x] Pagos y Mora
- [x] Inmuebles
- [ ] Mantenimiento
- [ ] Clientes
- [x] Administración (UI-A01 a UI-A06 completos; UI-A07 prioridad baja)
- [x] Login / Autenticación
- [ ] Chatbot

## Infraestructura pendiente
- [ ] Configurar `lib/api/axios.ts` con interceptores de JWT
- [ ] Implementar `lib/hooks/use-contratos.ts` con React Query
- [ ] Configurar `src/proxy.ts` con validación de JWT real
- [ ] Variables de entorno (`NEXT_PUBLIC_API_URL`)


## Decisiones de diseño pendientes
- [ ] **Generación de PDF de contratos**: definir estrategia para cuando se conecte la API. Opciones evaluadas en `docs/pdf-generacion-opciones.md`. Recomendación: generación server-side (Puppeteer o PDFLib) para garantizar PDFs idénticos independiente del browser. Alternativa frontend: `@react-pdf/renderer` si no hay backend disponible.


- [ ] **Contratos firmados manualmente**: definir si el sistema debe soportar cargar un PDF de contrato firmado fuera de DocuSign (no está contemplado en la documentación actual). Implica cambios en el modelo y en UI-C05.
- [x] **Pagos parciales**: no se soportan en esta versión. El cobro permanece en mora hasta recibir el monto completo. El asesor registra el pago solo cuando tiene el valor total.
- [ ] **Usuario con roles Administrador + Asesor simultáneos**: el modelo lo permite (UsuarioRol es muchos-a-muchos). Definir si un administrador con rol asesor activo recibe comisiones por contratos gestionados (`AsesorComision`). Considerar si Administrador debe ser superconjunto explícito de Asesor o si la combinación debe restringirse.

## Documentación pendiente (Google Docs)

> El archivo `docs/Documento_Proyecto.md` local ya está actualizado. Estos cambios aún deben reflejarse en Google Docs.

### Modelo de datos
- [ ] Agregar campo `tipo` (propietario / arrendatario / prospecto / **codeudor**) a `Cliente`
- [ ] Agregar campo `codeudor_id` (FK → Cliente, nullable) a `ContratoArriendo`
- [ ] Agregar entidad `TerminacionAnticipada`
- [ ] Agregar campo `notas` (TEXT, opcional) a `Pago`
- [ ] Agregar campo `modalidad` (arriendo / venta / ambos) a `Inmueble`
- [ ] Agregar campos `incluye_administracion` y `comision_colocacion` a `ContratoArriendo`
- [ ] Actualizar ENUM `Cobro.tipo` (comision_administracion, comision_colocacion, precio_venta)
- [ ] Agregar campo `pagado_con_mora` (INT, nullable) a `Cobro`
- [ ] Agregar campo `descripcion` (VARCHAR, nullable) a `FotografiaInmueble`
- [ ] Agregar entidad `ParametroSistema` (mora, alertas)
- [ ] Actualizar `EsquemaComision`: añadir `tipo`, `porcentaje_inmobiliaria`, `porcentaje_asesor`; eliminar `porcentaje`

### Requisitos funcionales
- [ ] Actualizar RF-08 (modelo de dos tasas en EsquemaComision)
- [ ] Actualizar RF-12 (especificar parámetros concretos de ParametroSistema)
- [ ] Actualizar RF-13 para incluir `modalidad` en el registro de inmuebles
- [ ] Agregar RF nuevo: cobro de comisión de colocación al activar arriendo sin administración

### Casos de uso
- [ ] Actualizar CU_05: flujo con tipo + dos porcentajes + simulador
- [ ] Actualizar CU_06: flujo correcto (seleccionar esquema primero, luego asignar asesores)

## TODO propio
- [ ] full page sheet no funciona
- [ ] lista de tabs centrada tambien en detalles de contrato
- animaciones, transiciones
- mejorar pdf reportes de ingresos
- 