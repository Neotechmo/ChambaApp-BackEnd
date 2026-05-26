import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatsModule } from '../chats/chats.module';
import {
  ProviderRequestsController,
  RequestsController,
  SolicitudesController,
} from './solicitudes.controller';
import { SolicitudesService } from './solicitudes.service';

@Module({
  imports: [NotificationsModule, ChatsModule],
  controllers: [
    SolicitudesController,
    RequestsController,
    ProviderRequestsController,
  ],
  providers: [SolicitudesService],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}
