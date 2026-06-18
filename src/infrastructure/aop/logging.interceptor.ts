import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

/**
 * Aspecto AOP: Trazabilidad. Registra entrada, salida y duración
 * de cada request HTTP sin contaminar los casos de uso ni controllers.
 * Implementado via NestInterceptor siguiendo OCP (abierto a extensión)
 * y SRP (única responsabilidad: logging).
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const duration = Date.now() - startTime;

        this.logger.log(
          `${method} ${originalUrl} - ${statusCode} - ${duration}ms`,
        );
      }),
    );
  }
}
