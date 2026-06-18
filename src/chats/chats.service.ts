import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { CreateChatMessageDto } from './dto/create-chat-message.dto';
import type { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import {
  ChatMessage,
  type ChatMessageDocument,
} from './schemas/chat-message.schema';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessageDocument>,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: CreateChatMessageDto, userId: number, rolId: number) {
    const requestId = this.requestIdFromRoom(data.roomId);
    if (requestId === null) {
      throw new ForbiddenException('Sala de chat no autorizada');
    }

    const request = await this.authorizeConversation(requestId, userId, rolId);
    const receiverId =
      request.cliente_id === userId
        ? request.servicio.prestador_id
        : request.cliente_id;

    return this.chatMessageModel.create({
      roomId: data.roomId,
      senderId: userId,
      receiverId,
      message: data.message,
    });
  }

  async findConversations(userId: number, rolId: number) {
    const requests = await this.prisma.solicitud.findMany({
      where:
        rolId === 1
          ? {}
          : {
              OR: [
                { cliente_id: userId },
                { servicio: { prestador_id: userId } },
              ],
            },
      include: {
        cliente: { select: { id: true, nombre: true, apellido: true } },
        servicio: {
          include: {
            prestador: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                especialidad: true,
              },
            },
          },
        },
      },
    });

    const data = await Promise.all(
      requests.map(async (request) => {
        const roomId = this.roomId(request.id);
        const [lastMessage, unreadCount] = await Promise.all([
          this.chatMessageModel
            .findOne({ roomId })
            .sort({ createdAt: -1 })
            .exec(),
          this.chatMessageModel.countDocuments({
            roomId,
            receiverId: userId,
            read: false,
          }),
        ]);
        const other =
          request.cliente_id === userId
            ? request.servicio.prestador
            : request.cliente;
        return {
          id: request.id,
          requestId: request.id,
          otherUser: {
            id: other.id,
            nombre: [other.nombre, other.apellido].filter(Boolean).join(' '),
            oficio:
              'especialidad' in other
                ? (other.especialidad ?? undefined)
                : undefined,
          },
          lastMessage: lastMessage?.message ?? null,
          lastMessageAt: lastMessage?.createdAt ?? null,
          unreadCount,
        };
      }),
    );
    return { data };
  }

  async findConversationMessages(id: number, userId: number, rolId: number) {
    await this.authorizeConversation(id, userId, rolId);
    const messages = await this.chatMessageModel
      .find({ roomId: this.roomId(id) })
      .sort({ createdAt: 1 })
      .exec();
    return { data: messages.map((message) => this.mapMessage(id, message)) };
  }

  async sendConversationMessage(
    id: number,
    text: string,
    userId: number,
    rolId: number,
  ) {
    const request = await this.authorizeConversation(id, userId, rolId);
    const receiverId =
      request.cliente_id === userId
        ? request.servicio.prestador_id
        : request.cliente_id;
    const message = await this.chatMessageModel.create({
      roomId: this.roomId(id),
      senderId: userId,
      receiverId,
      message: text,
    });
    return this.mapMessage(id, message);
  }

  async markConversationRead(id: number, userId: number, rolId: number) {
    await this.authorizeConversation(id, userId, rolId);
    await this.chatMessageModel.updateMany(
      { roomId: this.roomId(id), receiverId: userId, read: false },
      { read: true },
    );
    return { id, unreadCount: 0 };
  }

  async findAll(userId: number, rolId: number) {
    const filter =
      rolId === 1
        ? {}
        : { $or: [{ senderId: userId }, { receiverId: userId }] };

    return this.chatMessageModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findByRoom(roomId: string, userId: number, rolId: number) {
    const requestId = this.requestIdFromRoom(roomId);
    if (requestId === null) {
      throw new ForbiddenException('Sala de chat no autorizada');
    }

    await this.authorizeConversation(requestId, userId, rolId);

    return this.chatMessageModel.find({ roomId }).sort({ createdAt: 1 }).exec();
  }

  async findOne(id: string, userId: number, rolId: number) {
    const message = await this.chatMessageModel.findById(id).exec();

    if (!message) {
      throw new NotFoundException('Mensaje no encontrado');
    }

    if (
      rolId !== 1 &&
      message.senderId !== userId &&
      message.receiverId !== userId
    ) {
      throw new ForbiddenException('No puedes ver este mensaje');
    }

    return message;
  }

  async update(
    id: string,
    data: UpdateChatMessageDto,
    userId: number,
    rolId: number,
  ) {
    const message = await this.findOne(id, userId, rolId);

    if (rolId !== 1 && message.senderId !== userId) {
      throw new ForbiddenException('No puedes editar este mensaje');
    }

    const updatedMessage = await this.chatMessageModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException('Mensaje no encontrado');
    }

    return updatedMessage;
  }

  async remove(id: string, userId: number, rolId: number) {
    const message = await this.findOne(id, userId, rolId);

    if (rolId !== 1 && message.senderId !== userId) {
      throw new ForbiddenException('No puedes eliminar este mensaje');
    }

    await this.chatMessageModel.findByIdAndDelete(id).exec();

    return {
      message: 'Mensaje eliminado correctamente',
    };
  }

  async authorizeConversation(id: number, userId: number, rolId: number) {
    const request = await this.prisma.solicitud.findUnique({
      where: { id },
      include: { servicio: true },
    });
    if (!request) {
      throw new NotFoundException('Conversacion no encontrada');
    }
    if (
      rolId !== 1 &&
      request.cliente_id !== userId &&
      request.servicio.prestador_id !== userId
    ) {
      throw new ForbiddenException('No puedes ver esta conversacion');
    }
    return request;
  }

  private roomId(id: number) {
    return `request-${id}`;
  }

  requestIdFromRoom(roomId: string) {
    const match = /^request-(\d+)$/.exec(roomId);
    return match ? Number(match[1]) : null;
  }

  private mapMessage(conversationId: number, message: ChatMessageDocument) {
    return {
      id: message.id,
      conversationId,
      senderId: message.senderId,
      text: message.message,
      sentAt: message.createdAt,
      readAt: message.read ? message.updatedAt : null,
    };
  }
}
