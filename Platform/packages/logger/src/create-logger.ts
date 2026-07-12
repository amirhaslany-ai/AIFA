import pino, { type Logger } from 'pino';

export interface CreateLoggerOptions {
  service: string;
  logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
}

export function createLogger({ service, logLevel = 'info' }: CreateLoggerOptions): Logger {
  return pino({
    level: logLevel,
    base: { service },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

export type { Logger } from 'pino';
