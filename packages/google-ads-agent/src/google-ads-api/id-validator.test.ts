import { describe, it, expect, vi } from 'vitest';

// id-validator transitively imports config-repository → keychain → keytar.
// Mock keytar so the suite runs without a system keychain.
vi.mock('keytar', () => {
  const store = new Map<string, string>();
  return {
    default: {
      setPassword: vi.fn(async (s: string, a: string, v: string) => {
        store.set(`${s}::${a}`, v);
      }),
      getPassword: vi.fn(async (s: string, a: string) => store.get(`${s}::${a}`) ?? null),
      deletePassword: vi.fn(async (s: string, a: string) => store.delete(`${s}::${a}`)),
    },
  };
});

const { isNumericId, assertNumericId, assertCustomerId, escapeGaqlString } = await import(
  './id-validator.js'
);

describe('isNumericId', () => {
  it('accepts a plain numeric string', () => {
    expect(isNumericId('1234567890')).toBe(true);
  });

  it('accepts a short numeric string', () => {
    expect(isNumericId('42')).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(isNumericId('  99  ')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isNumericId('')).toBe(false);
  });

  it('rejects letters', () => {
    expect(isNumericId('12a3')).toBe(false);
  });

  it('rejects GAQL-injection payloads', () => {
    expect(isNumericId("1 OR 1=1")).toBe(false);
    expect(isNumericId('1; SELECT campaign.id')).toBe(false);
    expect(isNumericId("1' OR '1'='1")).toBe(false);
  });

  it('rejects dashes (numeric ID has no formatting)', () => {
    expect(isNumericId('123-456')).toBe(false);
  });

  it('rejects non-string input', () => {
    expect(isNumericId(undefined)).toBe(false);
    expect(isNumericId(null)).toBe(false);
    expect(isNumericId(123)).toBe(false);
  });
});

describe('assertNumericId', () => {
  it('returns the trimmed id when valid', () => {
    expect(assertNumericId('  555  ', 'Campaign ID')).toBe('555');
  });

  it('throws a pt-BR VALIDATION error with the label when invalid', () => {
    expect(() => assertNumericId('abc', 'Campaign ID')).toThrowError(
      /Campaign ID inválido/,
    );
  });

  it('throws on an injection attempt', () => {
    expect(() => assertNumericId("1 OR 1=1", 'Criterion ID')).toThrowError(
      /Criterion ID inválido/,
    );
  });
});

describe('assertCustomerId', () => {
  it('returns the normalized (dash-stripped) id for a valid 10-digit value', () => {
    expect(assertCustomerId('123-456-7890')).toBe('1234567890');
  });

  it('accepts a plain 10-digit value', () => {
    expect(assertCustomerId('1234567890')).toBe('1234567890');
  });

  it('throws when not exactly 10 digits', () => {
    expect(() => assertCustomerId('123')).toThrowError(/Customer ID inválido/);
  });

  it('throws on injection attempt', () => {
    expect(() => assertCustomerId("1' OR '1'='1")).toThrowError(/Customer ID inválido/);
  });
});

describe('escapeGaqlString', () => {
  it('escapes a single quote', () => {
    expect(escapeGaqlString("O'Brien")).toBe("O\\'Brien");
  });

  it('escapes a backslash', () => {
    expect(escapeGaqlString('a\\b')).toBe('a\\\\b');
  });

  it('escapes backslash BEFORE quote (order matters)', () => {
    // Input: \'  → backslash must be doubled first, then the quote escaped.
    // Correct result: \\\'  (escaped backslash + escaped quote)
    expect(escapeGaqlString("\\'")).toBe("\\\\\\'");
  });

  it('leaves a normal name untouched', () => {
    expect(escapeGaqlString('Campanha Verão 2026')).toBe('Campanha Verão 2026');
  });
});
