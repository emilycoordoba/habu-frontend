# TODO — Sistema de Gestión Inmobiliaria (Frontend)

## UI-C01 — Lista de contratos
- [ ] Conectar filtros a `searchParams` de Next.js para que sean persistentes en URL
- [ ] Conectar paginación a datos reales (pasar `page`, `pageSize`, `total` desde la API)
- [ ] Reemplazar `CONTRATOS_MOCK` con hook `useContratos()` al conectar la API
- [ ] Poblar filtro "Asesor" dinámicamente desde la API

## Interfaces pendientes — Módulo Contratos
- [ ] UI-C02 — Formulario iniciar contrato
- [ ] UI-C03 — Gestión de documentos del contrato
- [ ] UI-C04 — Proceso de escrituración
- [ ] UI-C05 — Flujo de terminación de contrato
- [ ] UI-C06 — Detalle del contrato
- [ ] UI-C07 — Renovación de contrato
- [ ] UI-C08 — Historial y auditoría
- [ ] UI-C09 — Reporte / exportación

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
