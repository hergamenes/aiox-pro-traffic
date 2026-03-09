import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthError } from '../../../src/errors/types.js';

vi.mock('../../../src/auth/keychain.js', () => ({
  getToken: vi.fn(),
  getTokenExpiry: vi.fn(),
  storeToken: vi.fn(),
  storeTokenExpiry: vi.fn(),
  storeAppId: vi.fn(),
  getAppId: vi.fn(),
  getAppSecret: vi.fn(),
  storeAppSecret: vi.fn(),
  clearAll: vi.fn(),
}));

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import * as keychain from '../../../src/auth/keychain.js';
import { getAccessToken, getAuthStatus, isTokenExpiringSoon, saveToken } from '../../../src/auth/token-manager.js';

describe('token-manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('should return valid token when not expired', async () => {
      vi.mocked(keychain.getToken).mockResolvedValue('valid-token');
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      vi.mocked(keychain.getTokenExpiry).mockResolvedValue(futureDate);

      const token = await getAccessToken();
      expect(token).toBe('valid-token');
    });

    it('should throw AuthError when no token found', async () => {
      vi.mocked(keychain.getToken).mockResolvedValue(null);

      await expect(getAccessToken()).rejects.toThrow(AuthError);
    });

    it('should throw AuthError when token expired', async () => {
      vi.mocked(keychain.getToken).mockResolvedValue('expired-token');
      const pastDate = new Date(Date.now() - 1000);
      vi.mocked(keychain.getTokenExpiry).mockResolvedValue(pastDate);

      await expect(getAccessToken()).rejects.toThrow(AuthError);
    });
  });

  describe('getAuthStatus', () => {
    it('should return not configured when no token', async () => {
      vi.mocked(keychain.getToken).mockResolvedValue(null);

      const status = await getAuthStatus();
      expect(status.authenticated).toBe(false);
      expect(status.tokenPreview).toBeNull();
    });

    it('should return authenticated with days remaining', async () => {
      vi.mocked(keychain.getToken).mockResolvedValue('abcdefgh-token');
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      vi.mocked(keychain.getTokenExpiry).mockResolvedValue(futureDate);

      const status = await getAuthStatus();
      expect(status.authenticated).toBe(true);
      expect(status.daysRemaining).toBe(30);
      expect(status.tokenPreview).toBe('abcdefgh...');
    });

    it('should return expired when token past expiry', async () => {
      vi.mocked(keychain.getToken).mockResolvedValue('abcdefgh-old');
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      vi.mocked(keychain.getTokenExpiry).mockResolvedValue(pastDate);

      const status = await getAuthStatus();
      expect(status.authenticated).toBe(false);
      expect(status.daysRemaining).toBe(0);
    });
  });

  describe('isTokenExpiringSoon', () => {
    it('should detect token expiring within 7 days', async () => {
      vi.mocked(keychain.getToken).mockResolvedValue('token');
      const soonDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      vi.mocked(keychain.getTokenExpiry).mockResolvedValue(soonDate);

      const expiring = await isTokenExpiringSoon(7);
      expect(expiring).toBe(true);
    });

    it('should return false when token has many days left', async () => {
      vi.mocked(keychain.getToken).mockResolvedValue('token');
      const farDate = new Date(Date.now() + 50 * 24 * 60 * 60 * 1000);
      vi.mocked(keychain.getTokenExpiry).mockResolvedValue(farDate);

      const expiring = await isTokenExpiringSoon(7);
      expect(expiring).toBe(false);
    });
  });

  describe('saveToken', () => {
    it('should store token, expiry, and appId', async () => {
      const tokenInfo = {
        accessToken: 'new-token',
        expiresAt: new Date('2026-05-01'),
        appId: '12345',
      };

      await saveToken(tokenInfo);

      expect(keychain.storeToken).toHaveBeenCalledWith('new-token');
      expect(keychain.storeTokenExpiry).toHaveBeenCalledWith(tokenInfo.expiresAt);
      expect(keychain.storeAppId).toHaveBeenCalledWith('12345');
    });
  });
});
