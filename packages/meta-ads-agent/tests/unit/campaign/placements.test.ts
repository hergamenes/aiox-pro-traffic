import { describe, it, expect } from 'vitest';
import { applyPlacements, parsePlatform, VALID_PLATFORMS } from '../../../src/campaign/placements.js';
import { ValidationError } from '../../../src/errors/types.js';

describe('applyPlacements', () => {
  it('should restrict to instagram', () => {
    const targeting: Record<string, unknown> = { geo_locations: { countries: ['BR'] } };
    applyPlacements(targeting, 'instagram');
    expect(targeting['publisher_platforms']).toEqual(['instagram']);
  });

  it('should restrict to facebook', () => {
    const targeting: Record<string, unknown> = {};
    applyPlacements(targeting, 'facebook');
    expect(targeting['publisher_platforms']).toEqual(['facebook']);
  });

  it('should NOT touch targeting for "all"', () => {
    const targeting: Record<string, unknown> = {};
    applyPlacements(targeting, 'all');
    expect(targeting['publisher_platforms']).toBeUndefined();
  });

  it('should NOT touch targeting when platform is undefined', () => {
    const targeting: Record<string, unknown> = {};
    applyPlacements(targeting, undefined);
    expect(targeting['publisher_platforms']).toBeUndefined();
  });
});

describe('parsePlatform', () => {
  it('should return undefined for empty value', () => {
    expect(parsePlatform(undefined)).toBeUndefined();
  });

  it('should accept all valid platforms', () => {
    for (const p of VALID_PLATFORMS) {
      expect(parsePlatform(p)).toBe(p);
    }
  });

  it('should throw ValidationError for invalid platform', () => {
    expect(() => parsePlatform('tiktok')).toThrow(ValidationError);
  });
});
