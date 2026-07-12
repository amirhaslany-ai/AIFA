import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export interface RequestWithId extends Request {
  requestId: string;
}

/**
 * Assigns/propagates the request-correlation id used by the API error shape
 * and by every log line for this request (docs/architecture/logging-strategy.md).
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.header('x-request-id');
    const requestId = incoming && incoming.length > 0 ? incoming : randomUUID();

    (req as RequestWithId).requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  }
}
