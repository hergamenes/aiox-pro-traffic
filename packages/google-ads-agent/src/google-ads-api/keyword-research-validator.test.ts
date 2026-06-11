import { describe, it, expect } from 'vitest';
import {
  resolveGeoConstant,
  resolveLanguageConstant,
  validateSeeds,
  MAX_SEEDS,
} from './keyword-research-validator.js';

describe('resolveGeoConstant', () => {
  it('resolves known code BR', () => {
    expect(resolveGeoConstant('BR')).toBe('geoTargetConstants/2076');
  });

  it('is case-insensitive', () => {
    expect(resolveGeoConstant('br')).toBe('geoTargetConstants/2076');
  });

  it('accepts raw numeric id as fallback', () => {
    expect(resolveGeoConstant('9999')).toBe('geoTargetConstants/9999');
  });

  it('trims whitespace', () => {
    expect(resolveGeoConstant('  US ')).toBe('geoTargetConstants/2840');
  });

  it('returns null for unknown code', () => {
    expect(resolveGeoConstant('XX')).toBeNull();
  });
});

describe('resolveLanguageConstant', () => {
  it('resolves known code pt', () => {
    expect(resolveLanguageConstant('pt')).toBe('languageConstants/1014');
  });

  it('accepts raw numeric id', () => {
    expect(resolveLanguageConstant('1000')).toBe('languageConstants/1000');
  });

  it('returns null for unknown code', () => {
    expect(resolveLanguageConstant('zz')).toBeNull();
  });
});

describe('validateSeeds', () => {
  it('rejects empty list', () => {
    const r = validateSeeds([]);
    expect(r.valid).toBe(false);
    expect(r.error).toBeDefined();
  });

  it('rejects list with only blanks', () => {
    const r = validateSeeds(['', '   ']);
    expect(r.valid).toBe(false);
  });

  it('trims and removes blanks', () => {
    const r = validateSeeds(['  livro com IA  ', '']);
    expect(r.valid).toBe(true);
    expect(r.seeds).toEqual(['livro com IA']);
  });

  it('removes case-insensitive duplicates', () => {
    const r = validateSeeds(['Livro IA', 'livro ia', 'ebook IA']);
    expect(r.valid).toBe(true);
    expect(r.seeds).toEqual(['Livro IA', 'ebook IA']);
  });

  it('accepts exactly MAX_SEEDS', () => {
    const seeds = Array.from({ length: MAX_SEEDS }, (_, i) => `seed ${i}`);
    expect(validateSeeds(seeds).valid).toBe(true);
  });

  it('rejects more than MAX_SEEDS', () => {
    const seeds = Array.from({ length: MAX_SEEDS + 1 }, (_, i) => `seed ${i}`);
    const r = validateSeeds(seeds);
    expect(r.valid).toBe(false);
    expect(r.error).toContain(String(MAX_SEEDS));
  });
});
