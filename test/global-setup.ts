import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

declare global {
  // eslint-disable-next-line no-var
  var __PG_CONTAINER__: Awaited<ReturnType<PostgreSqlContainer['start']>>;
}

export default async function globalSetup() {
  console.log('\n🐳 Iniciando contenedor PostgreSQL (Testcontainers)...');

  const container = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('chambaapp_test')
    .withUsername('test')
    .withPassword('test')
    .start();

  const url = container.getConnectionUri();
  process.env.DATABASE_URL = url;

  // Exponer para globalTeardown
  global.__PG_CONTAINER__ = container;

  console.log(`✅ PostgreSQL listo: ${url}`);

  // ── Punto 4.2: Migraciones se ejecutan correctamente antes de los tests ──
  console.log('🔄 Ejecutando migraciones Prisma...');
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'inherit',
  });

  // ── Punto 4.2: Seeds deterministas — solo roles base (no usuarios) ────────
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    for (const nombre of ['admin', 'cliente', 'prestador']) {
      await prisma.role.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      });
    }
    console.log('✅ Roles seed insertados: admin(1), cliente(2), prestador(3)');
  } finally {
    await prisma.$disconnect();
  }

  console.log('✅ Setup de integración completo.\n');
}
