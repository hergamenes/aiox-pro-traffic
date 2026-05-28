import { describe, it, expect } from 'vitest';
import { buildGaql } from './gaql-builder.js';
import { parseRows } from '../reporting/insights-parser.js';
import type { InsightsParams } from '../types/insights.js';

/**
 * Integration test for the keyword-level report path.
 *
 * Guards the bug fixed in commit b5ca0d7: the keyword level queried
 * `FROM ad_group_criterion` (which rejects metrics with
 * PROHIBITED_METRIC_IN_SELECT_OR_WHERE_CLAUSE) instead of `keyword_view`.
 *
 * This test exercises the real contract between the two modules the adapter
 * chains together — buildGaql() produces the query, and parseRows() consumes
 * a keyword_view API response — without mocking the SDK/auth layer.
 *
 * The mock rows mirror the real shape keyword_view returns (ad_group_criterion
 * nested alongside metrics) using values from the Grupo Prestarh account.
 */
describe('keyword-level report (integration: builder ↔ parser)', () => {
  const baseParams: InsightsParams = {
    customerId: '9631900143',
    period: '7d',
    level: 'keyword',
  };
  const dateRange = { from: '2026-05-22', to: '2026-05-28' };

  // Shape returned by `SELECT ... FROM keyword_view`: each row carries the
  // ad_group_criterion fields AND the metrics that ad_group_criterion alone
  // could not provide.
  const keywordViewResponse = [
    {
      ad_group_criterion: {
        criterion_id: '101',
        keyword: { text: 'consultoria de rh para empresas' },
      },
      metrics: {
        cost_micros: '71040000', // R$ 71.04
        impressions: '276',
        clicks: '14',
        conversions: '6',
      },
    },
    {
      ad_group_criterion: {
        criterion_id: '102',
        keyword: { text: 'Grupo Prestarh' },
      },
      metrics: {
        cost_micros: '58120000', // R$ 58.12
        impressions: '150',
        clicks: '28',
        conversions: '8',
      },
    },
  ];

  it('builds a query that targets keyword_view (not ad_group_criterion)', () => {
    const { query } = buildGaql(baseParams);
    expect(query).toContain('FROM keyword_view');
    expect(query).not.toContain('FROM ad_group_criterion');
  });

  it('parses a keyword_view response into per-keyword metrics', () => {
    const parsed = parseRows(keywordViewResponse, { level: 'keyword', dateRange, currencyCode: 'BRL' });

    expect(parsed).toHaveLength(2);

    const generic = parsed[0];
    expect(generic.name).toBe('consultoria de rh para empresas');
    expect(generic.level).toBe('keyword');
    expect(generic.spend).toBeCloseTo(71.04, 2);
    expect(generic.clicks).toBe(14);
    expect(generic.conversions).toBe(6);
    expect(generic.cpa).toBeCloseTo(11.84, 2); // 71.04 / 6

    const branded = parsed[1];
    expect(branded.name).toBe('Grupo Prestarh');
    expect(branded.spend).toBeCloseTo(58.12, 2);
    expect(branded.cpa).toBeCloseTo(7.265, 2); // 58.12 / 8
  });

  it('keeps keyword totals consistent (sum matches account aggregate)', () => {
    const parsed = parseRows(keywordViewResponse, { level: 'keyword', dateRange, currencyCode: 'BRL' });
    const totalSpend = parsed.reduce((s, r) => s + r.spend, 0);
    const totalConv = parsed.reduce((s, r) => s + r.conversions, 0);
    expect(totalSpend).toBeCloseTo(129.16, 2); // 71.04 + 58.12
    expect(totalConv).toBe(14);
  });
});
