# ChambaApp Backend

Backend transaccional y de tiempo real para una plataforma de contratación de servicios profesionales a domicilio.

ChambaApp conecta clientes que requieren un trabajo con prestadores que publican servicios, administran solicitudes, agenda, conversaciones, reputación y pagos simulados. Este repositorio implementa la API REST y el canal Socket.IO consumidos por el frontend, con PostgreSQL como base principal y MongoDB para datos documentales de comunicación y operación.

## Tabla de contenidos

1. [Propósito del sistema](#propósito-del-sistema)
2. [Características principales](#características-principales)
3. [Tecnologías utilizadas](#tecnologías-utilizadas)
4. [Arquitectura general](#arquitectura-general)
5. [Diagramas de arquitectura](#diagramas-de-arquitectura)
6. [Flujo de datos](#flujo-de-datos)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Módulos del sistema](#módulos-del-sistema)
9. [Base de datos](#base-de-datos)
10. [Modelo relacional](#modelo-relacional)
11. [API REST y WebSocket](#api-rest-y-websocket)
12. [Variables de entorno](#variables-de-entorno)
13. [Instalación local](#instalación-local)
14. [Docker y despliegue](#docker-y-despliegue)
15. [Pipeline CICD](#pipeline-cicd)
16. [Seguridad](#seguridad)
17. [Manejo de errores y observabilidad](#manejo-de-errores-y-observabilidad)
18. [Estrategia de testing](#estrategia-de-testing)
19. [Escalabilidad](#escalabilidad)
20. [Decisiones arquitectónicas](#decisiones-arquitectónicas)
21. [Roadmap](#roadmap)
22. [Contribución](#contribución)
23. [Licencia](#licencia)

## Propósito del sistema

### Objetivo principal

Proveer un backend seguro para el ciclo completo de un servicio local:

1. Un prestador publica un servicio.
2. Un cliente descubre al prestador y registra una solicitud agendada.
3. Ambas partes negocian o aceptan una fecha sin dobles reservas.
4. El cliente registra y confirma un pago simulado.
5. El prestador ejecuta el servicio y el cliente deja una reseña.
6. Ambos consultan chat, notificaciones y dashboards relacionados.

### Problema que resuelve

La contratación informal de servicios suele carecer de agenda verificable, historial, confianza, visibilidad del costo y comunicación centralizada. ChambaApp consolida:

| Necesidad                 | Solución implementada                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Encontrar prestadores     | Catálogo público filtrable por categoría, precio, distancia, calificación y disponibilidad |
| Coordinar visitas         | Solicitudes con fecha, duración, reprogramación y control de traslapes                     |
| Reducir disputas de monto | Monto del pago derivado en backend del precio registrado                                   |
| Dar seguimiento           | Estados de trabajo, dashboards, notificaciones y chat                                      |
| Construir confianza       | Calificaciones únicas por servicio completado y perfil profesional                         |

### Alcance actual

El repositorio es el backend de ChambaApp. El frontend React mencionado en el contrato de integración es un consumidor externo y no forma parte de este proyecto. El flujo de pago es deliberadamente simulado para uso académico: no procesa tarjetas ni integra una pasarela financiera.

### Supuestos y limitaciones verificadas

| Tema         | Estado en el código actual                                                                                                   | Implicación para mantenimiento                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Roles seed   | Los roles se crean en orden `admin`, `cliente`, `prestador`; algunos servicios interpretan `rol_id === 1` como administrador | No alterar IDs de roles sin refactorizar autorización para resolver por nombre |
| Pago         | Confirmación simulada por API, sin proveedor externo                                                                         | No representa transferencia real ni cumplimiento financiero                    |
| MongoDB      | Requerido por arranque de `AppModule`; no se incluye como servicio de Compose                                                | Configurar una instancia alcanzable incluso si sólo se prueban rutas SQL       |
| Conversación | `roomId = request-{id}` enlaza MongoDB con PostgreSQL lógicamente                                                            | No existe FK entre bases; conservar convenio en clientes y migraciones         |
| Auditoría    | El módulo de logs es invocable por admin, no automático                                                                      | Las operaciones de negocio no generan trazabilidad integral por sí mismas      |
| API legacy   | Rutas `/solicitudes`, `/pagos` y `/chats` permanecen por compatibilidad                                                      | Preferir contratos `/requests` y `/conversations` para nuevas pantallas        |

## Características principales

- API REST versionada por prefijo `/api`.
- Autenticación con JWT y contraseñas protegidas mediante `bcrypt`.
- Roles `admin`, `cliente` y `prestador` con autorización por endpoint.
- Perfil de usuario y perfil profesional del prestador.
- Catálogo público de servicios y categorías.
- Filtros de catálogo por búsqueda, ubicación, radio, precio, rating y disponibilidad.
- Direcciones propias del usuario para solicitudes.
- Prestadores favoritos del cliente.
- Solicitudes de servicio compatibles con CRUD histórico y contrato nuevo `/requests`.
- Agenda con fecha solicitada, duración estimada y negociación de nueva fecha.
- Prevención transaccional de reservas traslapadas para un prestador.
- Estados de ejecución del trabajo: `pending`, `accepted`, `on_the_way`, `in_progress`, `completed`, `cancelled` y `rejected`.
- Pago simulado con estados canónicos `pending`, `paid`, `failed` y `refunded`.
- Protección del monto: el backend calcula el importe a cobrar.
- Dashboards de cliente y prestador; ganancias basadas solamente en pagos confirmados.
- Reseñas y resumen público de reputación.
- Chat persistente en MongoDB por REST y en tiempo real por Socket.IO.
- Notificaciones persistentes y eventos de tiempo real por usuario.
- Registro documental administrativo de logs.
- Migraciones y seed reproducible con Prisma.
- Ejecución local o mediante Docker Compose.
- Despliegue actual por GitHub Actions hacia EC2 vía SSH.

## Tecnologías utilizadas

Las versiones instaladas se obtienen del `package-lock.json`/árbol local; la imagen de ejecución establece Node.js y PostgreSQL.

| Tecnología              |                       Versión actual | Uso                                                    |
| ----------------------- | -----------------------------------: | ------------------------------------------------------ |
| Node.js                 |                `22-alpine` en Docker | Runtime del backend                                    |
| TypeScript              |                              `5.7.x` | Lenguaje y tipado estático                             |
| NestJS                  |                             `11.1.x` | Framework modular HTTP/WebSocket                       |
| Express adapter         |                             `11.1.x` | Servidor HTTP subyacente de NestJS                     |
| PostgreSQL              |                      `16` en Compose | Persistencia relacional transaccional                  |
| Prisma Client / CLI     |                             `6.19.3` | ORM, esquema, migraciones y seed                       |
| MongoDB                 | Instancia externa o local compatible | Persistencia documental de chat, notificaciones y logs |
| Mongoose                |                              `9.6.2` | ODM para MongoDB                                       |
| Passport JWT            |                              `4.0.1` | Estrategia de autenticación REST                       |
| `@nestjs/jwt`           |                             `11.0.2` | Firma y verificación de tokens                         |
| `bcrypt`                |                              `6.0.0` | Hash de contraseñas                                    |
| Socket.IO               |                              `4.8.3` | Comunicación bidireccional para chat y eventos         |
| `class-validator`       |                             `0.15.1` | Validación declarativa de DTOs                         |
| `class-transformer`     |                              `0.5.1` | Conversión de queries y bodies                         |
| Jest                    |                             `30.4.x` | Pruebas unitarias/e2e                                  |
| ESLint                  |                             `9.39.x` | Análisis estático                                      |
| Prettier                |                              `3.8.x` | Formato de código                                      |
| Docker / Docker Compose |                 Requerido en entorno | Empaquetado y orquestación local/EC2                   |
| GitHub Actions          |                   Workflow existente | Despliegue automatizado a EC2                          |

## Arquitectura general

### Estilo arquitectónico

ChambaApp Backend es un **monolito modular** NestJS. Los módulos viven en el mismo proceso y comparten infraestructura, pero delimitan capacidades funcionales independientes: identidad, catálogo, solicitudes, pagos, reputación, comunicación y dashboards.

No es una arquitectura de microservicios. Esa elección reduce complejidad operativa para el alcance actual, permite transacciones directas sobre PostgreSQL y mantiene la integración del frontend sencilla.

### Persistencia híbrida

| Base                       | Información almacenada                                                                              | Razón técnica                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| PostgreSQL mediante Prisma | usuarios, roles, categorías, servicios, solicitudes, direcciones, favoritos, pagos y calificaciones | Relaciones, restricciones únicas, filtros y consistencia de negocio      |
| MongoDB mediante Mongoose  | mensajes de chat, notificaciones y logs                                                             | Documentos cronológicos, escritura flexible y consultas por sala/usuario |

La relación entre una conversación MongoDB y el dominio relacional se mantiene mediante el convenio `roomId = "request-{solicitudId}"`. Los identificadores de usuario presentes en MongoDB corresponden a `Usuario.id` en PostgreSQL.

### Capas del sistema

| Capa                       | Componentes                            | Responsabilidad                                                            |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| Presentación               | Controllers REST, `ChatsGateway`, DTOs | Exponer contratos HTTP/Socket, recibir entrada y serializar respuesta      |
| Aplicación                 | Services NestJS                        | Ejecutar casos de uso, reglas de roles/propiedad, estados y notificaciones |
| Dominio lógico             | Reglas en servicios                    | Agenda, pagos, reputación, privacidad de contacto y transiciones           |
| Infraestructura relacional | `PrismaService`, esquema y migraciones | Persistir entidades transaccionales y relaciones                           |
| Infraestructura documental | Modelos Mongoose                       | Persistir chat, notificaciones y logs                                      |
| Operación                  | Dockerfile, Compose, GitHub Actions    | Construcción, dependencias de ejecución y despliegue                       |

### Decisiones de consistencia importantes

- La aceptación de una solicitud usa una transacción y `pg_advisory_xact_lock(providerId)` para serializar aceptaciones concurrentes del mismo prestador.
- El pago tiene restricción única por solicitud en PostgreSQL.
- La calificación tiene restricción única por solicitud.
- El backend emite eventos Socket.IO después de persistir; REST y las bases de datos siguen siendo la fuente de verdad.
- Chat, notificaciones y logs no participan en una transacción distribuida con PostgreSQL. En fallos parciales se debe reintentar o reconciliar a nivel de aplicación.

## Diagramas de arquitectura

### Contenedores y dependencias

```mermaid
flowchart LR
    FE["Frontend web / cliente API"] -->|"HTTPS REST /api + JWT"| API["ChambaApp Backend<br/>NestJS monolito modular"]
    FE <-->|"Socket.IO /chat + JWT"| API
    API -->|"Prisma ORM"| PG[("PostgreSQL 16<br/>negocio transaccional")]
    API -->|"Mongoose ODM"| MG[("MongoDB<br/>chat, notificaciones, logs")]
    API -->|"Eventos privados user-{id}"| FE
    CICD["GitHub Actions"] -->|"SSH + Docker Compose"| VM["Servidor EC2"]
    VM --> API
```

### Módulos internos

```mermaid
flowchart TB
    App["AppModule"] --> Auth["AuthModule"]
    App --> Users["UsersModule"]
    App --> Services["ServicesModule"]
    App --> Requests["SolicitudesModule"]
    App --> Payments["PagosModule"]
    App --> Reviews["CalificacionesModule"]
    App --> Chat["ChatsModule"]
    App --> Notifications["NotificationsModule"]
    App --> Logs["LogsModule"]
    App --> Addresses["AddressesModule"]
    App --> Favorites["FavoritesModule"]
    App --> Dashboard["DashboardModule"]
    Auth --> Prisma["PrismaModule"]
    Users --> Prisma
    Services --> Prisma
    Requests --> Prisma
    Payments --> Prisma
    Reviews --> Prisma
    Addresses --> Prisma
    Favorites --> Prisma
    Dashboard --> Prisma
    Requests --> Notifications
    Payments --> Notifications
    Requests --> Chat
    Payments --> Chat
    Chat --> Mongo["Mongoose / MongoDB"]
    Notifications --> Mongo
    Logs --> Mongo
```

### Despliegue actual

```mermaid
flowchart LR
    Dev["Push a master"] --> GH["GitHub Actions<br/>deploy.yml"]
    GH -->|"SSH con secrets"| EC2["EC2 /opt/chambaapp/ChambaApp-BackEnd"]
    EC2 --> Pull["git pull origin master"]
    Pull --> Env["Genera .env con secrets"]
    Env --> Compose["docker compose down<br/>docker compose up -d --build"]
    Compose --> Backend["Contenedor backend"]
    Compose --> Postgres[("Contenedor PostgreSQL")]
    Backend --> Mongo[("MongoDB configurado por URI")]
```

## Flujo de datos

### Entrada, validación, procesamiento y respuesta

1. El cliente envía HTTP JSON o un evento Socket.IO.
2. NestJS aplica prefijo `/api`, CORS y `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted` y `transform`.
3. En rutas protegidas, `AuthGuard('jwt')` extrae y verifica el bearer token.
4. `RolesGuard` consulta el rol persistido y autoriza la operación declarada por `@Roles`.
5. El controller delega el caso de uso al service.
6. El service verifica propiedad, estado de negocio y consistencia.
7. Prisma o Mongoose persisten el resultado.
8. Cuando corresponde, se crea una notificación MongoDB y se emite un evento Socket.IO.
9. El controller retorna JSON o NestJS transforma una excepción en error HTTP.

### Flujo principal de solicitud, agenda y pago

```mermaid
sequenceDiagram
    actor C as Cliente
    participant API as API NestJS
    participant PG as PostgreSQL
    participant N as Mongo Notificaciones
    participant S as Socket.IO
    actor P as Prestador

    C->>API: POST /api/requests<br/>fechaSolicitada + duracion
    API->>API: Validar fecha futura y propiedad/dirección
    API->>PG: INSERT Solicitud pending
    API->>N: Notificar nueva solicitud
    API-->>S: requestCreated para prestador
    API-->>C: Solicitud normalizada

    P->>API: PATCH /api/provider/requests/:id/accept
    API->>PG: Transacción + advisory lock
    API->>PG: Buscar traslapes activos
    alt existe traslape
        API-->>P: 409 SCHEDULE_CONFLICT
    else horario disponible
        API->>PG: estado = accepted
        API->>N: Notificar aceptación
        API-->>S: requestStatusChanged para cliente
        API-->>P: Trabajo aceptado
    end

    C->>API: POST /api/requests/:id/payment
    API->>PG: Crear Pago pending con monto calculado
    API-->>C: Intento de pago
    C->>API: PATCH /api/requests/:id/payment/confirm
    API->>PG: estado = paid, fecha_pago = now()
    API->>N: Notificar pago al prestador
    API-->>S: paymentPaid
    API-->>C: Pago confirmado
```

### Negociación de agenda

```mermaid
stateDiagram-v2
    [*] --> pending: Cliente crea solicitud
    pending --> pending: Cliente reprograma
    pending --> pending: Prestador propone fecha
    pending --> pending: Cliente acepta fecha propuesta
    pending --> accepted: Prestador acepta sin conflicto
    pending --> rejected: Prestador rechaza
    pending --> cancelled: Cliente cancela
    accepted --> on_the_way: Prestador en camino
    accepted --> in_progress: Prestador inicia directamente
    accepted --> cancelled: Cliente cancela
    on_the_way --> in_progress: Prestador inicia
    in_progress --> completed: Prestador finaliza
    completed --> [*]
    rejected --> [*]
    cancelled --> [*]
```

### Estados de pago

| Estado     | Significado                                           | Impacta dashboard/ganancias |
| ---------- | ----------------------------------------------------- | --------------------------- |
| `pending`  | Intento registrado sin confirmación                   | No                          |
| `paid`     | Pago simulado confirmado y fechado                    | Sí                          |
| `failed`   | Pago fallido, soportado por modelo/administración     | No                          |
| `refunded` | Pago reembolsado, soportado por modelo/administración | No                          |

El monto se deriva en el orden `precio_final ?? precio_estimado ?? servicio.precio_base`. Ningún endpoint orientado a cliente confía en el monto enviado desde UI.

## Estructura del proyecto

```text
chabaapp-backend/
├── .github/
│   └── workflows/
│       └── deploy.yml                     # Despliegue actual a EC2 por SSH
├── prisma/
│   ├── migrations/                        # Historial SQL de estructura PostgreSQL
│   ├── schema.prisma                      # Modelo relacional principal
│   └── seed.ts                            # Roles, usuarios y servicio demo
├── src/
│   ├── addresses/                         # Direcciones del usuario
│   │   └── dto/
│   ├── auth/                              # Login, registro, JWT, roles
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── jwt/
│   │   └── types/
│   ├── calificaciones/                    # Reseñas y reputación
│   │   └── dto/
│   ├── chats/                             # REST + gateway Socket.IO + mensajes MongoDB
│   │   ├── dto/
│   │   └── schemas/
│   ├── dashboard/                         # Métricas y ganancias
│   ├── favorites/                         # Prestadores favoritos
│   ├── logs/                              # Auditoría documental administrativa
│   │   ├── dto/
│   │   └── schemas/
│   ├── notifications/                     # Notificaciones MongoDB
│   │   ├── dto/
│   │   └── schemas/
│   ├── pagos/                             # Pago legacy y flujo UI simulado
│   │   └── dto/
│   ├── prisma/                            # Cliente Prisma compartido
│   ├── services/                          # Catálogo de servicios/categorías
│   │   └── dto/
│   ├── solicitudes/                       # Solicitudes, agenda y trabajos
│   │   └── dto/
│   ├── users/                             # Usuarios y perfiles
│   │   └── dto/
│   ├── app.controller.ts                 # Health/saludo básico en GET /api
│   ├── app.module.ts                     # Composición raíz y conexión MongoDB
│   └── main.ts                           # Bootstrap, CORS, prefijo y validación
├── test/
│   ├── app.e2e-spec.ts                   # Suite e2e Nest inicial
│   └── jest-e2e.json
├── .env.example                          # Plantilla de configuración
├── Dockerfile                            # Imagen backend
├── docker-compose.yml                    # Backend + PostgreSQL local/servidor
├── DOCUMENTACION_CONSUMO_API.md          # Contrato extenso orientado al frontend
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

### Archivos operativos importantes

| Archivo                             | Responsabilidad                                                         |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `src/main.ts`                       | Inicializa Nest, aplica `/api`, habilita CORS y valida DTOs globalmente |
| `src/app.module.ts`                 | Registra módulos y conexión MongoDB                                     |
| `prisma/schema.prisma`              | Fuente de verdad del modelo PostgreSQL                                  |
| `prisma/migrations/*/migration.sql` | Cambios reproducibles de base de datos                                  |
| `prisma/seed.ts`                    | Datos mínimos para probar el sistema                                    |
| `Dockerfile`                        | Construye backend, genera Prisma, compila y ejecuta migraciones/seed    |
| `docker-compose.yml`                | Ejecuta PostgreSQL y backend                                            |
| `.github/workflows/deploy.yml`      | Despliega a EC2 en cada push a `master`                                 |

## Módulos del sistema

### `AuthModule`

**Responsabilidad:** registro público de clientes/prestadores y autenticación.

| Componente       | Función                                                      |
| ---------------- | ------------------------------------------------------------ |
| `AuthController` | Rutas `/auth/register` y `/auth/login`                       |
| `AuthService`    | Hash bcrypt, lookup de rol, validación de cuenta y firma JWT |
| `JwtStrategy`    | Lee Bearer token y construye `AuthUser`                      |
| `RolesGuard`     | Comprueba roles persistidos para `@Roles(...)`               |

**Flujo interno:** al registrar, valida correo único, resuelve rol permitido y almacena hash bcrypt. Al iniciar sesión, compara hash y firma un token de 7 días con `sub`, `correo` y `rol_id`.

### `UsersModule`

**Responsabilidad:** administración de usuarios, perfil propio y perfil profesional.

| Controller                       | Operaciones                              |
| -------------------------------- | ---------------------------------------- |
| `UsersController`                | Perfil autenticado y CRUD administrativo |
| `ProvidersProfileController`     | Datos laborales de prestador             |
| `ProviderAvailabilityController` | Switch de disponibilidad                 |

**Flujo interno:** el usuario actualiza identidad/ubicación/preferencias; un prestador agrega especialidad, tarifa, cobertura y etiquetas; el administrador puede activar, verificar, cambiar rol o eliminar usuarios.

### `ServicesModule`

**Responsabilidad:** catálogo público de trabajos ofrecidos.

| Componente             | Función                                        |
| ---------------------- | ---------------------------------------------- |
| `ServicesController`   | CRUD de servicios y búsqueda pública           |
| `CategoriesController` | Categorías públicas con disponibilidad         |
| `ServicesService`      | Filtros, rating promedio y distancia Haversine |

**Flujo interno:** el prestador crea un servicio vinculado a sí mismo; el catálogo reúne categoría, reputación, disponibilidad y ubicación para devolver tarjetas listas para UI.

### `SolicitudesModule`

**Responsabilidad:** núcleo de contratación, agenda y ciclo del trabajo.

| Contrato       | Uso                                    |
| -------------- | -------------------------------------- |
| `/solicitudes` | CRUD histórico compatible              |
| `/requests`    | Contrato frontend para clientes        |
| `/provider/*`  | Bandeja, agenda y avance del prestador |

**Flujo interno:** una solicitud nueva exige fecha futura y duración positiva, notifica al prestador y queda `pending`. La aceptación se protege con bloqueo de PostgreSQL y verifica intervalos activos. El módulo también orquesta propuestas de fecha, privacidad de dirección/contacto y eventos de cambio de estado.

### `PagosModule`

**Responsabilidad:** registrar pagos vinculados a solicitudes.

| Contrato                        | Uso                              |
| ------------------------------- | -------------------------------- |
| `/pagos`                        | CRUD compatible anterior         |
| `/requests/:id/payment`         | Intento/consulta de pago para UI |
| `/requests/:id/payment/confirm` | Confirmación simulada            |

**Flujo interno:** sólo el cliente dueño paga solicitudes aceptadas o avanzadas. Se calcula un único importe en servidor y al confirmar se actualiza `fecha_pago`, se notifica al prestador y se habilita el cómputo financiero.

### `DashboardModule`

**Responsabilidad:** métricas agregadas para vistas principales.

| Endpoint                     | Métricas                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `/dashboard/client`          | solicitudes activas, completadas, gasto mensual pagado, favoritos y próximas visitas |
| `/dashboard/provider`        | solicitudes pendientes, trabajos activos/completados, rating y ganancias             |
| `/provider/earnings/summary` | totales pagados en rango                                                             |
| `/provider/transactions`     | pagos confirmados relacionados                                                       |

### `CalificacionesModule`

**Responsabilidad:** reputación posterior al servicio.

Un cliente sólo puede calificar una solicitud propia completada y sólo existe una calificación por solicitud. El prestador obtiene distribución, promedio y porcentaje de satisfacción; los perfiles públicos pueden consultarlo sin autenticación.

### `ChatsModule`

**Responsabilidad:** conversación persistente y eventos en tiempo real.

| Componente                | Función                                         |
| ------------------------- | ----------------------------------------------- |
| `ChatsController`         | CRUD legacy de mensajes MongoDB                 |
| `ConversationsController` | Conversación normalizada por solicitud          |
| `ChatsGateway`            | Namespace Socket.IO `/chat` autenticado con JWT |
| `ChatsService`            | Autoriza participantes y mapea `request-{id}`   |

**Flujo interno:** cliente y prestador de una solicitud consultan mensajes por REST; el socket autentica el JWT al conectar, une automáticamente `user-{id}` y sólo deja unir salas `request-{id}` si el usuario participa.

### `NotificationsModule`

**Responsabilidad:** bandeja persistente de alertas MongoDB.

Las notificaciones se crean desde solicitudes y pagos o manualmente por administrador. Un usuario sólo puede leer/modificar/eliminar sus documentos; el administrador accede a todos.

### `LogsModule`

**Responsabilidad:** registros administrativos flexibles en MongoDB.

Actualmente expone CRUD sólo para administrador. No existe todavía un interceptor global que capture acciones automáticamente.

### `AddressesModule`

**Responsabilidad:** direcciones reutilizables del usuario autenticado.

La propiedad se comprueba en cada actualización. Una solicitud puede apuntar a una dirección guardada o contener una dirección textual.

### `FavoritesModule`

**Responsabilidad:** relación cliente-prestador guardada.

Previene duplicados mediante `@@unique([cliente_id, prestador_id])` y devuelve tarjetas del catálogo marcadas como favoritas.

### `PrismaModule`

**Responsabilidad:** proporcionar una instancia única de `PrismaService` conectada a PostgreSQL durante la inicialización del módulo.

## Base de datos

### PostgreSQL: entidades transaccionales

#### `Role`

| Campo    | Tipo                     | Descripción                      |
| -------- | ------------------------ | -------------------------------- |
| `id`     | `Int` PK autoincremental | Identificador                    |
| `nombre` | `String` único           | `admin`, `cliente` o `prestador` |

Relación: un rol tiene muchos usuarios.

#### `Usuario`

| Campo                                       | Tipo                | Descripción                         |
| ------------------------------------------- | ------------------- | ----------------------------------- |
| `id`                                        | `Int` PK            | Identificador                       |
| `nombre`, `apellido`                        | `String`, `String?` | Identidad visible                   |
| `correo`                                    | `String` único      | Credencial de login                 |
| `password_hash`                             | `String`            | Hash bcrypt, nunca respuesta de API |
| `telefono`, `foto_perfil`                   | `String?`           | Contacto y avatar                   |
| `activo`, `verificado`                      | `Boolean`           | Control administrativo              |
| `fecha_registro`                            | `DateTime`          | Alta del usuario                    |
| `ciudad`, `estado`, `lat`, `lng`            | Opcionales          | Ubicación del perfil                |
| `preferencias`                              | `Json?`             | Configuración del cliente           |
| `especialidad`, `descripcion_profesional`   | `String?`           | Perfil prestador                    |
| `experiencia_anios`, `precio_hora`          | Opcionales          | Perfil prestador                    |
| `zona_cobertura`, `disponible`, `etiquetas` | Opcionales/default  | Catálogo del prestador              |
| `rol_id`                                    | `Int` FK            | Rol asignado                        |

Relaciones: servicios publicados, solicitudes como cliente, calificaciones, direcciones y favoritos.

#### `Categoria`

| Campo    | Tipo           | Descripción                 |
| -------- | -------------- | --------------------------- |
| `id`     | `Int` PK       | Identificador               |
| `nombre` | `String` único | Nombre visible de categoría |

Relación: contiene muchos servicios.

#### `Servicio`

| Campo                   | Tipo       | Descripción                                 |
| ----------------------- | ---------- | ------------------------------------------- |
| `id`                    | `Int` PK   | Identificador del servicio                  |
| `titulo`, `descripcion` | `String`   | Presentación comercial                      |
| `precio_base`           | `Float`    | Precio base utilizado como fallback de pago |
| `disponible`            | `Boolean`  | Publicación activa                          |
| `fecha_creacion`        | `DateTime` | Registro                                    |
| `prestador_id`          | `Int` FK   | Usuario prestador propietario               |
| `categoria_id`          | `Int?` FK  | Categoría opcional                          |

Relaciones: solicitudes y calificaciones.

#### `Solicitud`

| Campo                             | Tipo        | Descripción                                |
| --------------------------------- | ----------- | ------------------------------------------ |
| `id`                              | `Int` PK    | Identificador de contratación/conversación |
| `titulo`, `descripcion`           | `String?`   | Descripción del trabajo                    |
| `direccion_servicio`              | `String?`   | Dirección textual capturada                |
| `prioridad`                       | `String`    | `normal` o `urgent`                        |
| `estado`                          | `String`    | Estado canónico del ciclo de trabajo       |
| `fecha_solicitud`                 | `DateTime`  | Creación                                   |
| `fecha_programada`                | `DateTime?` | Fecha solicitada/acordada                  |
| `fecha_propuesta`                 | `DateTime?` | Fecha alternativa del prestador            |
| `propuesta_pendiente`             | `Boolean`   | Indica aceptación pendiente del cliente    |
| `duracion_estimada_min`           | `Int?`      | Intervalo usado para agenda                |
| `precio_estimado`, `precio_final` | `Float?`    | Base de cálculo del pago                   |
| `cliente_id`, `servicio_id`       | `Int` FK    | Participantes y servicio                   |
| `direccion_id`                    | `Int?` FK   | Dirección guardada opcional                |

Relaciones: un pago máximo y una calificación máxima.

#### `Direccion`

| Campo                       | Tipo      | Descripción         |
| --------------------------- | --------- | ------------------- |
| `id`                        | `Int` PK  | Identificador       |
| `etiqueta`                  | `String?` | Casa, oficina, etc. |
| `calle`, `ciudad`, `estado` | `String`  | Dirección           |
| `codigo_postal`             | `String?` | Código postal       |
| `lat`, `lng`                | `Float?`  | Georreferencia      |
| `usuario_id`                | `Int` FK  | Propietario         |

#### `Favorito`

| Campo            | Tipo       | Descripción        |
| ---------------- | ---------- | ------------------ |
| `id`             | `Int` PK   | Identificador      |
| `cliente_id`     | `Int` FK   | Cliente que guarda |
| `prestador_id`   | `Int` FK   | Prestador guardado |
| `fecha_creacion` | `DateTime` | Creación           |

Restricción: pareja cliente/prestador única.

#### `Pago`

| Campo                  | Tipo           | Descripción                             |
| ---------------------- | -------------- | --------------------------------------- |
| `id`                   | `Int` PK       | Identificador                           |
| `monto`                | `Float`        | Importe derivado por servidor           |
| `metodo`, `referencia` | `String?`      | Información no sensible del pago        |
| `estado`               | `String`       | `pending`, `paid`, `failed`, `refunded` |
| `fecha_pago`           | `DateTime?`    | Momento de confirmación                 |
| `fecha_creacion`       | `DateTime`     | Momento de intento                      |
| `solicitud_id`         | `Int` FK único | Solicitud pagada                        |

#### `Calificacion`

| Campo                                       | Tipo           | Descripción                  |
| ------------------------------------------- | -------------- | ---------------------------- |
| `id`                                        | `Int` PK       | Identificador                |
| `puntuacion`                                | `Int`          | Escala 1 a 5                 |
| `comentario`                                | `String?`      | Reseña                       |
| `fecha_creacion`                            | `DateTime`     | Creación                     |
| `cliente_id`, `prestador_id`, `servicio_id` | `Int` FK       | Contexto                     |
| `solicitud_id`                              | `Int` FK único | Servicio completado evaluado |

### MongoDB: colecciones documentales

#### `ChatMessage`

| Campo                    | Tipo                | Descripción                      |
| ------------------------ | ------------------- | -------------------------------- |
| `_id`                    | `ObjectId`          | Identificador MongoDB            |
| `roomId`                 | `string`            | Sala, normalmente `request-{id}` |
| `senderId`, `receiverId` | `number`, `number?` | IDs PostgreSQL de usuarios       |
| `message`                | `string`            | Texto                            |
| `read`                   | `boolean`           | Leído                            |
| `createdAt`, `updatedAt` | `Date`              | Timestamps automáticos           |

#### `Notification`

| Campo                    | Tipo      | Descripción                 |
| ------------------------ | --------- | --------------------------- |
| `userId`                 | `number`  | Usuario PostgreSQL receptor |
| `title`, `message`       | `string`  | Contenido                   |
| `read`                   | `boolean` | Estado de lectura           |
| `createdAt`, `updatedAt` | `Date`    | Timestamps automáticos      |

#### `Log`

| Campo                    | Tipo      | Descripción            |
| ------------------------ | --------- | ---------------------- |
| `userId`                 | `number?` | Usuario relacionado    |
| `action`                 | `string`  | Acción auditada        |
| `entity`, `entityId`     | `string?` | Recurso                |
| `metadata`               | `object?` | Datos adicionales      |
| `createdAt`, `updatedAt` | `Date`    | Timestamps automáticos |

## Modelo relacional

```mermaid
erDiagram
    Role ||--o{ Usuario : assigns
    Usuario ||--o{ Servicio : publishes
    Categoria o|--o{ Servicio : classifies
    Usuario ||--o{ Solicitud : requests
    Servicio ||--o{ Solicitud : receives
    Usuario ||--o{ Direccion : owns
    Direccion o|--o{ Solicitud : used_in
    Usuario ||--o{ Favorito : saves_as_client
    Usuario ||--o{ Favorito : saved_provider
    Solicitud ||--o| Pago : has
    Solicitud ||--o| Calificacion : receives
    Usuario ||--o{ Calificacion : writes
    Usuario ||--o{ Calificacion : receives
    Servicio ||--o{ Calificacion : rates

    Role {
        int id PK
        string nombre UK
    }
    Usuario {
        int id PK
        string correo UK
        string password_hash
        int rol_id FK
        boolean disponible
        boolean verificado
    }
    Servicio {
        int id PK
        int prestador_id FK
        int categoria_id FK
        float precio_base
    }
    Solicitud {
        int id PK
        int cliente_id FK
        int servicio_id FK
        datetime fecha_programada
        int duracion_estimada_min
        string estado
    }
    Pago {
        int id PK
        int solicitud_id FK_UK
        float monto
        string estado
    }
    Calificacion {
        int id PK
        int solicitud_id FK_UK
        int puntuacion
    }
```

MongoDB referencia lógicamente solicitudes y usuarios mediante IDs numéricos, pero esas referencias no están protegidas por llaves foráneas.

## API REST y WebSocket

### Convenciones

| Elemento           | Valor                                  |
| ------------------ | -------------------------------------- |
| Base URL local     | `http://localhost:3000/api`            |
| Socket namespace   | `http://localhost:3000/chat`           |
| Autenticación REST | `Authorization: Bearer <access_token>` |
| Content-Type       | `application/json`                     |
| IDs PostgreSQL     | Números enteros                        |
| IDs MongoDB        | Strings `ObjectId`                     |
| Fechas             | ISO 8601 UTC recomendado               |

Las tablas siguientes documentan todos los endpoints implementados. En la columna de respuesta, `SolicitudUI` y `PagoUI` corresponden a los modelos completos definidos después del catálogo.

### Salud y autenticación

| Método y ruta             | Acceso  | Request                                                  | Response principal                                               | Códigos             |
| ------------------------- | ------- | -------------------------------------------------------- | ---------------------------------------------------------------- | ------------------- |
| `GET /api`                | Público | Sin body                                                 | String de saludo de `AppService`                                 | `200`               |
| `POST /api/auth/register` | Público | `{nombre, apellido?, correo, password, telefono?, rol?}` | `{message, user: {id, nombre, apellido, correo, rol, telefono}}` | `201`, `400`, `409` |
| `POST /api/auth/login`    | Público | `{correo, password}`                                     | `{access_token, user}`                                           | `201`, `400`, `401` |

Ejemplo de login:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "correo": "cliente@chambaapp.com",
  "password": "Password123"
}
```

```json
{
  "access_token": "eyJhbGciOi...",
  "user": {
    "id": 2,
    "nombre": "Cliente",
    "apellido": "Demo",
    "correo": "cliente@chambaapp.com",
    "rol": "cliente",
    "telefono": "5555555556",
    "avatar": null
  }
}
```

### Usuarios y perfiles

| Método y ruta                      | Acceso          | Request                                                                                                  | Response principal                | Códigos                                  |
| ---------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------- |
| `GET /api/users/profile`           | JWT             | Sin body                                                                                                 | Perfil normalizado y estadísticas | `200`, `401`, `404`                      |
| `PATCH /api/users/profile`         | JWT             | `{nombre?, apellido?, correo?, telefono?, avatar?, ubicacion?, preferencias?}`                           | Perfil actualizado                | `200`, `400`, `401`, `409`               |
| `POST /api/users`                  | `admin`         | Usuario con `rol_id`                                                                                     | Usuario creado sin password       | `201`, `400`, `401`, `403`, `409`        |
| `GET /api/users`                   | `admin`         | Sin body                                                                                                 | Lista de usuarios                 | `200`, `401`, `403`                      |
| `GET /api/users/:id`               | `admin`         | Sin body                                                                                                 | Usuario                           | `200`, `401`, `403`, `404`               |
| `PATCH /api/users/:id`             | Dueño o `admin` | Campos editables; sólo admin cambia rol/control                                                          | Usuario actualizado               | `200`, `400`, `401`, `403`, `404`, `409` |
| `DELETE /api/users/:id`            | `admin`         | Sin body                                                                                                 | `{message}`                       | `200`, `401`, `403`, `404`               |
| `PATCH /api/providers/profile`     | `prestador`     | `{especialidad?, descripcion?, experienciaAnios?, precioHora?, zonaCobertura?, disponible?, etiquetas?}` | Perfil actualizado                | `200`, `400`, `401`, `403`               |
| `PATCH /api/provider/availability` | `prestador`     | `{disponible: boolean}`                                                                                  | Perfil actualizado                | `200`, `400`, `401`, `403`               |

Ejemplo de respuesta de perfil:

```json
{
  "id": 3,
  "rol": "prestador",
  "nombre": "Prestador",
  "correo": "prestador@chambaapp.com",
  "ubicacion": {
    "ciudad": null,
    "estado": null,
    "lat": 21.123,
    "lng": -101.681
  },
  "estadisticas": {
    "solicitudes": 0,
    "completados": 0,
    "favoritos": 0,
    "ratingExperiencia": null
  },
  "especialidad": "Plomeria",
  "precioHora": 350,
  "disponible": true,
  "verificado": true
}
```

### Catálogo, categorías, direcciones y favoritos

| Método y ruta                       | Acceso               | Request / query                                                 | Response principal                           | Códigos                           |
| ----------------------------------- | -------------------- | --------------------------------------------------------------- | -------------------------------------------- | --------------------------------- |
| `GET /api/categories`               | Público              | Sin body                                                        | `{data: [{id, nombre, providersAvailable}]}` | `200`                             |
| `GET /api/services`                 | Público              | Query de búsqueda/filtros                                       | `{data: ServiceCard[], meta}`                | `200`, `400`                      |
| `GET /api/services/:id`             | Público              | Sin body                                                        | Detalle de tarjeta/servicio                  | `200`, `404`                      |
| `POST /api/services`                | `admin`, `prestador` | `{titulo, descripcion, precio_base, categoryId?}`               | Servicio creado                              | `201`, `400`, `401`, `403`        |
| `PATCH /api/services/:id`           | Dueño o `admin`      | Campos del servicio                                             | Servicio actualizado                         | `200`, `400`, `401`, `403`, `404` |
| `DELETE /api/services/:id`          | Dueño o `admin`      | Sin body                                                        | `{message}`                                  | `200`, `401`, `403`, `404`        |
| `GET /api/addresses`                | JWT                  | Sin body                                                        | `{data: Direccion[]}` propias                | `200`, `401`                      |
| `POST /api/addresses`               | JWT                  | `{etiqueta?, calle, ciudad, estado, codigoPostal?, lat?, lng?}` | Dirección creada                             | `201`, `400`, `401`               |
| `PATCH /api/addresses/:id`          | Dueño                | Mismo body de dirección                                         | Dirección actualizada                        | `200`, `400`, `401`, `404`        |
| `GET /api/favorites`                | `cliente`            | Sin body                                                        | `{data: ServiceCard[]}`                      | `200`, `401`, `403`               |
| `POST /api/favorites/:providerId`   | `cliente`            | Sin body                                                        | `{providerId, favorito: true}`               | `201`, `401`, `403`, `404`, `409` |
| `DELETE /api/favorites/:providerId` | `cliente`            | Sin body                                                        | `{providerId, favorito: false}`              | `200`, `401`, `403`               |

Queries de `GET /api/services`:

| Query                    | Tipo      | Descripción                                                     |
| ------------------------ | --------- | --------------------------------------------------------------- |
| `search`                 | `string`  | Coincidencia en título, descripción o especialidad              |
| `categoryId`             | `number`  | Categoría                                                       |
| `lat`, `lng`, `radiusKm` | `number`  | Distancia calculada con coordenadas del prestador               |
| `minPrice`, `maxPrice`   | `number`  | Precio base                                                     |
| `minRating`              | `1..5`    | Rating promedio mínimo                                          |
| `available`, `verified`  | `boolean` | Filtros de prestador/servicio                                   |
| `sort`                   | enum      | `price_asc`, `price_desc`, `rating`, `distance`, `availability` |
| `page`, `limit`          | `number`  | Página; límite máximo `100`                                     |

### Solicitudes y agenda

#### Contrato frontend recomendado

| Método y ruta                                   | Acceso                   | Request                                   | Response principal                             | Códigos                                  |
| ----------------------------------------------- | ------------------------ | ----------------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `POST /api/requests`                            | `cliente`                | Nueva solicitud con fecha/duración        | `SolicitudUI`                                  | `201`, `400`, `401`, `403`, `404`        |
| `GET /api/requests/mine`                        | `cliente`                | Sin body                                  | `{data: SolicitudUI[]}`                        | `200`, `401`, `403`                      |
| `GET /api/requests/:id`                         | Participante o admin JWT | Sin body                                  | `SolicitudUI`                                  | `200`, `401`, `403`, `404`               |
| `PATCH /api/requests/:id/cancel`                | Cliente dueño            | Sin body                                  | `SolicitudUI` en `cancelled`                   | `200`, `401`, `403`, `404`, `409`        |
| `PATCH /api/requests/:id/reschedule`            | Cliente dueño            | `{fechaSolicitada, duracionEstimadaMin?}` | `SolicitudUI`                                  | `200`, `400`, `401`, `403`, `404`, `409` |
| `PATCH /api/requests/:id/accept-date`           | Cliente dueño            | Sin body                                  | `SolicitudUI` con propuesta aplicada           | `200`, `401`, `403`, `404`, `409`        |
| `GET /api/provider/requests`                    | `prestador`              | Sin body                                  | `{data: SolicitudUI[]}` pendientes/respondidas | `200`, `401`, `403`                      |
| `PATCH /api/provider/requests/:id/accept`       | Prestador relacionado    | Sin body                                  | `SolicitudUI` en `accepted`                    | `200`, `401`, `403`, `404`, `409`        |
| `PATCH /api/provider/requests/:id/reject`       | Prestador relacionado    | `{motivo?}`                               | `SolicitudUI` en `rejected`                    | `200`, `401`, `403`, `404`, `409`        |
| `PATCH /api/provider/requests/:id/propose-date` | Prestador relacionado    | `{fechaPropuesta}`                        | `SolicitudUI` con propuesta                    | `200`, `400`, `401`, `403`, `404`, `409` |
| `GET /api/provider/jobs`                        | `prestador`              | Sin body                                  | `{data: SolicitudUI[]}` activas/completadas    | `200`, `401`, `403`                      |
| `PATCH /api/provider/jobs/:id/status`           | Prestador relacionado    | `{status}`                                | `SolicitudUI` actualizada                      | `200`, `400`, `401`, `403`, `404`, `409` |
| `GET /api/provider/calendar`                    | `prestador`              | Sin body                                  | `{data: SolicitudUI[]}` ordenadas por agenda   | `200`, `401`, `403`                      |

Creación de una solicitud agendada:

```http
POST /api/requests
Authorization: Bearer <token-cliente>
Content-Type: application/json
```

```json
{
  "serviceId": 1,
  "titulo": "Reparación de fuga",
  "descripcion": "Fuga debajo del lavabo",
  "prioridad": "urgent",
  "fechaSolicitada": "2026-06-03T16:00:00.000Z",
  "duracionEstimadaMin": 90,
  "direccion": "Calle Uno 10, León",
  "precioEstimado": 350
}
```

También puede usarse `direccionId` propio en lugar de dirección textual, o `providerId` más `categoryId` para localizar un servicio disponible.

Modelo `SolicitudUI`:

```json
{
  "id": 24,
  "title": "Reparación de fuga",
  "description": "Fuga debajo del lavabo",
  "priority": "urgent",
  "status": "accepted",
  "requestedAt": "2026-05-26T12:00:00.000Z",
  "scheduledAt": "2026-06-03T16:00:00.000Z",
  "proposedAt": null,
  "hasPendingDateProposal": false,
  "estimatedDurationMin": 90,
  "estimatedPrice": 350,
  "finalPrice": null,
  "payment": {
    "id": 10,
    "amount": 350,
    "method": "transferencia",
    "reference": "OP-123",
    "status": "paid",
    "paidAt": "2026-05-26T18:30:00.000Z"
  },
  "address": "Calle Uno 10, León",
  "client": { "id": 2, "nombre": "Cliente Demo", "telefono": "5555555556" },
  "provider": { "id": 3, "nombre": "Prestador Demo", "telefono": "5555555555" },
  "service": { "id": 1, "title": "Plomeria general" }
}
```

Privacidad: al prestador se le responde `address: null` y `client.telefono: null` mientras la solicitud no esté aceptada o en ejecución. El cliente dueño sí ve la dirección que registró.

Conflicto de horario:

```http
HTTP/1.1 409 Conflict
```

```json
{
  "message": "Ya tienes un servicio agendado en ese horario",
  "code": "SCHEDULE_CONFLICT"
}
```

Estados y transición permitida por endpoints especializados:

| Estado origen          | Acción                      | Estado destino               |
| ---------------------- | --------------------------- | ---------------------------- |
| `pending`              | Prestador acepta            | `accepted`                   |
| `pending`              | Prestador rechaza           | `rejected`                   |
| `pending` o `accepted` | Cliente cancela             | `cancelled`                  |
| `accepted`             | Prestador actualiza trabajo | `on_the_way` o `in_progress` |
| `on_the_way`           | Prestador inicia            | `in_progress`                |
| `in_progress`          | Prestador completa          | `completed`                  |

#### Endpoints CRUD compatibles

Estas rutas no se eliminan por compatibilidad, pero el frontend nuevo debe preferir `/requests`.

| Método y ruta                 | Acceso                 | Request                                            | Response              | Códigos                           |
| ----------------------------- | ---------------------- | -------------------------------------------------- | --------------------- | --------------------------------- |
| `POST /api/solicitudes`       | `admin`, `cliente`     | `{descripcion?, direccion_servicio?, servicio_id}` | Solicitud normalizada | `201`, `400`, `401`, `403`, `404` |
| `GET /api/solicitudes`        | JWT participante/admin | Sin body                                           | Lista accesible       | `200`, `401`, `403`               |
| `GET /api/solicitudes/:id`    | Participante/admin     | Sin body                                           | Solicitud normalizada | `200`, `401`, `403`, `404`        |
| `PATCH /api/solicitudes/:id`  | Participante/admin     | `{descripcion?, direccion_servicio?, estado?}`     | Solicitud normalizada | `200`, `400`, `401`, `403`, `404` |
| `DELETE /api/solicitudes/:id` | Cliente dueño/admin    | Sin body                                           | `{message}`           | `200`, `401`, `403`, `404`        |

### Pagos

| Método y ruta                             | Acceso                                 | Request                                               | Response principal              | Códigos                                  |
| ----------------------------------------- | -------------------------------------- | ----------------------------------------------------- | ------------------------------- | ---------------------------------------- |
| `POST /api/requests/:id/payment`          | Cliente dueño                          | `{method, reference?}`                                | `PagoUI` en `pending`           | `201`, `400`, `401`, `403`, `404`, `409` |
| `GET /api/requests/:id/payment`           | Cliente, prestador relacionado o admin | Sin body                                              | `PagoUI`                        | `200`, `401`, `403`, `404`               |
| `PATCH /api/requests/:id/payment/confirm` | Cliente dueño                          | Sin body                                              | `PagoUI` en `paid`              | `200`, `400`, `401`, `403`, `404`, `409` |
| `POST /api/pagos`                         | Cliente dueño                          | `{monto, metodo?, referencia?, solicitud_id}`         | `PagoUI`; `monto` ignorado      | `201`, `400`, `401`, `403`, `404`, `409` |
| `GET /api/pagos`                          | JWT relacionado/admin                  | Sin body                                              | Pagos accesibles con relaciones | `200`, `401`                             |
| `GET /api/pagos/:id`                      | Relacionado/admin                      | Sin body                                              | Pago con solicitud              | `200`, `401`, `403`, `404`               |
| `PATCH /api/pagos/:id`                    | Cliente dueño/admin                    | Método/referencia; admin puede campos de estado/monto | Pago actualizado                | `200`, `400`, `401`, `403`, `404`        |
| `DELETE /api/pagos/:id`                   | Cliente dueño/admin                    | Sin body                                              | `{message}`                     | `200`, `401`, `403`, `404`               |

Sólo pueden pagarse solicitudes en `accepted`, `on_the_way`, `in_progress` o `completed`. Se mantiene un pago único por solicitud.

```http
POST /api/requests/24/payment
Authorization: Bearer <token-cliente>
Content-Type: application/json
```

```json
{
  "method": "transferencia",
  "reference": "OP-123"
}
```

`PagoUI` después de confirmar:

```json
{
  "id": 10,
  "requestId": 24,
  "amount": 350,
  "method": "transferencia",
  "reference": "OP-123",
  "status": "paid",
  "paidAt": "2026-05-26T18:30:00.000Z"
}
```

### Dashboards y finanzas

| Método y ruta                        | Acceso      | Query              | Response principal                                                        | Códigos             |
| ------------------------------------ | ----------- | ------------------ | ------------------------------------------------------------------------- | ------------------- |
| `GET /api/dashboard/client`          | `cliente`   | Ninguna            | `{activeRequests, completedServices, monthSpent, favorites, upcoming}`    | `200`, `401`, `403` |
| `GET /api/dashboard/provider`        | `prestador` | Ninguna            | `{pendingRequests, activeJobs, completedJobs, rating, reviews, earnings}` | `200`, `401`, `403` |
| `GET /api/provider/earnings/summary` | `prestador` | `from?`, `to?` ISO | `{weekly, monthTotal, weekTotal, availableBalance, monthlyGrowthPercent}` | `200`, `401`, `403` |
| `GET /api/provider/transactions`     | `prestador` | Ninguna            | `{data: Pago[]}` pagados                                                  | `200`, `401`, `403` |

Regla financiera: `monthSpent`, resumen de ganancias y transacciones consideran únicamente registros `Pago.estado = "paid"` con fecha de pago aplicable.

### Calificaciones y reputación

| Método y ruta                       | Acceso              | Request                                   | Response                 | Códigos                                  |
| ----------------------------------- | ------------------- | ----------------------------------------- | ------------------------ | ---------------------------------------- |
| `POST /api/requests/:id/review`     | Cliente dueño       | `{rating: 1..5, comment?}`                | Calificación creada      | `201`, `400`, `401`, `403`, `404`, `409` |
| `GET /api/providers/:id/reviews`    | Público             | Sin body                                  | `{summary, data}`        | `200`                                    |
| `GET /api/provider/reviews/summary` | `prestador`         | Sin body                                  | `{summary, data}`        | `200`, `401`, `403`                      |
| `POST /api/calificaciones`          | Cliente dueño/admin | `{puntuacion, comentario?, solicitud_id}` | Calificación creada      | `201`, `400`, `401`, `403`, `404`, `409` |
| `GET /api/calificaciones`           | Participante/admin  | Sin body                                  | Lista accesible          | `200`, `401`                             |
| `GET /api/calificaciones/:id`       | Participante/admin  | Sin body                                  | Calificación             | `200`, `401`, `403`, `404`               |
| `PATCH /api/calificaciones/:id`     | Cliente autor/admin | `{puntuacion?, comentario?}`              | Calificación actualizada | `200`, `400`, `401`, `403`, `404`        |
| `DELETE /api/calificaciones/:id`    | Cliente autor/admin | Sin body                                  | `{message}`              | `200`, `401`, `403`, `404`               |

La solicitud debe encontrarse `completed` y no tener una calificación previa.

### Conversaciones y mensajes

| Método y ruta                          | Acceso             | Request                          | Response                                             | Códigos                           |
| -------------------------------------- | ------------------ | -------------------------------- | ---------------------------------------------------- | --------------------------------- |
| `GET /api/conversations`               | JWT                | Sin body                         | `{data: Conversation[]}` de solicitudes relacionadas | `200`, `401`                      |
| `GET /api/conversations/:id/messages`  | Participante/admin | Sin body                         | `{data: MessageUI[]}`                                | `200`, `401`, `403`, `404`        |
| `POST /api/conversations/:id/messages` | Participante/admin | `{text}`                         | `MessageUI`                                          | `201`, `400`, `401`, `403`, `404` |
| `PATCH /api/conversations/:id/read`    | Participante/admin | Sin body                         | `{id, unreadCount: 0}`                               | `200`, `401`, `403`, `404`        |
| `POST /api/chats`                      | JWT                | `{roomId, receiverId?, message}` | Documento MongoDB                                    | `201`, `400`, `401`               |
| `GET /api/chats`                       | JWT                | Sin body                         | Documentos propios o todos para admin                | `200`, `401`                      |
| `GET /api/chats/room/:roomId`          | JWT                | Sin body                         | Historial accesible                                  | `200`, `401`                      |
| `GET /api/chats/:id`                   | Participante/admin | Sin body                         | Documento mensaje                                    | `200`, `401`, `403`, `404`        |
| `PATCH /api/chats/:id`                 | Emisor/admin       | `{message?, read?}`              | Documento actualizado                                | `200`, `400`, `401`, `403`, `404` |
| `DELETE /api/chats/:id`                | Emisor/admin       | Sin body                         | `{message}`                                          | `200`, `401`, `403`, `404`        |

Modelo normalizado de mensaje de conversación:

```json
{
  "id": "6652cafe...",
  "conversationId": 24,
  "senderId": 2,
  "text": "¿Podemos confirmar la visita?",
  "sentAt": "2026-05-26T18:30:00.000Z",
  "readAt": null
}
```

### Notificaciones y logs

| Método y ruta                   | Acceso      | Request                                            | Response                            | Códigos                           |
| ------------------------------- | ----------- | -------------------------------------------------- | ----------------------------------- | --------------------------------- |
| `POST /api/notifications`       | `admin`     | `{userId, title, message}`                         | Documento notificación              | `201`, `400`, `401`, `403`        |
| `GET /api/notifications`        | JWT         | Sin body                                           | Notificaciones propias; admin todas | `200`, `401`                      |
| `GET /api/notifications/:id`    | Dueño/admin | Sin body                                           | Documento                           | `200`, `401`, `403`, `404`        |
| `PATCH /api/notifications/:id`  | Dueño/admin | `{title?, message?, read?}`                        | Documento actualizado               | `200`, `400`, `401`, `403`, `404` |
| `DELETE /api/notifications/:id` | Dueño/admin | Sin body                                           | `{message}`                         | `200`, `401`, `403`, `404`        |
| `POST /api/logs`                | `admin`     | `{userId?, action, entity?, entityId?, metadata?}` | Documento log                       | `201`, `400`, `401`, `403`        |
| `GET /api/logs`                 | `admin`     | Sin body                                           | Logs descendentes                   | `200`, `401`, `403`               |
| `GET /api/logs/:id`             | `admin`     | Sin body                                           | Documento log                       | `200`, `401`, `403`, `404`        |
| `DELETE /api/logs/:id`          | `admin`     | Sin body                                           | `{message}`                         | `200`, `401`, `403`, `404`        |

### Socket.IO

Conexión autenticada al namespace:

```ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/chat', {
  auth: { token: accessToken },
});
```

También se acepta `Authorization: Bearer <token>` en el handshake. Un socket sin JWT válido se desconecta.

| Dirección          | Evento                 | Payload                                   | Regla                                            |
| ------------------ | ---------------------- | ----------------------------------------- | ------------------------------------------------ |
| Cliente a servidor | `joinRoom`             | `{roomId: "request-24"}`                  | Comprueba participación si usa sala de solicitud |
| Cliente a servidor | `sendMessage`          | `{roomId: "request-24", message: "Hola"}` | El emisor proviene del JWT                       |
| Servidor a sala    | `newMessage`           | Mensaje persistido                        | Se emite tras guardar                            |
| Servidor a usuario | `requestCreated`       | `{requestId, scheduledAt}`                | Nueva solicitud para prestador                   |
| Servidor a usuario | `requestStatusChanged` | `SolicitudUI`                             | Aceptación, rechazo o avance                     |
| Servidor a usuario | `requestRescheduled`   | `{requestId, scheduledAt}`                | Cliente reprogramó                               |
| Servidor a usuario | `dateProposed`         | `{requestId, proposedAt}`                 | Prestador propone                                |
| Servidor a usuario | `dateAccepted`         | `{requestId, scheduledAt}`                | Cliente acepta propuesta                         |
| Servidor a usuario | `paymentPaid`          | `PagoUI`                                  | Pago confirmado                                  |

### Formato de errores

NestJS responde normalmente:

```json
{
  "message": "La fecha solicitada debe ser futura",
  "error": "Bad Request",
  "statusCode": 400
}
```

|  HTTP | Uso habitual                                                         |
| ----: | -------------------------------------------------------------------- |
| `400` | DTO inválido, fecha pasada, transición o pago no elegible            |
| `401` | Ausencia de token o JWT inválido                                     |
| `403` | Rol o propiedad insuficiente                                         |
| `404` | Recurso no encontrado o no visible para el actor                     |
| `409` | Correo repetido, pago/reseña duplicado, conflicto de agenda o estado |
| `500` | Fallo no capturado o infraestructura no disponible                   |

## Variables de entorno

| Variable       | Requerida   | Descripción                              | Ejemplo local                                                             |
| -------------- | ----------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL` | Sí          | Cadena PostgreSQL consumida por Prisma   | `postgresql://chamba:chamba123@localhost:5432/chambaapp_db?schema=public` |
| `JWT_SECRET`   | Sí          | Secreto para firmar/verificar tokens JWT | `cambia_este_secreto_por_uno_largo`                                       |
| `MONGODB_URI`  | Condicional | URI MongoDB preferida                    | `mongodb://127.0.0.1:27017/chambaapp`                                     |
| `MONGO_URI`    | Condicional | Alias de `MONGODB_URI`                   | `mongodb+srv://...`                                                       |
| `PORT`         | No          | Puerto HTTP; default `3000`              | `3000`                                                                    |

El backend usa `MONGODB_URI`, después `MONGO_URI`, y finalmente `mongodb://127.0.0.1:27017/chambaapp`. En producción debe definirse explícitamente una URI segura.

`.env` local:

```env
DATABASE_URL="postgresql://chamba:chamba123@localhost:5432/chambaapp_db?schema=public"
JWT_SECRET="reemplazar-por-secreto-largo-y-aleatorio"
MONGODB_URI="mongodb://127.0.0.1:27017/chambaapp"
PORT=3000
```

`.env` para backend dentro de `docker-compose.yml`:

```env
DATABASE_URL="postgresql://chamba:chamba123@postgres:5432/chambaapp_db?schema=public"
JWT_SECRET="reemplazar-por-secreto-largo-y-aleatorio"
MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/chambaapp"
PORT=3000
```

> Dentro del contenedor backend, `localhost` refiere al propio contenedor; para PostgreSQL de Compose debe usarse el hostname del servicio `postgres`.

## Instalación local

### Requisitos

| Dependencia           | Versión recomendada      | Propósito                      |
| --------------------- | ------------------------ | ------------------------------ |
| Node.js               | `22.x`                   | Ejecutar y construir           |
| npm                   | Incluido con Node.js     | Dependencias/scripts           |
| PostgreSQL            | `16.x`, o Docker         | Base principal                 |
| MongoDB               | Local o Atlas            | Chat/notificaciones/logs       |
| Docker Desktop/Engine | Reciente, opcional local | Levantar PostgreSQL o el stack |

### Clonar e instalar

```bash
git clone <URL_DEL_REPOSITORIO>
cd chabaapp-backend
npm install
cp .env.example .env
```

Actualice `.env` con las credenciales reales descritas anteriormente.

### Levantar dependencias

Opción A, PostgreSQL por Docker y MongoDB externo/local:

```bash
docker compose up -d postgres
```

El Compose actual no define un contenedor MongoDB; configure `MONGODB_URI` hacia una instancia disponible.

### Inicializar PostgreSQL

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed
```

Durante desarrollo de nuevas migraciones, use:

```bash
npx prisma migrate dev --name nombre_del_cambio
```

### Ejecutar en desarrollo

```bash
npm run start:dev
```

Puntos de acceso:

```text
REST:      http://localhost:3000/api
Socket.IO: http://localhost:3000/chat
```

### Datos seed

| Rol           | Correo                    | Contraseña    |
| ------------- | ------------------------- | ------------- |
| Administrador | `admin@chambaapp.com`     | `Password123` |
| Cliente       | `cliente@chambaapp.com`   | `Password123` |
| Prestador     | `prestador@chambaapp.com` | `Password123` |

El seed crea roles, un perfil prestador de plomería, la categoría `Plomeria` y el servicio `Plomeria general` con precio base `350`.

### Recorrido funcional de verificación

```bash
# Login cliente
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"correo":"cliente@chambaapp.com","password":"Password123"}'

# Utilice el token devuelto para crear una solicitud futura:
curl -X POST http://localhost:3000/api/requests \
  -H 'Authorization: Bearer TOKEN_CLIENTE' \
  -H 'Content-Type: application/json' \
  -d '{"serviceId":1,"titulo":"Visita","descripcion":"Revisión","fechaSolicitada":"2026-06-03T16:00:00.000Z","duracionEstimadaMin":60,"direccion":"Calle 1","precioEstimado":350}'
```

Después, autentique al prestador, acepte la solicitud; autentique de nuevo al cliente para crear/confirmar pago y consulte dashboards.

### Scripts disponibles

| Script      | Comando             | Descripción                    |
| ----------- | ------------------- | ------------------------------ |
| Desarrollo  | `npm run start:dev` | Nest en modo watch             |
| Inicio      | `npm run start`     | Nest estándar                  |
| Compilación | `npm run build`     | Genera `dist/`                 |
| Formato     | `npm run format`    | Prettier para `src/` y `test/` |
| Lint        | `npm run lint`      | ESLint con autocorrección      |
| Unit tests  | `npm test`          | Jest sobre `src/**/*.spec.ts`  |
| Coverage    | `npm run test:cov`  | Cobertura                      |
| E2E         | `npm run test:e2e`  | Suite bajo `test/`             |
| Seed        | `npm run seed`      | Datos de desarrollo            |

**Nota operativa:** el Dockerfile arranca correctamente con `node dist/src/main.js`. El script actual `start:prod` apunta a `node dist/main`; antes de usar ese script directamente en producción conviene alinearlo con la salida real del build.

## Docker y despliegue

### Dockerfile actual

La imagen:

1. Parte de `node:22-alpine`.
2. Ejecuta `npm install`.
3. Copia el repositorio.
4. Genera Prisma Client.
5. Compila NestJS.
6. Expone `3000`.
7. Al arrancar aplica `prisma migrate deploy`, ejecuta seed y levanta `node dist/src/main.js`.

```bash
docker build -t chambaapp-backend .
docker run --env-file .env -p 3000:3000 chambaapp-backend
```

### Docker Compose actual

| Servicio   | Imagen/build  | Puerto      | Persistencia              |
| ---------- | ------------- | ----------- | ------------------------- |
| `postgres` | `postgres:16` | `5432:5432` | Volumen `postgres_data`   |
| `backend`  | `build: .`    | `3000:3000` | Sin volumen de aplicación |

```bash
docker compose up -d --build
docker compose logs -f backend
docker compose down
```

Para eliminar datos locales PostgreSQL de manera explícita:

```bash
docker compose down -v
```

Use ese comando sólo cuando pretenda perder la base local.

### Red y MongoDB

Compose crea una red interna por defecto donde el backend resuelve PostgreSQL como `postgres:5432`. MongoDB no está definido en Compose y debe estar disponible desde el contenedor a través de `MONGODB_URI`/`MONGO_URI`, típicamente MongoDB Atlas.

### Consideraciones de producción

| Estado actual                      | Recomendación de producción                                |
| ---------------------------------- | ---------------------------------------------------------- |
| `npm install` dentro de la imagen  | Usar `npm ci` y build multi-stage                          |
| Seed en cada inicio                | Separar seed demo de arranque productivo                   |
| CORS abierto                       | Configurar orígenes permitidos                             |
| Postgres expuesto por Compose      | Restringir puerto/red privada en servidor                  |
| Secretos escritos en `.env` por CI | Proteger permisos y usar secret manager cuando sea posible |
| Sin healthcheck de containers      | Agregar healthchecks y política de rollback                |

### Preparación del servidor EC2 para el workflow actual

El workflow presupone que el servidor ya cuenta con la carpeta del repositorio y Docker Compose disponible. Una preparación mínima es:

```bash
sudo mkdir -p /opt/chambaapp
sudo chown "$USER":"$USER" /opt/chambaapp
cd /opt/chambaapp
git clone <URL_DEL_REPOSITORIO> ChambaApp-BackEnd
cd ChambaApp-BackEnd
docker compose version
```

Configure en GitHub Actions los secrets listados en la sección siguiente. El `DATABASE_URL` entregado al contenedor debe apuntar a `postgres:5432` cuando se utilice la base del mismo Compose:

```env
DATABASE_URL="postgresql://chamba:chamba123@postgres:5432/chambaapp_db?schema=public"
```

Para exponer el servicio públicamente debe existir además una decisión de infraestructura fuera de este repositorio: DNS, TLS y reverse proxy o balanceador hacia el puerto `3000`. El Compose actual por sí solo publica HTTP sin terminación TLS.

## Pipeline CICD

### Pipeline implementado

Existe `.github/workflows/deploy.yml`.

| Elemento      | Configuración actual                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Evento        | `push` a rama `master`                                                                          |
| Runner        | `ubuntu-latest`                                                                                 |
| Acción        | `appleboy/ssh-action@v1`                                                                        |
| Destino       | EC2, ruta `/opt/chambaapp/ChambaApp-BackEnd`                                                    |
| Pasos remotos | `git pull`, generar `.env`, `docker compose down`, `docker compose up -d --build`               |
| Secrets       | `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `DATABASE_URL`, `JWT_SECRET`, `MONGO_URI`, `MONGODB_URI` |

```mermaid
flowchart TD
    Push["Push master"] --> Action["GitHub Actions: deploy"]
    Action --> SSH["Conexión SSH a EC2"]
    SSH --> Pull["Actualizar código"]
    Pull --> Secrets["Crear .env desde secrets"]
    Secrets --> Restart["Recrear stack Docker Compose"]
    Restart --> Live["Backend actualizado"]
```

### Brecha actual de CI

El workflow es de **despliegue**, pero no incluye gates previos de calidad. No se ejecutan `npm ci`, build, lint, tests, escaneo de dependencias ni aprobación antes de reiniciar producción.

Pipeline objetivo recomendado:

```mermaid
flowchart LR
    PR["Pull Request"] --> Install["npm ci"]
    Install --> Validate["Prisma validate"]
    Validate --> Lint["npm run lint"]
    Lint --> Test["npm test -- --runInBand"]
    Test --> Build["npm run build"]
    Build --> Image["Build imagen Docker"]
    Image --> Approve["Merge/aprobación"]
    Approve --> Deploy["Deploy EC2"]
    Deploy --> Smoke["Healthcheck / smoke test"]
```

Pasos mínimos que deben preceder al despliegue:

```yaml
- run: npm ci
- run: npx prisma validate
- run: npm run lint
- run: npm test -- --runInBand
- run: npm run build
```

## Seguridad

### Controles implementados

| Área                | Implementación                                                       |
| ------------------- | -------------------------------------------------------------------- |
| Contraseñas         | Hash `bcrypt` con factor `10`; no se exponen en selects de API       |
| Identidad REST      | JWT Bearer firmado con `JWT_SECRET`, expiración `7d`                 |
| Identidad Socket.IO | JWT requerido en handshake; socket inválido se desconecta            |
| Autorización        | `RolesGuard` más validación de propiedad en services                 |
| Entrada             | `ValidationPipe` global, whitelist y rechazo de campos no declarados |
| Pagos               | Sin tarjeta/CVV; monto computado en backend y único por solicitud    |
| Privacidad          | Dirección y teléfono ocultos al prestador antes de aceptación        |
| Agenda              | Validación de fecha futura y bloqueo de concurrencia en aceptación   |
| Integridad          | Un pago y una calificación máximos por solicitud                     |

### Matriz de permisos de alto nivel

| Recurso                      | Admin                        | Cliente             | Prestador           | Público         |
| ---------------------------- | ---------------------------- | ------------------- | ------------------- | --------------- |
| Auth registro/login          | N/A                          | Sí                  | Sí                  | Sí              |
| Usuarios CRUD administrativo | Sí                           | No                  | No                  | No              |
| Perfil propio                | Sí                           | Sí                  | Sí                  | No              |
| Servicios catálogo           | Sí                           | Sí                  | Sí                  | Lectura         |
| Crear/editar servicio        | Sí                           | No                  | Propio              | No              |
| Solicitud                    | Todas                        | Propia              | Relacionadas        | No              |
| Pago                         | Todos/edición administrativa | Propio              | Lectura relacionada | No              |
| Reseña                       | Todas                        | Crear/editar propia | Lectura propia      | Resumen público |
| Chat/notificación            | Según relación               | Propios             | Propios             | No              |
| Logs                         | Sí                           | No                  | No                  | No              |

### Endurecimiento pendiente para producción

- Definir CORS restrictivo por entorno; actualmente `enableCors()` y gateway aceptan origen abierto.
- Gestionar secretos fuera de archivos planos cuando la infraestructura lo permita.
- Incorporar rate limiting para login, registro, chat y endpoints públicos.
- Añadir expiración/rotación de refresh tokens; actualmente sólo hay access token de siete días.
- Definir políticas de auditoría automática e inmutabilidad de logs.
- Usar HTTPS/TLS en reverse proxy y URI MongoDB cifrada.
- Revisar permisos administrativos de actualización/eliminación de pagos para un entorno financiero real.
- Integrar pasarela certificada si el flujo deja de ser simulado.

## Manejo de errores y observabilidad

### Excepciones actuales

Los services lanzan excepciones NestJS expresivas:

| Excepción               | Ejemplo funcional                                     |
| ----------------------- | ----------------------------------------------------- |
| `BadRequestException`   | Fecha pasada; pago antes de aceptación; body inválido |
| `UnauthorizedException` | Login incorrecto o cuenta desactivada                 |
| `ForbiddenException`    | Actor intenta operar un recurso ajeno                 |
| `NotFoundException`     | Servicio, solicitud, pago o documento inexistente     |
| `ConflictException`     | Duplicado, transición inválida o agenda ocupada       |

Caso con código consumible por frontend:

```json
{
  "message": "Ya tienes un servicio agendado en ese horario",
  "code": "SCHEDULE_CONFLICT"
}
```

### Logs actuales

El módulo `logs` permite almacenar documentos administrativos en MongoDB, pero su escritura es manual mediante `POST /api/logs`. No hay actualmente:

- logger estructurado centralizado;
- correlación por request ID;
- métricas Prometheus/OpenTelemetry;
- trazas distribuidas;
- captura automática de errores en una plataforma externa.

Para operar producción se recomienda agregar un interceptor/logger JSON, request IDs, health endpoints para PostgreSQL/MongoDB y alertamiento centralizado.

## Estrategia de testing

### Suites existentes

| Tipo                    | Ubicación              | Cobertura relevante                                                      |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------ |
| Unitarias de aplicación | `src/**/*.spec.ts`     | servicios, controller base, Prisma, agenda, pago, dashboard, gateway JWT |
| E2E inicial             | `test/app.e2e-spec.ts` | Arranque/ruta base de Nest                                               |

Reglas de negocio cubiertas explícitamente:

- creación de solicitud futura con duración;
- rechazo de fecha pasada;
- rechazo de agenda traslapada;
- aceptación de trabajos no traslapados;
- rechazo de pago antes de aceptar;
- imposibilidad de manipular monto desde cliente;
- confirmación de pago y agregación financiera;
- denegación de operaciones de otro usuario;
- autenticación/autorización básica del gateway Socket.IO.

### Comandos

```bash
npm test
npm test -- --runInBand
npm run test:cov
npm run test:e2e
npm run lint
npm run build
npx prisma validate
```

### Estrategia recomendada para ampliación

| Nivel        | Próximas pruebas                                                 |
| ------------ | ---------------------------------------------------------------- |
| Unitarias    | Validación de privacidad, notificaciones y filtros geográficos   |
| Integración  | Prisma contra PostgreSQL efímero y Mongoose contra Mongo de test |
| E2E REST     | Ciclo cliente-prestador-pago-calificación con autenticación real |
| WebSocket    | Conexión con JWT real, salas no autorizadas y entrega de eventos |
| Concurrencia | Dos aceptaciones simultáneas del mismo horario/prestador         |
| Seguridad    | CORS, rate limiting, tokens vencidos y campos extra rechazados   |

## Escalabilidad

### Escalamiento horizontal del backend

El API NestJS es mayormente stateless porque la sesión vive en JWT y los datos en bases externas. Puede ejecutarse detrás de un balanceador con múltiples réplicas, sujeto a los siguientes ajustes:

| Área                 | Estado actual            | Necesidad al escalar                                      |
| -------------------- | ------------------------ | --------------------------------------------------------- |
| REST                 | Stateless                | Balanceador HTTP y healthchecks                           |
| Socket.IO            | Memoria de una instancia | Adaptador Redis y sticky sessions o transporte compatible |
| PostgreSQL           | Única instancia          | Pooling, réplicas de lectura y respaldos                  |
| MongoDB              | URI externa              | Replica set/Atlas, índices y política de retención        |
| Notificaciones       | Sin cola                 | Cola durable para eventos y reintentos                    |
| Cálculos de catálogo | En request               | Índices geoespaciales/caché según volumen                 |

### Evolución sugerida

1. Agregar Redis para caché de catálogo y adaptador Socket.IO.
2. Introducir una cola para notificaciones y tareas asincrónicas.
3. Añadir índices de consulta frecuentes y monitorear planes SQL.
4. Separar chat/notificaciones en un servicio independiente sólo cuando volumen u operación lo justifiquen.
5. Separar pagos al integrar proveedor financiero real y requisitos de auditoría.

## Decisiones arquitectónicas

### ADR-001: monolito modular NestJS

| Aspecto   | Decisión                                                               |
| --------- | ---------------------------------------------------------------------- |
| Contexto  | Producto con dominios relacionados y equipo pequeño/académico          |
| Decisión  | Un único deploy compuesto por módulos NestJS                           |
| Ventajas  | Menos infraestructura, contratos internos simples, desarrollo rápido   |
| Costos    | Escalado y despliegue acoplados; fallos afectan el proceso completo    |
| Evolución | Extraer módulos de alta carga o alto cumplimiento cuando sea necesario |

### ADR-002: PostgreSQL y Prisma para el dominio principal

| Aspecto  | Decisión                                                              |
| -------- | --------------------------------------------------------------------- |
| Contexto | Solicitudes, pagos y calificaciones requieren relaciones e integridad |
| Decisión | Modelo relacional con Prisma y migraciones SQL                        |
| Ventajas | FK, índices únicos, transacciones, cliente tipado                     |
| Costos   | Cambios de esquema requieren migraciones coordinadas                  |

### ADR-003: MongoDB para comunicación y logs

| Aspecto  | Decisión                                                                |
| -------- | ----------------------------------------------------------------------- |
| Contexto | Mensajes/notificaciones/logs son documentos cronológicos flexibles      |
| Decisión | Mongoose y colecciones separadas                                        |
| Ventajas | Evolución flexible y lecturas naturales por sala/usuario                |
| Costos   | No hay FK/transaction global con PostgreSQL; requiere disciplina de IDs |

### ADR-004: JWT y RBAC

| Aspecto  | Decisión                                                      |
| -------- | ------------------------------------------------------------- |
| Contexto | UI SPA y Socket.IO necesitan identidad compartida             |
| Decisión | Bearer JWT para REST y handshake Socket.IO; roles persistidos |
| Ventajas | Backend stateless y autorización explícita                    |
| Costos   | Sin revocación/refresh token en implementación actual         |

### ADR-005: pago simulado y monto calculado en servidor

| Aspecto  | Decisión                                                       |
| -------- | -------------------------------------------------------------- |
| Contexto | Integración académica sin proveedor de pagos                   |
| Decisión | Intento `pending` y confirmación REST a `paid`, sin tarjeta    |
| Ventajas | Permite probar flujo UI y métricas sin manejar datos sensibles |
| Costos   | No constituye cobro real ni ofrece conciliación financiera     |

### ADR-006: bloqueo por prestador durante aceptación

| Aspecto  | Decisión                                                           |
| -------- | ------------------------------------------------------------------ |
| Contexto | Dos solicitudes pueden aceptarse simultáneamente y traslaparse     |
| Decisión | `pg_advisory_xact_lock(providerId)` dentro de transacción          |
| Ventajas | Evita doble reserva concurrente por prestador sin rediseñar modelo |
| Costos   | Dependencia específica de PostgreSQL y serialización por prestador |

## Roadmap

Las siguientes capacidades no deben interpretarse como implementadas actualmente:

- [ ] Gates CI obligatorios (`lint`, `test`, `build`, migraciones) antes de deploy.
- [ ] Healthchecks, métricas, logging estructurado y alertamiento.
- [ ] Restricción CORS, rate limiting y gestión avanzada de sesiones/refresh tokens.
- [ ] Redis adapter para Socket.IO y caché de catálogo.
- [ ] Procesamiento asíncrono durable de notificaciones.
- [ ] Pasarela real de pagos con webhooks, idempotencia y reembolsos auditables.
- [ ] Bloques de disponibilidad recurrente y excepciones de agenda del prestador.
- [ ] Certificaciones y validación administrativa avanzada.
- [ ] Retiros, conciliaciones y reportes descargables.
- [ ] Índices/consultas geoespaciales avanzadas para mapa.
- [ ] E2E completo REST/WebSocket en infraestructura aislada.
- [ ] Imagen Docker multi-stage y estrategia de migraciones/seed productiva.

## Contribución

### Flujo sugerido

1. Cree una rama desde la base actual:

   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

2. Instale dependencias e inicialice las bases según [Instalación local](#instalación-local).
3. Mantenga cada cambio dentro del módulo responsable.
4. Para cambios PostgreSQL, actualice `prisma/schema.prisma` y cree una migración.
5. Para contratos REST, actualice también `DOCUMENTACION_CONSUMO_API.md` y este README cuando aplique.
6. Ejecute validaciones antes de abrir Pull Request:

   ```bash
   npx prisma validate
   npm run lint
   npm test -- --runInBand
   npm run build
   ```

7. Abra un Pull Request indicando alcance, migraciones, endpoints afectados y evidencia de pruebas.

### Convenciones recomendadas

| Elemento       | Convención                                                              |
| -------------- | ----------------------------------------------------------------------- |
| Ramas          | `feature/...`, `fix/...`, `docs/...`                                    |
| Commits        | Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`       |
| DTOs           | Validar toda entrada con `class-validator`                              |
| Services       | Reglas de propiedad/negocio en la capa de servicio                      |
| Persistencia   | Prisma para dominio relacional; Mongoose sólo para documentos definidos |
| Compatibilidad | No retirar rutas legacy sin plan de migración del frontend              |

### Checklist de Pull Request

- [ ] La funcionalidad tiene pruebas proporcionales al riesgo.
- [ ] No se exponen contraseñas, tokens, dirección o teléfono indebidamente.
- [ ] Los montos y estados sensibles no son confiados al cliente.
- [ ] Las migraciones son reproducibles y fueron validadas.
- [ ] La documentación del contrato fue actualizada.
- [ ] Build, lint y tests pasan localmente.

## Licencia

El `package.json` declara:

```text
UNLICENSED
```

Por lo tanto, el proyecto no concede actualmente permisos de redistribución o uso público mediante una licencia open source. Antes de distribución externa o uso comercial, los propietarios deben definir e incorporar un archivo `LICENSE` apropiado.

---

Documentación complementaria de consumo frontend: [`DOCUMENTACION_CONSUMO_API.md`](./DOCUMENTACION_CONSUMO_API.md).
