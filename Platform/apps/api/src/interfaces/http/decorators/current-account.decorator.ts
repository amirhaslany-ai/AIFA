import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedPrincipal } from '../../../application/ports/auth-guard.port';
import type { RequestWithPrincipal } from '../guards/jwt-auth.guard';

/** Use inside a route guarded by JwtAuthGuard — undefined otherwise. */
export const CurrentAccount = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedPrincipal | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithPrincipal>();
    return request.principal;
  },
);
