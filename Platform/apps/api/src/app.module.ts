import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { HealthModule } from './health.module';
import { IdentityModule } from './identity.module';
import { WalletModule } from './wallet.module';
import { PricingModule } from './pricing.module';
import { ChatModule } from './chat.module';
import { RequestIdMiddleware } from './interfaces/http/middleware/request-id.middleware';

@Module({
  imports: [HealthModule, IdentityModule, WalletModule, PricingModule, ChatModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
