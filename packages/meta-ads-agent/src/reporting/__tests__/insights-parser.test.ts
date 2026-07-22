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
    // Result resolves to purchases (highest priority) when present
    expect(parsed.results).toBe(10);
    expect(parsed.costPerResult).toBe(15.05);
    // No messaging events in a pixel campaign
    expect(parsed.messagingConversationsStarted).toBe(0);
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

describe('messaging (Click-to-WhatsApp)', () => {
  function makeMessagingRow(overrides: Partial<RawInsightRow> = {}): RawInsightRow {
    return {
      spend: '406.58',
      impressions: '28154',
      cpm: '14.44',
      frequency: '2.08',
      campaign_name: 'SOL_VENDAS_F_CBO_VW_UP',
      campaign_id: '999',
      actions: [
        { action_type: 'link_click', value: '190' },
        { action_type: 'onsite_conversion.messaging_conversation_started_7d', value: '38' },
        { action_type: 'onsite_conversion.messaging_first_reply', value: '32' },
        { action_type: 'onsite_conversion.total_messaging_connection', value: '41' },
      ],
      cost_per_action_type: [
        { action_type: 'link_click', value: '2.14' },
        { action_type: 'onsite_conversion.messaging_conversation_started_7d', value: '10.70' },
      ],
      ...overrides,
    };
  }

  it('extracts messaging conversations, replies and connections', () => {
    const parsed = parseInsightRow(makeMessagingRow());
    expect(parsed.messagingConversationsStarted).toBe(38);
    expect(parsed.messagingFirstReplies).toBe(32);
    expect(parsed.totalMessagingConnections).toBe(41);
    expect(parsed.costPerMessagingConversation).toBe(10.70);
  });

  it('does not affect pixel conversion fields', () => {
    const parsed = parseInsightRow(makeMessagingRow());
    // Messaging is onsite_conversion.*, not offsite — so pixel totals stay 0
    expect(parsed.conversions).toBe(0);
    expect(parsed.purchases).toBe(0);
    expect(parsed.leads).toBe(0);
  });

  it('matches conversations regardless of attribution window (_1d)', () => {
    const parsed = parseInsightRow(
      makeMessagingRow({
        actions: [
          { action_type: 'onsite_conversion.messaging_conversation_started_1d', value: '12' },
        ],
        cost_per_action_type: [
          { action_type: 'onsite_conversion.messaging_conversation_started_1d', value: '9.50' },
        ],
      }),
    );
    expect(parsed.messagingConversationsStarted).toBe(12);
    expect(parsed.costPerMessagingConversation).toBe(9.5);
  });

  it('matches conversations with no window suffix', () => {
    const parsed = parseInsightRow(
      makeMessagingRow({
        actions: [
          { action_type: 'onsite_conversion.messaging_conversation_started', value: '7' },
        ],
        cost_per_action_type: [],
      }),
    );
    expect(parsed.messagingConversationsStarted).toBe(7);
  });
});

describe('leads (multi-source resolution)', () => {
  function leadRow(actions: RawAction[], spend = '100', costs: RawAction[] = []): RawInsightRow {
    return {
      spend,
      impressions: '1000',
      cpm: '10',
      frequency: '1.5',
      actions,
      cost_per_action_type: costs,
    };
  }

  it('reads native instant-form leads (onsite_conversion.lead_grouped)', () => {
    const parsed = parseInsightRow(
      leadRow([{ action_type: 'onsite_conversion.lead_grouped', value: '3' }]),
    );
    expect(parsed.leads).toBe(3);
  });

  it('reads website pixel leads via fallback (offsite_conversion.fb_pixel_lead)', () => {
    const parsed = parseInsightRow(
      leadRow([{ action_type: 'offsite_conversion.fb_pixel_lead', value: '7' }]),
    );
    expect(parsed.leads).toBe(7);
  });

  it('does not double-count when aggregate and lead_grouped coexist', () => {
    const parsed = parseInsightRow(
      leadRow([
        { action_type: 'lead', value: '4' },
        { action_type: 'onsite_conversion.lead_grouped', value: '4' },
      ]),
    );
    // Aggregate wins; specifics are already rolled into it → 4, not 8.
    expect(parsed.leads).toBe(4);
  });

  it('derives cost per lead from spend when no per-action cost present', () => {
    const parsed = parseInsightRow(
      leadRow([{ action_type: 'onsite_conversion.lead_grouped', value: '4' }], '80'),
    );
    expect(parsed.leads).toBe(4);
    // 80 / 4 = 20
    expect(parsed.costPerLead).toBe(20);
  });

  it('uses lead_grouped per-action cost when present', () => {
    const parsed = parseInsightRow(
      leadRow(
        [{ action_type: 'onsite_conversion.lead_grouped', value: '4' }],
        '80',
        [{ action_type: 'onsite_conversion.lead_grouped', value: '12.50' }],
      ),
    );
    expect(parsed.costPerLead).toBe(12.5);
  });
});

