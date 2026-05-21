/**
 * Account-related adapter functions.
 *
 * BOUNDARY RULE: Files in this directory are the only ones that
 * import from 'google-ads-api'. Consumers must talk to functions
 * exported here.
 */

import type { GoogleAdsApi } from 'google-ads-api';
import { listAccessibleCustomers, getCustomer } from './client.js';
import { logger } from '../cli/logger.js';

export interface CustomerInfo {
  customerId: string;
  name?: string;
  currencyCode?: string;
  status?: string;
}

/**
 * Lists accessible customers and, on a best-effort basis, enriches
 * each with name + currency_code + status via a GAQL query.
 *
 * If enrichment fails for a given customer (commonly PERMISSION_DENIED
 * for accounts the operator can access via OAuth but not via the
 * developer token), the customer is still returned with only the ID.
 */
export async function listAccessibleCustomersDetailed(
  client: GoogleAdsApi,
  refreshToken: string,
  loginCustomerId?: string,
): Promise<CustomerInfo[]> {
  const { customerIds } = await listAccessibleCustomers(client, refreshToken);

  const enrichments = await Promise.allSettled(
    customerIds.map(async (customerId) => {
      try {
        const customer = getCustomer(client, {
          customerId,
          refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
        });
        const rows = await customer.query(`
          SELECT
            customer.id,
            customer.descriptive_name,
            customer.currency_code,
            customer.status
          FROM customer
          LIMIT 1
        `);
        const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        if (!first?.customer) return { customerId };
        return {
          customerId,
          ...(first.customer.descriptive_name
            ? { name: String(first.customer.descriptive_name) }
            : {}),
          ...(first.customer.currency_code
            ? { currencyCode: String(first.customer.currency_code) }
            : {}),
          ...(first.customer.status ? { status: String(first.customer.status) } : {}),
        };
      } catch (err) {
        logger.debug({ customerId, err }, 'Enrichment failed for customer; returning ID only');
        return { customerId };
      }
    }),
  );

  return enrichments.map((settled, idx) =>
    settled.status === 'fulfilled' ? settled.value : { customerId: customerIds[idx] },
  );
}
