export const PASSWORD_HASHER_PORT = Symbol('PasswordHasherPort');

/**
 * docs/architecture/security-architecture.md: argon2id (current OWASP
 * recommendation) — never a fast/general-purpose hash for passwords.
 */
export interface PasswordHasherPort {
  hash(plainPassword: string): Promise<string>;
  verify(plainPassword: string, hash: string): Promise<boolean>;
}
