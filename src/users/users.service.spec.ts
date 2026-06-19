import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const mockUser = {
  id: 1,
  nombre: 'Maria',
  apellido: 'Garcia',
  correo: 'maria@mail.com',
  telefono: '5550001111',
  foto_perfil: null,
  activo: true,
  verificado: false,
  createdAt: new Date(),
  rol: { id: 2, nombre: 'cliente' },
};

const makePrisma = () => ({
  usuario: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

// ---------------------------------------------------------------------------
describe('UsersService', () => {
  // ------------------------------------------------------------------
  describe('create', () => {
    it('debe crear usuario y retornar datos sin password cuando el correo no existe', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue(null);
      prisma.usuario.create.mockResolvedValue(mockUser);
      const service = new UsersService(prisma as never);

      const dto = {
        nombre: 'Maria', apellido: 'Garcia', correo: 'maria@mail.com',
        password: 'Pass123!', telefono: '5550001111', activo: true,
        verificado: false, rol_id: 2,
      };

      // Act
      const result = await service.create(dto as never);

      // Assert
      expect(result).not.toHaveProperty('password_hash');
      expect(prisma.usuario.create).toHaveBeenCalledTimes(1);
    });

    it('debe lanzar ConflictException cuando el correo ya está registrado', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue(mockUser);
      const service = new UsersService(prisma as never);

      // Act & Assert
      await expect(
        service.create({
          nombre: 'Otro', apellido: 'User', correo: 'maria@mail.com',
          password: 'pass', rol_id: 2,
        } as never),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ------------------------------------------------------------------
  describe('findOne', () => {
    it('debe retornar el usuario cuando existe el ID', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue(mockUser);
      const service = new UsersService(prisma as never);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(mockUser);
      expect(prisma.usuario.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('debe lanzar NotFoundException cuando el usuario no existe', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue(null);
      const service = new UsersService(prisma as never);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ------------------------------------------------------------------
  describe('findAll', () => {
    it('debe retornar array de usuarios ordenados por ID', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findMany.mockResolvedValue([mockUser]);
      const service = new UsersService(prisma as never);

      // Act
      const result = await service.findAll();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(prisma.usuario.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { id: 'asc' } }),
      );
    });

    it('debe retornar array vacío cuando no hay usuarios', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findMany.mockResolvedValue([]);
      const service = new UsersService(prisma as never);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  // ------------------------------------------------------------------
  describe('password hashing en create', () => {
    it('el password almacenado debe ser un hash bcrypt válido distinto al original', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue(null);
      let savedHash = '';
      prisma.usuario.create.mockImplementation(async (args: never) => {
        savedHash = (args as { data: { password_hash: string } }).data.password_hash;
        return mockUser;
      });
      const service = new UsersService(prisma as never);
      const plainPassword = 'SuperSecret99!';

      // Act
      await service.create({
        nombre: 'Test', apellido: 'Usr', correo: 'test@mail.com',
        password: plainPassword, rol_id: 2, activo: true, verificado: false,
      } as never);

      // Assert
      expect(savedHash).not.toBe(plainPassword);
      const match = await bcrypt.compare(plainPassword, savedHash);
      expect(match).toBe(true);
    });
  });
});
