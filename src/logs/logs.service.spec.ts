import { NotFoundException } from '@nestjs/common';
import { LogsService } from './logs.service';

// ---------------------------------------------------------------------------
// Mock del modelo Mongoose
// ---------------------------------------------------------------------------
const makeLogModel = () => {
  const saveMock = jest.fn();
  const execMock = jest.fn();
  const mockDoc = { _id: 'abc123', action: 'USER_LOGIN', userId: 1 };

  const model: Record<string, unknown> = {
    create: jest.fn().mockResolvedValue(mockDoc),
    find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockDoc]) }) }),
    findById: jest.fn().mockReturnValue({ exec: execMock }),
    findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDoc) }),
  };

  return { model, execMock, mockDoc, saveMock };
};

// ---------------------------------------------------------------------------
describe('LogsService', () => {
  // ------------------------------------------------------------------
  describe('create', () => {
    it('debe guardar y retornar el log creado', async () => {
      // Arrange
      const { model, mockDoc } = makeLogModel();
      const service = new LogsService(model as never);
      const dto = { action: 'USER_LOGIN', userId: 1, entity: 'usuario', entityId: '1' };

      // Act
      const result = await service.create(dto);

      // Assert
      expect(model.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockDoc);
    });

    it('debe crear log sin campos opcionales (solo action requerido)', async () => {
      // Arrange
      const { model } = makeLogModel();
      const service = new LogsService(model as never);
      const dto = { action: 'SYSTEM_START' };

      // Act
      await service.create(dto);

      // Assert
      expect(model.create).toHaveBeenCalledWith({ action: 'SYSTEM_START' });
    });
  });

  // ------------------------------------------------------------------
  describe('findAll', () => {
    it('debe retornar todos los logs ordenados por fecha descendente', async () => {
      // Arrange
      const { model, mockDoc } = makeLogModel();
      const service = new LogsService(model as never);

      // Act
      const result = await service.findAll();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockDoc);
      expect(model.find).toHaveBeenCalled();
    });
  });

  // ------------------------------------------------------------------
  describe('findOne', () => {
    it('debe retornar el log cuando el ID existe', async () => {
      // Arrange
      const { model, execMock, mockDoc } = makeLogModel();
      execMock.mockResolvedValue(mockDoc);
      const service = new LogsService(model as never);

      // Act
      const result = await service.findOne('abc123');

      // Assert
      expect(result).toEqual(mockDoc);
      expect(model.findById).toHaveBeenCalledWith('abc123');
    });

    it('debe lanzar NotFoundException cuando el log no existe', async () => {
      // Arrange
      const { model, execMock } = makeLogModel();
      execMock.mockResolvedValue(null);
      const service = new LogsService(model as never);

      // Act & Assert
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ------------------------------------------------------------------
  describe('remove', () => {
    it('debe eliminar el log y retornar mensaje de confirmación', async () => {
      // Arrange
      const { model, execMock, mockDoc } = makeLogModel();
      execMock.mockResolvedValue(mockDoc); // findOne retorna algo
      const service = new LogsService(model as never);

      // Act
      const result = await service.remove('abc123');

      // Assert
      expect(result).toHaveProperty('message');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('abc123');
    });

    it('debe lanzar NotFoundException al intentar eliminar un log inexistente', async () => {
      // Arrange
      const { model, execMock } = makeLogModel();
      execMock.mockResolvedValue(null);
      const service = new LogsService(model as never);

      // Act & Assert
      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
