# 📘 Documentación de Consumo API - ChambaApp v2

Documento para el equipo de UI/UX y frontend. Aquí se describe cómo consumir los endpoints REST y el WebSocket de chat del backend.

## 🚀 Base URL

Desarrollo local:

```txt
http://localhost:3000/api
```

WebSocket:

```txt
http://localhost:3000/chat
```

## 🔐 Autenticación

Las rutas protegidas usan JWT con header:

```txt
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

El token se obtiene con:

```txt
POST /api/auth/login
```

## 👥 Roles del sistema

Roles usados por el backend:

| Rol | Uso principal |
| --- | --- |
| `admin` | Administración total |
| `cliente` | Solicita servicios, paga y califica |
| `prestador` | Publica servicios y atiende solicitudes |

Usuarios seed para desarrollo:

| Rol | Correo | Password |
| --- | --- | --- |
| Admin | `admin@chambaapp.com` | `Password123` |
| Cliente | `cliente@chambaapp.com` | `Password123` |
| Prestador | `prestador@chambaapp.com` | `Password123` |

## 🧩 Respuesta de errores

NestJS responde normalmente con este formato:

```json
{
  "message": "Mensaje del error",
  "error": "Bad Request",
  "statusCode": 400
}
```

Códigos comunes:

| Código | Significado |
| --- | --- |
| `400` | Body inválido |
| `401` | No autenticado o token inválido |
| `403` | Usuario sin permisos |
| `404` | Recurso no encontrado |
| `409` | Conflicto, por ejemplo correo duplicado |

## 🔑 Auth

### 🟢 Registrar usuario

```txt
POST /api/auth/register
```

Token: no requiere.

Body:

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "correo": "juan@test.com",
  "password": "Password123",
  "telefono": "5555555555",
  "rol": "cliente"
}
```

Notas UI:

- Usar para registro público de `cliente` o `prestador`.
- Si no se manda `rol`, el backend registra como `cliente`.
- Valores permitidos para registro público: `cliente`, `prestador`.
- No se permite registrar `admin` desde esta ruta.

Ejemplo para registrar prestador:

```json
{
  "nombre": "Carlos",
  "apellido": "Ramirez",
  "correo": "carlos.prestador@test.com",
  "password": "Password123",
  "telefono": "5555555588",
  "rol": "prestador"
}
```

También se acepta `rol_id` solo para cliente/prestador:

```json
{
  "nombre": "Ana",
  "correo": "ana.prestadora@test.com",
  "password": "Password123",
  "rol_id": 3
}
```

Mapeo:

| Rol | `rol_id` |
| --- | --- |
| `cliente` | `2` |
| `prestador` | `3` |

### 🟢 Login

```txt
POST /api/auth/login
```

Token: no requiere.

Body:

```json
{
  "correo": "cliente@chambaapp.com",
  "password": "Password123"
}
```

Respuesta esperada:

```json
{
  "access_token": "JWT_AQUI",
  "user": {
    "nombre": "Cliente",
    "correo": "cliente@chambaapp.com",
    "rol": "cliente",
    "telefono": "5555555556"
  }
}
```

Notas UI:

- Guardar `access_token` para consumir rutas protegidas.
- Guardar `user.rol` para mostrar vistas según permisos.

## 👤 Usuarios

### 👀 Perfil actual

```txt
GET /api/users/profile
```

Token: sí.

Roles: `admin`, `cliente`, `prestador`.

Body: no lleva.

Uso UI:

- Cargar datos del usuario logueado.
- Ideal para inicializar sesión después de refrescar pantalla.

### 🟢 Crear usuario

```txt
POST /api/users
```

Token: sí.

Roles: `admin`.

Body:

```json
{
  "nombre": "Maria",
  "apellido": "Lopez",
  "correo": "maria@test.com",
  "password": "Password123",
  "telefono": "5555555557",
  "foto_perfil": "https://example.com/foto.jpg",
  "activo": true,
  "verificado": true,
  "rol_id": 2
}
```

### 👀 Listar usuarios

```txt
GET /api/users
```

Token: sí.

Roles: `admin`.

Body: no lleva.

### 👀 Ver usuario por ID

```txt
GET /api/users/:id
```

Token: sí.

Roles: `admin`.

Ejemplo:

```txt
GET /api/users/1
```

### 🟡 Actualizar usuario

```txt
PATCH /api/users/:id
```

Token: sí.

Roles:

- `admin`: puede editar cualquier usuario.
- `cliente` y `prestador`: solo su propio perfil.

Body:

```json
{
  "nombre": "Juan Actualizado",
  "apellido": "Perez",
  "telefono": "5555555599",
  "foto_perfil": "https://example.com/nueva-foto.jpg"
}
```

