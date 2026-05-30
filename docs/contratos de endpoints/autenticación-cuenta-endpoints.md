<style>
body {
    font-family: "Calibri", sans-serif;
  }
</style>


# Contrato de Endpoints — Autenticación y Cuenta

**Versión**: 1.0  
**Fecha**: 2026-05-30  
**Estado**: Borrador para revisión del equipo  
**Frontend**: Emily Perea Córdoba  
**Backend**: Por definir

---

## Convenciones generales

| Parámetro | Valor |
|-----------|-------|
| Base URL | `NEXT_PUBLIC_API_URL` (variable de entorno) |
| Formato de fecha | ISO 8601: `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm:ssZ` |
| Errores | Objeto `{ mensaje: string, codigo?: string }` en el campo `error` |
| Autenticación | Bearer token en header `Authorization: Bearer <JWT>` — excepto los endpoints marcados como **públicos** |
| Content-Type | `application/json` |

---

## Tipos compartidos

```ts
type RolUsuario = "administrador" | "asesor"

interface UsuarioSesion {
  id: string
  nombre: string
  correo: string
  rol: RolUsuario
}

interface MiPerfil extends UsuarioSesion {
  telefono?: string
  ciudad?: string
}

interface NotificacionesConfig {
  vencimientoContrato: boolean   // alerta de contrato próximo a vencer
  cobroEnMora: boolean           // alerta cuando un cobro entra en mora
  nuevoContrato: boolean         // aviso al asesor cuando se le asigna un contrato
  pagoRegistrado: boolean        // confirmación cuando se registra un pago
}
```

---

## Módulo: Autenticación

> Todos los endpoints de esta sección son **públicos** — no requieren JWT.

---

### 1. Iniciar sesión

```
POST /auth/login
```

**Body:**

```ts
{
  correo: string
  password: string
}
```

**Respuesta exitosa `200`:**

```ts
{
  token: string          // JWT firmado — el frontend lo guarda en localStorage
  usuario: UsuarioSesion // datos del usuario autenticado para poblar la sesión
}
```

**Errores:**
- `401` — Correo o contraseña incorrectos
- `403` — La cuenta está desactivada (`estado: "inactivo"`)

> **Nota**: El frontend detecta el error `403` por el mensaje del campo `error.mensaje` y muestra "Tu cuenta está desactivada. Contacta al administrador." El error `401` muestra "Correo o contraseña incorrectos."

---

### 2. Solicitar recuperación de contraseña

```
POST /auth/recuperar
```

Envía un correo al usuario con un enlace de recuperación que contiene un token de un solo uso.

**Body:**

```ts
{
  correo: string
}
```

**Respuesta exitosa `200`:** Sin cuerpo o `{}`.

> **Nota de seguridad**: El backend siempre responde `200` independientemente de si el correo existe en el sistema, para no revelar qué correos están registrados. El frontend siempre muestra el mensaje "Si `<correo>` está registrado, recibirás las instrucciones en los próximos minutos."

**Errores:**
- `400` — Formato de correo inválido

---

### 3. Restablecer contraseña

```
POST /auth/restablecer
```

Establece una nueva contraseña usando el token enviado por correo. El enlace tiene la forma `/restablecer-password?token=<token>`.

**Body:**

```ts
{
  token: string          // token del enlace de recuperación
  nuevaPassword: string  // nueva contraseña (mínimo 8 caracteres)
}
```

**Respuesta exitosa `200`:** Sin cuerpo o `{}`.

**Errores:**
- `400` — Token inválido, expirado o ya utilizado
- `400` — La contraseña no cumple los requisitos mínimos

> **Nota**: El token de recuperación debe ser de un solo uso y expirar tras un tiempo razonable (recomendado: 1 hora). Una vez utilizado, cualquier intento posterior con el mismo token devuelve `400`.

---

## Módulo: Cuenta del usuario autenticado

> Todos los endpoints de esta sección requieren JWT. El segmento `/me` hace referencia al usuario dueño del token — cada usuario solo puede ver y modificar su propia cuenta.

---

### 4. Obtener perfil propio

```
GET /usuarios/me
```

Devuelve el perfil completo del usuario autenticado.

**Respuesta exitosa `200`:**

```ts
{
  data: MiPerfil
}
```

---

### 5. Actualizar perfil propio

```
PATCH /usuarios/me
```

