import { Module } from '@nestjs/common';
import { IdentityModule } from './identity.module';
import { UsageController } from './interfaces/http/controllers/usage.controller';
import { ListUsageEventsUseCase } from './application/use-cases/list-usage-events.use-case';
import { USAGE_EVENT_REPOSITORY_PORT } from './application/ports/usage-event-repository.port';
import { PrismaUsageEventRepository } from './infrastructure/persistence/prisma-usage-event.repository';

/**
 * Usage Tracking (docs/architecture/domain-boundaries.md,
 * docs/adr/0015-usage-tracking.md). USAGE_EVENT_REPOSITORY_PORT is exported
 * so ChatModule's SendChatMessageUseCase can record an event right after
 * each billed exchange — this module never depends on ChatModule, only the
 * reverse, avoiding a circular import.
 */
@Module({
  imports: [IdentityModule],
  controllers: [UsageController],
  providers: [
    ListUsageEventsUseCase,
    { provide: USAGE_EVENT_REPOSITORY_PORT, useClass: PrismaUsageEventRepository },
  ],
  exports: [USAGE_EVENT_REPOSITORY_PORT],
})
export class UsageModule {}
