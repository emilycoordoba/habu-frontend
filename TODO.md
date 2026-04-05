# TODO — Sistema de Gestión Inmobiliaria (Frontend)

## Módulo Contratos — UI
- [x] UI-C01 — Lista de contratos (vista general con filtros por estado, tipo y asesor)
- [ ] UI-C02 — Iniciar contrato (selección de inmueble, tipo y partes involucradas)
- [ ] UI-C03 — Formulario contrato de arriendo (canon, fechas, depósito, administración)
- [ ] UI-C04 — Formulario promesa de compraventa (precio, arras, forma de pago, fecha escrituración)
- [ ] UI-C05 — Gestión de documentos (lista de chequeo y carga de archivos)
- [ ] UI-C06 — Detalle de contrato (estado actual, partes, documentos y firmas)
- [ ] UI-C07 — Registrar escrituración (fecha, notaría, pagos pendientes, certificado de tradición)
- [ ] UI-C08 — Registrar terminación anticipada (causa, penalizaciones, fecha de entrega)
- [ ] UI-C09 — Gestionar vencimiento y renovación (alerta, decisión de renovar o finalizar)

### Pendientes de UI-C01 al conectar la API
- [ ] Conectar filtros a `searchParams` de Next.js para que sean persistentes en URL
- [ ] Conectar paginación a datos reales (pasar `page`, `pageSize`, `total` desde la API)
- [ ] Reemplazar `CONTRATOS_MOCK` con hook `useContratos()`
- [ ] Poblar filtro "Asesor" dinámicamente desde la API

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
