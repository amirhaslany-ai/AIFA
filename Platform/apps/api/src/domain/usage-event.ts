export interface UsageEventProps {
  id: string;
  accountId: string;
  conversationId: string;
  userMessageId: string;
  providerId: string;
  promptTokens: number;
  completionTokens: number;
  costMinorUnits: bigint;
  priceMinorUnits: bigint;
  currency: string;
  createdAt: Date;
}

/**
 * An append-only fact record of one completed, billed chat exchange
 * (docs/adr/0015-usage-tracking.md) — never mutated after creation, same as
 * LedgerEntry. Not owned by any other aggregate (Conversation, Wallet), so
 * it gets its own repository for independent querying, unlike LedgerEntry
 * (which is only ever read through Wallet).
 */
export class UsageEvent {
  private constructor(
    readonly id: string,
    readonly accountId: string,
    readonly conversationId: string,
    readonly userMessageId: string,
    readonly providerId: string,
    readonly promptTokens: number,
    readonly completionTokens: number,
    readonly costMinorUnits: bigint,
    readonly priceMinorUnits: bigint,
    readonly currency: string,
    readonly createdAt: Date,
  ) {}

  static create(props: UsageEventProps): UsageEvent {
    if (props.promptTokens < 0 || props.completionTokens < 0) {
      throw new Error('UsageEvent token counts must not be negative');
    }
    if (props.costMinorUnits < 0n || props.priceMinorUnits < 0n) {
      throw new Error('UsageEvent cost/price must not be negative');
    }

    return new UsageEvent(
      props.id,
      props.accountId,
      props.conversationId,
      props.userMessageId,
      props.providerId,
      props.promptTokens,
      props.completionTokens,
      props.costMinorUnits,
      props.priceMinorUnits,
      props.currency,
      props.createdAt,
    );
  }
}
