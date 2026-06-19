import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-access-token'),
  signAsync: jest.fn().mockResolvedValue('mock-access-token'),
  verify: jest.fn().mockReturnValue({ sub: 1, email: 'test@mail.com' }),
};

/** Mock del LoggerService inyectado por Winston */
const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

const mockRole = { id: 2, nombre: 'cliente' };

const makePrisma = (overrides: Record<string, unknown> = {}) => ({
  usuario: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  role: {
    findUnique: jest.fn().mockResolvedValue(mockRole),
  },
  ...overrides,
});

// ---------------------------------------------------------------------------
// Suite: register
// ---------------------------------------------------------------------------
describe('AuthService', () => {
  describe('register', () => {
    it('debe crear usuario y retornar mensaje de éxito cuando el correo no existe', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue(null);
      prisma.usuario.create.mockResolvedValue({
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        correo: 'juan@mail.com',
        rol: mockRole,
      });
      const service = new AuthService(prisma as never, mockJwtService as never, mockLogger as never);

      const dto = {
        nombre: 'Juan',
        apellido: 'Perez',
        correo: 'juan@mail.com',
        password: 'Secure123!',
        telefono: '1234567890',
      };

      // Act
      const result = await service.register(dto as never);

      // Assert
      expect(result.message).toContain('Juan');
      expect(prisma.usuario.create).toHaveBeenCalledTimes(1);
    });

    it('debe lanzar ConflictException cuando el correo ya está registrado', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue({ id: 99, correo: 'exists@mail.com' });
      const service = new AuthService(prisma as never, mockJwtService as never, mockLogger as never);

      // Act & Assert
      await expect(
        service.register({
          nombre: 'Test',
          apellido: 'User',
          correo: 'exists@mail.com',
          password: 'pass',
          telefono: '0000000000',
        } as never),
      ).rejects.toThrow(ConflictException);
    });

    it('debe hashear el password antes de guardar', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue(null);
      let capturedHash = '';
      prisma.usuario.create.mockImplementation(async (args: never) => {
        capturedHash = (args as { data: { password_hash: string } }).data.password_hash;
        return { id: 1, nombre: 'Test', apellido: 'U', correo: 'test@mail.com', rol: mockRole };
      });
      const service = new AuthService(prisma as never, mockJwtService as never, mockLogger as never);

      const plainPassword = 'MySecret123!';

      // Act
      await service.register({
        nombre: 'Test', apellido: 'U', correo: 'test@mail.com',
        password: plainPassword, telefono: '0000000000',
      } as never);

      // Assert
      expect(capturedHash).not.toBe(plainPassword);
      const isValid = await bcrypt.compare(plainPassword, capturedHash);
      expect(isValid).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Suite: login
  // ---------------------------------------------------------------------------
  describe('login', () => {
    it('debe retornar access_token cuando las credenciales son válidas', async () => {
      // Arrange
      const passwordHash = await bcrypt.hash('correctPass', 10);
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        correo: 'user@mail.com',
        password_hash: passwordHash,
        nombre: 'Ana',
        apellido: 'Lopez',
        activo: true,
        rol: { id: 2, nombre: 'cliente' },
      });
      const service = new AuthService(prisma as never, mockJwtService as never, mockLogger as never);

      // Act
      const result = await service.login({ correo: 'user@mail.com', password: 'correctPass' });

      // Assert
      expect(result).toHaveProperty('access_token');
      expect(mockJwtService.signAsync).toHaveBeenCalled();
    });

    it('debe lanzar UnauthorizedException cuando la contraseña es incorrecta', async () => {
      // Arrange
      const passwordHash = await bcrypt.hash('correctPass', 10);
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        correo: 'user@mail.com',
        password_hash: passwordHash,
        activo: true,
        rol: mockRole,
      });
      const service = new AuthService(prisma as never, mockJwtService as never, mockLogger as never);

      // Act & Assert
      await expect(
        service.login({ correo: 'user@mail.com', password: 'wrongPass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException cuando el usuario no existe', async () => {
      // Arrange
      const prisma = makePrisma();
      prisma.usuario.findUnique.mockResolvedValue(null);
      const service = new AuthService(prisma as never, mockJwtService as never, mockLogger as never);

      // Act & Assert
      await expect(
        service.login({ correo: 'nobody@mail.com', password: 'anypass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
