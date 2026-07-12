import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { UsageEventResult } from '../../../application/use-cases/list-usage-events.use-case';

export class ListUsageEventsQueryDto {
  @ApiProperty({ required: false, minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ required: false, description: 'ISO date string — only events created strictly before this.' })
  @IsOptional()
  @IsDateString()
  before?: string;
}

export class UsageEventResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  conversationId!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty()
  promptTokens!: number;

  @ApiProperty()
  completionTokens!: number;

  @ApiProperty({ description: 'Integer string, minor units — what this call cost the platform.' })
  costMinorUnits!: string;

  @ApiProperty({ description: 'Integer string, minor units — what the account was charged.' })
  priceMinorUnits!: string;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  createdAt!: Date;
}

export function toUsageEventResponseDto(event: UsageEventResult): UsageEventResponseDto {
  return {
    id: event.id,
    conversationId: event.conversationId,
    providerId: event.providerId,
    promptTokens: event.promptTokens,
    completionTokens: event.completionTokens,
    costMinorUnits: event.costMinorUnits.toString(),
    priceMinorUnits: event.priceMinorUnits.toString(),
    currency: event.currency,
    createdAt: event.createdAt,
  };
}
