import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { CreateNotificationDto } from './dto/create-notification.dto';
import type { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  Notification,
  type NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: CreateNotificationDto) {
    return this.notificationModel.create(data);
  }

  async findAll(userId: number, rolId: number) {
    const filter = rolId === 1 ? {} : { userId };
    return this.notificationModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: number, rolId: number) {
    const notification = await this.notificationModel.findById(id).exec();

    if (!notification) {
      throw new NotFoundException('Notificacion no encontrada');
    }

    if (rolId !== 1 && notification.userId !== userId) {
      throw new ForbiddenException('No puedes ver esta notificacion');
    }

    return notification;
  }

  async update(
    id: string,
    data: UpdateNotificationDto,
    userId: number,
    rolId: number,
  ) {
    await this.findOne(id, userId, rolId);

    const notification = await this.notificationModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    if (!notification) {
      throw new NotFoundException('Notificacion no encontrada');
    }

    return notification;
  }

  async remove(id: string, userId: number, rolId: number) {
    await this.findOne(id, userId, rolId);
    await this.notificationModel.findByIdAndDelete(id).exec();

    return {
      message: 'Notificacion eliminada correctamente',
    };
  }
}
