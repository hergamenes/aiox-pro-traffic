import { describe, it, expect } from 'vitest';
import { buildGaql, isValidIsoDate, ENTITY_BY_LEVEL } from './gaql-builder.js';
import { AppError } from '../errors/types.js';
import type { InsightsParams } from '../types/insights.js';

const baseParams: InsightsParams = {
  customerId: '1234567890',
  period: '7d',
  level: 'campaign',
};

describe('gaql-builder', () => {
  describe('isValidIsoDate', () => {
    it('accepts YYYY-MM-DD', () => {
      expect(isValidIsoDate('2026-05-21')).toBe(true);
    });
    it('rejects DD/MM/YYYY', () => {
      expect(isValidIsoDate('21/05/2026')).toBe(false);
    });
    it('rejects empty', () => {
      expect(isValidIsoDate('')).toBe(false);
    });
  });

  describe('builds query for each level', () => {
    for (const level of ['account', 'campaign', 'ad_group', 'ad', 'keyword'] as const) {
      it(`level=${level} → FROM ${ENTITY_BY_LEVEL[level].resource}`, () => {
        const out = buildGaql({ ...baseParams, level });
        expect(out.query).toContain(`FROM ${ENTITY_BY_LEVEL[level].resource}`);
        expect(out.resource).toBe(ENTITY_BY_LEVEL[level].resource);
      });
    }
  });

  describe('period handling', () => {
    it('7d → DURING LAST_7_DAYS', () => {
      const out = buildGaql({ ...baseParams, period: '7d' });
      expect(out.query).toMatch(/DURING LAST_7_DAYS/);
    });

    it('14d → DURING LAST_14_DAYS', () => {
      const out = buildGaql({ ...baseParams, period: '14d' });
      expect(out.query).toMatch(/DURING LAST_14_DAYS/);
    });

    it('30d → DURING LAST_30_DAYS', () => {
      const out = buildGaql({ ...baseParams, period: '30d' });
      expect(out.query).toMatch(/DURING LAST_30_DAYS/);
    });

    it('custom with from/to → BETWEEN', () => {
      const out = buildGaql({
        ...baseParams,
        period: 'custom',
        from: '2026-05-01',
        to: '2026-05-07',
      });
      expect(out.query).toMatch(/BETWEEN '2026-05-01' AND '2026-05-07'/);
    });

    it('throws on custom without dates', () => {
      expect(() =>
        buildGaql({ ...baseParams, period: 'custom' }),
      ).toThrow(AppError);
    });
  });

  describe('filters', () => {
    it('appends campaign-id filter when provided', () => {
      const out = buildGaql({
        ...baseParams,
        level: 'ad_group',
        filter: { campaignId: '99' },
      });
      expect(out.query).toContain('campaign.id = 99');
    });

    it('does NOT append campaign-id filter at account level', () => {
      const out = buildGaql({
        ...baseParams,
        level: 'account',
        filter: { campaignId: '99' },
      });
      expect(out.query).not.toContain('campaign.id = 99');
    });

    it('adds keyword type filter at keyword level', () => {
      const out = buildGaql({ ...baseParams, level: 'keyword' });
      expect(out.query).toContain("ad_group_criterion.type = 'KEYWORD'");
    });
  });

  describe('always selects required metrics', () => {
    it('includes cost_micros, impressions, clicks, ctr, average_cpc, conversions, conversions_value', () => {
      const out = buildGaql(baseParams);
      const expected = [
        'metrics.cost_micros',
        'metrics.impressions',
        'metrics.clicks',
        'metrics.ctr',
        'metrics.average_cpc',
        'metrics.conversions',
        'metrics.conversions_value',
      ];
      for (const metric of expected) {
        expect(out.query).toContain(metric);
      }
    });

    it('always includes segments.date', () => {
      const out = buildGaql(baseParams);
      expect(out.query).toContain('segments.date');
    });
  });
});