Campos admin:

```json
{
  "activo": true,
  "verificado": true,
  "rol_id": 3
}
```

### 🔴 Eliminar usuario

```txt
DELETE /api/users/:id
```

Token: sí.

Roles: `admin`.

Body: no lleva.

## 🛠️ Servicios

### 🟢 Crear servicio

```txt
POST /api/services
```

Token: sí.

Roles: `admin`, `prestador`.

Body:

```json
{
  "titulo": "Instalacion electrica",
  "descripcion": "Instalacion y revision electrica para casa habitacion.",
  "precio_base": 500
}
```

Uso UI:

- Formulario de publicación de servicio para prestador.
- El `prestador_id` se toma del token.

### 👀 Listar servicios

```txt
GET /api/services
```

Token: no requiere.

Body: no lleva.

Uso UI:

- Home, catálogo o explorador de servicios.
- Incluye prestador, solicitudes y calificaciones.

### 👀 Ver servicio por ID

```txt
GET /api/services/:id
```

Token: no requiere.

Ejemplo:

```txt
GET /api/services/1
```

Uso UI:

- Pantalla detalle del servicio.
- Mostrar datos del prestador y calificaciones.

### 🟡 Actualizar servicio

```txt
PATCH /api/services/:id
```

Token: sí.

Roles: `admin` o `prestador` dueño del servicio.

Body:

```json
{
  "titulo": "Instalacion electrica residencial",
  "descripcion": "Servicio actualizado de instalacion electrica.",
  "precio_base": 650,
  "disponible": true
}
```

### 🔴 Eliminar servicio

```txt
DELETE /api/services/:id
```

Token: sí.

Roles: `admin` o `prestador` dueño del servicio.

Body: no lleva.

## 📋 Solicitudes

### 🟢 Crear solicitud

```txt
POST /api/solicitudes
```

Token: sí.

Roles: `admin`, `cliente`.

Body:

```json
{
  "descripcion": "Necesito el servicio el sabado por la manana.",
  "direccion_servicio": "Av. Siempre Viva 123, CDMX",
  "servicio_id": 1
}
```

Uso UI:

- Botón “Solicitar servicio” desde detalle del servicio.
- El `cliente_id` sale del token.

### 👀 Listar solicitudes

```txt
GET /api/solicitudes
```

Token: sí.

Roles:

- `admin`: ve todas.
- `cliente`: ve sus solicitudes.
- `prestador`: ve solicitudes hechas a sus servicios.

Uso UI:

- Cliente: historial de solicitudes.
- Prestador: bandeja de trabajo.
- Admin: panel general.

### 👀 Ver solicitud por ID

```txt
GET /api/solicitudes/:id
```

Token: sí.

Roles: `admin`, cliente dueño o prestador dueño del servicio.

### 🟡 Actualizar solicitud

```txt
PATCH /api/solicitudes/:id
```

Token: sí.

Roles: `admin`, cliente dueño o prestador dueño del servicio.

Body:

```json
{
  "descripcion": "Actualizacion de detalles del servicio.",
  "direccion_servicio": "Calle Nueva 456, CDMX",
  "estado": "aceptada"
}
```

Estados válidos:

```txt
pendiente, aceptada, rechazada, completada, cancelada
```

Uso UI:

- Prestador puede aceptar/rechazar.
- Cliente puede cancelar.
- Cuando esté `completada`, se habilita calificación.

### 🔴 Eliminar solicitud

```txt
DELETE /api/solicitudes/:id
```

Token: sí.

Roles: `admin` o cliente dueño.

## 💳 Pagos

### 🟢 Crear pago

```txt
POST /api/pagos
```

Token: sí.

Roles: `admin`, cliente dueño de la solicitud.

Body:

```json
{
  "monto": 500,
  "metodo": "tarjeta",
  "referencia": "REF-123456",
  "solicitud_id": 1
}
```

Uso UI:

- Pantalla de pago de solicitud.
- Cada solicitud solo puede tener un pago.

### 👀 Listar pagos

```txt
GET /api/pagos
```

Token: sí.

Roles:

- `admin`: ve todos.
- `cliente`: ve pagos de sus solicitudes.
- `prestador`: ve pagos relacionados con sus servicios.

### 👀 Ver pago por ID

```txt
GET /api/pagos/:id
```

Token: sí.

Roles: `admin`, cliente dueño o prestador dueño del servicio.

### 🟡 Actualizar pago

```txt
PATCH /api/pagos/:id
```

Token: sí.

Roles: `admin` o cliente dueño.

Body:

