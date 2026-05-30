<style>
body {
    font-family: "Calibri", sans-serif;
  }
</style>


# Contrato de Endpoints — Módulo Administración

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
| Formato de fecha | ISO 8601: `YYYY-MM-DD` |
| Paginación | `page` (base 1) y `limit` en query params; respuesta incluye `total` y `totalPaginas` |
| Errores | Objeto `{ mensaje: string, codigo?: string }` en el campo `error` |
| Autenticación | Bearer token en header `Authorization` (JWT) |
| Content-Type | `application/json` salvo endpoints de plantillas con HTML (`text/html` en respuesta de preview) |

---

## Tipos compartidos

```ts
type RolUsuario    = "administrador" | "asesor"
type EstadoUsuario = "activo" | "inactivo"

type TipoComision  = "administracion" | "colocacion" | "venta"
// administracion → % mensual sobre canon cobrado
// colocacion     → % del primer canon (cobro único al iniciar contrato)
// venta          → % sobre precio de escrituración

type TipoPersona   = "natural" | "juridica" | "ambos"
type TipoInmueble  = "residencial" | "comercial" | "ambos"

type TipoPlantilla = "arriendo" | "promesa_compraventa" | "administracion"
```

---

## Módulo: Usuarios

### 1. Listar usuarios

```
GET /administracion/usuarios
```

**Query params (todos opcionales):**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `busqueda` | `string` | Filtra por nombre o correo (parcial, case-insensitive) |
| `rol` | `RolUsuario` | Filtra por rol exacto |
| `estado` | `EstadoUsuario` | Filtra por estado |
| `page` | `number` | Página (default: 1) |
| `limit` | `number` | Resultados por página (default: 20) |

**Respuesta exitosa `200`:**

```ts
{
  data: Usuario[]
  total: number
  pagina: number
  totalPaginas: number
}

interface Usuario {
  id: string
  nombre: string
  correo: string
  roles: RolUsuario[]
  estado: EstadoUsuario
  fechaCreacion: string    // ISO date
}
```

---

### 2. Obtener usuario

```
GET /administracion/usuarios/:id
```

**Respuesta exitosa `200`:**

```ts
{
  data: Usuario
}
```

**Errores:**
- `404` — Usuario no encontrado

---

### 3. Crear usuario

```
POST /administracion/usuarios
```

**Body:**

```ts
{
  nombre: string
  correo: string
  contrasena: string          // mínimo 8 caracteres — solo en creación
  roles: RolUsuario[]         // al menos uno requerido
  estado?: EstadoUsuario      // default: "activo"
}
```

**Respuesta exitosa `201`:**

```ts
{
  data: Usuario
}
```

**Errores:**
- `400` — Campos faltantes o contraseña muy corta
- `409` — El correo ya está registrado en otro usuario

---

### 4. Editar usuario

```
PATCH /administracion/usuarios/:id
```

**Body (todos los campos opcionales — solo se envían los que cambian):**

```ts
{
  nombre?: string
  correo?: string
  roles?: RolUsuario[]
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: Usuario
}
```

**Errores:**
- `404` — Usuario no encontrado
- `409` — El correo ya está en uso por otro usuario

---

### 5. Cambiar estado del usuario (activar / desactivar)

```
PATCH /administracion/usuarios/:id/estado
```

**Body:**

```ts
{
  estado: EstadoUsuario
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: {
    id: string
    estado: EstadoUsuario
  }
}
```

**Errores:**
- `404` — Usuario no encontrado
- `400` — No se puede desactivar al último administrador activo

---

## Módulo: Roles y permisos

Los roles (`administrador`, `asesor`) son **fijos en esta versión**. No existe API para crearlos ni eliminarlos. El endpoint sirve únicamente para leer la matriz de permisos y mostrarla en la UI.

### 6. Obtener matriz de permisos por rol

```
GET /administracion/roles
```

**Respuesta exitosa `200`:**

