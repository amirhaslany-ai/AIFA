import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Logger } from '@aifa/logger';
import { AllProvidersUnavailableError, CircuitOpenError, ProviderUnavailableError } from '@aifa/ai-provider-sdk';
import { DomainError } from '../../../domain/errors/domain-error';
import { AccountAlreadyExistsError } from '../../../domain/errors/account-already-exists.error';
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials.error';
import { InvalidRefreshTokenError } from '../../../domain/errors/invalid-refresh-token.error';
import type { RequestWithId } from '../middleware/request-id.middleware';

/**
 * Global exception filter implementing docs/architecture/api-architecture.md's
 * error shape. Maps known domain/provider errors to a stable code + appropriate
 * status; sanitizes everything else to a generic 500 (never leaks a stack trace
 * or raw vendor/ORM error to the client — see docs/architecture/logging-strategy.md).
 */
@Catch()
export class DomainErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();
    const requestId = request.requestId ?? 'unknown';

    const { status, code, message } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error({ err: exception, requestId }, message);
    } else {
      this.logger.warn({ requestId, code }, message);
    }

    response.status(status).json({ error: { code, message, requestId } });
  }

  private resolve(exception: unknown): { status: number; code: string; message: string } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return { status, code: HttpStatus[status] ?? 'HTTP_ERROR', message: exception.message };
    }

    if (
      exception instanceof AllProvidersUnavailableError ||
      exception instanceof CircuitOpenError ||
      exception instanceof ProviderUnavailableError
    ) {
      // 04_PATCH_LIST.md P2-7: ProviderUnavailableError (thrown by
      // ProviderRegistry.get() for an unknown id) previously fell through to
      // a generic 500 — it belongs with the other provider-unavailable cases.
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        code: 'PROVIDER_UNAVAILABLE',
        message: exception.message,
      };
    }

    if (exception instanceof AccountAlreadyExistsError) {
      return { status: HttpStatus.CONFLICT, code: exception.code, message: exception.message };
    }

    if (exception instanceof InvalidCredentialsError || exception instanceof InvalidRefreshTokenError) {
      return { status: HttpStatus.UNAUTHORIZED, code: exception.code, message: exception.message };
    }

    if (exception instanceof DomainError) {
      return { status: HttpStatus.BAD_REQUEST, code: exception.code, message: exception.message };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    };
  }
}
