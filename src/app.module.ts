import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { ChatsModule } from './chats/chats.module';
import { LogsModule } from './logs/logs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PagosModule } from './pagos/pagos.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AddressesModule } from './addresses/addresses.module';
import { AppLoggerModule } from './logger/logger.module';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ??
        process.env.MONGO_URI ??
        'mongodb://127.0.0.1:27017/chambaapp',
    ),
    AppLoggerModule,   // ← Winston structured logging (global)
    AuthModule,
    UsersModule,
    PrismaModule,
    ServicesModule,
    SolicitudesModule,
    PagosModule,
    CalificacionesModule,
    NotificationsModule,
    ChatsModule,
    LogsModule,
    FavoritesModule,
    DashboardModule,
    AddressesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Correlation ID en TODAS las rutas
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