```ts
{
  data: PermisoModulo[]
}

interface PermisoModulo {
  modulo: string           // ej: "Inmuebles", "Contratos", "Administración"
  permisos: Permiso[]
}

interface Permiso {
  clave: string            // identificador interno, ej: "inmuebles.registrar"
  descripcion: string      // ej: "Registrar inmueble"
  roles: {
    administrador: boolean
    asesor: boolean
  }
}
```

---

## Módulo: Esquemas de comisión

### 7. Listar esquemas de comisión

```
GET /comisiones/esquemas
```

**Query params (todos opcionales):**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `busqueda` | `string` | Filtra por nombre del esquema |
| `tipo` | `TipoComision` | Filtra por tipo exacto |
| `estado` | `"activo" \| "inactivo"` | Filtra por estado |
| `page` | `number` | Página (default: 1) |
| `limit` | `number` | Default: 50 |

**Respuesta exitosa `200`:**

```ts
{
  data: EsquemaComision[]
  total: number
  pagina: number
  totalPaginas: number
}

interface EsquemaComision {
  id: string
  nombre: string
  tipo: TipoComision
  porcentajeInmobiliaria: number   // 0.01–100 — lo que cobra la inmobiliaria al cliente
  porcentajeAsesor: number         // 0.01–100 — del cobro anterior, lo que recibe el asesor
  condiciones: string              // descripción textual de condiciones especiales
  estado: "activo" | "inactivo"
}
```

---

### 8. Obtener detalle de un esquema

```
GET /comisiones/esquemas/:id
```

**Respuesta exitosa `200`:**

```ts
{
  data: EsquemaComisionDetalle
}

interface EsquemaComisionDetalle extends EsquemaComision {
  asesores: AsesorAsignado[]
}

interface AsesorAsignado {
  usuarioId: string
  nombre: string
  correo: string
  fechaAsignacion: string    // ISO date
}
```

**Errores:**
- `404` — Esquema no encontrado

---

### 9. Crear esquema de comisión

```
POST /comisiones/esquemas
```

**Body:**

```ts
{
  nombre: string
  tipo: TipoComision
  porcentajeInmobiliaria: number   // 0.01–100
  porcentajeAsesor: number         // 0.01–100
  condiciones: string
  estado?: "activo" | "inactivo"   // default: "activo"
}
```

**Respuesta exitosa `201`:**

```ts
{
  data: EsquemaComision
}
```

**Errores:**
- `400` — Porcentaje fuera de rango o campos faltantes

---

### 10. Editar esquema de comisión

```
PATCH /comisiones/esquemas/:id
```

**Body (campos opcionales — solo los que cambian):**

```ts
{
  nombre?: string
  tipo?: TipoComision
  porcentajeInmobiliaria?: number
  porcentajeAsesor?: number
  condiciones?: string
  estado?: "activo" | "inactivo"
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: EsquemaComision
}
```

**Errores:**
- `404` — Esquema no encontrado
- `400` — Porcentaje fuera de rango

---

### 11. Eliminar esquema de comisión

```
DELETE /comisiones/esquemas/:id
```

Elimina el esquema y todas sus asignaciones a asesores. Los cobros de comisión ya generados en contratos activos **no se ven afectados**.

**Respuesta exitosa `204`:** Sin cuerpo.

**Errores:**
- `404` — Esquema no encontrado
- `400` — El esquema está referenciado en contratos activos y no puede eliminarse

---

### 12. Listar asesores asignados a un esquema

```
GET /comisiones/esquemas/:id/asesores
```

**Respuesta exitosa `200`:**

```ts
{
  data: AsesorAsignado[]
}
```

---

### 13. Asignar asesor a un esquema

```
POST /comisiones/esquemas/:id/asesores
```

**Body:**

```ts
{
  usuarioId: string
}
```

**Respuesta exitosa `201`:**

```ts
{
  data: AsesorAsignado
}
```

**Errores:**
- `404` — Esquema o usuario no encontrado
- `409` — El asesor ya está asignado a este esquema
- `400` — El usuario no tiene el rol "asesor"

---

### 14. Desasignar asesor de un esquema

