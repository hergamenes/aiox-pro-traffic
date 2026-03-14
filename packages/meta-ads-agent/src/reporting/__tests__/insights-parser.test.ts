import { describe, it, expect } from 'vitest';
import { extractAction, extractCostPerAction, parseInsightRow } from '../insights-parser.js';
import type { RawInsightRow, RawAction } from '../../types/insights.js';

function makeRow(overrides: Partial<RawInsightRow> = {}): RawInsightRow {
  return {
    spend: '150.50',
    impressions: '10000',
    cpm: '15.05',
    frequency: '2.3',
    campaign_name: 'PPT_VENDAS_COMPRA_09-03-26_Test',
    campaign_id: '123456',
    actions: [
      { action_type: 'link_click', value: '200' },
      { action_type: 'landing_page_view', value: '150' },
      { action_type: 'offsite_conversion.fb_pixel_purchase', value: '10' },
      { action_type: 'offsite_conversion.fb_pixel_initiate_checkout', value: '25' },
      { action_type: 'offsite_conversion.fb_pixel_lead', value: '30' },
    ],
    cost_per_action_type: [
      { action_type: 'link_click', value: '0.75' },
      { action_type: 'landing_page_view', value: '1.00' },
      { action_type: 'offsite_conversion.fb_pixel_purchase', value: '15.05' },
      { action_type: 'offsite_conversion.fb_pixel_initiate_checkout', value: '6.02' },
      { action_type: 'offsite_conversion.fb_pixel_lead', value: '5.02' },
    ],
    website_ctr: [{ action_type: 'link_click', value: '2.0' }],
    purchase_roas: [{ action_type: 'offsite_conversion.fb_pixel_purchase', value: '3.5' }],
    ...overrides,
  };
}

describe('extractAction', () => {
  it('extracts value by action_type', () => {
    const actions: RawAction[] = [
      { action_type: 'link_click', value: '200' },
      { action_type: 'landing_page_view', value: '150' },
    ];
    expect(extractAction(actions, 'link_click')).toBe(200);
    expect(extractAction(actions, 'landing_page_view')).toBe(150);
  });

  it('returns 0 for missing action_type', () => {
    const actions: RawAction[] = [{ action_type: 'link_click', value: '200' }];
    expect(extractAction(actions, 'page_view')).toBe(0);
  });

  it('returns 0 for undefined actions', () => {
    expect(extractAction(undefined, 'link_click')).toBe(0);
  });

  it('returns 0 for invalid value', () => {
    const actions: RawAction[] = [{ action_type: 'link_click', value: 'abc' }];
    expect(extractAction(actions, 'link_click')).toBe(0);
  });
});

describe('extractCostPerAction', () => {
  it('extracts cost by action_type', () => {
    const costs = [{ action_type: 'link_click', value: '0.75' }];
    expect(extractCostPerAction(costs, 'link_click')).toBe(0.75);
  });

  it('returns 0 for undefined', () => {
    expect(extractCostPerAction(undefined, 'link_click')).toBe(0);
  });
});

describe('parseInsightRow', () => {
  it('parses complete row with all metrics', () => {
    const row = makeRow();
    const parsed = parseInsightRow(row);

    expect(parsed.spend).toBe(150.50);
    expect(parsed.impressions).toBe(10000);
    expect(parsed.cpm).toBe(15.05);
    expect(parsed.frequency).toBe(2.3);
    expect(parsed.linkClicks).toBe(200);
    expect(parsed.cpcLink).toBe(0.75);
    expect(parsed.ctrLink).toBe(2.0);
    expect(parsed.landingPageViews).toBe(150);
    expect(parsed.costPerLandingPageView).toBe(1.00);
    expect(parsed.purchases).toBe(10);
    expect(parsed.costPerPurchase).toBe(15.05);
    expect(parsed.roas).toBe(3.5);
    expect(parsed.leads).toBe(30);
    expect(parsed.costPerLead).toBe(5.02);
    expect(parsed.initiateCheckout).toBe(25);
    expect(parsed.costPerInitiateCheckout).toBe(6.02);
    expect(parsed.campaignName).toBe('PPT_VENDAS_COMPRA_09-03-26_Test');
    expect(parsed.campaignId).toBe('123456');
  });

  it('calculates landingPageViewRate correctly', () => {
    const parsed = parseInsightRow(makeRow());
    // 150 / 200 = 0.75
    expect(parsed.landingPageViewRate).toBe(0.75);
  });

  it('calculates purchaseRateByClicks correctly', () => {
    const parsed = parseInsightRow(makeRow());
    // 10 / 200 = 0.05
    expect(parsed.purchaseRateByClicks).toBe(0.05);
  });

  it('calculates purchaseRateByLandingPageViews correctly', () => {
    const parsed = parseInsightRow(makeRow());
    // 10 / 150 ≈ 0.0667
    expect(parsed.purchaseRateByLandingPageViews).toBeCloseTo(0.0667, 3);
  });

  it('handles division by zero gracefully', () => {
    const row = makeRow({
      actions: [], // No link_clicks or landing_page_views
    });
    const parsed = parseInsightRow(row);

    expect(parsed.landingPageViewRate).toBe(0);
    expect(parsed.purchaseRateByClicks).toBe(0);
    expect(parsed.purchaseRateByLandingPageViews).toBe(0);
  });

  it('handles missing actions array', () => {
    const row = makeRow({ actions: undefined, cost_per_action_type: undefined });
    const parsed = parseInsightRow(row);

    expect(parsed.linkClicks).toBe(0);
    expect(parsed.landingPageViews).toBe(0);
    expect(parsed.purchases).toBe(0);
    expect(parsed.leads).toBe(0);
    expect(parsed.conversions).toBe(0);
  });

  it('handles all zero values', () => {
    const row = makeRow({
      spend: '0',
      impressions: '0',
      cpm: '0',
      frequency: '0',
      actions: [],
      cost_per_action_type: [],
      website_ctr: [],
      purchase_roas: [],
    });
    const parsed = parseInsightRow(row);

    expect(parsed.spend).toBe(0);
    expect(parsed.impressions).toBe(0);
    expect(parsed.linkClicks).toBe(0);
    expect(parsed.roas).toBe(0);
  });

  it('sums all offsite_conversion.* for conversions total', () => {
    const row = makeRow();
    const parsed = parseInsightRow(row);
    // purchase(10) + initiate_checkout(25) + lead(30) = 65
    expect(parsed.conversions).toBe(65);
  });

  it('sets budget to null (populated separately)', () => {
    const parsed = parseInsightRow(makeRow());
    expect(parsed.budget).toBeNull();
  });
});
