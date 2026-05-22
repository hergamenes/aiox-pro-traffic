import { describe, it, expect } from 'vitest';
import {
  parseMicros,
  formatMicros,
  calculateBudgetDelta,
  calculatePercentDelta,
} from './budget-validator.js';

describe('parseMicros', () => {
  it('parses plain integer', () => {
    expect(parseMicros('30')).toBe(30_000_000);
  });

  it('parses decimal with dot', () => {
    expect(parseMicros('30.50')).toBe(30_500_000);
  });

  it('parses decimal with comma (BR style)', () => {
    expect(parseMicros('30,50')).toBe(30_500_000);
  });

  it('strips R$ prefix', () => {
    expect(parseMicros('R$ 30,00')).toBe(30_000_000);
  });

  it('strips $ prefix and whitespace', () => {
    expect(parseMicros('  $30.00 ')).toBe(30_000_000);
  });

  it('handles thousand separators (BR style 1.234,56)', () => {
    expect(parseMicros('1.234,56')).toBe(1_234_560_000);
  });

  it('handles thousand separators (US style 1,234.56)', () => {
    expect(parseMicros('1,234.56')).toBe(1_234_560_000);
  });

  it('throws on empty string', () => {
    expect(() => parseMicros('')).toThrow();
  });

  it('throws on negative value', () => {
    expect(() => parseMicros('-10')).toThrow();
  });

  it('throws on non-numeric input', () => {
    expect(() => parseMicros('abc')).toThrow();
  });
});

describe('formatMicros', () => {
  it('formats BRL with pt-BR locale', () => {
    expect(formatMicros(30_000_000, 'BRL')).toBe('R$ 30,00');
  });

  it('formats BRL decimal', () => {
    expect(formatMicros(30_500_000, 'BRL')).toBe('R$ 30,50');
  });

  it('formats USD with en-US locale', () => {
    expect(formatMicros(30_000_000, 'USD')).toBe('$ 30.00');
  });

  it('formats EUR with euro symbol', () => {
    const result = formatMicros(30_500_000, 'EUR');
    expect(result).toContain('€');
    expect(result).toMatch(/30/);
  });

  it('formats AUD with $ symbol', () => {
    expect(formatMicros(30_000_000, 'AUD')).toBe('$ 30.00');
  });

  it('handles zero', () => {
    expect(formatMicros(0, 'BRL')).toBe('R$ 0,00');
  });

  it('falls back to currency code for unknown currency', () => {
    expect(formatMicros(30_000_000, 'XYZ')).toContain('XYZ');
  });
});

describe('calculateBudgetDelta', () => {
  it('calculates +10% increase', () => {
    const delta = calculateBudgetDelta(100_000_000, 110_000_000);
    expect(delta.pct).toBeCloseTo(10, 5);
    expect(delta.exceedsThreshold(50)).toBe(false);
  });

  it('calculates +50% as exactly at boundary (does not exceed)', () => {
    const delta = calculateBudgetDelta(100_000_000, 150_000_000);
    expect(delta.pct).toBeCloseTo(50, 5);
    expect(delta.exceedsThreshold(50)).toBe(false);
  });

  it('calculates +51% as exceeds 50% threshold', () => {
    const delta = calculateBudgetDelta(100_000_000, 151_000_000);
    expect(delta.exceedsThreshold(50)).toBe(true);
  });

  it('calculates -50% reduction (not massive)', () => {
    const delta = calculateBudgetDelta(100_000_000, 50_000_000);
    expect(delta.pct).toBeCloseTo(-50, 5);
    expect(delta.isMassiveReduction()).toBe(false);
  });

  it('detects -90% as massive reduction', () => {
    const delta = calculateBudgetDelta(100_000_000, 10_000_000);
    expect(delta.isMassiveReduction()).toBe(true);
  });

  it('detects -91% as massive reduction', () => {
    const delta = calculateBudgetDelta(100_000_000, 9_000_000);
    expect(delta.isMassiveReduction()).toBe(true);
  });

  it('handles zero start (infinity)', () => {
    const delta = calculateBudgetDelta(0, 100_000_000);
    expect(delta.pct).toBe(Number.POSITIVE_INFINITY);
    expect(delta.exceedsThreshold(50)).toBe(true);
  });

  it('handles zero to zero (no change)', () => {
    const delta = calculateBudgetDelta(0, 0);
    expect(delta.pct).toBe(0);
    expect(delta.exceedsThreshold(50)).toBe(false);
  });
});

describe('calculatePercentDelta (alias of calculateBudgetDelta, used by 6.4)', () => {
  it('alias is identical to calculateBudgetDelta', () => {
    expect(calculatePercentDelta).toBe(calculateBudgetDelta);
  });

  it('works for keyword bid scenario (small CPC values)', () => {
    // R$ 0,50 → R$ 0,80 = +60%
    const delta = calculatePercentDelta(500_000, 800_000);
    expect(delta.pct).toBeCloseTo(60, 1);
    expect(delta.exceedsThreshold(50)).toBe(true);
  });

  it('works for keyword bid scenario within threshold', () => {
    // R$ 1,00 → R$ 1,10 = +10%
    const delta = calculatePercentDelta(1_000_000, 1_100_000);
    expect(delta.exceedsThreshold(50)).toBe(false);
  });
});