```
DELETE /comisiones/esquemas/:id/asesores/:usuarioId
```

**Respuesta exitosa `204`:** Sin cuerpo.

**Errores:**
- `404` — Asignación no encontrada

---

## Módulo: Parámetros del sistema

Los parámetros son un **registro único** en el sistema. No existe paginación ni múltiples registros.

### 15. Obtener parámetros

```
GET /administracion/parametros
```

**Respuesta exitosa `200`:**

```ts
{
  data: Parametros
}

interface Parametros {
  moraGraciaDiasHabiles: number      // días hábiles antes de marcar cobro en mora (0–30)
  moraAplicaResidencial: boolean     // si true, aplican intereses en inmuebles residenciales
  moraTasaResidencial: number        // % mensual de mora residencial (0–5)
  moraTasaComercial: number          // % mensual de mora comercial (0–5)
  alertaVencimientoDias: number      // días de anticipación para alertar vencimiento (1–180)
  alertaRenovacionDias: number       // días de anticipación para alertar renovación (1–180)
}
```

> **Nota de negocio**: La Ley 820 de 2003 prohíbe intereses de mora en arriendos residenciales. El campo `moraAplicaResidencial` existe para administración futura, pero el frontend muestra una advertencia legal cuando se intenta habilitar.

---

### 16. Actualizar parámetros

```
PATCH /administracion/parametros
```

**Body (campos opcionales — solo los que cambian):**

```ts
{
  moraGraciaDiasHabiles?: number     // entero 0–30
  moraAplicaResidencial?: boolean
  moraTasaResidencial?: number       // decimal 0.00–5.00
  moraTasaComercial?: number         // decimal 0.00–5.00
  alertaVencimientoDias?: number     // entero 1–180
  alertaRenovacionDias?: number      // entero 1–180
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: Parametros
}
```

**Errores:**
- `400` — Valor fuera del rango permitido

---

## Módulo: Tipos de documento requeridos

Define el catálogo de documentos que el sistema exige según el tipo de contrato, persona e inmueble.

### 17. Listar tipos de documento

```
GET /administracion/tipos-documento
```

**Query params (todos opcionales):**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `busqueda` | `string` | Filtra por nombre del documento |
| `tipoPersona` | `TipoPersona` | Filtra por tipo de persona |
| `tipoInmueble` | `TipoInmueble` | Filtra por tipo de inmueble |

**Respuesta exitosa `200`:**

```ts
{
  data: TipoDocumentoReq[]
}

interface TipoDocumentoReq {
  id: string
  nombre: string
  tipoPersona: TipoPersona       // a qué tipo de cliente aplica
  tipoInmueble: TipoInmueble     // a qué tipo de inmueble aplica
  requiereCodeudor: boolean      // true → solo se pide cuando hay codeudor
  obligatorio: boolean           // false → opcional, puede omitirse
}
```

---

### 18. Crear tipo de documento

```
POST /administracion/tipos-documento
```

**Body:**

```ts
{
  nombre: string
  tipoPersona: TipoPersona
  tipoInmueble: TipoInmueble
  requiereCodeudor: boolean
  obligatorio: boolean
}
```

**Respuesta exitosa `201`:**

```ts
{
  data: TipoDocumentoReq
}
```

**Errores:**
- `400` — Nombre vacío o campos faltantes
- `409` — Ya existe un tipo con el mismo nombre

---

### 19. Editar tipo de documento

```
PATCH /administracion/tipos-documento/:id
```

**Body (campos opcionales):**

```ts
{
  nombre?: string
  tipoPersona?: TipoPersona
  tipoInmueble?: TipoInmueble
  requiereCodeudor?: boolean
  obligatorio?: boolean
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: TipoDocumentoReq
}
```

**Errores:**
- `404` — Tipo no encontrado

---

### 20. Eliminar tipo de documento

```
DELETE /administracion/tipos-documento/:id
```

Los documentos ya cargados en contratos existentes **no se ven afectados**. Solo elimina el tipo del catálogo para nuevos contratos.

**Respuesta exitosa `204`:** Sin cuerpo.

