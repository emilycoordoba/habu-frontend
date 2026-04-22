# CLAUDE.md — Sistema de Gestión Inmobiliaria (Frontend)

## Contexto del proyecto

Frontend de un sistema inmobiliario. Next.js 16 App Router con shadcn/ui. Los datos son mock — la API real (backend Python) aún no está conectada.

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
├── (auth)/          # Rutas públicas (sin sidebar)
└── (dashboard)/     # Rutas con layout del dashboard (sidebar + header)
    ├── administracion/
    ├── clientes/
    ├── contratos/
    ├── inmuebles/
    ├── mantenimiento/
    └── pagos/
```

Cada módulo tiene su propio layout si necesita tabs o contexto. Las subrutas dinámicas usan `[id]`.

## Convenciones de código

- **Idioma**: español para nombres de variables de negocio (`contrato`, `inmueble`, `canon`), inglés para código genérico (`handleSubmit`, `isLoading`, `data`).
- **Componentes**: PascalCase. Archivos: kebab-case (`contrato-form.tsx`).
- **Server vs Client**: preferir Server Components; agregar `"use client"` solo cuando sea necesario (interactividad, hooks, efectos).
- **Mock data**: en `src/lib/mock/`. Todos los componentes usan datos mock hasta que se conecte la API.
- **Tipos**: definidos en `src/types/` por módulo (`contrato.types.ts`, `inmueble.types.ts`, `pago.types.ts`).
- **No usar** `any`. Tipar correctamente o usar `unknown`.

## Flujo de trabajo con Git

- Crear rama por feature/UI antes de empezar (`git checkout -b feat/ui-cl01`).
- Hacer commit después de cada fix o pantalla completada — no acumular cambios.
- Rama principal para PRs: `ui-[modulo]`.
- Formato de commits: `feat(ui-xxx): descripción` / `fix(ui-xxx): descripción`.

## Decisiones de diseño establecidas

- **Pagos parciales**: no soportados en esta versión. Un cobro permanece en mora hasta recibir el monto completo.
- **PDF de contratos**: pendiente de definir. Ver `TODO.md` → "Decisiones de diseño pendientes".
- **Sidebar**: componente `<AppSidebar>` en `src/components/app-sidebar.tsx`. No modificar la estructura sin revisar el layout del dashboard.

## Lo que está incompleto (no tocar sin contexto)

- `src/proxy.ts` — interceptor JWT, pendiente de implementar.
- `src/lib/api/` — clientes HTTP, aún no conectados a backend.
- Módulo Clientes (UI-CL01 a UI-CL04) — pendiente de construir.
- Módulo Mantenimiento — pendiente.
- Módulo Chatbot — pendiente.
