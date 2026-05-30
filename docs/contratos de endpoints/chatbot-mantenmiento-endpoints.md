<style>
body {
    font-family: "Calibri", sans-serif;
  }
</style>


# Contrato de Endpoints — Módulos Chatbot y Mantenimiento

**Versión**: 1.0  
**Fecha**: 2026-05-30  
**Estado**: Borrador para revisión del equipo  
**Frontend**: Emily Perea Córdoba  
**Backend**: Por definir

---

## Convenciones generales

Las mismas del sistema. Ver `contratos-pagos-endpoints.md` → sección "Convenciones generales".

| Parámetro | Valor |
|-----------|-------|
| Base URL | `NEXT_PUBLIC_API_URL` (variable de entorno) |
| Formato de fecha | ISO 8601: `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm:ss` para datetime |
| Moneda | Pesos colombianos (COP), siempre como `number` entero |
| Paginación | `page` (base 1) y `limit` en query params |
| Errores | `{ error: { mensaje: string, codigo?: string } }` |
| Autenticación | Bearer token en header `Authorization` (JWT) — **excepto** el widget del chatbot (§1, endpoint público) |
| Archivos | `multipart/form-data` para uploads |

---

## Tipos compartidos — Chatbot

```ts
type EstadoSolicitud = "nueva" | "en_gestion" | "atendida"
type TipoSolicitud   = "visita" | "contacto" | "asesor"

interface MensajeChatHistorial {
  tipo: "bot" | "usuario"
  texto: string
  timestamp: string    // ISO datetime
}

interface SolicitudChatbot {
  id: string
  tipo: TipoSolicitud
  estado: EstadoSolicitud
  fecha: string        // ISO datetime — cuándo llegó la solicitud
  nombre: string
  telefono: string
  correo?: string
  inmuebleInteres?: string    // dirección del inmueble de interés
  mensaje?: string            // mensaje libre (solo tipo "contacto")
  fechaVisita?: string        // ISO date — solo tipo "visita"
  horaVisita?: string         // "HH:MM" — solo tipo "visita"
  asesorAsignado?: string     // nombre del asesor asignado
  historial: MensajeChatHistorial[]
}
```

---

## Módulo: Chatbot — Bandeja de solicitudes

El widget público del chatbot genera `SolicitudChatbot` registros. El backoffice (dashboard) las gestiona: asigna asesores, actualiza estados y ve el historial de conversación.

### 1. Enviar solicitud desde el widget (endpoint público)

```
POST /chatbot/solicitudes
```

Este endpoint **no requiere autenticación** — es consumido directamente por el widget embebido en el sitio web público.

**Body:**

```ts
{
  tipo: TipoSolicitud
  nombre: string
  telefono: string
  correo?: string
  inmuebleInteres?: string
  mensaje?: string            // requerido si tipo === "contacto"
  fechaVisita?: string        // requerido si tipo === "visita"
  horaVisita?: string         // requerido si tipo === "visita"
  historial: MensajeChatHistorial[]
}
```

**Respuesta exitosa `201`:**

```ts
{
  data: {
    id: string
    estado: "nueva"           // siempre inicia en "nueva"
  }
}
```

**Errores:**
- `400` — Campos obligatorios faltantes o formato inválido

---

### 2. Listar solicitudes (bandeja del backoffice)

```
GET /chatbot/solicitudes
```

**Query params (todos opcionales):**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `busqueda` | `string` | Filtra por nombre, teléfono, correo o inmueble (parcial, case-insensitive) |
| `estado` | `EstadoSolicitud` | Filtra por estado exacto |
| `tipo` | `TipoSolicitud` | Filtra por tipo exacto |
| `conAsesor` | `boolean` | `true` = solo las asignadas; `false` = solo las sin asignar |
| `page` | `number` | Página (default: 1) |
| `limit` | `number` | Default: 20 |

**Respuesta exitosa `200`:**

```ts
{
  data: SolicitudChatbot[]
  total: number
  pagina: number
  totalPaginas: number
  resumenEstados: {
    nueva: number
    en_gestion: number
    atendida: number
  }
}
```

---

### 3. Obtener detalle de solicitud

```
GET /chatbot/solicitudes/:id
```

**Respuesta exitosa `200`:**

```ts
{
  data: SolicitudChatbot    // incluye historial[] completo
}
```

**Errores:**
- `404` — Solicitud no encontrada

---

### 4. Asignar asesor a solicitud

```
PATCH /chatbot/solicitudes/:id/asesor
```

Asigna o reasigna el asesor responsable. Si la solicitud estaba en `"nueva"`, pasa automáticamente a `"en_gestion"`.

