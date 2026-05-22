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

export interface TreeNodeInfo extends CustomerInfo {
  level: number;
  isManager: boolean;
  parentId?: string;
}

/**
 * Strips the 'customers/' prefix from a Google Ads resource name.
 * E.g. 'customers/1234567890' → '1234567890'. If no prefix is
 * present, returns the input unchanged.
 */
export function stripCustomersPrefix(resourceName: string): string {
  const match = resourceName.match(/^customers\/(\d+)/);
  return match ? match[1] : resourceName;
}

/**
 * Builds the GAQL query that lists all sub-accounts (clients) of a
 * Manager Account (MCC). The query must be issued with
 * login_customer_id = customer_id = MCC id.
 */
export function buildCustomerClientGaql(): string {
  return `
    SELECT
      customer_client.id,
      customer_client.descriptive_name,
      customer_client.level,
      customer_client.manager,
      customer_client.currency_code,
      customer_client.status,
      customer_client.client_customer
    FROM customer_client
  `.trim();
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

interface RawCustomerClient {
  customer_client?: {
    id?: string | number;
    descriptive_name?: string;
    level?: string | number;
    manager?: boolean;
    currency_code?: string;
    status?: string;
    client_customer?: string;
  };
}

function parseCustomerClientRow(row: RawCustomerClient, parentId: string): TreeNodeInfo | null {
  const cc = row?.customer_client;
  if (!cc) return null;

  // Prefer `id` if present; otherwise extract from client_customer resource name.
  const customerId = cc.id
    ? String(cc.id)
    : cc.client_customer
      ? stripCustomersPrefix(cc.client_customer)
      : '';
  if (!customerId) return null;

  const node: TreeNodeInfo = {
    customerId,
    level: typeof cc.level === 'number' ? cc.level : Number(cc.level ?? 0),
    isManager: Boolean(cc.manager),
  };

  if (cc.descriptive_name) node.name = String(cc.descriptive_name);
  if (cc.currency_code) node.currencyCode = String(cc.currency_code);
  if (cc.status) node.status = String(cc.status);
  if (customerId !== parentId) node.parentId = parentId;

  return node;
}

/**
 * Lists the full MCC tree (manager + all children) for the given
 * MCC customer-id. Issues GAQL against `customer_client` with
 * login_customer_id = mccId (the MCC is the login context).
 *
 * Returns a flat array including the MCC itself (level=0) followed
 * by descendants in the order Google returns them (typically a
 * breadth-first traversal).
 *
 * If `mccId` is NOT actually a manager account, Google rejects the
 * query with `CUSTOMER_NOT_ENABLED` or `NOT_FOUND` — caller should
 * catch and fall back to a single-leaf node.
 */
export async function listMccTree(
  client: GoogleAdsApi,
  refreshToken: string,
  mccId: string,
): Promise<TreeNodeInfo[]> {
  const customer = getCustomer(client, {
    customerId: mccId,
    refreshToken,
    loginCustomerId: mccId,
  });
  const rows = (await customer.query(buildCustomerClientGaql())) as RawCustomerClient[];
  const arr = Array.isArray(rows) ? rows : [];

  const nodes: TreeNodeInfo[] = [];
  for (const row of arr) {
    const node = parseCustomerClientRow(row, mccId);
    if (node) nodes.push(node);
  }
  // Sort: level ASC, then by name for stable output
  nodes.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return (a.name ?? '').localeCompare(b.name ?? '');
  });
  return nodes;
}