Actualiza los datos personales del usuario. Solo se procesan los campos enviados.

**Body (todos opcionales — al menos uno requerido):**

```ts
{
  nombre?:   string
  correo?:   string
  telefono?: string
  ciudad?:   string
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: MiPerfil    // perfil actualizado
}
```

**Errores:**
- `400` — Formato de correo inválido
- `409` — El correo ya está en uso por otro usuario

---

### 6. Cambiar contraseña propia

```
PATCH /usuarios/me/password
```

Cambia la contraseña del usuario autenticado. Requiere confirmar la contraseña actual.

**Body:**

```ts
{
  actual: string    // contraseña actual para verificar identidad
  nueva: string     // nueva contraseña (mínimo 8 caracteres)
}
```

**Respuesta exitosa `200`:** Sin cuerpo o `{}`.

**Errores:**
- `400` — La contraseña actual es incorrecta
- `400` — La nueva contraseña no cumple los requisitos mínimos

> **Nota**: El frontend detecta el error de contraseña actual incorrecta por el texto del `error.mensaje` y lo muestra inline en el campo "Contraseña actual", no como toast.

---

### 7. Obtener preferencias de notificación

```
GET /usuarios/me/notificaciones
```

Devuelve las preferencias de notificación del usuario. Si el usuario no tiene registro previo, el backend devuelve los valores por defecto.

**Respuesta exitosa `200`:**

```ts
{
  data: NotificacionesConfig
}
```

**Valores por defecto:**

| Preferencia | Default |
|---|---|
| `vencimientoContrato` | `true` |
| `cobroEnMora` | `true` |
| `nuevoContrato` | `false` |
| `pagoRegistrado` | `false` |

---

### 8. Actualizar preferencias de notificación

```
PATCH /usuarios/me/notificaciones
```

Activa o desactiva una o más preferencias. Solo se actualizan los campos enviados — los demás conservan su valor actual.

**Body (todos opcionales — al menos uno requerido):**

```ts
{
  vencimientoContrato?: boolean
  cobroEnMora?:         boolean
  nuevoContrato?:       boolean
  pagoRegistrado?:      boolean
}
```

**Respuesta exitosa `200`:**

```ts
{
  data: NotificacionesConfig    // configuración completa tras la actualización
}
```

> **Nota UX**: El frontend aplica el toggle de forma optimista — actualiza la UI inmediatamente y revierte si la API devuelve error.

---

## Resumen de endpoints

| # | Método | Ruta | Auth | Descripción |
|---|--------|------|------|-------------|
| 1 | `POST` | `/auth/login` | Pública | Iniciar sesión |
| 2 | `POST` | `/auth/recuperar` | Pública | Solicitar enlace de recuperación |
| 3 | `POST` | `/auth/restablecer` | Pública | Restablecer contraseña con token |
| 4 | `GET` | `/usuarios/me` | JWT | Obtener perfil propio |
| 5 | `PATCH` | `/usuarios/me` | JWT | Actualizar datos personales |
| 6 | `PATCH` | `/usuarios/me/password` | JWT | Cambiar contraseña |
| 7 | `GET` | `/usuarios/me/notificaciones` | JWT | Obtener preferencias de notificación |
| 8 | `PATCH` | `/usuarios/me/notificaciones` | JWT | Actualizar preferencias de notificación |

---

## Notas de negocio para el backend

1. **Token JWT**: debe incluir al menos `id`, `nombre`, `correo` y `rol` en el payload para que el frontend pueda poblar la sesión sin una llamada adicional a `/usuarios/me`.

2. **Expiración del JWT**: recomendado 8 horas de sesión activa. El frontend no implementa renovación automática — cuando el token expira, el próximo request devuelve `401` y el interceptor de axios redirige al login.

3. **Token de recuperación**: debe ser de un solo uso y expirar en 1 hora. Implementar como token firmado o UUID almacenado en DB con timestamp.

4. **Correo de recuperación**: el enlace debe apuntar a `<FRONTEND_URL>/restablecer-password?token=<token>`. El backend debe tener configurado `FRONTEND_URL` como variable de entorno.

5. **`/usuarios/me` vs `/administracion/usuarios/:id`**: son endpoints distintos con propósitos distintos. `/me` es para que el usuario gestione su propia cuenta; `/administracion/usuarios/:id` es para que el administrador gestione cualquier usuario del sistema.
