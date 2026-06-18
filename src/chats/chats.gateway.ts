import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import type { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatsService } from './chats.service';
import type { AuthUser } from '../auth/types/auth-user.type';

type JoinRoomPayload = {
  roomId: string;
};

type UserSocket = Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  { user?: AuthUser }
>;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: UserSocket) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
        correo: string;
        rol_id: number;
      }>(this.socketToken(client));
      const user: AuthUser = {
        userId: payload.sub,
        correo: payload.correo,
        rol_id: payload.rol_id,
      };
      client.data.user = user;
      await client.join(this.userRoom(user.userId));
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const user = this.currentUser(client);
    const requestId = this.chatsService.requestIdFromRoom(payload.roomId);
    if (requestId === null) {
      throw new WsException('Sala de chat no autorizada');
    }
    await this.chatsService.authorizeConversation(
      requestId,
      user.userId,
      user.rol_id,
    );
    await client.join(payload.roomId);
    return {
      event: 'joinedRoom',
      data: payload,
    };
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() payload: CreateChatMessageDto,
  ) {
    const user = this.currentUser(client);
    const requestId = this.chatsService.requestIdFromRoom(payload.roomId);
    if (requestId === null) {
      throw new WsException('Sala de chat no autorizada');
    }
    const message = await this.chatsService.sendConversationMessage(
      requestId,
      payload.message,
      user.userId,
      user.rol_id,
    );
    this.server.to(payload.roomId).emit('newMessage', message);
    return message;
  }

  emitUserEvent(userId: number, event: string, data: unknown) {
    this.server.to(this.userRoom(userId)).emit(event, data);
  }

  private currentUser(client: UserSocket) {
    const user = client.data.user;
    if (!user) {
      throw new WsException('Usuario no autenticado');
    }
    return user;
  }

  private socketToken(client: UserSocket) {
    const authToken = client.handshake.auth?.token as string | undefined;
    const authorization = client.handshake.headers.authorization;
    const bearer =
      typeof authorization === 'string' && authorization.startsWith('Bearer ')
        ? authorization.slice(7)
        : undefined;
    const token = authToken ?? bearer;
    if (!token) {
      throw new WsException('Token requerido');
    }
    return token;
  }

  private userRoom(userId: number) {
    return `user-${userId}`;
  }
}
