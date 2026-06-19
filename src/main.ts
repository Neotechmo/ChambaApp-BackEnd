import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Desactivar logger por defecto; Winston lo reemplaza
    bufferLogs: true,
  });

  // Usar Winston como logger global de NestJS
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.setGlobalPrefix('api');
  app.enableCors();
  // RED Metrics interceptor — Rate, Errors, Duration por endpoint (sección 11.1)
  app.useGlobalInterceptors(
    new MetricsInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  logger.log(`ChambaApp corriendo en puerto ${port}`, 'Bootstrap');
}
void bootstrap();
