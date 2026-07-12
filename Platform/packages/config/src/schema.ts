import { z } from 'zod';

export const configSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),

  api: z.object({
    port: z.coerce.number().int().positive().default(3001),
    baseUrl: z.string().url().default('http://localhost:3001'),
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
