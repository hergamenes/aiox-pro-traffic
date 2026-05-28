import { describe, it, expect } from 'vitest';
import { formatTable, formatJson } from '../report-formatter.js';
import type { ParsedMetrics } from '../../types/insights.js';

function makeMetrics(overrides: Partial<ParsedMetrics> = {}): ParsedMetrics {
  return {
    campaignName: 'PPT_VENDAS_COMPRA_09-03-26_Test',
    campaignId: '123456',
    spend: 150.50,
    budget: 50.00,
    impressions: 10000,
    cpm: 15.05,
    frequency: 2.3,
    linkClicks: 200,
    cpcLink: 0.75,
    ctrLink: 2.0,
    landingPageViews: 150,
    costPerLandingPageView: 1.00,
    landingPageViewRate: 0.75,
    conversions: 65,
    costPerConversion: 8.70,
    initiateCheckout: 25,
    costPerInitiateCheckout: 6.02,
    purchases: 10,
    costPerPurchase: 15.05,
    roas: 3.5,
    leads: 30,
    costPerLead: 5.02,
    purchaseRateByClicks: 0.05,
    purchaseRateByLandingPageViews: 0.0667,
    messagingConversationsStarted: 0,
    costPerMessagingConversation: 0,
    messagingFirstReplies: 0,
    totalMessagingConnections: 0,
    results: 10,
    costPerResult: 15.05,
    ...overrides,
  };
}

describe('formatTable', () => {
  it('formats campaign level with name', () => {
    const result = formatTable([makeMetrics()], 'campaign');
    expect(result).toContain('PPT_VENDAS_COMPRA_09-03-26_Test');
    expect(result).toContain('Campanha');
  });

  it('formats monetary values with R$', () => {
    const result = formatTable([makeMetrics()], 'campaign');
    expect(result).toContain('R$');
  });

  it('shows dash for zero values', () => {
    const result = formatTable(
      [makeMetrics({ spend: 0, linkClicks: 0 })],
      'campaign',
    );
    expect(result).toContain('—');
  });

  it('shows dash for null budget', () => {
    const result = formatTable(
      [makeMetrics({ budget: null })],
      'campaign',
    );
    // Budget line should show —
    expect(result).toContain('Orçamento');
  });

  it('returns message for empty metrics', () => {
    const result = formatTable([], 'campaign');
    expect(result).toContain('Nenhum dado encontrado');
  });

  it('formats adset level with adset name', () => {
    const result = formatTable(
      [makeMetrics({ adsetName: 'Público Lookalike', adsetId: '789' })],
      'adset',
    );
    expect(result).toContain('Conjunto');
    expect(result).toContain('Público Lookalike');
  });

  it('formats account level', () => {
    const result = formatTable([makeMetrics()], 'account');
    expect(result).toContain('Conta');
  });

  it('formats multiple campaigns', () => {
    const metrics = [
      makeMetrics({ campaignName: 'Campaign A' }),
      makeMetrics({ campaignName: 'Campaign B', spend: 200 }),
    ];
    const result = formatTable(metrics, 'campaign');
    expect(result).toContain('Campaign A');
    expect(result).toContain('Campaign B');
  });

  it('shows messaging and result rows', () => {
    const result = formatTable(
      [makeMetrics({ messagingConversationsStarted: 38, costPerMessagingConversation: 10.7 })],
      'campaign',
    );
    expect(result).toContain('Conversas WhatsApp');
    expect(result).toContain('Custo por Conversa');
    expect(result).toContain('Resultado');
  });
});

describe('formatJson', () => {
  it('returns valid JSON', () => {
    const metrics = [makeMetrics()];
    const result = formatJson(metrics);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].spend).toBe(150.50);
  });

  it('returns empty array for no metrics', () => {
    const result = formatJson([]);
    expect(JSON.parse(result)).toEqual([]);
  });

  it('preserves all 22+ fields', () => {
    const result = formatJson([makeMetrics()]);
    const parsed = JSON.parse(result)[0];
    expect(parsed).toHaveProperty('spend');
    expect(parsed).toHaveProperty('roas');
    expect(parsed).toHaveProperty('purchaseRateByClicks');
    expect(parsed).toHaveProperty('purchaseRateByLandingPageViews');
  });
});
