# Sistema de Gestión Inmobiliaria — Frontend

Aplicación web para la gestión integral de inmuebles, contratos, clientes y pagos de una empresa inmobiliaria. Construida con Next.js 16 App Router.

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
| Drag & Drop | @dnd-kit |
| Validación | Zod |
| Notificaciones | Sonner |
| Temas | next-themes |

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/          # Rutas públicas: login, recuperar contraseña
│   └── (dashboard)/     # Rutas protegidas
│       ├── administracion/   # Usuarios, roles, comisiones, documentos, parámetros, plantillas
│       ├── clientes/         # Lista, detalle, registro de clientes y visitas
│       ├── contratos/        # Ciclo completo de contratos (arriendo y compraventa)
│       ├── inmuebles/        # Registro y gestión de inmuebles
│       ├── mantenimiento/    # (pendiente)
│       └── pagos/            # Cobros, mora, reportes de ingresos
├── components/
│   ├── administracion/
│   ├── contratos/
│   ├── inmuebles/
│   ├── pagos/
│   ├── shared/          # Componentes reutilizables entre módulos
│   └── ui/              # Componentes base de shadcn
├── lib/
│   ├── api/             # Clientes HTTP (pendiente de conectar)
│   ├── hooks/           # Custom hooks
│   ├── mock/            # Datos de prueba para desarrollo
│   └── schemas/         # Esquemas Zod
└── types/               # Tipos globales por módulo
```

## Módulos implementados

| Módulo | Interfaces | Estado |
|---|---|---|
| Login / Autenticación | UI-L01 a UI-L03 | Completo |
| Contratos | UI-C01 a UI-C09 | Completo |
| Pagos y Mora | UI-P01 a UI-P05 | Completo |
| Inmuebles | UI-I01 a UI-I04 | Completo |
| Administración | UI-A01 a UI-A07 | Completo |
| Clientes | UI-CL01 a UI-CL04 | Pendiente |
| Mantenimiento | — | Pendiente |
| Chatbot | — | Pendiente |


## Comandos

```bash
# Desarrollo (con Turbopack)
npm run dev

# Build de producción
npm run build

# Lint
npm run lint

# Formatear código
npm run format

# Verificar tipos
npm run typecheck
```

## Estado actual

La UI está completa para los módulos de Contratos, Pagos, Inmuebles y Administración. Los datos son mock — la conexión con la API REST (backend Django/FastAPI) es el siguiente paso.

Ver `TODO.md` para el detalle de tareas pendientes, decisiones de diseño abiertas y pendientes de documentación.
