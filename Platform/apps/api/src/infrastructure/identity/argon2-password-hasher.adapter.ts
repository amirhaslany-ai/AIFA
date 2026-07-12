import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';
import type { PasswordHasherPort } from '../../application/ports/password-hasher.port';

/** Real argon2id hashing (docs/architecture/security-architecture.md) — @node-rs/argon2, prebuilt native binary. */
@Injectable()
export class Argon2PasswordHasherAdapter implements PasswordHasherPort {
  async hash(plainPassword: string): Promise<string> {
    return hash(plainPassword);
  }

  async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return verify(hashedPassword, plainPassword);
  }
}
