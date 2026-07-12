import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendChatMessageUseCase } from '../../../application/use-cases/send-chat-message.use-case';
import { GetConversationUseCase } from '../../../application/use-cases/get-conversation.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentAccount } from '../decorators/current-account.decorator';
import type { AuthenticatedPrincipal } from '../../../application/ports/auth-guard.port';
import {
  GetConversationResponseDto,
  SendChatMessageRequestDto,
  SendChatMessageResponseDto,
  toGetConversationResponseDto,
  toSendChatMessageResponseDto,
} from '../dto/chat.dto';

/**
 * Conversation bounded context (docs/architecture/domain-boundaries.md,
 * docs/adr/0014-chat-orchestration.md) — the first HTTP surface tying
 * Identity + Provider Access + Pricing + Wallet together into one request.
 */
@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly sendChatMessage: SendChatMessageUseCase,
    private readonly getConversation: GetConversationUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Send a message, starting a new conversation if conversationId is omitted.' })
  @ApiResponse({ status: 201, type: SendChatMessageResponseDto })
  @ApiResponse({ status: 402, description: 'Wallet balance is not positive.' })
  @ApiResponse({ status: 404, description: 'conversationId does not exist for this account.' })
  @ApiResponse({ status: 409, description: 'messageId was already submitted (retry rejected, not re-processed).' })
  @ApiResponse({ status: 503, description: 'Every configured AI provider failed.' })
  async send(
    @CurrentAccount() principal: AuthenticatedPrincipal,
    @Body() body: SendChatMessageRequestDto,
  ): Promise<SendChatMessageResponseDto> {
    const result = await this.sendChatMessage.execute({
      accountId: principal.accountId,
      content: body.content,
      ...(body.conversationId ? { conversationId: body.conversationId } : {}),
      ...(body.messageId ? { messageId: body.messageId } : {}),
    });
    return toSendChatMessageResponseDto(result);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: "A conversation's full message history." })
  @ApiResponse({ status: 200, type: GetConversationResponseDto })
  @ApiResponse({ status: 404, description: 'conversationId does not exist for this account.' })
  async conversation(
    @CurrentAccount() principal: AuthenticatedPrincipal,
    @Param('id') id: string,
  ): Promise<GetConversationResponseDto> {
    const result = await this.getConversation.execute(id, principal.accountId);
    return toGetConversationResponseDto(result);
  }
}
