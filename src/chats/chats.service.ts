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

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  async create(data: CreateChatMessageDto, userId: number) {
    return this.chatMessageModel.create({
      roomId: data.roomId,
      senderId: data.senderId ?? userId,
      receiverId: data.receiverId,
      message: data.message,
    });
  }

  async findAll(userId: number, rolId: number) {
    const filter =
      rolId === 1
        ? {}
        : { $or: [{ senderId: userId }, { receiverId: userId }] };

    return this.chatMessageModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findByRoom(roomId: string, userId: number, rolId: number) {
    const filter =
      rolId === 1
        ? { roomId }
        : {
            roomId,
            $or: [{ senderId: userId }, { receiverId: userId }],
          };

    return this.chatMessageModel.find(filter).sort({ createdAt: 1 }).exec();
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
}
