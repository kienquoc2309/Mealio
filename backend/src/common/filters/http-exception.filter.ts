import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { httpLog } from '../logger/http-logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse =
      typeof message === 'string'
        ? { statusCode: status, message }
        : (message as Record<string, unknown>);

    const reason =
      typeof message === 'string'
        ? message
        : ((message as Record<string, unknown>).message as string) ||
          JSON.stringify(message);

    const user = request['user'] as { id?: string } | undefined;
    const userId = user?.id ?? null;

    httpLog('ERROR', {
      service: 'exception-filter',
      message: 'Request failed',
      method: request.method,
      path: request.originalUrl,
      statusCode: status,
      reason,
      ip: request.ip,
      userId,
      ...(!(exception instanceof HttpException) &&
        exception instanceof Error && { stack: exception.stack }),
    });

    response.status(status).json(errorResponse);
  }
}
