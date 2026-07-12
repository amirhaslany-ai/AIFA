import { Message } from './message';

/**
 * Aggregate root for the Conversation bounded context (docs/architecture/ddd-tactical-design.md).
 * Owns Message entities; holds accountId by id only, never a live Account
 * reference, so it stays independently loadable/testable.
 */
export class Conversation {
  private constructor(
    readonly id: string,
    readonly accountId: string,
    private readonly messages: Message[],
    readonly createdAt: Date,
  ) {}

  static start(params: { id: string; accountId: string; now: Date }): Conversation {
    return new Conversation(params.id, params.accountId, [], params.now);
  }

  static reconstitute(params: {
    id: string;
    accountId: string;
    messages: Message[];
    createdAt: Date;
  }): Conversation {
    return new Conversation(params.id, params.accountId, [...params.messages], params.createdAt);
  }

  addMessage(message: Message): void {
    this.messages.push(message);
  }

  getMessages(): readonly Message[] {
    return this.messages;
  }
}
