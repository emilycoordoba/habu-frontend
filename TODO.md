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
- [ ] UI-P02 — Registrar pago (selección de cobro, valor, fecha y comprobante)
- [ ] UI-P03 — Estado de cuenta (historial cronológico de pagos, mora e intereses)
- [ ] UI-P04 — Generar reporte de ingresos (filtros por periodo, cliente o inmueble)
- [ ] UI-P05 — Vista de cobros en mora (listado con intereses acumulados)

## Módulos pendientes (UI)
- [ ] Pagos y Mora
- [ ] Inmuebles
- [ ] Mantenimiento
- [ ] Clientes
- [ ] Administración
- [ ] Login / Autenticación

## Infraestructura pendiente
- [ ] Configurar `lib/api/axios.ts` con interceptores de JWT
- [ ] Implementar `lib/hooks/use-contratos.ts` con React Query
- [ ] Configurar `src/proxy.ts` con validación de JWT real
- [ ] Variables de entorno (`NEXT_PUBLIC_API_URL`)


## Decisiones de diseño pendientes
- [ ] **Contratos firmados manualmente**: definir si el sistema debe soportar cargar un PDF de contrato firmado fuera de DocuSign (no está contemplado en la documentación actual). Implica cambios en el modelo y en UI-C05.

## Documentación pendiente (Google Docs)
- [ ] Agregar entidad `TerminacionAnticipada` al modelo de datos (ver `docs/Documento_Proyecto.md` para los campos completos)
- [ ] Actualizar Google Docs del proyecto con el campo `modalidad` (arriendo / venta / ambos) en la entidad `Inmueble` y en RF-13
- [ ] Agregar `precio_venta` al ENUM `Cobro.tipo` — el pago del precio total al vendedor no estaba contemplado en el modelo original
- [ ] Agregar `comision_colocacion` y `comision_administracion` al ENUM `Cobro.tipo` (reemplaza el genérico `comisión`)
- [ ] Agregar campos `incluye_administracion` (BOOLEAN) y `comision_colocacion` (DECIMAL) a la entidad `ContratoArriendo`
- [ ] Actualizar RF-08 para incluir configuración de comisión de colocación además de comisión de administración

## TODO propio
- [ ] full page sheet no funciona
- [ ] lista de tabs centrada tambien en detalles de contrato