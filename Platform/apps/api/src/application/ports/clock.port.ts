export const CLOCK_PORT = Symbol('ClockPort');

/**
 * Trivial example port demonstrating the pattern (a use case depends on this
 * interface, never on `new Date()` directly, so time can be controlled in tests).
 */
export interface ClockPort {
  now(): Date;
}
