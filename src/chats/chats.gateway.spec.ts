import { ChatsGateway } from './chats.gateway';

describe('ChatsGateway authentication', () => {
  function setup() {
    const chats = {
      authorizeConversation: jest.fn().mockResolvedValue({}),
      sendConversationMessage: jest.fn(),
      requestIdFromRoom: jest.fn((roomId: string) => {
        const match = /^request-(\d+)$/.exec(roomId);
        return match ? Number(match[1]) : null;
      }),
    };
    const jwt = {
      verifyAsync: jest.fn(),
    };
    const gateway = new ChatsGateway(chats as never, jwt as never);
    const socket = {
      handshake: { auth: { token: 'jwt-token' }, headers: {} },
      data: {},
      join: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn(),
    };

    return { chats, gateway, jwt, socket };
  }

  it('authenticates the socket and joins its user room', async () => {
    const { gateway, jwt, socket } = setup();
    jwt.verifyAsync.mockResolvedValue({
      sub: 20,
      correo: 'provider@example.com',
      rol_id: 3,
    });

    await gateway.handleConnection(socket as never);

    expect(socket.data).toEqual({
      user: { userId: 20, correo: 'provider@example.com', rol_id: 3 },
    });
    expect(socket.join).toHaveBeenCalledWith('user-20');
    expect(socket.disconnect).not.toHaveBeenCalled();
  });

  it('disconnects sockets without a valid JWT', async () => {
    const { gateway, jwt, socket } = setup();
    jwt.verifyAsync.mockRejectedValue(new Error('invalid token'));

    await gateway.handleConnection(socket as never);

    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('authorizes the participant before joining a request room', async () => {
    const { chats, gateway, socket } = setup();
    socket.data = {
      user: { userId: 20, correo: 'provider@example.com', rol_id: 3 },
    };

    await gateway.joinRoom(socket as never, { roomId: 'request-7' });

    expect(chats.authorizeConversation).toHaveBeenCalledWith(7, 20, 3);
    expect(socket.join).toHaveBeenCalledWith('request-7');
  });

  it('rejects non-request rooms', async () => {
    const { chats, gateway, socket } = setup();
    socket.data = {
      user: { userId: 20, correo: 'provider@example.com', rol_id: 3 },
    };

    await expect(
      gateway.joinRoom(socket as never, { roomId: 'general' }),
    ).rejects.toThrow('Sala de chat no autorizada');
    expect(chats.authorizeConversation).not.toHaveBeenCalled();
    expect(socket.join).not.toHaveBeenCalledWith('general');
  });
});
