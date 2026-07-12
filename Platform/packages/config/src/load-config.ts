import { configSchema, type AppConfig } from './schema';

/**
 * Parses and validates process.env once. Fails fast (throws) on boot if a
 * required variable is missing or malformed, per docs/architecture/secrets-config-management.md.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = configSchema.safeParse({
    nodeEnv: env.NODE_ENV,
    api: {
      port: env.API_PORT,
      baseUrl: env.API_BASE_URL,
      corsAllowedOrigins: env.CORS_ALLOWED_ORIGINS,
    },
    web: {
      port: env.WEB_PORT,
    },
    database: {
      url: env.DATABASE_URL,
    },
    redis: {
      url: env.REDIS_URL,
    },
    observability: {
      logLevel: env.LOG_LEVEL,
      otlpEndpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT || undefined,
    },
  });

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration:\n${result.error.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n')}`,
    );
  }

  return result.data;
}
