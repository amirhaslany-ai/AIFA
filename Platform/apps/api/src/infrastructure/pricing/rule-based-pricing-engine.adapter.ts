import { Injectable } from '@nestjs/common';
import { loadConfig } from '@aifa/config';
import { Money } from '../../domain/money';
import { BaseMarkupRule } from '../../domain/pricing/base-markup-rule';
import { FloorRule } from '../../domain/pricing/floor-rule';
import { PricingPipeline } from '../../domain/pricing/pricing-pipeline';
import type {
  PricingEnginePort,
  PricingRequest,
  PricingResult,
} from '../../application/ports/pricing-engine.port';

/**
 * Builds the real rule pipeline from configuration on every call (config is
 * cheap to re-read; this avoids caching a stale multiplier across a config
 * change without a restart-and-recompute step). No campaign/discount rules
 * exist yet — the pipeline is base markup + floor only, per
 * docs/architecture/pricing-architecture.md's "no fake campaign data".
 */
@Injectable()
export class RuleBasedPricingEngineAdapter implements PricingEnginePort {
  async calculatePrice(request: PricingRequest): Promise<PricingResult> {
    const config = loadConfig();

    const pipeline = new PricingPipeline([
      new BaseMarkupRule(BigInt(config.pricing.baseMarkupBasisPoints)),
      new FloorRule(Money.of(config.pricing.minimumPriceMinorUnits, request.currency)),
    ]);

    const outcome = pipeline.run(Money.of(request.costMinorUnits, request.currency), {
      accountId: request.accountId,
      providerId: request.providerId,
      requestedAt: request.requestedAt,
    });

    return { priceMinorUnits: outcome.price.minorUnits, appliedRules: outcome.appliedRules };
  }
}
