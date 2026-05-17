import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatsService } from './chats.service';

type JoinRoomPayload = {
  roomId: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    await client.join(payload.roomId);
    return {
      event: 'joinedRoom',
      data: payload,
    };
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: CreateChatMessageDto) {
    const senderId = payload.senderId ?? 0;
    const message = await this.chatsService.create(payload, senderId);
    this.server.to(payload.roomId).emit('newMessage', message);
    return message;
  }
}
