# TODO — Sistema de Gestión Inmobiliaria (Frontend)

## Estado general

Todos los módulos de UI están completos y conectados a la capa de API REST. El backend aún no está desplegado.

---

## Módulo Contratos

- [x] UI-C01 — Lista de contratos
- [x] UI-C02 — Iniciar contrato
- [x] UI-C03 — Formulario contrato de arriendo
- [x] UI-C04 — Formulario promesa de compraventa
- [x] UI-C05 — Gestión de documentos
- [x] UI-C06 — Detalle de contrato
- [x] UI-C07 — Registrar escrituración
- [x] UI-C08 — Registrar terminación anticipada
- [x] UI-C09 — Gestionar vencimiento y renovación

### Pendiente al activar el backend
- [ ] Paginación server-side en UI-C01 (pasar `page` / `pageSize` desde la URL, actualmente `limit: 200`)
- [ ] Filtro "Asesor" dinámico desde la API (actualmente hardcoded)
- [ ] Conectar filtros a `searchParams` de Next.js para que sean persistentes en URL

---

## Módulo Pagos y Mora

- [x] UI-P01 — Lista de cobros de un contrato
- [x] UI-P02 — Registrar pago
- [x] UI-P03 — Estado de cuenta
- [x] UI-P04 — Generar reporte de ingresos
- [x] UI-P05 — Vista de cobros en mora

---

## Módulo Inmuebles

- [x] UI-I01 — Lista de inmuebles
- [x] UI-I02 — Registrar inmueble
- [x] UI-I03 — Detalle del inmueble
- [x] UI-I04 — Editar inmueble

### Pendiente al activar el backend
- [ ] Paginación server-side en UI-I01 (actualmente `limit: 200`)

---

## Módulo Administración

- [x] UI-A01 — Lista de usuarios
- [x] UI-A02 — incluido en UI-A01 (dialog crear/editar usuario)
- [x] UI-A03 — Roles y permisos (solo lectura, hardcoded)
- [x] UI-A04 — Esquemas de comisión
- [x] UI-A05 — Documentos requeridos
- [x] UI-A06 — Parámetros del sistema
- [x] UI-A07 — Plantillas de documentos

---

## Módulo Clientes

- [x] UI-CL01 — Lista de clientes
- [x] UI-CL02 — Registrar / Editar cliente
- [x] UI-CL03 — Detalle del cliente
- [x] UI-CL04 — Registrar visita (sheet lateral)
  - [ ] Pendiente: campo `estado` (pendiente/confirmada/cancelada) — requiere decisión de diseño

### Pendiente al activar el backend
- [ ] Paginación server-side en UI-CL01 (actualmente `limit: 200`)

---

## Módulo Cuenta

- [x] UI-ACC01 — Mi cuenta (datos personales, seguridad, notificaciones)
  - [ ] Pendiente: flujo de notificación "Nuevo contrato asignado" (requiere backend)

---

## Módulo Mantenimiento

- [x] UI-M01 — Lista de solicitudes
- [x] UI-M02 — Registrar solicitud
- [x] UI-M03 — Detalle de solicitud
- [x] UI-M04 — Asignar proveedor
- [x] UI-M05 — Actualizar estado / registrar avance
- [x] UI-M06 — Cerrar solicitud (costo + factura)
- [x] UI-M07 — Gestión de proveedores (CRUD)

---

## Módulo Chatbot

- [x] UI-CH01 — Portal de chat (público)
- [x] UI-CH02 — Bandeja de solicitudes entrantes
- [x] UI-CH03 — Detalle de solicitud

---

## Autenticación

- [x] Login (POST /auth/login → setSession → redirect)
- [x] Recuperar contraseña (POST /auth/recuperar)
- [x] Restablecer contraseña (POST /auth/restablecer con `?token=`)
- [x] Logout (clearSession + redirect)
- [x] Interceptor 401 → clearSession + redirect /login
- [ ] `src/proxy.ts` → middleware real de Next.js (requiere migrar token a cookie httpOnly)
- [ ] Cierre automático de sesión por inactividad (RS-09)
- [ ] Bloqueo temporal tras intentos fallidos (RS-06)

