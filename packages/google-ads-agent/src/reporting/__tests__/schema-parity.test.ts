/**
 * CRITICAL TEST — Schema Contract Guardian
 *
 * Per Story 5.3 R1 (drift quebra squad consumers), this test fixes the
 * canonical contract that `google-ads report --format json` emits. Any
 * change to ParsedMetrics MUST go through a deliberate Story update.
 *
 * Why this isn't a full parity test with meta-ads-agent:
 *
 * The meta-ads-agent uses level-nominal keys (campaignName, adsetId, ...)
 * while we use a level-agnostic shape ({ id, name, level, ... }) so the
 * same shape carries 5 levels (account/campaign/ad_group/ad/keyword).
 * Strict structural parity is therefore not viable; squad consumers
 * needing cross-platform comparison must normalize via an adapter.
 *
 * What this test DOES enforce:
 *   1. The canonical 10 required keys are present on every parsed row.
 *   2. The 3 optional keys, if present, come from the declared whitelist.
 *   3. No undeclared key leaks into the output (drift detector).
 */

import { describe, it, expect } from 'vitest';
import { parseRow } from '../insights-parser.js';
import {
  REQUIRED_PARSED_METRICS_KEYS,
  OPTIONAL_PARSED_METRICS_KEYS,
} from '../../types/insights.js';
import { formatJson } from '../report-formatter.js';

const dateRange = { from: '2026-05-01', to: '2026-05-07' };

describe('SCHEMA PARITY — canonical contract', () => {
  it('required keys list is the spec-declared 10 keys', () => {
    expect([...REQUIRED_PARSED_METRICS_KEYS].sort()).toEqual(
      [
        'id',
        'name',
        'level',
        'spend',
        'impressions',
        'clicks',
        'ctr',
        'cpc',
        'conversions',
        'date_range',
      ].sort(),
    );
  });

  it('optional keys list is the spec-declared 3 keys', () => {
    expect([...OPTIONAL_PARSED_METRICS_KEYS].sort()).toEqual(['cpa', 'roas', 'currencyCode'].sort());
  });

  it('parsed output ONLY contains REQUIRED + OPTIONAL keys (no drift)', () => {
    const richRow = {
      campaign: { id: 1, name: 'x' },
      metrics: {
        cost_micros: '1000000',
        impressions: '100',
        clicks: '10',
        ctr: '1.0',
        average_cpc: '100000',
        conversions: '2',
        conversions_value: '20',
      },
    };
    const parsed = parseRow(richRow, { level: 'campaign', dateRange, currencyCode: 'BRL' });
    const allowed = new Set<string>([
      ...REQUIRED_PARSED_METRICS_KEYS,
      ...OPTIONAL_PARSED_METRICS_KEYS,
    ]);
    for (const key of Object.keys(parsed)) {
      expect(allowed.has(key)).toBe(true);
    }
  });

  it('JSON output preserves all REQUIRED keys verbatim', () => {
    const row = {
      campaign: { id: 1, name: 'x' },
      metrics: { cost_micros: '1000000', impressions: '100' },
    };
    const parsed = parseRow(row, { level: 'campaign', dateRange });
    const json = formatJson([parsed]);
    const recovered = JSON.parse(json)[0];
    for (const key of REQUIRED_PARSED_METRICS_KEYS) {
      expect(recovered).toHaveProperty(key);
    }
  });

  it('JSON serialization round-trips the contract', () => {
    const row = {
      campaign: { id: 999, name: 'Round Trip Test' },
      metrics: { cost_micros: '50000000', conversions: '5', conversions_value: '50' },
    };
    const parsed = parseRow(row, { level: 'campaign', dateRange, currencyCode: 'USD' });
    const recovered = JSON.parse(formatJson([parsed]))[0];

    expect(recovered.id).toBe('999');
    expect(recovered.name).toBe('Round Trip Test');
    expect(recovered.spend).toBe(50);
    expect(recovered.cpa).toBe(10);
    expect(recovered.roas).toBe(1);
    expect(recovered.currencyCode).toBe('USD');
    expect(recovered.date_range).toEqual(dateRange);
  });
});
