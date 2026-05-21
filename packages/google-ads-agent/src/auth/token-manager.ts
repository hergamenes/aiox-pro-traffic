import { getAllCredentials, type Credentials } from './keychain.js';
import { createClient, listAccessibleCustomers } from '../google-ads-api/client.js';
import { AppError } from '../errors/types.js';
import { logger } from '../cli/logger.js';

export interface AuthValidation {
  valid: boolean;
  accessibleCustomers: string[];
  reason?: string;
}

/**
 * Returns the full Credentials object from Keychain, throwing an
 * AppError('AUTH_MISSING') if any required key is absent.
 */
export async function ensureValidAuth(): Promise<Credentials> {
  const creds = await getAllCredentials();
  if (!creds) {
    throw new AppError(
      'AUTH_MISSING',
      'Credenciais Google Ads não configuradas.',
      'Execute: google-ads auth setup',
    );
  }
  return creds;
}

/**
 * Verifies the stored refresh token is still valid by attempting to
 * list accessible customers. Returns { valid, accessibleCustomers,
 * reason? }. Does NOT throw on auth failure — callers can branch on
 * the returned `valid` flag.
 */
export async function verifyToken(): Promise<AuthValidation> {
  const creds = await getAllCredentials();
  if (!creds) {
    return {
      valid: false,
      accessibleCustomers: [],
      reason: 'Credenciais não encontradas no Keychain.',
    };
  }

  try {
    const client = createClient({
      clientId: creds.clientId,
      clientSecret: creds.clientSecret,
      developerToken: creds.developerToken,
    });
    const result = await listAccessibleCustomers(client, creds.refreshToken);
    return { valid: true, accessibleCustomers: result.customerIds };
  } catch (err) {
    logger.debug({ err }, 'verifyToken failed');
    const message = err instanceof Error ? err.message : 'erro desconhecido';
    return {
      valid: false,
      accessibleCustomers: [],
      reason: message,
    };
  }
}
