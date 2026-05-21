import keytar from 'keytar';
import { logger } from '../cli/logger.js';

const SERVICE_NAME = 'google-ads-agent';

const ACCOUNTS = {
  DEVELOPER_TOKEN: 'developer-token',
  CLIENT_ID: 'client-id',
  CLIENT_SECRET: 'client-secret',
  REFRESH_TOKEN: 'refresh-token',
  CUSTOMER_ID: 'customer-id',
  LOGIN_CUSTOMER_ID: 'login-customer-id',
} as const;

export interface Credentials {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId?: string;
  loginCustomerId?: string;
}

export async function storeDeveloperToken(value: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.DEVELOPER_TOKEN, value);
  logger.debug('Developer token stored in Keychain');
}

export async function storeClientId(value: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.CLIENT_ID, value);
  logger.debug('Client ID stored in Keychain');
}

export async function storeClientSecret(value: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.CLIENT_SECRET, value);
  logger.debug('Client secret stored in Keychain');
}

export async function storeRefreshToken(value: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.REFRESH_TOKEN, value);
  logger.debug('Refresh token stored in Keychain');
}

export async function storeCustomerId(value: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.CUSTOMER_ID, value);
  logger.debug('Customer ID stored in Keychain');
}

export async function storeLoginCustomerId(value: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.LOGIN_CUSTOMER_ID, value);
  logger.debug('Login customer ID stored in Keychain');
}

export async function getDeveloperToken(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.DEVELOPER_TOKEN);
}

export async function getClientId(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.CLIENT_ID);
}

export async function getClientSecret(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.CLIENT_SECRET);
}

export async function getRefreshToken(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.REFRESH_TOKEN);
}

export async function getCustomerId(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.CUSTOMER_ID);
}

export async function getLoginCustomerId(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.LOGIN_CUSTOMER_ID);
}

/**
 * Retrieves all credentials from Keychain. Returns null if any of the
 * four required keys (developer-token, client-id, client-secret,
 * refresh-token) is missing. customer-id and login-customer-id are
 * optional and may be undefined.
 */
export async function getAllCredentials(): Promise<Credentials | null> {
  const [developerToken, clientId, clientSecret, refreshToken, customerId, loginCustomerId] =
    await Promise.all([
      getDeveloperToken(),
      getClientId(),
      getClientSecret(),
      getRefreshToken(),
      getCustomerId(),
      getLoginCustomerId(),
    ]);

  if (!developerToken || !clientId || !clientSecret || !refreshToken) {
    return null;
  }

  return {
    developerToken,
    clientId,
    clientSecret,
    refreshToken,
    ...(customerId ? { customerId } : {}),
    ...(loginCustomerId ? { loginCustomerId } : {}),
  };
}

export async function clearAll(): Promise<void> {
  await Promise.all([
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.DEVELOPER_TOKEN),
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.CLIENT_ID),
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.CLIENT_SECRET),
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.REFRESH_TOKEN),
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.CUSTOMER_ID),
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.LOGIN_CUSTOMER_ID),
  ]);
  logger.debug('All credentials cleared from Keychain');
}

export { ACCOUNTS, SERVICE_NAME };