**Errores:**
- `404` — Tipo no encontrado

---

## Módulo: Plantillas de documentos

Almacena las plantillas HTML de contratos y promesas que se generan con variables interpoladas. El editor usa Tiptap (rich text) en el frontend; el backend recibe y devuelve HTML sanitizado.

### 21. Listar plantillas

```
GET /administracion/plantillas
```

**Query params (todos opcionales):**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `busqueda` | `string` | Filtra por nombre de plantilla |
| `tipo` | `TipoPlantilla` | Filtra por tipo |

**Respuesta exitosa `200`:**

```ts
{
  data: PlantillaResumen[]
}

interface PlantillaResumen {
  id: string
  nombre: string
  tipo: TipoPlantilla
  ultimaEdicion: string    // ISO datetime
}
```

> El campo `contenido` (HTML) **no se devuelve en el listado** para reducir el payload. Se obtiene en el endpoint de detalle.

---

### 22. Obtener plantilla (con contenido)

```
GET /administracion/plantillas/:id
```

**Respuesta exitosa `200`:**

```ts
{
  data: Plantilla
}

interface Plantilla extends PlantillaResumen {
  contenido: string    // HTML sanitizado — tags permitidos: p, strong, em, ul, ol, li, br, h1, h2, h3
}
```

**Errores:**
- `404` — Plantilla no encontrada

---

### 23. Crear plantilla

```
POST /administracion/plantillas
```

**Body:**

```ts
{
  nombre: string
  tipo: TipoPlantilla
  contenido: string    // HTML sanitizado
}
```

**Respuesta exitosa `201`:**

```ts
{
  data: Plantilla
}
```

**Errores:**
- `400` — Nombre vacío

---

### 24. Guardar plantilla (edición completa)

```
PUT /administracion/plantillas/:id
```

Reemplaza el contenido completo de la plantilla. El frontend siempre envía el nombre y el HTML completo.

**Body:**

```ts
{
  nombre: string
  contenido: string    // HTML sanitizado
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: Plantilla
}
```

**Errores:**
- `404` — Plantilla no encontrada
- `400` — Nombre vacío

---

### 25. Eliminar plantilla

```
DELETE /administracion/plantillas/:id
```

Los contratos ya generados con esta plantilla **no se ven afectados**. Solo elimina la plantilla del catálogo.

**Respuesta exitosa `204`:** Sin cuerpo.

**Errores:**
- `404` — Plantilla no encontrada

---

## Endpoints relacionados requeridos por otros módulos

Estos endpoints son consumidos desde formularios externos (crear contrato, registrar pago), pero pertenecen funcionalmente a administración.

### 26. Listar asesores activos (para selectores)

```
GET /administracion/usuarios?rol=asesor&estado=activo
```

Reutiliza el endpoint §1 con filtros aplicados. Devuelve la lista reducida de asesores para poblar dropdowns en formularios de contratos.

---

### 27. Variables disponibles para plantillas

```
GET /administracion/plantillas/variables
```

Devuelve el catálogo de variables `{{key}}` que el editor puede insertar en una plantilla.

**Respuesta exitosa `200`:**

```ts
{
  data: GrupoVariables[]
}

interface GrupoVariables {
  grupo: string            // ej: "Contrato", "Propietario", "Inmueble"
  variables: Variable[]
}

interface Variable {
  key: string              // ej: "contrato.referencia"
  label: string            // ej: "Referencia del contrato"
}
```

---

## Resumen de endpoints

