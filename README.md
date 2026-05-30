# Sistema de Gestión Inmobiliaria — Frontend

Aplicación web para la gestión integral de inmuebles, contratos, clientes, pagos y mantenimiento de una empresa inmobiliaria. Construida con Next.js 16 App Router, conectada a la capa de API REST del backend Python.

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI base | React 19 + TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| Componentes | shadcn/ui + Radix UI |
| Iconos | @hugeicons/react |
| Tablas | @tanstack/react-table |
| Gráficos | Recharts |
| Editor de texto | TipTap 3 |
| Mapas | React Leaflet |
| Validación | Zod |
| Notificaciones | Sonner |
| Temas | next-themes |

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/          # Rutas públicas: login, recuperar/restablecer contraseña
│   └── (dashboard)/     # Rutas protegidas (sidebar + header)
│       ├── administracion/   # Usuarios, roles, comisiones, documentos, parámetros, plantillas
│       ├── chatbot/          # Bandeja de solicitudes y detalle
│       ├── clientes/         # Lista, detalle, registro de clientes y visitas
│       ├── contratos/        # Ciclo completo de contratos (arriendo y compraventa)
│       ├── inmuebles/        # Registro y gestión de inmuebles
│       ├── mantenimiento/    # Solicitudes, proveedores y seguimiento
│       ├── mi-cuenta/        # Perfil, seguridad y notificaciones
│       └── pagos/            # Cobros, mora, reportes de ingresos
├── components/
│   ├── administracion/
│   ├── auth/            # Login, recuperar y restablecer contraseña
│   ├── chatbot/
│   ├── clientes/
│   ├── contratos/
│   ├── cuenta/
│   ├── inmuebles/
│   ├── mantenimiento/
│   ├── pagos/
│   └── ui/              # Componentes base de shadcn
├── lib/
│   ├── api/             # Clientes HTTP por módulo (conectados al backend)
│   ├── mock/            # Datos de prueba (fallback mientras el backend no está activo)
│   ├── schemas/         # Esquemas Zod
│   └── session.ts       # Gestión de sesión JWT (localStorage)
└── types/               # Tipos globales por módulo
```

## Módulos implementados

| Módulo | Interfaces | UI | API conectada |
|---|---|---|---|
| Autenticación | Login, recuperar, restablecer contraseña | ✅ | ✅ |
| Inmuebles | UI-I01 a UI-I04 | ✅ | ✅ |
| Clientes | UI-CL01 a UI-CL04 | ✅ | ✅ |
| Contratos | UI-C01 a UI-C09 | ✅ | ✅ |
| Pagos y Mora | UI-P01 a UI-P05 | ✅ | ✅ |
| Administración | UI-A01 a UI-A07 | ✅ | ✅ |
| Mantenimiento | UI-M01 a UI-M07 | ✅ | ✅ |
| Chatbot | UI-CH01 a UI-CH03 | ✅ | ✅ |
| Mi Cuenta | UI-ACC01 | ✅ | ✅ |

## Capa de API

Todos los módulos tienen su cliente HTTP en `src/lib/api/`:

| Archivo | Módulo |
|---|---|
| `auth.ts` | Login, recuperar y restablecer contraseña |
| `cuenta.ts` | Perfil del usuario autenticado, notificaciones |
| `inmuebles.ts` | Inmuebles, fotos, historial |
| `clientes.ts` | Clientes, visitas, interacciones |
| `contratos.ts` | Contratos, documentos, firmas |
| `pagos.ts` | Cobros, pagos, mora, reportes |
| `administracion.ts` | Usuarios, esquemas, parámetros, documentos, plantillas |
| `mantenimiento.ts` | Solicitudes de mantenimiento, proveedores |
| `chatbot.ts` | Solicitudes del chatbot público y bandeja interna |

El interceptor en `axios.ts` adjunta el JWT en cada request y redirige a `/login` ante un `401`.

## Comandos

```bash
# Desarrollo (con Turbopack)
npm run dev

# Build de producción
npm run build

# Verificar tipos
npm run typecheck

# Lint
npm run lint
```

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=https://api.habu.com.co   # URL base del backend
```

## Estado actual

La UI está completa para todos los módulos y cada uno tiene su capa de API conectada. El backend (Python/Django) aún no está desplegado — mientras tanto los componentes muestran estado de error con botón de reintentar, usando los datos mock como referencia de desarrollo.

Ver `TODO.md` para el detalle de tareas pendientes y decisiones de diseño abiertas.
