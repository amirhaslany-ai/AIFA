import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { HealthModule } from './health.module';
import { RequestIdMiddleware } from './interfaces/http/middleware/request-id.middleware';

@Module({
  imports: [HealthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
