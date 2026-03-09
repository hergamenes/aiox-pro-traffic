import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('keytar', () => ({
  default: {
    setPassword: vi.fn().mockResolvedValue(undefined),
    getPassword: vi.fn().mockResolvedValue(null),
    deletePassword: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import keytar from 'keytar';
import {
  storeToken,
  getToken,
  storeAppSecret,
  getAppSecret,
  storeTokenExpiry,
  getTokenExpiry,
  clearAll,
} from '../../../src/auth/keychain.js';

describe('keychain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should store and retrieve token', async () => {
    await storeToken('test-token-123');
    expect(keytar.setPassword).toHaveBeenCalledWith(
      'meta-ads-agent',
      'access-token',
      'test-token-123',
    );

    vi.mocked(keytar.getPassword).mockResolvedValueOnce('test-token-123');
    const token = await getToken();
    expect(token).toBe('test-token-123');
  });

  it('should store and retrieve app secret', async () => {
    await storeAppSecret('secret-abc');
    expect(keytar.setPassword).toHaveBeenCalledWith(
      'meta-ads-agent',
      'app-secret',
      'secret-abc',
    );

    vi.mocked(keytar.getPassword).mockResolvedValueOnce('secret-abc');
    const secret = await getAppSecret();
    expect(secret).toBe('secret-abc');
  });

  it('should store and retrieve token expiry as Date', async () => {
    const date = new Date('2026-05-01T00:00:00.000Z');
    await storeTokenExpiry(date);
    expect(keytar.setPassword).toHaveBeenCalledWith(
      'meta-ads-agent',
      'token-expiry',
      date.toISOString(),
    );

    vi.mocked(keytar.getPassword).mockResolvedValueOnce(date.toISOString());
    const expiry = await getTokenExpiry();
    expect(expiry).toEqual(date);
  });

  it('should return null for missing token expiry', async () => {
    vi.mocked(keytar.getPassword).mockResolvedValueOnce(null);
    const expiry = await getTokenExpiry();
    expect(expiry).toBeNull();
  });

  it('should clear all credentials', async () => {
    await clearAll();
    expect(keytar.deletePassword).toHaveBeenCalledTimes(4);
  });
});
