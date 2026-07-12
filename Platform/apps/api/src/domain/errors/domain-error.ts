/**
 * Base class for errors that originate from domain/application rules.
 * Carries a stable, machine-readable `code` (see docs/architecture/api-architecture.md's
 * error shape) but deliberately knows nothing about HTTP — mapping code -> status
 * is the interfaces layer's job (see interfaces/http/filters/domain-error.filter.ts).
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
