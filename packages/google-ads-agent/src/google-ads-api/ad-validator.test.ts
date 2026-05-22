import { describe, it, expect } from 'vitest';
import { validateRsaInputs, validateRdaInputs, AD_LIMITS } from './ad-validator.js';

const validRsa = {
  headlines: ['Marketing Digital', 'Resultados em 30 Dias', 'Especialistas Tráfego'],
  descriptions: ['Aumente vendas com gestão pro.', 'Time certificado, ROI mensurável.'],
  finalUrl: 'https://example.com',
};

const validRda = {
  headlines: ['Headline 1', 'Headline 2'],
  longHeadline: 'Long Headline Up To 90 Chars',
  descriptions: ['Description 1', 'Description 2'],
  businessName: 'Solaro',
  finalUrl: 'https://example.com',
  logoAssetId: '12345',
  marketingImageAssetIds: ['67890'],
};

describe('validateRsaInputs', () => {
  it('accepts minimal valid RSA', () => {
    const r = validateRsaInputs(validRsa);
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it('rejects too few headlines', () => {
    const r = validateRsaInputs({
      ...validRsa,
      headlines: ['Only One', 'Only Two'],
    });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/mínimo 3/);
  });

  it('rejects too many headlines', () => {
    const r = validateRsaInputs({
      ...validRsa,
      headlines: Array(16).fill('H'),
    });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/máximo 15/);
  });

  it('rejects headline > 30 chars', () => {
    const r = validateRsaInputs({
      ...validRsa,
      headlines: ['Normal', 'Normal 2', 'a'.repeat(31)],
    });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/Headline 3/);
    expect(r.errors.join(' ')).toMatch(/31\/30/);
  });

  it('rejects too few descriptions', () => {
    const r = validateRsaInputs({ ...validRsa, descriptions: ['Only one'] });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/mínimo 2/);
  });

  it('rejects description > 90 chars', () => {
    const r = validateRsaInputs({
      ...validRsa,
      descriptions: ['Normal', 'a'.repeat(91)],
    });
    expect(r.valid).toBe(false);
  });

  it('rejects path > 15 chars', () => {
    const r = validateRsaInputs({
      ...validRsa,
      path1: 'a'.repeat(16),
    });
    expect(r.valid).toBe(false);
  });

  it('rejects path2 without path1', () => {
    const r = validateRsaInputs({ ...validRsa, path2: 'something' });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/path2 não pode/);
  });

  it('rejects non-HTTPS finalUrl', () => {
    const r = validateRsaInputs({ ...validRsa, finalUrl: 'http://example.com' });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/HTTPS/);
  });

  it('rejects pinned headline not in headlines list', () => {
    const r = validateRsaInputs({
      ...validRsa,
      pinnedHeadline1: 'Not In The List',
    });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/não está na lista/);
  });

  it('accepts pinned headline that IS in headlines list', () => {
    const r = validateRsaInputs({
      ...validRsa,
      pinnedHeadline1: validRsa.headlines[0],
    });
    expect(r.valid).toBe(true);
  });

  it('accepts at exact limits (boundary)', () => {
    const r = validateRsaInputs({
      headlines: Array(3).fill('a'.repeat(30)),
      descriptions: Array(2).fill('a'.repeat(90)),
      path1: 'a'.repeat(15),
      finalUrl: 'https://example.com',
    });
    expect(r.valid).toBe(true);
  });

  it('lists multiple errors at once', () => {
    const r = validateRsaInputs({
      headlines: ['One', 'Two'],
      descriptions: ['One'],
      finalUrl: 'http://x',
    });
    expect(r.errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe('validateRdaInputs', () => {
  it('accepts minimal valid RDA', () => {
    const r = validateRdaInputs(validRda);
    expect(r.valid).toBe(true);
  });

  it('rejects empty headlines', () => {
    const r = validateRdaInputs({ ...validRda, headlines: [] });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/mínimo 1/);
  });

  it('rejects too many headlines', () => {
    const r = validateRdaInputs({
      ...validRda,
      headlines: Array(6).fill('H'),
    });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/máximo 5/);
  });

  it('rejects business_name > 25 chars', () => {
    const r = validateRdaInputs({
      ...validRda,
      businessName: 'a'.repeat(26),
    });
    expect(r.valid).toBe(false);
  });

  it('rejects long-headline > 90 chars', () => {
    const r = validateRdaInputs({
      ...validRda,
      longHeadline: 'a'.repeat(91),
    });
    expect(r.valid).toBe(false);
  });

  it('rejects empty marketing-image-asset-ids', () => {
    const r = validateRdaInputs({
      ...validRda,
      marketingImageAssetIds: [],
    });
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/marketing-image-asset-id/);
  });

  it('rejects empty logo-asset-id', () => {
    const r = validateRdaInputs({ ...validRda, logoAssetId: '' });
    expect(r.valid).toBe(false);
  });

  it('rejects non-HTTPS finalUrl', () => {
    const r = validateRdaInputs({ ...validRda, finalUrl: 'http://example.com' });
    expect(r.valid).toBe(false);
  });
});

describe('AD_LIMITS constants', () => {
  it('RSA limits are immutable and correct', () => {
    expect(AD_LIMITS.RSA.HEADLINE_MAX).toBe(30);
    expect(AD_LIMITS.RSA.DESCRIPTION_MAX).toBe(90);
    expect(AD_LIMITS.RSA.HEADLINE_COUNT_MIN).toBe(3);
    expect(AD_LIMITS.RSA.HEADLINE_COUNT_MAX).toBe(15);
  });

  it('RDA limits are correct', () => {
    expect(AD_LIMITS.RDA.HEADLINE_MAX).toBe(30);
    expect(AD_LIMITS.RDA.LONG_HEADLINE_MAX).toBe(90);
    expect(AD_LIMITS.RDA.BUSINESS_NAME_MAX).toBe(25);
  });
});
