import keytar from 'keytar';
import { logger } from '../cli/logger.js';

const SERVICE_NAME = 'meta-ads-agent';

const ACCOUNTS = {
  ACCESS_TOKEN: 'access-token',
  APP_SECRET: 'app-secret',
  TOKEN_EXPIRY: 'token-expiry',
  APP_ID: 'app-id',
} as const;

export async function storeToken(token: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.ACCESS_TOKEN, token);
  logger.debug('Token stored in Keychain');
}

export async function storeAppSecret(secret: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.APP_SECRET, secret);
  logger.debug('App secret stored in Keychain');
}

export async function storeAppId(appId: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.APP_ID, appId);
  logger.debug('App ID stored in Keychain');
}

export async function storeTokenExpiry(expiresAt: Date): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNTS.TOKEN_EXPIRY, expiresAt.toISOString());
  logger.debug('Token expiry stored in Keychain');
}

export async function getToken(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.ACCESS_TOKEN);
}

export async function getAppSecret(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.APP_SECRET);
}

export async function getAppId(): Promise<string | null> {
  return keytar.getPassword(SERVICE_NAME, ACCOUNTS.APP_ID);
}

export async function getTokenExpiry(): Promise<Date | null> {
  const raw = await keytar.getPassword(SERVICE_NAME, ACCOUNTS.TOKEN_EXPIRY);
  if (!raw) return null;
  const date = new Date(raw);
  return isNaN(date.getTime()) ? null : date;
}

export async function clearAll(): Promise<void> {
  await Promise.all([
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.ACCESS_TOKEN),
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.APP_SECRET),
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.TOKEN_EXPIRY),
    keytar.deletePassword(SERVICE_NAME, ACCOUNTS.APP_ID),
  ]);
  logger.debug('All credentials cleared from Keychain');
}