| # | Método | Ruta | Descripción |
|---|--------|------|-------------|
| 1 | `GET` | `/administracion/usuarios` | Listar usuarios con filtros |
| 2 | `GET` | `/administracion/usuarios/:id` | Detalle de usuario |
| 3 | `POST` | `/administracion/usuarios` | Crear usuario |
| 4 | `PATCH` | `/administracion/usuarios/:id` | Editar usuario |
| 5 | `PATCH` | `/administracion/usuarios/:id/estado` | Activar / desactivar usuario |
| 6 | `GET` | `/administracion/roles` | Matriz de permisos por rol |
| 7 | `GET` | `/comisiones/esquemas` | Listar esquemas de comisión |
| 8 | `GET` | `/comisiones/esquemas/:id` | Detalle de esquema + asesores asignados |
| 9 | `POST` | `/comisiones/esquemas` | Crear esquema |
| 10 | `PATCH` | `/comisiones/esquemas/:id` | Editar esquema |
| 11 | `DELETE` | `/comisiones/esquemas/:id` | Eliminar esquema |
| 12 | `GET` | `/comisiones/esquemas/:id/asesores` | Asesores asignados al esquema |
| 13 | `POST` | `/comisiones/esquemas/:id/asesores` | Asignar asesor |
| 14 | `DELETE` | `/comisiones/esquemas/:id/asesores/:usuarioId` | Desasignar asesor |
| 15 | `GET` | `/administracion/parametros` | Obtener parámetros del sistema |
| 16 | `PATCH` | `/administracion/parametros` | Actualizar parámetros |
| 17 | `GET` | `/administracion/tipos-documento` | Listar tipos de documento |
| 18 | `POST` | `/administracion/tipos-documento` | Crear tipo de documento |
| 19 | `PATCH` | `/administracion/tipos-documento/:id` | Editar tipo de documento |
| 20 | `DELETE` | `/administracion/tipos-documento/:id` | Eliminar tipo de documento |
| 21 | `GET` | `/administracion/plantillas` | Listar plantillas (sin contenido HTML) |
| 22 | `GET` | `/administracion/plantillas/:id` | Obtener plantilla con contenido |
| 23 | `POST` | `/administracion/plantillas` | Crear plantilla |
| 24 | `PUT` | `/administracion/plantillas/:id` | Guardar plantilla (reemplazo completo) |
| 25 | `DELETE` | `/administracion/plantillas/:id` | Eliminar plantilla |
| 26 | *(alias)* | `/administracion/usuarios?rol=asesor&estado=activo` | Asesores activos para selectores |
| 27 | `GET` | `/administracion/plantillas/variables` | Catálogo de variables para el editor |

---

## Notas de negocio para el backend

1. **Un solo administrador activo**: el sistema debe garantizar que siempre exista al menos un usuario con rol `"administrador"` en estado `"activo"`. Si se intenta desactivar al último, retornar `400`.

2. **Contraseña**: nunca se devuelve en ningún response. Al editar usuario (§4) no se incluye contraseña — cambiar contraseña requeriría un endpoint dedicado (no implementado en esta versión).

3. **Esquemas de comisión y contratos activos**: antes de eliminar un esquema (§11), el backend debe verificar si hay contratos activos que lo referencien. Si los hay, retornar `400`. El criterio "activo" incluye estados `activo`, `en_firmas`, `en_escrituracion`, `pendiente_registro`, `por_vencer`.

4. **Parámetros — registro único**: la tabla de parámetros tiene exactamente un registro. El `GET` siempre lo devuelve (nunca `404`); el `PATCH` siempre lo actualiza.

5. **Plantillas — HTML sanitizado**: el backend debe sanitizar el HTML recibido antes de almacenarlo. Tags permitidos: `<p>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`, `<br>`, `<h1>`, `<h2>`, `<h3>`. El frontend aplica DOMPurify antes de enviar, pero el backend no debe confiar en eso.

6. **Variables de plantilla `{{key}}`**: el backend **no interpola** las variables al almacenar la plantilla. La interpolación ocurre en el frontend al generar el preview, o en el módulo de generación de documentos PDF (fuera del alcance de este contrato).

7. **Roles — solo lectura**: la matriz de permisos (§6) es configuración interna del backend. El frontend la muestra pero no puede modificarla en esta versión.

8. **`ultimaEdicion` de plantillas**: el backend debe actualizar este campo automáticamente en cada `PUT`. El frontend no lo envía en el body.

9. **`fechaCreacion` de usuarios**: lo genera el backend en el `POST`. El frontend no lo envía.