---

## Infraestructura pendiente

- [ ] Variables de entorno de producción (`NEXT_PUBLIC_API_URL`)
- [ ] Despliegue del backend Python
- [ ] Middleware de rutas (`src/proxy.ts`) — protección server-side

---

## Decisiones de diseño pendientes

- [ ] **Generación de PDF de contratos**: ver `docs/pdf-generacion-opciones.md`. Recomendación: generación server-side (Puppeteer o PDFLib).
- [ ] **Contratos firmados manualmente**: definir si el sistema debe soportar cargar un PDF de contrato firmado fuera de DocuSign.
- [x] **Pagos parciales**: no se soportan. El cobro permanece en mora hasta recibir el monto completo.
- [ ] **Usuario con roles Administrador + Asesor simultáneos**: definir si un administrador con rol asesor activo recibe comisiones.
- [ ] **Estado de visitas en Clientes** (UI-CL04): ¿el asesor puede actualizar pendiente → confirmada/cancelada desde el historial?

---

## Mejoras UI pendientes

- [ ] Animaciones y transiciones entre páginas
- [ ] Full-page sheet — actualmente no funciona correctamente
- [ ] Mejorar layout del PDF de reportes de ingresos
- [x] **Bordes de tarjetas en modo oscuro** — CORREGIDO 2026-07-08. Causa: `.dark` usaba bordes translúcidos (`oklch(1 0 0 / 10%)`) → turbios y de color inconsistente según el fondo. Fix en `globals.css`: `--border`→`oklch(0.32 0 0)`, `--input`→`oklch(0.37 0 0)`, `--sidebar-border`→`oklch(0.32 0 0)` (grises opacos, línea nítida). Todo lo hereda vía `border-border`.
- [x] **Chatbot — imágenes de fachada** — CORREGIDO 2026-07-08/09. 10 fotos reales de Unsplash (licencia comercial libre) en `frontend/public/inmuebles/` (casa-fachada-1, edificio-1/2, local-comercial-1/2, cocina-1/2, habitacion-1/2, sala-1). Seed del backend (`seed/mock/inmuebles.ts`) reapuntado a rutas locales `/inmuebles/*.jpg`. Verificado en local (`.env.local`→`http://localhost:4000`). **Pendiente:** replicar el cambio en `frontend/lib/mock/inmuebles.ts` (aún tiene placehold.co) y redeploy backend→Render para que se vea en la URL pública.
- [x] **Badges de estado en modo oscuro** — CORREGIDO 2026-07-09. Los badges de páginas internas usaban tríadas hardcodeadas `bg-*-100 text-*-700 border-*-200` (sin variante `.dark`) → ilegibles en oscuro. Fix: rutados a las clases compartidas `.badge-*` de `globals.css` (que ya definen su variante `.dark`). Archivos: mantenimiento (detalle, asignar-proveedor, proveedores), clientes/detalle-cliente, contratos (escrituracion, formulario-arriendo, formulario-promesa, gestion-documentos), inmuebles/detalle-inmueble (unificado). 
- [ ] **Selection-cards de prioridad/estado en modo oscuro** — `mantenimiento/registrar-solicitud` (PRIORIDAD_INFO) y `mantenimiento/actualizar-estado` (TRANSICIONES) usan `bg-*-50 border-*-300 text-*-700` en tarjetas grandes seleccionables (NO son badges). Requieren verse con la app en oscuro antes de tocar — no reusan `.badge-*` porque su borde `-300` pelearía. Decidir si crear `.select-card-*` o ajustar inline.

---

## Documentación pendiente (Google Docs / Documento_Proyecto.md)

Ver respuesta del asistente para el detalle de qué actualizar en `docs/Documento_Proyecto.md`.
