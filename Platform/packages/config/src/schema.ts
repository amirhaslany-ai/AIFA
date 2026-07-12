import { z } from 'zod';

export const configSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),

  api: z.object({
    port: z.coerce.number().int().positive().default(3001),
    baseUrl: z.string().url().default('http://localhost:3001'),
    /**
     * Comma-separated allowlist of origins permitted to call this API with
     * credentials (04_PATCH_LIST.md P1-4 — apps/web and apps/api are separate
     * origins by design; without this, browser calls from apps/web are
     * silently blocked by the same-origin policy the moment client-side
     * fetching is added).
     */
    corsAllowedOrigins: z
      .string()
      .default('http://localhost:3000')
      .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  }),

  web: z.object({
    port: z.coerce.number().int().positive().default(3000),
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

export type AppConfig = z.infer<typeof configSchema>;
