import { ForbiddenException } from '@nestjs/common';
import { ChatsService } from './chats.service';

describe('ChatsService authorization', () => {
  function setup() {
    const chatMessageModel = {
      create: jest.fn(),
      find: jest.fn(() => ({
        sort: jest.fn(() => ({
          exec: jest.fn().mockResolvedValue([]),
        })),
      })),
    };
    const prisma = {
      solicitud: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    };
    const service = new ChatsService(chatMessageModel as never, prisma as never);

    return { chatMessageModel, prisma, service };
  }

  it('rejects conversation access when the user is not a participant', async () => {
    const { prisma, service } = setup();
    prisma.solicitud.findUnique.mockResolvedValue({
      id: 10,
      cliente_id: 1,
      servicio: { prestador_id: 2 },
    });

    await expect(service.authorizeConversation(10, 99, 2)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('rejects legacy room reads that are not tied to a service request', async () => {
    const { chatMessageModel, service } = setup();

    await expect(service.findByRoom('general', 1, 2)).rejects.toThrow(
      ForbiddenException,
    );
    expect(chatMessageModel.find).not.toHaveBeenCalled();
  });

  it('derives the receiver from the authorized request instead of trusting the payload', async () => {
    const { chatMessageModel, prisma, service } = setup();
    prisma.solicitud.findUnique.mockResolvedValue({
      id: 10,
      cliente_id: 1,
      servicio: { prestador_id: 2 },
    });
    chatMessageModel.create.mockResolvedValue({});

    await service.create(
      {
        roomId: 'request-10',
        receiverId: 999,
        message: 'Hola',
      },
      1,
      2,
    );

    expect(chatMessageModel.create).toHaveBeenCalledWith({
      roomId: 'request-10',
      senderId: 1,
      receiverId: 2,
      message: 'Hola',
    });
  });

  it('lists conversations only for requests where the user participates', async () => {
    const { prisma, service } = setup();
    prisma.solicitud.findMany.mockResolvedValue([]);

    await service.findConversations(7, 2);

    expect(prisma.solicitud.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [{ cliente_id: 7 }, { servicio: { prestador_id: 7 } }],
        },
      }),
    );
  });
});