**Body:**

```ts
{
  asesorAsignado: string    // nombre del asesor — ver §26 de administracion-endpoints
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: {
    id: string
    estado: EstadoSolicitud
    asesorAsignado: string
  }
}
```

**Errores:**
- `404` — Solicitud no encontrada
- `400` — Solicitud ya está en estado "atendida"

---

### 5. Marcar solicitud como atendida

```
PATCH /chatbot/solicitudes/:id/atender
```

Marca la solicitud como `"atendida"`. Solo disponible desde `"en_gestion"`.

**Body:** Vacío o `{}`.

**Respuesta exitosa `200`:**

```ts
{
  data: {
    id: string
    estado: "atendida"
  }
}
```

**Errores:**
- `404` — Solicitud no encontrada
- `400` — La solicitud no está en estado `"en_gestion"`

---

## Tipos compartidos — Mantenimiento

```ts
type PrioridadMantenimiento = "baja" | "media" | "alta"
type EstadoMantenimiento     = "pendiente" | "en_proceso" | "finalizado" | "cancelado"

interface HistorialEstado {
  id: string
  estado: EstadoMantenimiento
  fecha: string        // ISO datetime
  nota?: string        // observación del cambio de estado
  usuario: string      // quién realizó el cambio
}

interface EvidenciaMantenimiento {
  id: string
  nombre: string       // nombre del archivo
  url: string          // URL pública del archivo
  fechaCarga: string   // ISO datetime
}

interface SolicitudMantenimiento {
  id: string
  inmuebleId: string
  inmuebleDireccion: string
  inmuebleUbicacion: string    // "Ciudad — Zona"
  descripcion: string
  prioridad: PrioridadMantenimiento
  estado: EstadoMantenimiento
  proveedorId?: string
  proveedorNombre?: string
  proveedorEspecialidad?: string
  costo?: number               // COP — solo si estado === "finalizado"
  fechaRegistro: string        // ISO date
  registradoPor: string        // nombre del usuario que creó la solicitud
  historial: HistorialEstado[]
  evidencias: EvidenciaMantenimiento[]
}

interface ProveedorOpcion {
  id: string
  nombre: string
  especialidad: string
  telefono: string
  correo?: string
  calificacion?: number        // 1.0–5.0
}
```

---

## Módulo: Mantenimiento — Solicitudes

### 6. Listar solicitudes de mantenimiento

```
GET /mantenimiento
```

**Query params (todos opcionales):**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `busqueda` | `string` | Filtra por dirección del inmueble o descripción (parcial) |
| `estado` | `EstadoMantenimiento` | Filtra por estado exacto |
| `prioridad` | `PrioridadMantenimiento` | Filtra por prioridad exacta |
| `page` | `number` | Página (default: 1) |
| `limit` | `number` | Default: 20 |

**Respuesta exitosa `200`:**

```ts
{
  data: SolicitudMantenimiento[]
  total: number
  pagina: number
  totalPaginas: number
  resumenEstados: {
    pendiente: number
    en_proceso: number
    finalizado: number
    cancelado: number
  }
}
```

> El campo `historial` y `evidencias` **se omiten** en el listado para reducir el payload. Se devuelven completos en el endpoint de detalle (§7).

---

### 7. Obtener detalle de solicitud

```
GET /mantenimiento/:id
```

**Respuesta exitosa `200`:**

```ts
{
  data: SolicitudMantenimiento    // incluye historial[] y evidencias[]
}
```

**Errores:**
- `404` — Solicitud no encontrada

---

### 8. Registrar nueva solicitud de mantenimiento

```
POST /mantenimiento
Content-Type: multipart/form-data
```

**Form fields:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `inmuebleId` | `string` | Sí | ID del inmueble afectado |
| `descripcion` | `string` | Sí | Descripción del problema (máx. 500 caracteres) |
| `prioridad` | `PrioridadMantenimiento` | Sí | Nivel de urgencia |
| `evidencias` | `File[]` | No | 0–5 archivos (JPG, PNG, PDF — máx. 10 MB c/u) |

**Respuesta exitosa `201`:**

```ts
{
  data: SolicitudMantenimiento    // con estado: "pendiente"
}
```

**Errores:**
- `400` — Campos faltantes, descripción muy larga o más de 5 archivos
- `404` — Inmueble no encontrado
- `413` — Algún archivo supera el límite de 10 MB

---

### 9. Asignar proveedor a solicitud

```
PATCH /mantenimiento/:id/asignar
```

