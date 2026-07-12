import { describe, expect, it } from 'vitest';
import { Email } from './email';

describe('Email', () => {
  it('accepts a well-formed address', () => {
    expect(() => Email.create('user@example.com')).not.toThrow();
  });

  it('rejects a malformed address', () => {
    expect(() => Email.create('not-an-email')).toThrow(/not a valid email/);
  });

  it('normalizes case and trims whitespace so equivalent addresses are equal', () => {
    const a = Email.create('  User@Example.com  ');
    const b = Email.create('user@example.com');

    expect(a.equals(b)).toBe(true);
    expect(a.toString()).toBe('user@example.com');
  });

  it('treats different addresses as unequal', () => {
    const a = Email.create('a@example.com');
    const b = Email.create('b@example.com');

    expect(a.equals(b)).toBe(false);
  });
});
