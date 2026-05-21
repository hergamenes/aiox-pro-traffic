import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  buildAuthUrl,
  generateState,
  getOAuthPort,
  getRedirectUri,
  SCOPE,
  GOOGLE_AUTH_URL,
} from './oauth-flow.js';

describe('oauth-flow', () => {
  describe('generateState', () => {
    it('returns a 64-char hex string (32 bytes)', () => {
      const s = generateState();
      expect(s).toMatch(/^[0-9a-f]{64}$/);
    });

    it('generates distinct values across calls', () => {
      const a = generateState();
      const b = generateState();
      expect(a).not.toBe(b);
    });
  });

  describe('getOAuthPort', () => {
    const originalEnv = process.env['GOOGLE_ADS_OAUTH_PORT'];

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env['GOOGLE_ADS_OAUTH_PORT'];
      } else {
        process.env['GOOGLE_ADS_OAUTH_PORT'] = originalEnv;
      }
    });

    it('returns default 8765 when env not set', () => {
      delete process.env['GOOGLE_ADS_OAUTH_PORT'];
      expect(getOAuthPort()).toBe(8765);
    });

    it('returns parsed port when env set to valid integer', () => {
      process.env['GOOGLE_ADS_OAUTH_PORT'] = '9000';
      expect(getOAuthPort()).toBe(9000);
    });

    it('falls back to default for invalid env values', () => {
      process.env['GOOGLE_ADS_OAUTH_PORT'] = 'not-a-number';
      expect(getOAuthPort()).toBe(8765);
    });

    it('falls back to default for out-of-range values', () => {
      process.env['GOOGLE_ADS_OAUTH_PORT'] = '99999';
      expect(getOAuthPort()).toBe(8765);
    });
  });

  describe('getRedirectUri', () => {
    it('builds redirect URI for given port', () => {
      expect(getRedirectUri(8765)).toBe('http://localhost:8765/oauth/callback');
      expect(getRedirectUri(9000)).toBe('http://localhost:9000/oauth/callback');
    });
  });

  describe('buildAuthUrl', () => {
    let url: URL;

    beforeEach(() => {
      const raw = buildAuthUrl({
        clientId: 'my-client-id',
        redirectUri: 'http://localhost:8765/oauth/callback',
        state: 'abc123',
      });
      url = new URL(raw);
    });

    it('points to Google OAuth endpoint', () => {
      expect(`${url.origin}${url.pathname}`).toBe(GOOGLE_AUTH_URL);
    });

    it('includes client_id', () => {
      expect(url.searchParams.get('client_id')).toBe('my-client-id');
    });

    it('includes redirect_uri', () => {
      expect(url.searchParams.get('redirect_uri')).toBe(
        'http://localhost:8765/oauth/callback',
      );
    });

    it('requests offline access for refresh token', () => {
      expect(url.searchParams.get('access_type')).toBe('offline');
    });

    it('forces consent to ensure refresh_token issuance', () => {
      expect(url.searchParams.get('prompt')).toBe('consent');
    });

    it('uses the Google Ads scope', () => {
      expect(url.searchParams.get('scope')).toBe(SCOPE);
      expect(SCOPE).toBe('https://www.googleapis.com/auth/adwords');
    });

    it('passes CSRF state through', () => {
      expect(url.searchParams.get('state')).toBe('abc123');
    });

    it('requests authorization_code via response_type=code', () => {
      expect(url.searchParams.get('response_type')).toBe('code');
    });
  });
});
