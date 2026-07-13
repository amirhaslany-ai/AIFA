import { z } from 'zod';

const baseConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),

  api: z.object({
    port: z.coerce.number().int().positive().default(3001),
    baseUrl: z.string().url().default('http://localhost:3001'),
    /**
     * Comma-separated allowlist of origins permitted to call this API with
     * credentials — apps/web and apps/api are separate origins by design;
     * without this, browser calls from apps/web are silently blocked by the
     * same-origin policy the moment client-side fetching is added.
     */
    corsAllowedOrigins: z
      .string()
      .default('http://localhost:3000')
      .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  }),

  web: z.object({
    port: z.coerce.number().int().positive().default(3000),
  }),

  auth: z.object({
    /**
     * PEM-encoded Ed25519 keypair for signing access tokens (docs/adr/0010-auth-token-strategy.md).
     * Optional: if unset, an ephemeral keypair is generated per-process at
     * boot (dev-only — tokens won't verify across a restart). Real
     * deployments must set both.
     */
    jwtPrivateKeyPem: z.string().optional(),
    jwtPublicKeyPem: z.string().optional(),
    accessTokenTtlSeconds: z.coerce.number().int().positive().default(900),
  }),

  pricing: z.object({
    /**
     * Basis points (10000 = 1.00x / no markup). Default 13000 = 1.30x —
     * docs/architecture/pricing-architecture.md's base markup rule. An
     * integer, not a float multiplier, so price computation stays exact
     * integer arithmetic (docs/adr/0008-wallet-ledger-pattern.md's "never a
     * float" principle applies to pricing too, not just the ledger).
     */
    baseMarkupBasisPoints: z.coerce.number().int().positive().default(13_000),
    /** Minimum price per call, in minor units. 0 = no floor enforced (the default — a real floor value is a product decision, not guessed here). */
    minimumPriceMinorUnits: z.coerce.bigint().default(0n),
  }),

  database: z.object({
    url: z
      .string({ required_error: 'DATABASE_URL is required' })
      .min(1, 'DATABASE_URL is required'),
  }),

  redis: z.object({
    url: z
      .string({ required_error: 'REDIS_URL is required' })
      .min(1, 'REDIS_URL is required'),
  }),

  observability: z.object({
    logLevel: z
      .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
      .default('info'),
    otlpEndpoint: z.string().optional(),
  }),
});

/**
 * A production boot with unset JWT signing keys previously succeeded
 * silently (JwtKeyProvider only logged a warning and generated an ephemeral
 * keypair) — every token issued would stop verifying on the next restart,
 * with no operator-visible failure until users were mass-logged-out.
 * Fail fast here instead: refuse to boot in production without real keys.
 * `development`/`test` keep the ephemeral-keypair convenience.
 */
export const configSchema = baseConfigSchema.superRefine((config, ctx) => {
  if (config.nodeEnv !== 'production') return;

  if (!config.auth.jwtPrivateKeyPem || !config.auth.jwtPublicKeyPem) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['auth', 'jwtPrivateKeyPem'],
      message:
        'AUTH_JWT_PRIVATE_KEY_PEM and AUTH_JWT_PUBLIC_KEY_PEM are required when NODE_ENV=production ' +
        '(an ephemeral per-process keypair is a development-only convenience — see .env.example).',
    });
  }
});

export type AppConfig = z.infer<typeof baseConfigSchema>;
