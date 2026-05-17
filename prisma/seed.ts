import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roles = ['admin', 'cliente', 'prestador'];

  for (const nombre of roles) {
    await prisma.role.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { nombre: 'admin' },
  });

  const prestadorRole = await prisma.role.findUniqueOrThrow({
    where: { nombre: 'prestador' },
  });

  const clienteRole = await prisma.role.findUniqueOrThrow({
    where: { nombre: 'cliente' },
  });

  const passwordHash = await bcrypt.hash('Password123', 10);

  await prisma.usuario.upsert({
    where: { correo: 'admin@chambaapp.com' },
    update: {},
    create: {
      nombre: 'Admin',
      apellido: 'ChambaApp',
      correo: 'admin@chambaapp.com',
      password_hash: passwordHash,
      rol_id: adminRole.id,
      activo: true,
      verificado: true,
    },
  });

  const prestador = await prisma.usuario.upsert({
    where: { correo: 'prestador@chambaapp.com' },
    update: {},
    create: {
      nombre: 'Prestador',
      apellido: 'Demo',
      correo: 'prestador@chambaapp.com',
      password_hash: passwordHash,
      telefono: '5555555555',
      rol_id: prestadorRole.id,
      activo: true,
      verificado: true,
    },
  });

  await prisma.usuario.upsert({
    where: { correo: 'cliente@chambaapp.com' },
    update: {},
    create: {
      nombre: 'Cliente',
      apellido: 'Demo',
      correo: 'cliente@chambaapp.com',
      password_hash: passwordHash,
      telefono: '5555555556',
      rol_id: clienteRole.id,
      activo: true,
      verificado: true,
    },
  });

  const existingService = await prisma.servicio.findFirst({
    where: {
      titulo: 'Plomeria general',
      prestador_id: prestador.id,
    },
  });

  if (!existingService) {
    await prisma.servicio.create({
      data: {
        titulo: 'Plomeria general',
        descripcion: 'Reparaciones e instalaciones de plomeria para hogar.',
        precio_base: 350,
        prestador_id: prestador.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

