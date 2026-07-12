import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  AUTH_GUARD_PORT,
  type AuthGuardPort,
  type AuthenticatedPrincipal,
} from '../../../application/ports/auth-guard.port';

export interface RequestWithPrincipal extends Request {
  principal?: AuthenticatedPrincipal;
}

/**
 * Protects a route with a Bearer access token, verified via AuthGuardPort
 * (docs/api-standards.md's auth flow design — now implemented, not just a seam).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_GUARD_PORT) private readonly authGuard: AuthGuardPort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithPrincipal>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.slice('Bearer '.length);

    try {
      request.principal = await this.authGuard.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return true;
  }
}
