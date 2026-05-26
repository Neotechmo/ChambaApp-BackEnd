import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatsModule } from '../chats/chats.module';
import { PagosController, RequestPaymentsController } from './pagos.controller';
import { PagosService } from './pagos.service';

@Module({
  imports: [NotificationsModule, ChatsModule],
  controllers: [PagosController, RequestPaymentsController],
  providers: [PagosService],
})
export class PagosModule {}