describe('purchases (multi-source resolution + revenue)', () => {
  function purchaseRow(overrides: Partial<RawInsightRow> = {}): RawInsightRow {
    return {
      spend: '500',
      impressions: '20000',
      cpm: '25',
      frequency: '2.0',
      campaign_name: 'ECOM_VENDAS_TEST',
      campaign_id: '777',
      actions: [{ action_type: 'link_click', value: '300' }],
      cost_per_action_type: [{ action_type: 'link_click', value: '1.66' }],
      purchase_roas: [],
      action_values: [],
      ...overrides,
    };
  }

  it('reads purchases/roas/cost/revenue from an omni_purchase account', () => {
    const parsed = parseInsightRow(
      purchaseRow({
        actions: [
          { action_type: 'link_click', value: '300' },
          { action_type: 'omni_purchase', value: '20' },
        ],
        cost_per_action_type: [
          { action_type: 'link_click', value: '1.66' },
          { action_type: 'omni_purchase', value: '25.00' },
        ],
        purchase_roas: [{ action_type: 'omni_purchase', value: '4.2' }],
        action_values: [{ action_type: 'omni_purchase', value: '2100.00' }],
      }),
    );
    expect(parsed.purchases).toBe(20);
    expect(parsed.costPerPurchase).toBe(25.0);
    expect(parsed.roas).toBe(4.2);
    expect(parsed.revenue).toBe(2100.0);
    // Result resolves to purchases (highest priority)
    expect(parsed.results).toBe(20);
    expect(parsed.costPerResult).toBe(25.0);
  });

  it('reads purchases/roas/revenue from a generic purchase account', () => {
    const parsed = parseInsightRow(
      purchaseRow({
        actions: [{ action_type: 'purchase', value: '8' }],
        cost_per_action_type: [{ action_type: 'purchase', value: '62.50' }],
        purchase_roas: [{ action_type: 'purchase', value: '2.9' }],
        action_values: [{ action_type: 'purchase', value: '1450.00' }],
      }),
    );
    expect(parsed.purchases).toBe(8);
    expect(parsed.costPerPurchase).toBe(62.5);
    expect(parsed.roas).toBe(2.9);
    expect(parsed.revenue).toBe(1450.0);
  });

  it('falls back to fb_pixel_purchase when omni/generic absent', () => {
    const parsed = parseInsightRow(
      purchaseRow({
        actions: [{ action_type: 'offsite_conversion.fb_pixel_purchase', value: '10' }],
        cost_per_action_type: [
          { action_type: 'offsite_conversion.fb_pixel_purchase', value: '15.05' },
        ],
        purchase_roas: [{ action_type: 'offsite_conversion.fb_pixel_purchase', value: '3.5' }],
        action_values: [{ action_type: 'offsite_conversion.fb_pixel_purchase', value: '900.00' }],
      }),
    );
    expect(parsed.purchases).toBe(10);
    expect(parsed.costPerPurchase).toBe(15.05);
    expect(parsed.roas).toBe(3.5);
    expect(parsed.revenue).toBe(900.0);
  });

  it('prefers omni over fb_pixel without double-counting when both present', () => {
    const parsed = parseInsightRow(
      purchaseRow({
        actions: [
          { action_type: 'omni_purchase', value: '12' },
          { action_type: 'offsite_conversion.fb_pixel_purchase', value: '12' },
        ],
        purchase_roas: [
          { action_type: 'omni_purchase', value: '5.0' },
          { action_type: 'offsite_conversion.fb_pixel_purchase', value: '5.0' },
        ],
        action_values: [
          { action_type: 'omni_purchase', value: '3000.00' },
          { action_type: 'offsite_conversion.fb_pixel_purchase', value: '3000.00' },
        ],
      }),
    );
    // Omni wins; specifics already rolled in → 12, not 24.
    expect(parsed.purchases).toBe(12);
    expect(parsed.roas).toBe(5.0);
    expect(parsed.revenue).toBe(3000.0);
  });

  it('derives cost per purchase from spend when no per-action cost present', () => {
    const parsed = parseInsightRow(
      purchaseRow({
        spend: '400',
        actions: [{ action_type: 'omni_purchase', value: '8' }],
        cost_per_action_type: [],
      }),
    );
    expect(parsed.purchases).toBe(8);
    // 400 / 8 = 50
    expect(parsed.costPerPurchase).toBe(50);
  });

  it('returns zero revenue when action_values absent', () => {
    const parsed = parseInsightRow(
      purchaseRow({ actions: [{ action_type: 'omni_purchase', value: '5' }] }),
    );
    expect(parsed.revenue).toBe(0);
  });
});

