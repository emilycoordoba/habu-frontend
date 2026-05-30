# CLAUDE.md — Sistema de Gestión Inmobiliaria (Frontend)

## Contexto del proyecto

Frontend de un sistema inmobiliario. Next.js 16 App Router con shadcn/ui. La UI está completa para todos los módulos y la capa de API REST está conectada. El backend Python aún no está desplegado — los componentes muestran error con reintentar cuando no hay respuesta.

## Stack

- **Framework**: Next.js 16 App Router + Turbopack
- **Estilos**: Tailwind CSS 4 (usa sintaxis nueva: `@theme`, `@layer`, etc.)
- **Componentes**: shadcn/ui (configurado en `components.json`), Radix UI
- **Iconos**: `@hugeicons/react` — usar siempre este paquete, nunca lucide-react ni otros
- **Tablas**: `@tanstack/react-table` con el wrapper `<DataTable>` en `src/components/data-table.tsx`
- **Validación de forms**: Zod (esquemas en `src/lib/schemas/`)
- **Notificaciones toast**: `sonner` — usar `toast.success()`, `toast.error()`, etc.
- **Editor rich text**: TipTap 3 (usado en UI-A07 plantillas de documentos)

## Estructura de rutas

```
src/app/
├── (auth)/          # Rutas públicas (sin sidebar): login, recuperar-password, restablecer-password
└── (dashboard)/     # Rutas con layout del dashboard (sidebar + header)
    ├── administracion/
    ├── chatbot/
    ├── clientes/
    ├── contratos/
    ├── inmuebles/
    ├── mantenimiento/
    ├── mi-cuenta/
    └── pagos/
```

Cada módulo tiene su propio layout si necesita tabs o contexto. Las subrutas dinámicas usan `[id]`.

## Arquitectura de API

- **`src/lib/session.ts`** — gestión de sesión JWT en localStorage: `getToken`, `getUsuario`, `setSession`, `clearSession`. Único punto de acceso al token en todo el frontend.
- **`src/lib/api/axios.ts`** — instancia axios con interceptor de request (adjunta JWT) y response (maneja 401 → clearSession + redirect `/login`).
- **`src/lib/api/[modulo].ts`** — un archivo por módulo con todas las funciones de API tipadas.
- **Patrón de respuesta**: el interceptor desenvuelve `response.data` → las funciones reciben el body directamente. Arrays usan `res.data ?? []`, objetos usan `res.data ?? DEFAULTS`.

## Convenciones de código

- **Idioma**: español para nombres de variables de negocio (`contrato`, `inmueble`, `canon`), inglés para código genérico (`handleSubmit`, `isLoading`, `data`).
- **Componentes**: PascalCase. Archivos: kebab-case (`contrato-form.tsx`).
- **Server vs Client**: preferir Server Components; agregar `"use client"` solo cuando sea necesario (interactividad, hooks, efectos).
- **Mock data**: en `src/lib/mock/`. Se mantienen como referencia y fallback de desarrollo — no borrar.
- **Tipos**: definidos en `src/types/` por módulo (`contrato.types.ts`, `inmueble.types.ts`, `pago.types.ts`, `mantenimiento.types.ts`, `chatbot.types.ts`).
- **No usar** `any`. Tipar correctamente o usar `unknown`.

## Patrones de componentes cliente establecidos

- **Carga**: `useState` + `useEffect` con `let cancelado = false` para evitar setState en componentes desmontados.
- **Reintentar**: `retryKey` — incrementar para re-disparar el `useEffect`.
- **Recargar tras mutación**: incrementar `retryKey` después de crear/editar/eliminar en lugar de actualizar el estado local.
- **Skeleton loading**: `animate-pulse` con la misma estructura visual del componente cargado.
- **Error state**: mensaje + botón "Reintentar" que incrementa `retryKey`.
- **Toggle optimista** (ej. notificaciones, obligatorio en documentos): actualizar UI inmediatamente, revertir si la API falla.
- **Upload de archivos**: `FormData` con `Content-Type: multipart/form-data` — el browser establece el boundary automáticamente.

## Flujo de trabajo con Git

- Crear rama por feature/UI antes de empezar (`git checkout -b feat/ui-cl01`).
- Hacer commit cuando la usuaria lo indique — no proactivamente.
- Rama principal para PRs: `ui-[modulo]`.
- Formato de commits: `feat(ui-xxx): descripción` / `fix(ui-xxx): descripción`.

## Decisiones de diseño establecidas

- **Pagos parciales**: no soportados en esta versión. Un cobro permanece en mora hasta recibir el monto completo.
- **PDF de contratos**: pendiente de definir. Ver `TODO.md` → "Decisiones de diseño pendientes".
- **Sidebar**: componente `<AppSidebar>` en `src/components/app-sidebar.tsx`. Lee el usuario de `getUsuario()` en `useEffect`. El ítem "Administración" solo es visible para rol `administrador`.
- **Roles**: son estáticos en el frontend (`administrador` | `asesor`). `roles-client.tsx` es hardcoded — no llama a la API.
- **Autenticación**: JWT en `localStorage` vía `src/lib/session.ts`. El middleware `src/proxy.ts` está pendiente de implementar — la protección de rutas actualmente depende del interceptor 401 de axios.

## Lo que está incompleto (no tocar sin contexto)

- `src/proxy.ts` — middleware Next.js para protección de rutas, pendiente. Requiere cambiar el almacenamiento del token a cookie para que sea legible en edge.
- Módulo Clientes (UI-CL04): campo `estado` de visitas (pendiente/confirmada/cancelada) — requiere decisión de diseño.
- Paginación server-side en Contratos, Inmuebles y Clientes — actualmente client-side con `limit: 200`.
