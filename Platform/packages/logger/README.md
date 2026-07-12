# @aifa/logger

Structured JSON logging wrapper around pino, implementing `docs/architecture/logging-strategy.md`. Apps call `createLogger()` and get a logger that always emits the required fields (`timestamp`, `level`, `message`, `service`, `context`); `requestId` is attached per-request via `.child({ requestId })` in `apps/api`'s request middleware.

## Dependencies

`pino`. No other runtime dependency.

## Public API

- `createLogger(options: CreateLoggerOptions): Logger` — `options.service` (required), `options.logLevel` (optional, defaults `'info'`).
- `Logger`, `CreateLoggerOptions` — re-exported types.

## Usage

```ts
import { createLogger } from '@aifa/logger';

const logger = createLogger({ service: 'api', logLevel: 'info' });
logger.info({ context: 'ProviderRegistry' }, 'provider registry initialized');
```

## Rule

Apps consume this wrapper; they do not import `pino` directly, so the log shape stays consistent and swapping the underlying library later touches one package, not every call site.