```json
{
  "monto": 500,
  "metodo": "tarjeta",
  "referencia": "REF-123456-ACT",
  "estado": "pagado",
  "fecha_pago": "2026-05-15T12:00:00.000Z"
}
```

Estados válidos:

```txt
pendiente, pagado, fallido, reembolsado
```

### 🔴 Eliminar pago

```txt
DELETE /api/pagos/:id
```

Token: sí.

Roles: `admin` o cliente dueño.

## ⭐ Calificaciones

### 🟢 Crear calificación

```txt
POST /api/calificaciones
```

Token: sí.

Roles: `admin`, cliente dueño de la solicitud.

Condición:

```txt
La solicitud debe estar en estado completada.
```

Body:

```json
{
  "puntuacion": 5,
  "comentario": "Excelente servicio, puntual y profesional.",
  "solicitud_id": 1
}
```

Uso UI:

- Mostrar formulario de calificación solo cuando `solicitud.estado === "completada"`.
- `puntuacion` va de 1 a 5.

### 👀 Listar calificaciones

```txt
GET /api/calificaciones
```

Token: sí.

Roles:

- `admin`: ve todas.
- `cliente`: ve las que hizo.
- `prestador`: ve las que recibió.

### 👀 Ver calificación por ID

```txt
GET /api/calificaciones/:id
```

Token: sí.

Roles: `admin`, cliente que calificó o prestador calificado.

### 🟡 Actualizar calificación

```txt
PATCH /api/calificaciones/:id
```

Token: sí.

Roles: `admin` o cliente que calificó.

Body:

```json
{
  "puntuacion": 4,
  "comentario": "Buen servicio, actualizo mi comentario."
}
```

### 🔴 Eliminar calificación

```txt
DELETE /api/calificaciones/:id
```

Token: sí.

Roles: `admin` o cliente que calificó.

## 🔔 Notificaciones

Colección MongoDB.

### 🟢 Crear notificación

```txt
POST /api/notifications
```

Token: sí.

Roles: `admin`.

Body:

```json
{
  "userId": 2,
  "title": "Nueva solicitud",
  "message": "Tienes una nueva solicitud pendiente."
}
```

### 👀 Listar notificaciones

```txt
GET /api/notifications
```

Token: sí.

Roles:

- `admin`: ve todas.
- Usuario normal: ve solo las propias.

Uso UI:

- Campana de notificaciones.
- Badge de pendientes usando `read: false`.

### 👀 Ver notificación por ID

```txt
GET /api/notifications/:id
```

Token: sí.

Roles: `admin` o usuario dueño.

### 🟡 Actualizar notificación

```txt
PATCH /api/notifications/:id
```

Token: sí.

Roles: `admin` o usuario dueño.

Body:

```json
{
  "title": "Solicitud actualizada",
  "message": "Tu solicitud cambio de estado.",
  "read": true
}
```

### 🔴 Eliminar notificación

```txt
DELETE /api/notifications/:id
```

Token: sí.

Roles: `admin` o usuario dueño.

## 💬 Chats REST

Colección MongoDB.

REST sirve para cargar historial. WebSocket sirve para tiempo real.

### 🟢 Crear mensaje por REST

```txt
POST /api/chats
```

Token: sí.

Roles: `admin`, `cliente`, `prestador`.

Body:

```json
{
  "roomId": "solicitud-1",
  "receiverId": 3,
  "message": "Hola, quiero confirmar la hora del servicio."
}
```

Nota:

- Por REST, `senderId` se toma del token.
- `roomId` recomendado: `solicitud-{id}`.

### 👀 Listar mensajes del usuario

```txt
GET /api/chats
```

Token: sí.

Roles:

- `admin`: ve todos.
- Usuario normal: ve mensajes enviados o recibidos.

### 👀 Cargar historial por sala

```txt
GET /api/chats/room/:roomId
```

Token: sí.

Ejemplo:

```txt
GET /api/chats/room/solicitud-1
```

Uso UI:

- Llamar al abrir una conversación.
- Renderizar historial antes de conectar WebSocket.

Flujo recomendado:

```txt
1. GET /api/chats/room/solicitud-1
2. Renderizar historial
3. Conectar socket
4. Emitir joinRoom
5. Escuchar newMessage
```

### 👀 Ver mensaje por ID

```txt
GET /api/chats/:id
```

Token: sí.

Roles: `admin`, emisor o receptor.

### 🟡 Actualizar mensaje

```txt
PATCH /api/chats/:id
```

Token: sí.

Roles: `admin` o emisor.

Body:

```json
{
  "message": "Mensaje editado",
  "read": true
}
```

### 🔴 Eliminar mensaje

```txt
DELETE /api/chats/:id
```

