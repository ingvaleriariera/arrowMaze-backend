import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Aspecto AOP: Manejo centralizado de excepciones. Captura y transforma
 * todos los errores HTTP en respuestas consistentes sin que los casos de uso
 * conozcan los formatos HTTP. Implementado via ExceptionFilter siguiendo
 * SRP (única responsabilidad: manejo de errores) y OCP.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, originalUrl } = request;
    const timestamp = new Date().toISOString();

    let statusCode = 500;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let errorText: string;
      let httpExceptionMessage: string | string[];

      if (typeof exceptionResponse === 'string') {
        errorText = 'Error';
        httpExceptionMessage = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, any>;
        errorText = res.error ?? 'Error';
        httpExceptionMessage = res.message ?? 'Unknown error';
      } else {
        errorText = 'Error';
        httpExceptionMessage = exception.message;
      }

      message = Array.isArray(httpExceptionMessage)
        ? httpExceptionMessage[0]
        : httpExceptionMessage || exception.message;

      error = errorText;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error('Unknown exception caught', exception);
    }

    const responseBody = {
      statusCode,
      message,
      error,
      timestamp,
      path: originalUrl,
    };

    response.status(statusCode).json(responseBody);
  }
}
