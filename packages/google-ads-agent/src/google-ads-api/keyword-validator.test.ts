import { describe, it, expect } from 'vitest';
import { validateKeywordText, isAutomatedBidding } from './keyword-validator.js';

describe('validateKeywordText', () => {
  it('accepts plain BROAD keyword', () => {
    const r = validateKeywordText('marketing digital', 'BROAD');
    expect(r.ok).toBe(true);
    expect(r.normalized).toBe('marketing digital');
    expect(r.warnings).toHaveLength(0);
  });

  it('trims leading/trailing whitespace and warns', () => {
    const r = validateKeywordText('  tênis  ', 'BROAD');
    expect(r.ok).toBe(true);
    expect(r.normalized).toBe('tênis');
    expect(r.warnings.join(' ')).toMatch(/Whitespace/);
  });

  it('strips quotes for PHRASE match', () => {
    const r = validateKeywordText('"marketing porto alegre"', 'PHRASE');
    expect(r.ok).toBe(true);
    expect(r.normalized).toBe('marketing porto alegre');
    expect(r.warnings.join(' ')).toMatch(/Aspas/);
  });

  it('strips brackets for EXACT match', () => {
    const r = validateKeywordText('[marketing poa]', 'EXACT');
    expect(r.ok).toBe(true);
    expect(r.normalized).toBe('marketing poa');
    expect(r.warnings.join(' ')).toMatch(/Brackets/);
  });

  it('rejects empty after trim', () => {
    expect(validateKeywordText('   ', 'BROAD').ok).toBe(false);
    expect(validateKeywordText('', 'BROAD').ok).toBe(false);
  });

  it('rejects > 80 chars', () => {
    const long = 'a'.repeat(81);
    const r = validateKeywordText(long, 'BROAD');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/80 caracteres/);
  });

  it('accepts exactly 80 chars', () => {
    const exactly80 = 'a'.repeat(80);
    expect(validateKeywordText(exactly80, 'BROAD').ok).toBe(true);
  });

  it('rejects non-string input', () => {
    expect(validateKeywordText(123 as unknown as string, 'BROAD').ok).toBe(false);
  });
});

describe('isAutomatedBidding', () => {
  it('detects automated strategies (string names)', () => {
    expect(isAutomatedBidding('MAXIMIZE_CONVERSIONS')).toBe(true);
    expect(isAutomatedBidding('TARGET_CPA')).toBe(true);
    expect(isAutomatedBidding('TARGET_ROAS')).toBe(true);
    expect(isAutomatedBidding('MAXIMIZE_CONVERSION_VALUE')).toBe(true);
    expect(isAutomatedBidding('TARGET_SPEND')).toBe(true);
  });

  it('detects manual strategies (returns false)', () => {
    expect(isAutomatedBidding('MANUAL_CPC')).toBe(false);
    expect(isAutomatedBidding('ENHANCED_CPC')).toBe(false);
  });

  it('handles numeric enums', () => {
    expect(isAutomatedBidding(10)).toBe(true); // MAXIMIZE_CONVERSIONS
    expect(isAutomatedBidding(6)).toBe(true); // TARGET_CPA
    expect(isAutomatedBidding(3)).toBe(false); // MANUAL_CPC
  });

  it('returns false for unknown/null', () => {
    expect(isAutomatedBidding(undefined)).toBe(false);
    expect(isAutomatedBidding(null)).toBe(false);
    expect(isAutomatedBidding('UNKNOWN_STRATEGY')).toBe(false);
  });

  it('case-insensitive', () => {
    expect(isAutomatedBidding('maximize_conversions')).toBe(true);
  });
});
