import { describe, it, expect } from 'vitest';
import { filterByTag } from './campaign-filter.js';
import type { ParsedMetrics } from '../types/insights.js';

const base: ParsedMetrics = {
  id: '',
  name: '',
  level: 'campaign',
  spend: 0,
  impressions: 0,
  clicks: 0,
  ctr: 0,
  cpc: 0,
  conversions: 0,
  date_range: { from: '2026-05-01', to: '2026-05-07' },
};

function row(id: string, name: string): ParsedMetrics {
  return { ...base, id, name };
}

describe('campaign-filter', () => {
  const rows: ParsedMetrics[] = [
    row('1', 'Black Friday - Vendas'),
    row('2', 'Cyber Monday'),
    row('3', 'Black Friday - Leads'),
    row('4', 'Promo Verão'),
  ];

  it('returns all rows when tag is undefined', () => {
    expect(filterByTag(rows, undefined).length).toBe(4);
  });

  it('returns all rows when tag is empty string', () => {
    expect(filterByTag(rows, '').length).toBe(4);
  });

  it('filters case-insensitive', () => {
    const out = filterByTag(rows, 'black friday');
    expect(out.length).toBe(2);
    expect(out.map((r) => r.id)).toEqual(['1', '3']);
  });

  it('matches substring (uppercase)', () => {
    expect(filterByTag(rows, 'PROMO').length).toBe(1);
  });

  it('returns empty when no match', () => {
    expect(filterByTag(rows, 'xyz-unmatchable').length).toBe(0);
  });
});
