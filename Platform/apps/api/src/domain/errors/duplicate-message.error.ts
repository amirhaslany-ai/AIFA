import { DomainError } from './domain-error';

/**
 * Thrown when a client-supplied `messageId` was already used in this
 * conversation — protects against a network retry re-calling the provider
 * and re-debiting the wallet for the same logical message
 * (docs/adr/0014-chat-orchestration.md). The client should fetch the
 * conversation to see the already-produced reply rather than resend.
 */
export class DuplicateMessageError extends DomainError {
  readonly code = 'DUPLICATE_MESSAGE';

  constructor(messageId: string) {
    super(`Message ${messageId} was already submitted to this conversation`);
  }
}
