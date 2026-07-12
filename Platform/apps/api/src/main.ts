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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loadConfig } from '@aifa/config';
import { createLogger } from '@aifa/logger';
import { AppModule } from './app.module';
import { DomainErrorFilter } from './interfaces/http/filters/domain-error.filter';

async function bootstrap(): Promise<void> {
  const config = loadConfig();
  const logger = createLogger({ service: 'api', logLevel: config.observability.logLevel });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new DomainErrorFilter(logger));

  // apps/web and apps/api are separate origins by design (docs/architecture/frontend-architecture.md).
  // Without this, browser-side calls from apps/web are silently blocked by the
  // same-origin policy (04_PATCH_LIST.md P1-4). Allowlist, not a wildcard —
  // `credentials: true` requires an explicit origin list per the CORS spec anyway.
  app.enableCors({ origin: config.api.corsAllowedOrigins, credentials: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AIFA Platform API')
    .setDescription(
      'Foundation-milestone API. See Platform/docs/architecture/api-architecture.md.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v1/docs', app, document);

  await app.listen(config.api.port);
  logger.info(`API listening on port ${config.api.port}, docs at /v1/docs`);
}

bootstrap();
