const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Value object — equality is by value, immutable, normalizes case so
 * "User@Example.com" and "user@example.com" are treated as the same account
 * (this is what makes the @@unique(email) constraint actually enforce
 * uniqueness the way a human expects it to).
 */
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      throw new Error(`"${raw}" is not a valid email address`);
    }
    return new Email(normalized);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