Solo disponible si `estado === "pendiente"`. Cambia el estado a `"en_proceso"` y registra un evento en `historial`.

**Body:**

```ts
{
  proveedorId: string
  fechaVisita?: string    // ISO date — fecha estimada de intervención
  notas?: string          // nota que queda en el historial
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: SolicitudMantenimiento    // estado pasa a "en_proceso"
}
```

**Errores:**
- `404` — Solicitud o proveedor no encontrado
- `400` — El estado actual no permite asignación (`en_proceso`, `finalizado` o `cancelado`)

---

### 10. Actualizar estado de solicitud

```
PATCH /mantenimiento/:id/estado
Content-Type: multipart/form-data
```

Permite pasar a `"finalizado"` o `"cancelado"`. Solo disponible desde `"en_proceso"`. Registra evento en `historial` y puede adjuntar evidencias adicionales.

**Form fields:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `estado` | `"finalizado" \| "cancelado"` | Sí | Nuevo estado |
| `nota` | `string` | Sí | Observación del cierre (requerida) |
| `evidencias` | `File[]` | No | 0–3 imágenes adicionales (JPG, PNG — máx. 10 MB c/u) |

**Respuesta exitosa `200`:**

```ts
{
  data: SolicitudMantenimiento
}
```

**Errores:**
- `404` — Solicitud no encontrada
- `400` — Estado actual no es `"en_proceso"`, o `nota` vacía, o más de 3 archivos

---

### 11. Registrar costo de mantenimiento

```
PATCH /mantenimiento/:id/costo
Content-Type: multipart/form-data
```

Solo disponible si `estado === "finalizado"`. El costo **no puede modificarse** una vez registrado.

**Form fields:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `costo` | `number` | Sí | Valor en COP (debe ser > 0) |
| `factura` | `File` | No | PDF, JPG o PNG de la factura (máx. 10 MB) |

**Respuesta exitosa `200`:**

```ts
{
  data: SolicitudMantenimiento    // con campo costo actualizado
}
```

**Errores:**
- `404` — Solicitud no encontrada
- `400` — Solicitud no está `"finalizado"`, costo ≤ 0, o ya tiene costo registrado

---

## Módulo: Mantenimiento — Proveedores

### 12. Listar proveedores

```
GET /mantenimiento/proveedores
```

**Query params (todos opcionales):**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `busqueda` | `string` | Filtra por nombre, especialidad o teléfono (parcial, case-insensitive) |

**Respuesta exitosa `200`:**

```ts
{
  data: ProveedorOpcion[]
}
```

---

### 13. Crear proveedor

```
POST /mantenimiento/proveedores
```

**Body:**

```ts
{
  nombre: string
  especialidad: string
  telefono: string
  correo?: string
  calificacion?: number    // 1.0–5.0, decimal
}
```

**Respuesta exitosa `201`:**

```ts
{
  data: ProveedorOpcion
}
```

**Errores:**
- `400` — Nombre, especialidad o teléfono faltantes
- `409` — Ya existe un proveedor con ese nombre y especialidad

---

### 14. Editar proveedor

```
PATCH /mantenimiento/proveedores/:id
```

**Body (campos opcionales — solo los que cambian):**

```ts
{
  nombre?: string
  especialidad?: string
  telefono?: string
  correo?: string
  calificacion?: number
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: ProveedorOpcion
}
```

**Errores:**
- `404` — Proveedor no encontrado

---

### 15. Eliminar proveedor

```
DELETE /mantenimiento/proveedores/:id
```

**Respuesta exitosa `204`:** Sin cuerpo.

**Errores:**
- `404` — Proveedor no encontrado
- `400` — El proveedor tiene solicitudes en estado `"en_proceso"` activas y no puede eliminarse

---

## Endpoints relacionados requeridos

### 16. Inmuebles para selector (al crear solicitud)

```
GET /inmuebles?limit=100
```

Reutiliza el endpoint estándar de inmuebles. El frontend carga todos los inmuebles para mostrar en el combobox de "Seleccionar inmueble" del formulario de nueva solicitud.

**Respuesta relevante:**

```ts
{
  data: {
    id: string
    nombre: string
    direccion: string
    ciudad: string
  }[]
}
```

### 17. Asesores para asignar en chatbot

```
GET /administracion/usuarios?rol=asesor&estado=activo
```

Reutiliza el endpoint de usuarios. Ver `administracion-endpoints.md` §26.

---

## Resumen de endpoints

### Chatbot

