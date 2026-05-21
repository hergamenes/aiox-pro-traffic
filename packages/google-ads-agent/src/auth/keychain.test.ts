import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock keytar BEFORE importing the module under test
vi.mock('keytar', () => {
  const store = new Map<string, string>();
  return {
    default: {
      setPassword: vi.fn(async (service: string, account: string, value: string) => {
        store.set(`${service}::${account}`, value);
      }),
      getPassword: vi.fn(async (service: string, account: string) => {
        return store.get(`${service}::${account}`) ?? null;
      }),
      deletePassword: vi.fn(async (service: string, account: string) => {
        return store.delete(`${service}::${account}`);
      }),
      __store: store,
    },
  };
});

import keytar from 'keytar';
import {
  storeDeveloperToken,
  storeClientId,
  storeClientSecret,
  storeRefreshToken,
  storeCustomerId,
  storeLoginCustomerId,
  getDeveloperToken,
  getClientId,
  getClientSecret,
  getRefreshToken,
  getCustomerId,
  getLoginCustomerId,
  getAllCredentials,
  clearAll,
  SERVICE_NAME,
} from './keychain.js';

interface KeytarWithStore {
  __store: Map<string, string>;
}

function getStore(): Map<string, string> {
  return (keytar as unknown as KeytarWithStore).__store;
}

describe('keychain', () => {
  beforeEach(() => {
    getStore().clear();
  });

  describe('individual setters/getters', () => {
    it('stores and retrieves developer token', async () => {
      await storeDeveloperToken('dev-token-abc');
      expect(await getDeveloperToken()).toBe('dev-token-abc');
    });

    it('stores and retrieves client id', async () => {
      await storeClientId('client-id-xyz');
      expect(await getClientId()).toBe('client-id-xyz');
    });

    it('stores and retrieves client secret', async () => {
      await storeClientSecret('secret-123');
      expect(await getClientSecret()).toBe('secret-123');
    });

    it('stores and retrieves refresh token', async () => {
      await storeRefreshToken('refresh-456');
      expect(await getRefreshToken()).toBe('refresh-456');
    });

    it('stores and retrieves customer id', async () => {
      await storeCustomerId('1234567890');
      expect(await getCustomerId()).toBe('1234567890');
    });

    it('stores and retrieves login customer id (MCC)', async () => {
      await storeLoginCustomerId('9999999999');
      expect(await getLoginCustomerId()).toBe('9999999999');
    });

    it('returns null when key not set', async () => {
      expect(await getDeveloperToken()).toBeNull();
    });
  });

  describe('uses correct service name', () => {
    it('writes under service google-ads-agent', async () => {
      await storeDeveloperToken('test');
      expect(SERVICE_NAME).toBe('google-ads-agent');
      expect(getStore().has('google-ads-agent::developer-token')).toBe(true);
    });
  });

  describe('getAllCredentials', () => {
    it('returns null when any required key missing', async () => {
      await storeDeveloperToken('dev');
      await storeClientId('cid');
      // missing client-secret and refresh-token
      expect(await getAllCredentials()).toBeNull();
    });

    it('returns credentials when 4 required keys present', async () => {
      await storeDeveloperToken('dev');
      await storeClientId('cid');
      await storeClientSecret('secret');
      await storeRefreshToken('refresh');
      const creds = await getAllCredentials();
      expect(creds).toEqual({
        developerToken: 'dev',
        clientId: 'cid',
        clientSecret: 'secret',
        refreshToken: 'refresh',
      });
    });

    it('includes optional customer-id when set', async () => {
      await storeDeveloperToken('dev');
      await storeClientId('cid');
      await storeClientSecret('secret');
      await storeRefreshToken('refresh');
      await storeCustomerId('1234567890');
      const creds = await getAllCredentials();
      expect(creds?.customerId).toBe('1234567890');
    });

    it('includes login customer id when set', async () => {
      await storeDeveloperToken('dev');
      await storeClientId('cid');
      await storeClientSecret('secret');
      await storeRefreshToken('refresh');
      await storeLoginCustomerId('mcc-999');
      const creds = await getAllCredentials();
      expect(creds?.loginCustomerId).toBe('mcc-999');
    });
  });

  describe('clearAll', () => {
    it('removes all 6 credential keys', async () => {
      await storeDeveloperToken('a');
      await storeClientId('b');
      await storeClientSecret('c');
      await storeRefreshToken('d');
      await storeCustomerId('e');
      await storeLoginCustomerId('f');

      await clearAll();

      expect(await getDeveloperToken()).toBeNull();
      expect(await getClientId()).toBeNull();
      expect(await getClientSecret()).toBeNull();
      expect(await getRefreshToken()).toBeNull();
      expect(await getCustomerId()).toBeNull();
      expect(await getLoginCustomerId()).toBeNull();
    });
  });
});
