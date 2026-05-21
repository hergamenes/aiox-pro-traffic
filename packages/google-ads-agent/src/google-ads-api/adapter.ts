/**
 * High-level adapter that resolves InsightsParams into a ParsedMetrics[]
 * by orchestrating the SDK Customer.query() call + parser.
 *
 * BOUNDARY RULE: this file is allowed to import google-ads-api (it lives
 * in src/google-ads-api/). All other code should call getInsights() from
 * here rather than touching the SDK.
 */

import { createClient, getCustomer } from './client.js';
import { buildGaql } from './gaql-builder.js';
import { parseRows } from '../reporting/insights-parser.js';
import { ensureValidAuth } from '../auth/token-manager.js';
import { getDefaults } from '../config/config-repository.js';
import { AppError } from '../errors/types.js';
import type { InsightsParams, ParsedMetrics, DateRange } from '../types/insights.js';

const PERIOD_DAYS: Record<Exclude<InsightsParams['period'], 'custom'>, number> = {
  '7d': 7,
  '14d': 14,
  '30d': 30,
};

function computeDateRange(params: InsightsParams): DateRange {
  if (params.period === 'custom' && params.from && params.to) {
    return { from: params.from, to: params.to };
  }
  const days = PERIOD_DAYS[params.period as keyof typeof PERIOD_DAYS] ?? 7;
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - (days - 1));
  return {
    from: from.toISOString().slice(0, 10),
    to: today.toISOString().slice(0, 10),
  };
}

export async function getInsights(params: InsightsParams): Promise<ParsedMetrics[]> {
  const creds = await ensureValidAuth();
  const defaults = await getDefaults();

  const customerId = params.customerId || defaults.customerId;
  if (!customerId) {
    throw new AppError(
      'VALIDATION',
      'Customer ID não informado e nenhuma conta padrão configurada.',
      "Passe como argumento OU execute 'google-ads config set-default'.",
    );
  }

  const loginCustomerId =
    params.loginCustomerId ?? defaults.loginCustomerId ?? creds.loginCustomerId;

  const client = createClient({
    clientId: creds.clientId,
    clientSecret: creds.clientSecret,
    developerToken: creds.developerToken,
  });

  const customer = getCustomer(client, {
    customerId,
    refreshToken: creds.refreshToken,
    ...(loginCustomerId ? { loginCustomerId } : {}),
  });

  const { query } = buildGaql({ ...params, customerId });

  let currencyCode: string | undefined;
  try {
    const meta = await customer.query(
      'SELECT customer.currency_code FROM customer LIMIT 1',
    );
    const first = Array.isArray(meta) && meta.length > 0 ? meta[0] : null;
    if (first?.customer?.currency_code) {
      currencyCode = String(first.customer.currency_code);
    }
  } catch {
    // currency lookup is best-effort
  }

  const rows = await customer.query(query);
  const arr = Array.isArray(rows) ? rows : [];

  return parseRows(arr, {
    level: params.level,
    dateRange: computeDateRange(params),
    ...(currencyCode ? { currencyCode } : {}),
  });
}
