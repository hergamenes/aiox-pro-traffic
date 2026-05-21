import { describe, it, expect } from 'vitest';
import { translateCode, listKnownCodes, GOOGLE_ADS_CODES, NETWORK_CODES } from './error-map.js';

describe('error-map', () => {
  describe('translateCode', () => {
    it('translates UNAUTHENTICATED with actionable guidance pointing to auth setup', () => {
      const t = translateCode('UNAUTHENTICATED');
      expect(t).not.toBeNull();
      expect(t!.message).toMatch(/Autenticação/);
      expect(t!.action).toMatch(/google-ads auth setup/);
    });

    it('translates PERMISSION_DENIED with permission hint', () => {
      const t = translateCode('PERMISSION_DENIED');
      expect(t).not.toBeNull();
      expect(t!.message).toMatch(/Acesso negado/);
      expect(t!.action).toMatch(/permissão|developer token/i);
    });

    it('translates INVALID_ARGUMENT', () => {
      const t = translateCode('INVALID_ARGUMENT');
      expect(t).not.toBeNull();
      expect(t!.message).toMatch(/inválido/i);
    });

    it('translates UNAVAILABLE', () => {
      const t = translateCode('UNAVAILABLE');
      expect(t).not.toBeNull();
      expect(t!.action).toMatch(/Aguarde/i);
    });

    it('translates DEADLINE_EXCEEDED', () => {
      const t = translateCode('DEADLINE_EXCEEDED');
      expect(t).not.toBeNull();
      expect(t!.message).toMatch(/Tempo limite/i);
    });

    it('translates network code ENOTFOUND', () => {
      const t = translateCode('ENOTFOUND');
      expect(t).not.toBeNull();
      expect(t!.message).toMatch(/Servidor não encontrado/i);
    });

    it('translates ETIMEDOUT', () => {
      const t = translateCode('ETIMEDOUT');
      expect(t).not.toBeNull();
    });

    it('translates ECONNREFUSED', () => {
      const t = translateCode('ECONNREFUSED');
      expect(t).not.toBeNull();
    });

    it('returns null for unknown codes', () => {
      expect(translateCode('NOT_A_REAL_CODE')).toBeNull();
    });

    it('handles undefined input gracefully', () => {
      expect(translateCode(undefined)).toBeNull();
    });

    it('is case-insensitive (uppercase keys)', () => {
      expect(translateCode('unauthenticated')).not.toBeNull();
    });

    it('accepts numeric codes (gRPC numeric status)', () => {
      // Coverage of numeric input path; map keys are strings so should
      // return null but not throw.
      expect(() => translateCode(7)).not.toThrow();
    });
  });

  describe('listKnownCodes', () => {
    it('returns all 8 Google Ads codes + 4 network codes', () => {
      const codes = listKnownCodes();
      expect(codes).toContain('UNAUTHENTICATED');
      expect(codes).toContain('PERMISSION_DENIED');
      expect(codes).toContain('ENOTFOUND');
      expect(codes.length).toBe(
        Object.keys(GOOGLE_ADS_CODES).length + Object.keys(NETWORK_CODES).length,
      );
    });
  });
});