describe('resolveResult hierarchy', () => {
  function row(actions: RawAction[], spend = '100', costs: RawAction[] = []): RawInsightRow {
    return {
      spend,
      impressions: '1000',
      cpm: '10',
      frequency: '1.5',
      actions,
      cost_per_action_type: costs,
    };
  }

  it('uses messaging conversations when no purchase/lead', () => {
    const parsed = parseInsightRow(
      row(
        [
          { action_type: 'link_click', value: '190' },
          { action_type: 'onsite_conversion.messaging_conversation_started_7d', value: '38' },
        ],
        '406.58',
        [{ action_type: 'onsite_conversion.messaging_conversation_started_7d', value: '10.70' }],
      ),
    );
    expect(parsed.results).toBe(38);
    expect(parsed.costPerResult).toBe(10.70);
  });

  it('falls back to link clicks when only clicks exist', () => {
    const parsed = parseInsightRow(
      row([{ action_type: 'link_click', value: '50' }], '100', [
        { action_type: 'link_click', value: '2.00' },
      ]),
    );
    expect(parsed.results).toBe(50);
    expect(parsed.costPerResult).toBe(2.0);
  });

  it('prioritizes leads over messaging and clicks', () => {
    const parsed = parseInsightRow(
      row(
        [
          { action_type: 'link_click', value: '190' },
          { action_type: 'offsite_conversion.fb_pixel_lead', value: '5' },
          { action_type: 'onsite_conversion.messaging_conversation_started_7d', value: '38' },
        ],
        '100',
        [{ action_type: 'offsite_conversion.fb_pixel_lead', value: '20' }],
      ),
    );
    expect(parsed.results).toBe(5);
    expect(parsed.costPerResult).toBe(20);
  });

  it('prioritizes purchases over messaging (mixed account, account level)', () => {
    const parsed = parseInsightRow(
      row(
        [
          { action_type: 'offsite_conversion.fb_pixel_purchase', value: '4' },
          { action_type: 'onsite_conversion.messaging_conversation_started_7d', value: '38' },
        ],
        '200',
        [{ action_type: 'offsite_conversion.fb_pixel_purchase', value: '50' }],
      ),
    );
    // Documented behavior: highest-priority outcome wins; messaging is hidden in
    // the aggregate. Messaging is still exposed via messagingConversationsStarted.
    expect(parsed.results).toBe(4);
    expect(parsed.costPerResult).toBe(50);
    expect(parsed.messagingConversationsStarted).toBe(38);
  });

  it('derives cost per result from spend when direct cost missing', () => {
    const parsed = parseInsightRow(
      row([{ action_type: 'onsite_conversion.messaging_conversation_started_7d', value: '10' }], '100'),
    );
    expect(parsed.results).toBe(10);
    // 100 / 10 = 10
    expect(parsed.costPerResult).toBe(10);
  });

  it('returns zero result when no actions', () => {
    const parsed = parseInsightRow(row([], '100'));
    expect(parsed.results).toBe(0);
    expect(parsed.costPerResult).toBe(0);
  });
});
