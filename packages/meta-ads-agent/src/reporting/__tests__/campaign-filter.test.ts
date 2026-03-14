import { describe, it, expect } from 'vitest';
import { filterByTag } from '../campaign-filter.js';
import type { RawInsightRow } from '../../types/insights.js';

function makeRow(campaignName: string): RawInsightRow {
  return {
    spend: '100',
    impressions: '5000',
    cpm: '20',
    frequency: '1.5',
    campaign_name: campaignName,
    campaign_id: '123',
  };
}

describe('filterByTag', () => {
  const rows = [
    makeRow('PPT_VENDAS_COMPRA_09-03-26_BlackFriday'),
    makeRow('PPT_LEADS_LP_09-03-26_Webinar'),
    makeRow('PPT_VENDAS_COMPRA_10-03-26_CyberMonday'),
    makeRow('PPT_LEADS_LP_10-03-26_Ebook'),
  ];

  it('filters by tag (case-insensitive)', () => {
    const result = filterByTag(rows, 'vendas');
    expect(result).toHaveLength(2);
    expect(result[0].campaign_name).toBe('PPT_VENDAS_COMPRA_09-03-26_BlackFriday');
    expect(result[1].campaign_name).toBe('PPT_VENDAS_COMPRA_10-03-26_CyberMonday');
  });

  it('filters by tag uppercase', () => {
    const result = filterByTag(rows, 'LEADS');
    expect(result).toHaveLength(2);
  });

  it('filters by partial match', () => {
    const result = filterByTag(rows, 'BlackFriday');
    expect(result).toHaveLength(1);
    expect(result[0].campaign_name).toBe('PPT_VENDAS_COMPRA_09-03-26_BlackFriday');
  });

  it('returns empty for no match', () => {
    const result = filterByTag(rows, 'REMARKETING');
    expect(result).toHaveLength(0);
  });

  it('handles rows without campaign_name', () => {
    const noNameRows = [{ ...makeRow('Test'), campaign_name: undefined }] as RawInsightRow[];
    const result = filterByTag(noNameRows, 'Test');
    expect(result).toHaveLength(0);
  });

  it('handles empty tag', () => {
    const result = filterByTag(rows, '');
    expect(result).toHaveLength(4); // empty string matches all
  });

  it('handles special characters in tag', () => {
    const specialRows = [makeRow('PPT_VENDAS_Black(Friday)_2026')];
    const result = filterByTag(specialRows, '(Friday)');
    expect(result).toHaveLength(1);
  });
});
