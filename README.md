# Real Estate Management System (Habu) — Frontend

Web application for managing a real estate company end to end: properties, clients, lease and sale contracts, payments and overdue tracking, maintenance, and a lead-capture chatbot. Built with the Next.js 16 App Router and connected over a REST API to a custom Node/Express/TypeScript backend.

> The product UI is in Spanish on purpose — Habu models a Colombian real estate agency, so the domain language (prices in COP, terms like *canon*, *arriendo*, *escrituración*) is part of what makes it realistic. This README is in English for reviewers.

## Live demo

| | URL | |
|---|---|---|
| **App (Vercel)** | https://habu-app.vercel.app | Sign in with the test users below |
| **API (Render)** | https://habu-app-backend.onrender.com | Check `/health` → `estado: ok` |

**Test users:**

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@habu.com.co` | `admin123` |
| Advisor | `asesor@habu.com.co` | `asesor123` |

> The backend runs on Render's free tier and sleeps after ~15 min of inactivity, so the first request after it sleeps takes ~30–50 s. If you see errors on load, open https://habu-app-backend.onrender.com/health first to wake it, then reload. The login screen also has a one-click "demo access" card that fills these credentials for you.

## Tech stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI base | React 19 + TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui + Radix UI |
| Icons | @hugeicons/react |
| Tables | @tanstack/react-table |
| Charts | Recharts |
| Rich text editor | TipTap 3 |
| Maps | React Leaflet |
| Validation | Zod |
| Notifications | Sonner |
| Theming | next-themes |

## Project structure

```
src/
├── app/
│   ├── (auth)/          # Public routes: login, password recovery/reset
│   └── (dashboard)/     # Protected routes (sidebar + header)
│       ├── administracion/   # Users, roles, commissions, documents, params, templates
│       ├── chatbot/          # Incoming lead inbox and detail
│       ├── clientes/         # Client list, detail, registration and visits
│       ├── contratos/        # Full contract lifecycle (lease and sale)
│       ├── inmuebles/        # Property registration and management
│       ├── mantenimiento/    # Requests, providers and tracking
│       ├── mi-cuenta/        # Profile, security and notifications
│       └── pagos/            # Charges, overdue, income reports
├── components/
│   ├── administracion/
│   ├── auth/            # Login, password recovery and reset
│   ├── chatbot/
│   ├── clientes/
│   ├── contratos/
│   ├── cuenta/
│   ├── inmuebles/
│   ├── mantenimiento/
│   ├── pagos/
│   └── ui/              # shadcn base components
├── lib/
│   ├── api/             # Per-module HTTP clients (wired to the backend)
│   ├── mock/            # Seed data (dev fallback when the backend is asleep)
│   ├── schemas/         # Zod schemas
│   └── session.ts       # JWT session management (localStorage)
└── types/               # Global types per module
```

## Modules

| Module | Screens | UI | API wired |
|---|---|---|---|
| Authentication | Login, recover, reset password | ✅ | ✅ |
| Properties | UI-I01 to UI-I04 | ✅ | ✅ |
| Clients | UI-CL01 to UI-CL04 | ✅ | ✅ |
| Contracts | UI-C01 to UI-C09 | ✅ | ✅ |
| Payments & overdue | UI-P01 to UI-P05 | ✅ | ✅ |
| Administration | UI-A01 to UI-A07 | ✅ | ✅ |
| Maintenance | UI-M01 to UI-M07 | ✅ | ✅ |
| Chatbot | UI-CH01 to UI-CH03 | ✅ | ✅ |
| My account | UI-ACC01 | ✅ | ✅ |

## API layer

Each module has its HTTP client in `src/lib/api/`:

| File | Module |
|---|---|
| `auth.ts` | Login, password recovery and reset |
| `cuenta.ts` | Authenticated user profile, notifications |
| `inmuebles.ts` | Properties, photos, history |
| `clientes.ts` | Clients, visits, interactions |
| `contratos.ts` | Contracts, documents, signatures |
| `pagos.ts` | Charges, payments, overdue, reports |
| `administracion.ts` | Users, schemes, params, documents, templates |
| `mantenimiento.ts` | Maintenance requests, providers |
| `chatbot.ts` | Public chatbot requests and internal inbox |

The interceptor in `axios.ts` attaches the JWT to every request and redirects to `/login` on a `401`.

## Commands

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Environment variables

```env
# Backend base URL (no trailing slash, no /api)
# Production: the Render URL. Local: http://localhost:4000
NEXT_PUBLIC_API_URL=https://habu-app-backend.onrender.com
```

> `NEXT_PUBLIC_*` is inlined into the bundle at build time: after changing it you must restart `npm run dev` (or redeploy) for it to take effect.

## Technical decisions

- **Server Components by default.** `"use client"` is added only where interactivity is needed (forms, hooks, maps). This keeps the JS shipped to the browser small.
- **A single source of truth for the token.** The whole JWT session lives in `lib/session.ts` (localStorage). No component reads the token directly. The `lib/api/axios.ts` interceptor attaches it to every request and, on a `401`, clears the session and redirects to `/login`.
- **Reloading via `retryKey`, not local state.** After create/update/delete, a `retryKey` is incremented to re-trigger the loading `useEffect`, instead of hand-mutating state. Fewer UI-vs-server sync bugs.
- **Centralized status colors.** Status/priority badges and alerts use shared classes (`.badge-*`, `.alert-*`) defined once in `globals.css`, each with its dark-mode variant. Changing a color is one edit, not N files.
- **Frontend and backend decoupled by contract.** The frontend knows nothing about the backend's storage: it consumes fixed response shapes (`{ data }` / `{ error }`). The backend started with in-memory data and can migrate to Postgres without touching the frontend.
- **Known limitation (kept honest).** Route protection currently relies on the client-side `401` interceptor; the server-side middleware (`src/proxy.ts`) is pending because it requires moving the token from localStorage to an edge-readable cookie. Roles (`administrador` | `asesor`) are static on the frontend.

## Current status

The UI is complete for all 9 modules, each wired to its API layer against the Node/Express backend, already deployed on Render. If the backend is asleep (free tier), components show an error state with a retry button and fall back to mock data.

See `TODO.md` for the detailed pending tasks and open design decisions.
