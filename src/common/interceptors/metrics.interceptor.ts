import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Request, Response } from 'express';

/**
 * MetricsInterceptor — RED Metrics (Rate, Errors, Duration)
 *
 * Cumple sección 11.1 Métricas:
 *   - Rate    : throughput de requests por endpoint
 *   - Errors  : porcentaje de respuestas con status >= 400
 *   - Duration: tiempo de respuesta en ms por endpoint
 *
 * Los datos se registran como logs estructurados JSON en Winston,
 * lo que permite consultarlos con cualquier herramienta de observabilidad.
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    const method = req.method;
    const url = req.url;
    const correlationId = (req as Request & { correlationId?: string }).correlationId ?? 'N/A';

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        this.logger.log(
          JSON.stringify({
            type: 'RED_METRIC',
            method,
            url,
            statusCode,
            duration_ms: duration,
            error: statusCode >= 400,
            correlationId,
            timestamp: new Date().toISOString(),
          }),
          'MetricsInterceptor',
        );
      }),
      catchError((err: unknown) => {
        const duration = Date.now() - startTime;
        const statusCode = (err as { status?: number })?.status ?? 500;

        this.logger.warn(
          JSON.stringify({
            type: 'RED_METRIC',
            method,
            url,
            statusCode,
            duration_ms: duration,
            error: true,
            errorMessage: (err as Error)?.message ?? 'Unknown error',
            correlationId,
            timestamp: new Date().toISOString(),
          }),
          'MetricsInterceptor',
        );

        return throwError(() => err);
      }),
    );
  }
}
