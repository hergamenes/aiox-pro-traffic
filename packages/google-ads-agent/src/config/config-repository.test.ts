import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('keytar', () => {
  const store = new Map<string, string>();
  return {
    default: {
      setPassword: vi.fn(async (s: string, a: string, v: string) => {
        store.set(`${s}::${a}`, v);
      }),
      getPassword: vi.fn(async (s: string, a: string) => store.get(`${s}::${a}`) ?? null),
      deletePassword: vi.fn(async (s: string, a: string) => store.delete(`${s}::${a}`)),
      __store: store,
    },
  };
});

import keytar from 'keytar';
import {
  normalizeCustomerId,
  isValidCustomerId,
  getDefaults,
  setDefaults,
} from './config-repository.js';
import { AppError } from '../errors/types.js';

interface KeytarWithStore {
  __store: Map<string, string>;
}

function clearStore(): void {
  (keytar as unknown as KeytarWithStore).__store.clear();
}

describe('config-repository', () => {
  beforeEach(() => clearStore());

  describe('normalizeCustomerId', () => {
    it('strips dashes', () => {
      expect(normalizeCustomerId('123-456-7890')).toBe('1234567890');
    });
    it('strips whitespace', () => {
      expect(normalizeCustomerId(' 123 4567890 ')).toBe('1234567890');
    });
    it('leaves plain digits intact', () => {
      expect(normalizeCustomerId('1234567890')).toBe('1234567890');
    });
  });

  describe('isValidCustomerId', () => {
    it('accepts 10 digits plain', () => {
      expect(isValidCustomerId('1234567890')).toBe(true);
    });
    it('accepts 10 digits with dashes', () => {
      expect(isValidCustomerId('123-456-7890')).toBe(true);
    });
    it('rejects 9 digits', () => {
      expect(isValidCustomerId('123456789')).toBe(false);
    });
    it('rejects 11 digits', () => {
      expect(isValidCustomerId('12345678901')).toBe(false);
    });
    it('rejects letters', () => {
      expect(isValidCustomerId('abcdefghij')).toBe(false);
    });
    it('rejects empty string', () => {
      expect(isValidCustomerId('')).toBe(false);
    });
  });

  describe('setDefaults / getDefaults', () => {
    it('persists customer-id only', async () => {
      await setDefaults({ customerId: '1234567890' });
      const got = await getDefaults();
      expect(got.customerId).toBe('1234567890');
      expect(got.loginCustomerId).toBeUndefined();
    });

    it('persists customer-id and login-customer-id', async () => {
      await setDefaults({ customerId: '1111111111', loginCustomerId: '2222222222' });
      const got = await getDefaults();
      expect(got.customerId).toBe('1111111111');
      expect(got.loginCustomerId).toBe('2222222222');
    });

    it('accepts dashed input and persists normalized', async () => {
      await setDefaults({ customerId: '123-456-7890' });
      const got = await getDefaults();
      expect(got.customerId).toBe('1234567890');
    });

    it('throws AppError on invalid customer-id', async () => {
      await expect(setDefaults({ customerId: 'invalid' })).rejects.toBeInstanceOf(AppError);
    });

    it('throws AppError on invalid login-customer-id', async () => {
      await expect(
        setDefaults({ customerId: '1234567890', loginCustomerId: '123' }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('returns empty object when nothing set', async () => {
      const got = await getDefaults();
      expect(got).toEqual({});
    });
  });
});
