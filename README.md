# Sistema de Gestión Inmobiliaria (Habu) — Frontend

Aplicación web para la gestión integral de una empresa inmobiliaria: inmuebles, clientes, contratos de arriendo y compraventa, pagos y mora, mantenimiento y un chatbot de captación. Construida con Next.js 16 App Router, conectada por API REST a un backend propio en Node/Express/TypeScript.

## Demo en vivo

| | URL | |
|---|---|---|
| **App (Vercel)** | `<PENDIENTE: pegar URL de Vercel>` | Iniciar sesión con los usuarios de prueba de abajo |
| **API (Render)** | https://habu-app-backend.onrender.com | Verificar en `/health` → `estado: ok` |

**Usuarios de prueba:**

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@habu.com.co` | `admin123` |
| Asesor | `asesor@habu.com.co` | `asesor123` |

> El backend corre en el plan Free de Render y "duerme" tras ~15 min de inactividad: la primera petición tras dormir tarda ~30–50 s. Si al entrar ves errores, abre primero `https://habu-app-backend.onrender.com/health` para despertarlo y recarga.

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
# URL base del backend (sin barra final, sin /api)
# Producción: la URL de Render. Local: http://localhost:4000
NEXT_PUBLIC_API_URL=https://habu-app-backend.onrender.com
```

> `NEXT_PUBLIC_*` se incrusta en el bundle en tiempo de build: al cambiarla hay que reiniciar `npm run dev` (o redeployar) para que tome efecto.

## Decisiones técnicas

- **Server Components por defecto.** Solo se marca `"use client"` cuando hace falta interactividad (formularios, hooks, mapas). Reduce el JS que llega al navegador.
- **Un único punto de acceso al token.** Toda la sesión JWT vive en `lib/session.ts` (localStorage). Ningún componente lee el token directo. El interceptor de `lib/api/axios.ts` lo adjunta en cada request y, ante un `401`, limpia la sesión y redirige a `/login`.
- **Recarga por `retryKey`, no por estado local.** Tras crear/editar/eliminar, se incrementa un `retryKey` que re-dispara el `useEffect` de carga, en vez de mutar el estado a mano. Menos bugs de sincronización entre la UI y el servidor.
- **Colores de estado centralizados.** Los badges de estado/prioridad y las alertas usan clases compartidas (`.badge-*`, `.alert-*`) definidas una sola vez en `globals.css`, cada una con su variante de modo oscuro. Cambiar un color = un solo lugar, no N archivos.
- **Frontend y backend desacoplados por contrato.** El frontend no sabe nada del almacenamiento del backend: consume formas de respuesta fijas (`{ data }` / `{ error }`). El backend arrancó con datos en memoria y puede migrar a Postgres sin tocar el frontend.
- **Limitación conocida (honesta).** La protección de rutas hoy depende del interceptor `401` del lado del cliente; el middleware server-side (`src/proxy.ts`) está pendiente porque requiere migrar el token de localStorage a una cookie legible en el edge. Los roles (`administrador` | `asesor`) son estáticos en el frontend.

## Estado actual

La UI está completa para los 9 módulos, cada uno conectado a su capa de API contra el backend Node/Express, ya desplegado en Render. Si el backend está dormido (plan Free), los componentes muestran estado de error con botón de reintentar y caen a los datos mock como referencia.

Ver `TODO.md` para el detalle de tareas pendientes y decisiones de diseño abiertas.
