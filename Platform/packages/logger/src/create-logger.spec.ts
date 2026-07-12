import { describe, expect, it, vi } from 'vitest';
import { createLogger } from './create-logger';

describe('createLogger', () => {
  it('creates a logger exposing the standard level methods', () => {
    const logger = createLogger({ service: 'test-service' });

    expect(logger.info).toBeTypeOf('function');
    expect(logger.warn).toBeTypeOf('function');
    expect(logger.error).toBeTypeOf('function');
  });

  it('includes the service name on every emitted line', () => {
    const logger = createLogger({ service: 'test-service', logLevel: 'info' });
    const writeSpy = vi.spyOn(logger, 'info');

    logger.info({ context: 'Test' }, 'hello');

    expect(writeSpy).toHaveBeenCalledWith({ context: 'Test' }, 'hello');
    expect(logger.bindings()).toMatchObject({ service: 'test-service' });
  });

  it('respects the configured log level', () => {
    const logger = createLogger({ service: 'test-service', logLevel: 'error' });
    expect(logger.level).toBe('error');
  });
});
