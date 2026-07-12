export type MessageRole = 'system' | 'user' | 'assistant';

export interface MessageProps {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

/**
 * A single turn in a Conversation. Not its own aggregate — never queried or
 * persisted independently of its parent Conversation, same rule
 * LedgerEntry follows for Wallet (docs/architecture/ddd-tactical-design.md).
 */
export class Message {
  private constructor(
    readonly id: string,
    readonly role: MessageRole,
    readonly content: string,
    readonly createdAt: Date,
  ) {}

  static create(props: MessageProps): Message {
    if (props.content.trim().length === 0) {
      throw new Error('Message content must not be empty');
    }
    return new Message(props.id, props.role, props.content, props.createdAt);
  }
}
