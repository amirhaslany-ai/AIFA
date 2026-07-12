import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { SendChatMessageResult } from '../../../application/use-cases/send-chat-message.use-case';
import type { ConversationMessageResult, GetConversationResult } from '../../../application/use-cases/get-conversation.use-case';

export class SendChatMessageRequestDto {
  @ApiPropertyOptional({ description: 'Omit to start a new conversation.' })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiPropertyOptional({
    description:
      'Client-supplied idempotency key. A retry with the same value is rejected (409) before any provider call or wallet debit, instead of silently double-charging.',
  })
  @IsOptional()
  @IsString()
  messageId?: string;
}

export class ChatMessageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ['system', 'user', 'assistant'] })
  @IsIn(['system', 'user', 'assistant'])
  role!: 'system' | 'user' | 'assistant';

  @ApiProperty()
  content!: string;

  @ApiProperty()
  createdAt!: Date;
}

export class SendChatMessageResponseDto {
  @ApiProperty()
  conversationId!: string;

  @ApiProperty({ type: ChatMessageResponseDto })
  message!: ChatMessageResponseDto;

  @ApiProperty()
  providerId!: string;

  @ApiPropertyOptional()
  usage?: { promptTokens: number; completionTokens: number };

  @ApiProperty({ description: 'Integer string, minor units — what this call cost the platform.' })
  costMinorUnits!: string;

  @ApiProperty({ description: 'Integer string, minor units — what the account was actually charged.' })
  priceMinorUnits!: string;

  @ApiProperty({ description: 'Integer string, minor units — wallet balance after this charge.' })
  walletBalanceMinorUnits!: string;
}

export function toSendChatMessageResponseDto(result: SendChatMessageResult): SendChatMessageResponseDto {
  return {
    conversationId: result.conversationId,
    message: result.message,
    providerId: result.providerId,
    ...(result.usage ? { usage: result.usage } : {}),
    costMinorUnits: result.costMinorUnits.toString(),
    priceMinorUnits: result.priceMinorUnits.toString(),
    walletBalanceMinorUnits: result.walletBalanceMinorUnits.toString(),
  };
}

export class GetConversationResponseDto {
  @ApiProperty()
  conversationId!: string;

  @ApiProperty({ type: [ChatMessageResponseDto] })
  messages!: ConversationMessageResult[];
}

export function toGetConversationResponseDto(result: GetConversationResult): GetConversationResponseDto {
  return { conversationId: result.conversationId, messages: result.messages };
}
