import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const CORRELATION_ID_HEADER = 'X-Correlation-Id';

/**
 * CorrelationIdMiddleware
 *
 * Cumple checklist 11.1 — "Correlation ID en cada request":
 * - Si el cliente ya envía X-Correlation-Id, se reutiliza.
 * - Si no, se genera un UUID v4 nuevo.
 * - El ID se reenvía en la respuesta para que el cliente pueda trazarlo.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId =
      (req.headers[CORRELATION_ID_HEADER.toLowerCase()] as string) ?? uuidv4();

    // Exponer en el request para que los servicios lo lean
    (req as Request & { correlationId: string }).correlationId = correlationId;

    // Reenviar en la respuesta
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    next();
  }
}
