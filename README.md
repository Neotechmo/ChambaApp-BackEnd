# 🚀 ChambaApp Backend v2

Backend REST + WebSocket para ChambaApp.

Stack principal:

- 🧱 NestJS
- 🗃️ PostgreSQL con Docker
- 🔷 Prisma ORM
- 🍃 MongoDB Atlas con Mongoose
- 🔐 JWT + Passport JWT
- 💬 Socket.IO para chat
- ✅ TypeScript + ESLint

## 📦 Requisitos

Antes de levantar el backend asegúrate de tener instalado:

- 🟢 Node.js
- 📦 npm
- 🐳 Docker Desktop
- 🍃 Cuenta/cluster de MongoDB Atlas

## ⚙️ Instalar dependencias

```bash
npm install
```

## 🐳 Levantar PostgreSQL con Docker

Este proyecto usa PostgreSQL desde `docker-compose.yml`.

Levanta el contenedor:

```bash
docker compose up -d
```

Verifica que esté corriendo:

```bash
docker ps
```

Deberías ver un contenedor llamado:

```txt
chamba_postgres
```

Datos del PostgreSQL local:

```txt
Host: localhost
Puerto: 5432
Usuario: chamba
Password: chamba123
Base de datos: chambaapp_db
```

## 🔐 Variables de entorno

Crea tu archivo `.env` en la raíz del proyecto.

Puedes usar como base:

```bash
cp .env.example .env
```

Ejemplo:

```env
DATABASE_URL="postgresql://chamba:chamba123@localhost:5432/chambaapp_db?schema=public"
JWT_SECRET="cambia_este_secreto"
MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/chambaapp?retryWrites=true&w=majority"
MONGO_URI="mongodb+srv://usuario:password@cluster.mongodb.net/chambaapp?retryWrites=true&w=majority"
PORT=3000
```

Notas:

- `DATABASE_URL` apunta a PostgreSQL en Docker.
- `JWT_SECRET` firma los tokens de login.
- `MONGODB_URI` o `MONGO_URI` conecta con MongoDB Atlas.
- Si Atlas rechaza la conexión, agrega tu IP en **Network Access**.

## 🔷 Preparar Prisma

Genera el cliente de Prisma:

```bash
npx prisma generate
```

Ejecuta migraciones:

```bash
npx prisma migrate dev
```

Si necesitas abrir Prisma Studio:

```bash
npx prisma studio
```

## 🌱 Cargar seeds

Ejecuta:

```bash
npm run seed
```

Esto crea roles y usuarios demo.

Usuarios para probar:

```txt
admin@chambaapp.com / Password123
cliente@chambaapp.com / Password123
prestador@chambaapp.com / Password123
```

Roles:

```txt
admin
cliente
prestador
```

## ▶️ Levantar el backend

Modo desarrollo:

```bash
npm run start:dev
```

URL base:

```txt
http://localhost:3000/api
```

WebSocket chat:

```txt
http://localhost:3000/chat
```

## 🧪 Probar login

Endpoint:

```txt
POST http://localhost:3000/api/auth/login
```

Body:

```json
{
  "correo": "cliente@chambaapp.com",
  "password": "Password123"
}
```

Copia el `access_token` y úsalo en rutas protegidas:

```txt
Authorization: Bearer TU_TOKEN
```

## 💬 Probar chat WebSocket

Existe una carpeta local ignorada por Git:

```txt
PRUEBA_CHAT/
```

Abre este archivo en el navegador:

```txt
PRUEBA_CHAT/index.html
```

Flujo:

1. 🔐 Pega token de cliente y prestador.
2. 🧭 Define una sala, por ejemplo `solicitud-1`.
3. 🔌 Presiona `Conectar`.
4. 💬 Envía mensaje como cliente.
5. ↩️ Responde como prestador.
6. 🔄 Recarga y vuelve a conectar para validar historial.

## 📚 Documentación de endpoints

Documento para frontend/UI:

```txt
DOCUMENTACION_CONSUMO_API.md
```

Incluye:

- 🔐 Auth
- 👤 Usuarios
- 🛠️ Servicios
- 📋 Solicitudes
- 💳 Pagos
- ⭐ Calificaciones
- 🔔 Notificaciones
- 💬 Chats REST + WebSocket
- 🧾 Logs
- 🎨 Notas para UI/UX

## 🧹 Comandos útiles

Formatear:

```bash
npm run format
```

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

Tests:

```bash
npm test
```

Tests en modo serial:

```bash
npm test -- --runInBand
```

## 🛑 Apagar servicios

Detener PostgreSQL:

```bash
docker compose down
```

Detener y borrar volumen de PostgreSQL:

```bash
docker compose down -v
```

⚠️ Cuidado: `docker compose down -v` elimina los datos locales de PostgreSQL.

## 🧭 Orden recomendado para levantar desde cero

```bash
npm install
docker compose up -d
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run seed
npm run start:dev
```

Después abre:

```txt
http://localhost:3000/api
```

