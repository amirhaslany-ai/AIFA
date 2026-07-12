import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { generateKeyPair, importPKCS8, importSPKI, type KeyLike } from 'jose';
import { loadConfig } from '@aifa/config';

/**
 * Shared Ed25519 keypair for both signing (JwtTokenIssuerAdapter) and
 * verifying (JwtAuthGuardAdapter) access tokens — docs/adr/0010-auth-token-strategy.md.
 * Must be a single shared instance: if each adapter generated its own
 * ephemeral keypair independently, tokens signed by the issuer would not
 * verify against the guard's key.
 */
@Injectable()
export class JwtKeyProvider implements OnModuleInit {
  private readonly logger = new Logger(JwtKeyProvider.name);
  private privateKey!: KeyLike;
  private publicKey!: KeyLike;

  async onModuleInit(): Promise<void> {
    const config = loadConfig();

    if (config.auth.jwtPrivateKeyPem && config.auth.jwtPublicKeyPem) {
      this.privateKey = await importPKCS8(config.auth.jwtPrivateKeyPem, 'EdDSA');
      this.publicKey = await importSPKI(config.auth.jwtPublicKeyPem, 'EdDSA');
      return;
    }

    this.logger.warn(
      'AUTH_JWT_PRIVATE_KEY_PEM/AUTH_JWT_PUBLIC_KEY_PEM not set — generating an ephemeral ' +
        'Ed25519 keypair for this process only. Tokens issued now will not verify after a ' +
        'restart. Set real keys (see .env.example) before any real deployment.',
    );
    const { privateKey, publicKey } = await generateKeyPair('EdDSA');
    this.privateKey = privateKey as KeyLike;
    this.publicKey = publicKey as KeyLike;
  }

  getPrivateKey(): KeyLike {
    return this.privateKey;
  }

  getPublicKey(): KeyLike {
    return this.publicKey;
  }
}
