import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListUsageEventsUseCase } from '../../../application/use-cases/list-usage-events.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentAccount } from '../decorators/current-account.decorator';
import type { AuthenticatedPrincipal } from '../../../application/ports/auth-guard.port';
import { ListUsageEventsQueryDto, toUsageEventResponseDto, UsageEventResponseDto } from '../dto/usage.dto';

/**
 * Usage Tracking (docs/adr/0015-usage-tracking.md) — read-only history of
 * billed chat exchanges. Events are written exclusively by
 * SendChatMessageUseCase (chat.module.ts); this controller has no write
 * endpoint, since a usage event is a fact about a call that already
 * happened, never a client-supplied record.
 */
@ApiTags('usage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usage')
export class UsageController {
  constructor(private readonly listUsageEvents: ListUsageEventsUseCase) {}

  @Get()
  @ApiOperation({ summary: "The current account's usage history, newest first." })
  @ApiResponse({ status: 200, type: [UsageEventResponseDto] })
  async list(
    @CurrentAccount() principal: AuthenticatedPrincipal,
    @Query() query: ListUsageEventsQueryDto,
  ): Promise<UsageEventResponseDto[]> {
    const results = await this.listUsageEvents.execute({
      accountId: principal.accountId,
      ...(query.limit ? { limit: query.limit } : {}),
      ...(query.before ? { before: new Date(query.before) } : {}),
    });
    return results.map(toUsageEventResponseDto);
  }
}
