import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { tap } from 'rxjs';
import type { Logger } from '@aifa/logger';
import type { RequestWithId } from '../middleware/request-id.middleware';

/**
 * Logs every request on the success path with its correlation id, method,
 * path, status, and duration. Before this existed, only DomainErrorFilter
 * held a logger instance — a failed request was traceable by its
 * requestId, but a successful one left no log line at all, so the
 * correlation-id design was only half-built (you could trace an error back
 * to a request but never trace a request's full lifecycle).
 *
 * Constructed manually in main.ts with the same logger instance
 * DomainErrorFilter uses, matching that filter's existing pattern rather
 * than introducing a new DI-wired LoggerModule — a bigger change than this
 * hardening pass's scope.
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): ReturnType<CallHandler['handle']> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.info(
          {
            requestId: request.requestId ?? 'unknown',
            method: request.method,
            path: request.originalUrl ?? request.url,
            status: response.statusCode,
            durationMs: Date.now() - startedAt,
          },
          'request completed',
        );
      }),
    );
  }
}
