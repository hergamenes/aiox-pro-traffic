import { describe, it, expect } from 'vitest';
import { parseRow } from './insights-parser.js';
import {
  REQUIRED_PARSED_METRICS_KEYS,
  OPTIONAL_PARSED_METRICS_KEYS,
} from '../types/insights.js';

const dateRange = { from: '2026-05-01', to: '2026-05-07' };

describe('insights-parser', () => {
  describe('parseRow — campaign level', () => {
    const row = {
      campaign: { id: 123, name: 'Black Friday Sale' },
      metrics: {
        cost_micros: '50000000', // R$ 50.00
        impressions: '10000',
        clicks: '350',
        ctr: '3.5',
        average_cpc: '142857',
        conversions: '25',
        conversions_value: '250',
      },
    };

    const parsed = parseRow(row, { level: 'campaign', dateRange, currencyCode: 'BRL' });

    it('extracts campaign id and name', () => {
      expect(parsed.id).toBe('123');
      expect(parsed.name).toBe('Black Friday Sale');
    });

    it('converts cost_micros to currency (R$ 50.00)', () => {
      expect(parsed.spend).toBe(50);
    });

    it('parses raw metrics correctly', () => {
      expect(parsed.impressions).toBe(10000);
      expect(parsed.clicks).toBe(350);
      expect(parsed.ctr).toBe(3.5);
      expect(parsed.cpc).toBeCloseTo(0.142857, 5);
      expect(parsed.conversions).toBe(25);
    });

    it('computes CPA when conversions > 0', () => {
      expect(parsed.cpa).toBe(2); // 50 / 25
    });

    it('computes ROAS when conversions_value > 0', () => {
      expect(parsed.roas).toBe(5); // 250 / 50
    });

    it('includes date_range and level', () => {
      expect(parsed.date_range).toEqual(dateRange);
      expect(parsed.level).toBe('campaign');
    });

    it('includes currencyCode when provided', () => {
      expect(parsed.currencyCode).toBe('BRL');
    });
  });

  describe('omits optional keys when not applicable', () => {
    it('omits cpa when conversions = 0', () => {
      const row = {
        campaign: { id: 1, name: 'x' },
        metrics: { cost_micros: '1000000', impressions: '100' },
      };
      const parsed = parseRow(row, { level: 'campaign', dateRange });
      expect(parsed.cpa).toBeUndefined();
    });

    it('omits roas when conversions_value = 0', () => {
      const row = {
        campaign: { id: 1, name: 'x' },
        metrics: {
          cost_micros: '1000000',
          conversions: '5',
          conversions_value: '0',
        },
      };
      const parsed = parseRow(row, { level: 'campaign', dateRange });
      expect(parsed.roas).toBeUndefined();
      expect(parsed.cpa).toBeDefined(); // conversions > 0 still gives cpa
    });

    it('omits currencyCode when not provided', () => {
      const row = { campaign: { id: 1, name: 'x' }, metrics: {} };
      const parsed = parseRow(row, { level: 'campaign', dateRange });
      expect(parsed.currencyCode).toBeUndefined();
    });
  });

  describe('handles edge cases', () => {
    it('returns zeros for empty metrics', () => {
      const parsed = parseRow({ campaign: { id: 1, name: 'x' } }, { level: 'campaign', dateRange });
      expect(parsed.spend).toBe(0);
      expect(parsed.impressions).toBe(0);
      expect(parsed.clicks).toBe(0);
      expect(parsed.conversions).toBe(0);
    });

    it('extracts ad_group identity at ad_group level', () => {
      const row = { ad_group: { id: 999, name: 'AG1' } };
      const parsed = parseRow(row, { level: 'ad_group', dateRange });
      expect(parsed.id).toBe('999');
      expect(parsed.name).toBe('AG1');
      expect(parsed.level).toBe('ad_group');
    });

    it('extracts ad identity at ad level', () => {
      const row = { ad_group_ad: { ad: { id: 555, name: 'Ad-A' } } };
      const parsed = parseRow(row, { level: 'ad', dateRange });
      expect(parsed.id).toBe('555');
      expect(parsed.name).toBe('Ad-A');
    });

    it('extracts keyword identity at keyword level', () => {
      const row = {
        ad_group_criterion: { criterion_id: 777, keyword: { text: 'buy shoes' } },
      };
      const parsed = parseRow(row, { level: 'keyword', dateRange });
      expect(parsed.id).toBe('777');
      expect(parsed.name).toBe('buy shoes');
    });

    it('extracts account identity at account level', () => {
      const row = { customer: { id: 1528041123, descriptive_name: 'Solaro' } };
      const parsed = parseRow(row, { level: 'account', dateRange });
      expect(parsed.id).toBe('1528041123');
      expect(parsed.name).toBe('Solaro');
    });
  });

  describe('CRITICAL — schema parity (required keys)', () => {
    it('emits all REQUIRED keys', () => {
      const row = { campaign: { id: 1, name: 'x' }, metrics: { cost_micros: '1000000' } };
      const parsed = parseRow(row, { level: 'campaign', dateRange });
      for (const key of REQUIRED_PARSED_METRICS_KEYS) {
        expect(parsed).toHaveProperty(key);
      }
    });

    it('only emits keys from REQUIRED + OPTIONAL set', () => {
      const row = {
        campaign: { id: 1, name: 'x' },
        metrics: {
          cost_micros: '1000000',
          conversions: '2',
          conversions_value: '10',
        },
      };
      const parsed = parseRow(row, { level: 'campaign', dateRange, currencyCode: 'BRL' });
      const allAllowed = [...REQUIRED_PARSED_METRICS_KEYS, ...OPTIONAL_PARSED_METRICS_KEYS];
      for (const key of Object.keys(parsed)) {
        expect(allAllowed).toContain(key);
      }
    });
  });
});
