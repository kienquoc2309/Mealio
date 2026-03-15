import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { httpLog } from '../logger/http-logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl, body, query } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;
    const now = Date.now();
    const user = request['user'] as { id?: string } | undefined;
    const userId = user?.id ?? null;
    const service = this.resolveService(context);

    const extra: Record<string, unknown> = {
      service,
      message: 'Incoming request',
      method,
      path: originalUrl,
      ip,
      userAgent,
      userId,
    };
    if (Object.keys(query).length) {
      extra.query = query;
    }
    if (body && Object.keys(body).length) {
      extra.body = this.sanitizeBody(body as Record<string, unknown>);
    }

    httpLog('INFO', extra);

    return next.handle().pipe(
      tap(() => {
        const response = ctx.getResponse<Response>();
        const statusCode = response.statusCode;
        const duration = Date.now() - now;

        httpLog('INFO', {
          service,
          message: 'Request completed',
          method,
          path: originalUrl,
          statusCode,
          duration: `${duration}ms`,
          ip,
          userId,
        });
      }),
    );
  }

  private resolveService(context: ExecutionContext): string {
    const controllerName = context.getClass().name;
    return controllerName.replace('Controller', '').toLowerCase() + '-service';
  }

  private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    const sanitized = { ...body };
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    }
    return sanitized;
  }
}
