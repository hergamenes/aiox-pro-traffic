import { logger } from '../cli/logger.js';
import { AuthError } from '../errors/types.js';
import * as keychain from './keychain.js';
import type { AuthStatus, TokenInfo } from '../types/auth.js';

export async function saveToken(tokenInfo: TokenInfo): Promise<void> {
  await keychain.storeToken(tokenInfo.accessToken);
  await keychain.storeTokenExpiry(tokenInfo.expiresAt);
  await keychain.storeAppId(tokenInfo.appId);
  logger.debug('Token saved successfully');
}

export async function getAccessToken(): Promise<string> {
  const token = await keychain.getToken();
  if (!token) {
    throw new AuthError(
      'Nenhum token encontrado.',
      'Execute: meta-ads auth setup',
    );
  }

  const expiry = await keychain.getTokenExpiry();
  if (expiry && expiry.getTime() < Date.now()) {
    throw new AuthError(
      'Token de acesso expirado.',
      'Execute: meta-ads auth setup',
    );
  }

  const daysRemaining = expiry
    ? Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  if (daysRemaining !== null && daysRemaining <= 7) {
    logger.warn(
      `⚠ Token expira em ${daysRemaining} dia(s). Execute: meta-ads auth setup para renovar`,
    );
  }

  return token;
}

export async function getAuthStatus(): Promise<AuthStatus> {
  const token = await keychain.getToken();

  if (!token) {
    return {
      authenticated: false,
      expiresAt: null,
      daysRemaining: null,
      tokenPreview: null,
    };
  }

  const expiresAt = await keychain.getTokenExpiry();
  const now = Date.now();

  if (expiresAt && expiresAt.getTime() < now) {
    return {
      authenticated: false,
      expiresAt,
      daysRemaining: 0,
      tokenPreview: `${token.substring(0, 8)}...`,
    };
  }

  const daysRemaining = expiresAt
    ? Math.ceil((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24))
    : null;

  return {
    authenticated: true,
    expiresAt,
    daysRemaining,
    tokenPreview: `${token.substring(0, 8)}...`,
  };
}

export async function isTokenExpiringSoon(days: number = 7): Promise<boolean> {
  const status = await getAuthStatus();
  if (!status.authenticated || status.daysRemaining === null) return true;
  return status.daysRemaining <= days;
}
