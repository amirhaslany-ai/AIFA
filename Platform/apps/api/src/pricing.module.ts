import { Module } from '@nestjs/common';
import { PRICING_ENGINE_PORT } from './application/ports/pricing-engine.port';
import { RuleBasedPricingEngineAdapter } from './infrastructure/pricing/rule-based-pricing-engine.adapter';

/**
 * The Pricing side of the Billing bounded context (docs/architecture/domain-boundaries.md,
 * docs/adr/0009-pricing-engine-pattern.md). No controller — Pricing has no
 * HTTP surface of its own; it's invoked by other use cases (the future Chat
 * settlement flow calls PricingEnginePort, then Wallet's SettleReservationUseCase).
 * Registered as a real NestJS provider now so it's genuinely wired and
 * boot-tested, not orphaned test-only code waiting for Chat to exist.
 */
@Module({
  providers: [{ provide: PRICING_ENGINE_PORT, useClass: RuleBasedPricingEngineAdapter }],
  exports: [PRICING_ENGINE_PORT],
})
export class PricingModule {}
