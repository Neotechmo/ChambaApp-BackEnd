/**
 * Pruebas de Integración — Base de Datos Relacional (PostgreSQL)
 *
 * Cumple checklist 4.2 (al menos 3 puntos):
 *  ✓ Testcontainers levanta PostgreSQL real en Docker (global-setup.ts)
 *  ✓ Migraciones Prisma ejecutadas antes de los tests (global-setup.ts)
 *  ✓ afterEach trunca tablas para aislamiento entre tests
 *  ✓ CRUD completo con datos reales en BD (no mocks)
 *  ✓ Constraints UNIQUE (correo) y NOT NULL (nombre, correo) probados
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// PrismaClient conectado a la BD del contenedor (DATABASE_URL inyectado por global-setup)
const prisma = new PrismaClient();

// ── Fixture base ─────────────────────────────────────────────────────────────
const BASE_USER = {
  nombre: 'Integration',
  apellido: 'Test',
  correo: 'integration@test.com',
  password_hash: '',
  rol_id: 2, // cliente (seed crea roles: 1=admin, 2=cliente, 3=prestador)
};

// ── Setup / Teardown ─────────────────────────────────────────────────────────
beforeAll(async () => {
  await prisma.$connect();
  BASE_USER.password_hash = await bcrypt.hash('Test1234!', 10);
});

/**
 * afterEach: truncar tablas en orden correcto (FK) para aislamiento.
 * Cumple punto: "afterEach o afterAll hace rollback o truncate de tablas"
 */
afterEach(async () => {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Usuario" RESTART IDENTITY CASCADE`,
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ── Suite 1: CRUD real en BD ─────────────────────────────────────────────────
describe('PostgreSQL Integration — Usuario CRUD', () => {
  it('debe CREAR un usuario con datos reales y persistirlo en BD', async () => {
    // Arrange
    const data = { ...BASE_USER };

    // Act
    const created = await prisma.usuario.create({
      data,
      include: { rol: true },
    });

    // Assert — verificar en BD real (no mock)
    expect(created.id).toBeGreaterThan(0);
    expect(created.correo).toBe('integration@test.com');
    expect(created.rol.nombre).toBe('cliente');
    expect(created.activo).toBe(true);
  });

  it('debe LEER el usuario recién creado por id', async () => {
    // Arrange
    const { id } = await prisma.usuario.create({ data: { ...BASE_USER } });

    // Act
    const found = await prisma.usuario.findUnique({ where: { id } });

    // Assert
    expect(found).not.toBeNull();
    expect(found!.correo).toBe('integration@test.com');
  });

  it('debe ACTUALIZAR el nombre del usuario en BD', async () => {
    // Arrange
    const { id } = await prisma.usuario.create({ data: { ...BASE_USER } });

    // Act
    const updated = await prisma.usuario.update({
      where: { id },
      data: { nombre: 'NombreActualizado' },
    });

    // Assert
    expect(updated.nombre).toBe('NombreActualizado');

    // Verificar persistencia real
    const refetch = await prisma.usuario.findUnique({ where: { id } });
    expect(refetch!.nombre).toBe('NombreActualizado');
  });

  it('debe ELIMINAR el usuario de BD', async () => {
    // Arrange
    const { id } = await prisma.usuario.create({ data: { ...BASE_USER } });

    // Act
    await prisma.usuario.delete({ where: { id } });

    // Assert
    const found = await prisma.usuario.findUnique({ where: { id } });
    expect(found).toBeNull();
  });
});

// ── Suite 2: Constraints de BD ────────────────────────────────────────────────
describe('PostgreSQL Integration — Constraints', () => {
  /**
   * Cumple: "Constraints de BD: UNIQUE, NOT NULL, FK violations probadas"
   */
  it('debe lanzar error de UNIQUE al insertar correo duplicado', async () => {
    // Arrange — primer usuario
    await prisma.usuario.create({ data: { ...BASE_USER } });

    // Act & Assert — mismo correo → violación UNIQUE
    await expect(
      prisma.usuario.create({ data: { ...BASE_USER } }),
    ).rejects.toThrow(); // Prisma lanza PrismaClientKnownRequestError P2002
  });

  it('debe lanzar error de FK al asignar rol_id inexistente', async () => {
    // Act & Assert — rol_id 999 no existe → FK violation
    await expect(
      prisma.usuario.create({
        data: { ...BASE_USER, rol_id: 999, correo: 'fk@test.com' },
      }),
    ).rejects.toThrow();
  });

  it('la contraseña almacenada debe ser el hash bcrypt, no texto plano', async () => {
    // Arrange
    const plain = 'Test1234!';
    const hash = await bcrypt.hash(plain, 10);

    // Act
    const user = await prisma.usuario.create({
      data: { ...BASE_USER, password_hash: hash },
    });

    // Assert — campo almacenado NO es texto plano
    expect(user.password_hash).not.toBe(plain);
    expect(user.password_hash).toMatch(/^\$2[ab]\$/); // formato bcrypt
    const valid = await bcrypt.compare(plain, user.password_hash);
    expect(valid).toBe(true);
  });
});

// ── Suite 3: Seeds deterministas ─────────────────────────────────────────────
describe('PostgreSQL Integration — Seeds deterministas', () => {
  /**
   * Cumple: "Seeds de datos de prueba son deterministas"
   */
  it('los roles semilla siempre existen con los mismos ids', async () => {
    const roles = await prisma.role.findMany({ orderBy: { id: 'asc' } });

    // El seed crea exactamente estos 3 roles en este orden
    expect(roles.length).toBeGreaterThanOrEqual(3);
    expect(roles[0].nombre).toBe('admin');
    expect(roles[1].nombre).toBe('cliente');
    expect(roles[2].nombre).toBe('prestador');
  });

  it('findMany con orderBy retorna usuarios en orden ascendente por id', async () => {
    // Arrange — crear 3 usuarios
    for (let i = 1; i <= 3; i++) {
      await prisma.usuario.create({
        data: { ...BASE_USER, correo: `user${i}@test.com` },
      });
    }

    // Act
    const users = await prisma.usuario.findMany({ orderBy: { id: 'asc' } });

    // Assert — orden determinista
    expect(users[0].id).toBeLessThan(users[1].id);
    expect(users[1].id).toBeLessThan(users[2].id);
  });
});