Token: sí.

Roles: `admin` o emisor.

## ⚡ Chat WebSocket

Namespace Socket.IO:

```txt
http://localhost:3000/chat
```

### Unirse a sala

Evento:

```txt
joinRoom
```

Payload:

```json
{
  "roomId": "solicitud-1"
}
```

ACK esperado:

```json
{
  "event": "joinedRoom",
  "data": {
    "roomId": "solicitud-1"
  }
}
```

### Enviar mensaje

Evento:

```txt
sendMessage
```

Payload actual:

```json
{
  "roomId": "solicitud-1",
  "senderId": 2,
  "receiverId": 3,
  "message": "Hola desde cliente"
}
```

ACK esperado:

```json
{
  "roomId": "solicitud-1",
  "senderId": 2,
  "receiverId": 3,
  "message": "Hola desde cliente",
  "read": false,
  "_id": "mongo_id",
  "createdAt": "2026-05-17T07:57:28.416Z",
  "updatedAt": "2026-05-17T07:57:28.416Z"
}
```

### Recibir mensaje

Evento:

```txt
newMessage
```

Payload:

```json
{
  "roomId": "solicitud-1",
  "senderId": 3,
  "receiverId": 2,
  "message": "Hola, claro",
  "read": false,
  "_id": "mongo_id",
  "createdAt": "2026-05-17T07:58:00.000Z",
  "updatedAt": "2026-05-17T07:58:00.000Z"
}
```

Nota para frontend:

- Pintar el ACK para feedback inmediato.
- Evitar duplicados si también llega el mismo mensaje por `newMessage`.
- Usar `_id` como llave única.

## 🧾 Logs

Colección MongoDB. Uso administrativo.

### 🟢 Crear log

```txt
POST /api/logs
```

Token: sí.

Roles: `admin`.

Body:

```json
{
  "userId": 1,
  "action": "CREATE_SERVICE",
  "entity": "Servicio",
  "entityId": "1",
  "metadata": {
    "titulo": "Instalacion electrica",
    "ip": "127.0.0.1"
  }
}
```

### 👀 Listar logs

```txt
GET /api/logs
```

Token: sí.

Roles: `admin`.

### 👀 Ver log por ID

```txt
GET /api/logs/:id
```

Token: sí.

Roles: `admin`.

### 🔴 Eliminar log

```txt
DELETE /api/logs/:id
```

Token: sí.

Roles: `admin`.

## 🧭 Flujos UI recomendados

### 🏠 Catálogo de servicios

```txt
GET /api/services
GET /api/services/:id
```

Pantallas:

- Home de servicios.
- Detalle de servicio.
- Perfil corto del prestador.

### 🧑‍🔧 Flujo prestador

```txt
POST /api/services
GET /api/solicitudes
PATCH /api/solicitudes/:id
GET /api/chats/room/:roomId
Socket joinRoom/sendMessage
```

Pantallas:

- Mis servicios.
- Crear/editar servicio.
- Solicitudes recibidas.
- Chat con cliente.

### 🙋 Flujo cliente

```txt
GET /api/services
POST /api/solicitudes
POST /api/pagos
GET /api/chats/room/:roomId
Socket joinRoom/sendMessage
POST /api/calificaciones
```

Pantallas:

- Buscar servicio.
- Detalle de servicio.
- Crear solicitud.
- Pago.
- Chat.
- Calificación.

### 💬 Flujo chat correcto

```txt
1. Login del usuario
2. Abrir conversación
3. GET /api/chats/room/solicitud-{id}
4. Renderizar historial
5. Conectar Socket.IO a /chat
6. Emitir joinRoom
7. Enviar con sendMessage
8. Escuchar newMessage
```

## 🎨 Notas para UI/UX

- Mostrar estados de solicitud con colores claros:
  - `pendiente`: amarillo
  - `aceptada`: azul
  - `rechazada`: rojo
  - `completada`: verde
  - `cancelada`: gris
- Mostrar `disponible` en servicios como switch.
- Mostrar `read` en notificaciones como leído/no leído.
- En chat, usar `_id` para evitar duplicados.
- En pagos, mostrar estado con chip visual.
- En calificaciones, usar selector de 1 a 5 estrellas.

## 🧪 Orden recomendado para probar todo

1. Login como prestador.
2. Crear servicio.
3. Login como cliente.
4. Crear solicitud sobre ese servicio.
5. Login como prestador.
6. Aceptar solicitud.
7. Cliente crea pago.
8. Prestador o admin marca solicitud como completada.
9. Cliente crea calificación.
10. Cliente y prestador abren chat.
11. Cargar historial por REST.
12. Enviar mensajes por WebSocket.
