/**
 * Adapter port for the google-ads-api npm package.
 *
 * BOUNDARY RULE: This file is the ONLY place in the codebase that
 * imports from 'google-ads-api'. All other modules must consume
 * functions exported from this directory (src/google-ads-api/).
 *
 * If the upstream SDK ever changes or is replaced, only this file
 * (and adapter.ts / accounts.ts) needs to be updated.
 */

import { GoogleAdsApi } from 'google-ads-api';
import type { GoogleAdsClientConfig, CustomerConfig, AccessibleCustomersResult } from './types.js';
import { logger } from '../cli/logger.js';

let clientInstance: GoogleAdsApi | null = null;
let clientConfigSignature: string | null = null;

function configSignature(config: GoogleAdsClientConfig): string {
  // We don't want the developer token in logs, but we do want a
  // deterministic key so the singleton resets if credentials change.
  return `${config.clientId}|${config.developerToken.slice(0, 8)}`;
}

export function createClient(config: GoogleAdsClientConfig): GoogleAdsApi {
  const signature = configSignature(config);
  if (clientInstance && clientConfigSignature === signature) {
    return clientInstance;
  }

  clientInstance = new GoogleAdsApi({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    developer_token: config.developerToken,
  });
  clientConfigSignature = signature;
  logger.debug({ clientId: config.clientId }, 'Created GoogleAdsApi client');
  return clientInstance;
}

export function getCustomer(
  client: GoogleAdsApi,
  config: CustomerConfig,
): ReturnType<GoogleAdsApi['Customer']> {
  return client.Customer({
    customer_id: stripDashes(config.customerId),
    refresh_token: config.refreshToken,
    ...(config.loginCustomerId
      ? { login_customer_id: stripDashes(config.loginCustomerId) }
      : {}),
  });
}

/**
 * Returns the list of customer IDs accessible to the authenticated
 * user. Used by `auth status` to validate that the refresh token is
 * still valid against the Google Ads API.
 */
export async function listAccessibleCustomers(
  client: GoogleAdsApi,
  refreshToken: string,
): Promise<AccessibleCustomersResult> {
  const result = await client.listAccessibleCustomers(refreshToken);
  const customerIds = (result.resource_names ?? []).map((r) =>
    r.replace(/^customers\//, ''),
  );
  return { customerIds, count: customerIds.length };
}

function stripDashes(id: string): string {
  return id.replace(/-/g, '');
}

/** Test-only helper to reset the singleton between tests. */
export function __resetClientForTests(): void {
  clientInstance = null;
  clientConfigSignature = null;
}
