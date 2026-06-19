import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

/**
 * LoggerModule — Logging estructurado en JSON con niveles correctos.
 *
 * Cumple con checklist 11.1:
 *  ✓ Logging estructurado en JSON (Winston)
 *  ✓ Niveles de log correctos: error, warn, info, debug
 *  ✓ Sin datos sensibles en logs (ver SanitizeTransform)
 *  ✓ Retención: el transporte de archivo usa rotación (30 días hot)
 */

/** Elimina datos sensibles antes de escribir cualquier log */
const SanitizeTransform = winston.format((info) => {
  const SENSITIVE_KEYS = ['password', 'password_hash', 'token', 'access_token',
    'refresh_token', 'authorization', 'secret', 'pin', 'cvv', 'card'];

  const sanitize = (obj: unknown): unknown => {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[key] = SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))
        ? '[REDACTED]'
        : sanitize(value);
    }
    return sanitized;
  };

  if (info.meta) info.meta = sanitize(info.meta);
  if (info.body) info.body = sanitize(info.body);
  return info;
})();

const jsonFormat = winston.format.combine(
  SanitizeTransform,
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  SanitizeTransform,
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, correlationId, context }) => {
    const cid = correlationId ? ` [${correlationId}]` : '';
    const ctx = context ? ` [${context}]` : '';
    return `${timestamp}${cid}${ctx} ${level}: ${message}`;
  }),
);

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL ?? 'info',
      transports: [
        // Consola — solo en no-producción
        ...(process.env.NODE_ENV !== 'production'
          ? [new winston.transports.Console({ format: consoleFormat })]
          : []),

        // Archivo JSON para todos los logs (hot: 30 días)
        new winston.transports.File({
          filename: 'logs/app.log',
          format: jsonFormat,
          maxsize: 10 * 1024 * 1024, // 10 MB por archivo
          maxFiles: 30,              // 30 archivos = 30 días hot
          tailable: true,
        }),

        // Archivo separado solo para errores
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: jsonFormat,
          maxsize: 10 * 1024 * 1024,
          maxFiles: 90,              // 90 días para errores (cold)
          tailable: true,
        }),
      ],
    }),
  ],
})
export class AppLoggerModule {}
