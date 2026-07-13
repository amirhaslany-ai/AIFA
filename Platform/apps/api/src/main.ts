import 'reflect-metadata';
import { join } from 'node:path';
import { config as loadDotenv } from 'dotenv';

// NestJS does not auto-load .env files (unlike Next.js). The single shared
// .env lives at the Platform/ monorepo root (docs/architecture/secrets-config-management.md),
// three levels up from this file whether running from src/ (ts-node, dev) or
// dist/ (compiled, production) — both sit at the same depth under apps/api/.
// A missing file is a no-op; real deployments inject env vars directly.
loadDotenv({ path: join(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { loadConfig } from '@aifa/config';
import { createLogger } from '@aifa/logger';
import { AppModule } from './app.module';
import { DomainErrorFilter } from './interfaces/http/filters/domain-error.filter';
import { RequestLoggingInterceptor } from './interfaces/http/interceptors/request-logging.interceptor';

async function bootstrap(): Promise<void> {
  const config = loadConfig();
  const logger = createLogger({ service: 'api', logLevel: config.observability.logLevel });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  // Drains the Prisma connection cleanly on SIGTERM/SIGINT instead of the
  // process dying with an open connection — matters for rolling deploys.
  // Requires PrismaLifecycleService's OnApplicationShutdown hook
  // (app.module.ts) to actually fire; Nest ignores shutdown hooks otherwise.
  app.enableShutdownHooks();

  // Baseline security headers (CSP, X-Frame-Options, HSTS, etc.) — there
  // were previously none at all on any response.
  app.use(helmet());

  app.useGlobalFilters(new DomainErrorFilter(logger));

  // Logs every request's outcome (method/path/status/duration/requestId) on
  // the success path — DomainErrorFilter already logged failures, but a
  // successful request previously left no log line, so request tracing was
  // only ever half-built (constructed manually with the same logger
  // instance as DomainErrorFilter, matching that filter's existing pattern).
  app.useGlobalInterceptors(new RequestLoggingInterceptor(logger));

  // class-validator/class-transformer were installed but no global pipe ever
  // enforced DTO validation — request bodies were accepted unchecked.
  // whitelist strips unknown properties rather than erroring on them
  // (lenient-by-default is friendlier for API evolution); forbidNonWhitelisted
  // would reject them instead, if that's ever preferred.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // apps/web and apps/api are separate origins by design (docs/architecture/frontend-architecture.md).
  // Without this, browser-side calls from apps/web are silently blocked by the
  // same-origin policy. Allowlist, not a wildcard —
  // `credentials: true` requires an explicit origin list per the CORS spec anyway.
  app.enableCors({ origin: config.api.corsAllowedOrigins, credentials: true });

  // Swagger exposes the full API surface (request/response shapes, error
  // codes) unauthenticated — acceptable in development, not in a real
  // deployment. Gated by NODE_ENV rather than a guard: there is no real
  // audience for interactive API docs in production yet, so the simplest
  // correct fix is to not mount it there at all.
  if (config.nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('AIFA Platform API')
      .setDescription(
        'Foundation-milestone API. See Platform/docs/architecture/api-architecture.md.',
      )
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('v1/docs', app, document);
  }

  await app.listen(config.api.port);
  logger.info(
    `API listening on port ${config.api.port}` +
      (config.nodeEnv !== 'production' ? ', docs at /v1/docs' : ''),
  );
}

bootstrap();
