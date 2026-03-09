import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetaApiError } from '../../../src/errors/types.js';
import { AuthError } from '../../../src/errors/types.js';

vi.mock('../../../src/auth/token-manager.js', () => ({
  getAccessToken: vi.fn().mockResolvedValue('test-token'),
}));

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('facebook-nodejs-business-sdk', () => ({
  default: {
    FacebookAdsApi: { init: vi.fn() },
  },
  FacebookAdsApi: { init: vi.fn() },
}));

import { getAccessToken } from '../../../src/auth/token-manager.js';
import { listAdAccounts, listPages, getInstagramAccount } from '../../../src/meta-api/adapter.js';

describe('meta-api/adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAccessToken).mockResolvedValue('test-token');
  });

  describe('listAdAccounts', () => {
    it('should return formatted accounts', async () => {
      const mockData = {
        data: [
          {
            account_id: '123456',
            name: 'Minha Conta',
            account_status: 1,
            currency: 'BRL',
            timezone_name: 'America/Sao_Paulo',
          },
          {
            account_id: '789012',
            name: 'Conta Suspensa',
            account_status: 100,
            currency: 'USD',
            timezone_name: 'America/New_York',
          },
        ],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve(mockData),
        }),
      );

      const accounts = await listAdAccounts();
      expect(accounts).toHaveLength(2);
      expect(accounts[0]).toEqual({
        accountId: '123456',
        name: 'Minha Conta',
        status: 1,
        statusLabel: 'Ativa',
        currency: 'BRL',
        timezone: 'America/Sao_Paulo',
      });
      expect(accounts[1]?.statusLabel).toBe('Suspensa');
    });

    it('should throw AuthError when not authenticated', async () => {
      vi.mocked(getAccessToken).mockRejectedValue(
        new AuthError('Nenhum token encontrado.', 'Execute: meta-ads auth setup'),
      );

      await expect(listAdAccounts()).rejects.toThrow(AuthError);
    });

    it('should throw MetaApiError on API error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () =>
            Promise.resolve({
              error: { code: 190, message: 'Invalid token' },
            }),
        }),
      );

      await expect(listAdAccounts()).rejects.toThrow(MetaApiError);
    });
  });

  describe('listPages', () => {
    it('should return formatted pages with Instagram', async () => {
      const mockData = {
        data: [
          {
            id: '111',
            name: 'Minha Página',
            category: 'Business',
            instagram_business_account: { id: '222' },
          },
          {
            id: '333',
            name: 'Outra Página',
            category: 'Personal Blog',
            instagram_business_account: null,
          },
        ],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve(mockData),
        }),
      );

      const pages = await listPages();
      expect(pages).toHaveLength(2);
      expect(pages[0]).toEqual({
        id: '111',
        name: 'Minha Página',
        category: 'Business',
        instagramAccountId: '222',
      });
      expect(pages[1]?.instagramAccountId).toBeNull();
    });
  });

  describe('getInstagramAccount', () => {
    it('should return Instagram account when connected', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () =>
            Promise.resolve({
              instagram_business_account: {
                id: '555',
                name: 'Meu IG',
                username: 'meuig',
              },
            }),
        }),
      );

      const ig = await getInstagramAccount('111');
      expect(ig).toEqual({ id: '555', name: 'Meu IG', username: 'meuig' });
    });

    it('should return null when no Instagram connected', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve({}),
        }),
      );

      const ig = await getInstagramAccount('111');
      expect(ig).toBeNull();
    });
  });
});
