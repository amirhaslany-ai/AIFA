import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health.module';
import { IdentityModule } from './identity.module';
import { WalletModule } from './wallet.module';
import { PricingModule } from './pricing.module';
import { ChatModule } from './chat.module';
import { UsageModule } from './usage.module';
import { RequestIdMiddleware } from './interfaces/http/middleware/request-id.middleware';
import { PrismaLifecycleService } from './infrastructure/persistence/prisma-lifecycle.service';

@Module({
  imports: [
    // Global default: 100 req/min per IP. Auth endpoints override this with a
    // stricter per-route @Throttle() limit (see auth.controller.ts) — before
    // this existed, /v1/auth/login and /v1/chat accepted unlimited requests
    // from any single caller (brute-force and cost-abuse vectors).
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    HealthModule,
    IdentityModule,
    WalletModule,
    PricingModule,
    ChatModule,
    UsageModule,
  ],
  providers: [
    // Registered at the root, not a feature module, so Prisma is disconnected
    // on shutdown regardless of which feature modules exist (main.ts must also
    // call app.enableShutdownHooks() for this hook to fire at all).
    PrismaLifecycleService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