| # | Método | Ruta | Auth | Descripción |
|---|--------|------|------|-------------|
| 1 | `POST` | `/chatbot/solicitudes` | ❌ Pública | Enviar solicitud desde el widget |
| 2 | `GET` | `/chatbot/solicitudes` | ✅ JWT | Listar solicitudes (bandeja) |
| 3 | `GET` | `/chatbot/solicitudes/:id` | ✅ JWT | Detalle de solicitud |
| 4 | `PATCH` | `/chatbot/solicitudes/:id/asesor` | ✅ JWT | Asignar asesor |
| 5 | `PATCH` | `/chatbot/solicitudes/:id/atender` | ✅ JWT | Marcar como atendida |

### Mantenimiento

| # | Método | Ruta | Descripción |
|---|--------|------|-------------|
| 6 | `GET` | `/mantenimiento` | Listar solicitudes con filtros |
| 7 | `GET` | `/mantenimiento/:id` | Detalle completo (con historial y evidencias) |
| 8 | `POST` | `/mantenimiento` | Registrar nueva solicitud + evidencias iniciales |
| 9 | `PATCH` | `/mantenimiento/:id/asignar` | Asignar proveedor (→ `en_proceso`) |
| 10 | `PATCH` | `/mantenimiento/:id/estado` | Cerrar o cancelar (→ `finalizado` / `cancelado`) |
| 11 | `PATCH` | `/mantenimiento/:id/costo` | Registrar costo final + factura |
| 12 | `GET` | `/mantenimiento/proveedores` | Listar proveedores |
| 13 | `POST` | `/mantenimiento/proveedores` | Crear proveedor |
| 14 | `PATCH` | `/mantenimiento/proveedores/:id` | Editar proveedor |
| 15 | `DELETE` | `/mantenimiento/proveedores/:id` | Eliminar proveedor |

---

## Notas de negocio para el backend

### Chatbot

1. **Endpoint público §1**: El widget del chatbot se embebe en páginas externas (portal de arriendo). Este endpoint **no debe requerir JWT**. El backend debe validar origen (CORS) en lugar de autenticación de usuario.

2. **Transición de estados automática**: Al asignar un asesor (§4), si la solicitud está en `"nueva"`, debe pasar automáticamente a `"en_gestion"`. El frontend no envía el nuevo estado explícitamente.

3. **Historial de conversación**: El campo `historial[]` contiene la conversación completa del chatbot (mensajes del bot y respuestas del usuario). El backend debe almacenarlo tal como llega en el POST — no lo procesa, solo lo persiste.

4. **Sin eliminación**: Las solicitudes no se eliminan — se mantienen como registro histórico. El flujo termina en `"atendida"`.

5. **`asesorAsignado` como nombre**: El frontend envía el nombre del asesor como string (no su ID) porque la columna de la bandeja muestra el nombre directamente. Si el backend requiere ID, puede recibir `asesorId` adicional, pero el campo `asesorAsignado` debe mantenerse como nombre en la respuesta para la UI.

### Mantenimiento

6. **Máquina de estados estricta**: El backend debe validar las transiciones permitidas:
   - `pendiente` → `en_proceso` (solo vía §9 asignar)
   - `en_proceso` → `finalizado` (vía §10)
   - `en_proceso` → `cancelado` (vía §10)
   - Ningún otro salto directo es válido

7. **Evidencias**: Los archivos de evidencia se cargan en §8 (al crear) y en §10 (al cerrar). Cada upload agrega evidencias al arreglo existente — no reemplaza. El backend retorna las URLs definitivas de almacenamiento.

8. **Historial automático**: Cada transición de estado debe generar automáticamente un registro en `historial[]` con `fecha`, `estado` nuevo, `usuario` (extraído del JWT) y `nota` si fue enviada.

9. **Costo inmutable**: Una vez registrado el costo (§11), el campo no puede modificarse. El backend debe rechazar intentos posteriores con `400`.

10. **Proveedor denormalizado**: Los campos `proveedorNombre` y `proveedorEspecialidad` en `SolicitudMantenimiento` se guardan como texto en el momento de la asignación. Si el proveedor cambia de nombre posteriormente, las solicitudes históricas conservan el nombre original. El `proveedorId` permite hacer lookup del estado actual del proveedor si se necesita.

11. **Eliminar proveedor con solicitudes activas**: Si el proveedor tiene solicitudes en `"en_proceso"`, el backend debe rechazar la eliminación (§15 → `400`). Solicitudes en `"finalizado"` o `"cancelado"` no bloquean la eliminación.

12. **`registradoPor`**: El backend extrae el nombre del usuario autenticado (desde el JWT) y lo guarda automáticamente. El frontend no lo envía.
