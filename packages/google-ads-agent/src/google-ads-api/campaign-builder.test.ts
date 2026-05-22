import { describe, it, expect } from 'vitest';
import {
  buildSearchCampaignOperations,
  buildDisplayCampaignOperations,
  buildPmaxCampaignOperations,
  validateBiddingStrategy,
  validateDisplayBiddingStrategy,
  validatePmaxBidding,
  parseStartDate,
  buildBiddingFields,
  buildDisplayBiddingFields,
  buildPmaxBiddingFields,
} from './campaign-builder.js';

describe('validateBiddingStrategy', () => {
  it('accepts maximize_conversions without target', () => {
    expect(validateBiddingStrategy('maximize_conversions').ok).toBe(true);
  });

  it('accepts target_cpa with valid targetMicros', () => {
    expect(validateBiddingStrategy('target_cpa', 30_000_000).ok).toBe(true);
  });

  it('rejects target_cpa without target', () => {
    const r = validateBiddingStrategy('target_cpa');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/target_cpa/);
  });

  it('rejects target_cpa with zero/negative target', () => {
    expect(validateBiddingStrategy('target_cpa', 0).ok).toBe(false);
    expect(validateBiddingStrategy('target_cpa', -100).ok).toBe(false);
  });

  it('accepts target_roas with valid targetRoas', () => {
    expect(validateBiddingStrategy('target_roas', undefined, 2.5).ok).toBe(true);
  });

  it('rejects target_roas without target', () => {
    expect(validateBiddingStrategy('target_roas').ok).toBe(false);
  });

  it('rejects maximize_conversions WITH a target (incoherent)', () => {
    const r = validateBiddingStrategy('maximize_conversions', 30_000_000);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/NÃO aceita --target/);
  });

  it('accepts manual_cpc without target', () => {
    expect(validateBiddingStrategy('manual_cpc').ok).toBe(true);
  });
});

describe('parseStartDate', () => {
  it('returns today in YYYYMMDD when input is undefined', () => {
    const result = parseStartDate(undefined, 'UTC');
    expect(result).toMatch(/^\d{8}$/);
  });

  it('returns today in YYYYMMDD when input is empty string', () => {
    const result = parseStartDate('', 'UTC');
    expect(result).toMatch(/^\d{8}$/);
  });

  it('parses valid YYYY-MM-DD input', () => {
    expect(parseStartDate('2026-05-22', 'UTC')).toBe('20260522');
  });

  it('parses with different timezone (today)', () => {
    const result = parseStartDate(undefined, 'America/Sao_Paulo');
    expect(result).toMatch(/^\d{8}$/);
  });

  it('throws on malformed date', () => {
    expect(() => parseStartDate('22-05-2026', 'UTC')).toThrow();
    expect(() => parseStartDate('not-a-date', 'UTC')).toThrow();
    expect(() => parseStartDate('2026/05/22', 'UTC')).toThrow();
  });
});

describe('buildBiddingFields', () => {
  it('builds maximize_conversions', () => {
    expect(buildBiddingFields('maximize_conversions')).toEqual({ maximize_conversions: {} });
  });

  it('builds target_cpa with targetMicros', () => {
    expect(buildBiddingFields('target_cpa', 30_000_000)).toEqual({
      target_cpa: { target_cpa_micros: 30_000_000 },
    });
  });

  it('builds target_roas with targetRoas', () => {
    expect(buildBiddingFields('target_roas', undefined, 2.5)).toEqual({
      target_roas: { target_roas: 2.5 },
    });
  });

  it('builds manual_cpc', () => {
    expect(buildBiddingFields('manual_cpc')).toEqual({
      manual_cpc: { enhanced_cpc_enabled: false },
    });
  });

  it('builds maximize_conversion_value', () => {
    expect(buildBiddingFields('maximize_conversion_value')).toEqual({
      maximize_conversion_value: {},
    });
  });
});

describe('buildSearchCampaignOperations', () => {
  const baseInput = {
    customerId: '5562216599',
    name: 'My Search Campaign',
    dailyMicros: 5_000_000,
    bidding: 'maximize_conversions' as const,
    startDateYYYYMMDD: '20260522',
  };

  it('returns 2 operations: campaign_budget + campaign', () => {
    const ops = buildSearchCampaignOperations(baseInput);
    expect(ops).toHaveLength(2);
    expect(ops[0].entity).toBe('campaign_budget');
    expect(ops[1].entity).toBe('campaign');
  });

  it('uses temp resource_name -1 for budget', () => {
    const ops = buildSearchCampaignOperations(baseInput);
    const budgetResource = ops[0].resource as { resource_name: string };
    expect(budgetResource.resource_name).toBe('customers/5562216599/campaignBudgets/-1');
  });

  it('cross-references budget from campaign via temp resource_name', () => {
    const ops = buildSearchCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as { campaign_budget: string };
    expect(campaignResource.campaign_budget).toBe('customers/5562216599/campaignBudgets/-1');
  });

  it('status is ALWAYS PAUSED (anti-burn veto)', () => {
    const ops = buildSearchCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as { status: string };
    expect(campaignResource.status).toBe('PAUSED');
  });

  it('advertising_channel_type is SEARCH', () => {
    const ops = buildSearchCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as { advertising_channel_type: string };
    expect(campaignResource.advertising_channel_type).toBe('SEARCH');
  });

  it('network_settings target Search only (Display + Partners OFF)', () => {
    const ops = buildSearchCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as {
      network_settings: {
        target_google_search: boolean;
        target_search_network: boolean;
        target_content_network: boolean;
        target_partner_search_network: boolean;
      };
    };
    expect(campaignResource.network_settings.target_google_search).toBe(true);
    expect(campaignResource.network_settings.target_search_network).toBe(true);
    expect(campaignResource.network_settings.target_content_network).toBe(false);
    expect(campaignResource.network_settings.target_partner_search_network).toBe(false);
  });

  it('budget amount_micros matches input', () => {
    const ops = buildSearchCampaignOperations(baseInput);
    const budgetResource = ops[0].resource as { amount_micros: number };
    expect(budgetResource.amount_micros).toBe(5_000_000);
  });

  it('includes target_cpa fields when bidding is target_cpa', () => {
    const ops = buildSearchCampaignOperations({
      ...baseInput,
      bidding: 'target_cpa',
      targetMicros: 30_000_000,
    });
    const campaignResource = ops[1].resource as { target_cpa?: { target_cpa_micros: number } };
    expect(campaignResource.target_cpa).toEqual({ target_cpa_micros: 30_000_000 });
  });

  it('handles customer-id with dashes (strips them)', () => {
    const ops = buildSearchCampaignOperations({
      ...baseInput,
      customerId: '556-221-6599',
    });
    const budgetResource = ops[0].resource as { resource_name: string };
    expect(budgetResource.resource_name).toBe('customers/5562216599/campaignBudgets/-1');
  });

  it('includes EU compliance field (DSA 2023)', () => {
    const ops = buildSearchCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as { contains_eu_political_advertising: string };
    expect(campaignResource.contains_eu_political_advertising).toBe(
      'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING',
    );
  });
});

// ============================================================================
// Story 6.3b — Display campaign tests
// ============================================================================

describe('validateDisplayBiddingStrategy', () => {
  it('accepts maximize_conversions without target', () => {
    expect(validateDisplayBiddingStrategy('maximize_conversions').ok).toBe(true);
  });

  it('accepts target_cpa with valid target', () => {
    expect(validateDisplayBiddingStrategy('target_cpa', 30_000_000).ok).toBe(true);
  });

  it('rejects target_cpa without target', () => {
    expect(validateDisplayBiddingStrategy('target_cpa').ok).toBe(false);
  });

  it('accepts maximize_clicks without target', () => {
    expect(validateDisplayBiddingStrategy('maximize_clicks').ok).toBe(true);
  });

  it('accepts maximize_conversion_value without target', () => {
    expect(validateDisplayBiddingStrategy('maximize_conversion_value').ok).toBe(true);
  });

  it('rejects strategies with --target except target_cpa', () => {
    expect(validateDisplayBiddingStrategy('maximize_conversions', 30_000_000).ok).toBe(false);
    expect(validateDisplayBiddingStrategy('maximize_clicks', 30_000_000).ok).toBe(false);
  });
});

describe('buildDisplayBiddingFields', () => {
  it('builds maximize_conversions', () => {
    expect(buildDisplayBiddingFields('maximize_conversions')).toEqual({
      maximize_conversions: {},
    });
  });

  it('builds target_cpa with targetMicros', () => {
    expect(buildDisplayBiddingFields('target_cpa', 30_000_000)).toEqual({
      target_cpa: { target_cpa_micros: 30_000_000 },
    });
  });

  it('builds maximize_conversion_value', () => {
    expect(buildDisplayBiddingFields('maximize_conversion_value')).toEqual({
      maximize_conversion_value: {},
    });
  });

  it('builds maximize_clicks as target_spend (SDK legacy mapping)', () => {
    expect(buildDisplayBiddingFields('maximize_clicks')).toEqual({ target_spend: {} });
  });
});

describe('buildDisplayCampaignOperations', () => {
  const baseInput = {
    customerId: '5562216599',
    name: 'My Display Campaign',
    dailyMicros: 5_000_000,
    bidding: 'maximize_conversions' as const,
    startDateYYYYMMDD: '20260522',
  };

  it('returns 2 operations: campaign_budget + campaign', () => {
    const ops = buildDisplayCampaignOperations(baseInput);
    expect(ops).toHaveLength(2);
    expect(ops[0].entity).toBe('campaign_budget');
    expect(ops[1].entity).toBe('campaign');
  });

  it('advertising_channel_type is DISPLAY (not SEARCH)', () => {
    const ops = buildDisplayCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as { advertising_channel_type: string };
    expect(campaignResource.advertising_channel_type).toBe('DISPLAY');
  });

  it('network_settings only target content network (no search)', () => {
    const ops = buildDisplayCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as {
      network_settings: {
        target_google_search: boolean;
        target_search_network: boolean;
        target_content_network: boolean;
        target_partner_search_network: boolean;
      };
    };
    expect(campaignResource.network_settings.target_google_search).toBe(false);
    expect(campaignResource.network_settings.target_search_network).toBe(false);
    expect(campaignResource.network_settings.target_content_network).toBe(true);
    expect(campaignResource.network_settings.target_partner_search_network).toBe(false);
  });

  it('status is ALWAYS PAUSED (R6 anti-burn)', () => {
    const ops = buildDisplayCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as { status: string };
    expect(campaignResource.status).toBe('PAUSED');
  });

  it('inherits EU compliance field from 6.3a', () => {
    const ops = buildDisplayCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as { contains_eu_political_advertising: string };
    expect(campaignResource.contains_eu_political_advertising).toBe(
      'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING',
    );
  });

  it('temp resource_name -1 + cross-reference', () => {
    const ops = buildDisplayCampaignOperations(baseInput);
    const budgetResource = ops[0].resource as { resource_name: string };
    const campaignResource = ops[1].resource as { campaign_budget: string };
    expect(budgetResource.resource_name).toBe('customers/5562216599/campaignBudgets/-1');
    expect(campaignResource.campaign_budget).toBe('customers/5562216599/campaignBudgets/-1');
  });
});

// ============================================================================
// Story 6.3c — PMax tests
// ============================================================================

describe('validatePmaxBidding', () => {
  it('accepts maximize_conversion_value without target', () => {
    expect(validatePmaxBidding('maximize_conversion_value').ok).toBe(true);
  });

  it('rejects maximize_conversion_value WITH targetRoas', () => {
    const r = validatePmaxBidding('maximize_conversion_value', 2.5);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/NÃO aceita/);
  });

  it('accepts target_roas with valid decimal', () => {
    expect(validatePmaxBidding('target_roas', 2.5).ok).toBe(true);
  });

  it('rejects target_roas without targetRoas', () => {
    expect(validatePmaxBidding('target_roas').ok).toBe(false);
  });

  it('rejects target_roas with zero/negative', () => {
    expect(validatePmaxBidding('target_roas', 0).ok).toBe(false);
    expect(validatePmaxBidding('target_roas', -1).ok).toBe(false);
  });

  it('warns (ok=true with message) when targetRoas > 10', () => {
    const r = validatePmaxBidding('target_roas', 15);
    expect(r.ok).toBe(true);
    expect(r.error).toMatch(/raramente atingível/);
  });
});

describe('buildPmaxBiddingFields', () => {
  it('builds maximize_conversion_value empty', () => {
    expect(buildPmaxBiddingFields('maximize_conversion_value')).toEqual({
      maximize_conversion_value: {},
    });
  });

  it('builds target_roas inside maximize_conversion_value', () => {
    expect(buildPmaxBiddingFields('target_roas', 2.5)).toEqual({
      maximize_conversion_value: { target_roas: 2.5 },
    });
  });
});

describe('buildPmaxCampaignOperations', () => {
  const baseInput = {
    customerId: '5562216599',
    name: 'My PMax Campaign',
    dailyMicros: 5_000_000,
    finalUrl: 'https://example.com',
    bidding: 'maximize_conversion_value' as const,
    startDateYYYYMMDD: '20260522',
  };

  it('returns 3 operations: budget + campaign + asset_group', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    expect(ops).toHaveLength(3);
    expect(ops[0].entity).toBe('campaign_budget');
    expect(ops[1].entity).toBe('campaign');
    expect(ops[2].entity).toBe('asset_group');
  });

  it('advertising_channel_type is PERFORMANCE_MAX', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    const campaignResource = ops[1].resource as { advertising_channel_type: string };
    expect(campaignResource.advertising_channel_type).toBe('PERFORMANCE_MAX');
  });

  it('all 3 entities use temp resource_names -1/-2/-3', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    expect((ops[0].resource as { resource_name: string }).resource_name).toBe(
      'customers/5562216599/campaignBudgets/-1',
    );
    expect((ops[1].resource as { resource_name: string }).resource_name).toBe(
      'customers/5562216599/campaigns/-2',
    );
    expect((ops[2].resource as { resource_name: string }).resource_name).toBe(
      'customers/5562216599/assetGroups/-3',
    );
  });

  it('campaign references budget via temp resource_name', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    expect((ops[1].resource as { campaign_budget: string }).campaign_budget).toBe(
      'customers/5562216599/campaignBudgets/-1',
    );
  });

  it('asset_group references campaign via temp resource_name', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    expect((ops[2].resource as { campaign: string }).campaign).toBe(
      'customers/5562216599/campaigns/-2',
    );
  });

  it('asset_group.final_urls contains the provided URL', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    expect((ops[2].resource as { final_urls: string[] }).final_urls).toEqual([
      'https://example.com',
    ]);
  });

  it('campaign + asset_group status both PAUSED', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    expect((ops[1].resource as { status: string }).status).toBe('PAUSED');
    expect((ops[2].resource as { status: string }).status).toBe('PAUSED');
  });

  it('with target_roas embeds inside maximize_conversion_value', () => {
    const ops = buildPmaxCampaignOperations({
      ...baseInput,
      bidding: 'target_roas',
      targetRoas: 3.0,
    });
    const campaignResource = ops[1].resource as {
      maximize_conversion_value: { target_roas: number };
    };
    expect(campaignResource.maximize_conversion_value).toEqual({ target_roas: 3.0 });
  });

  it('end_date present only when provided', () => {
    const opsWithout = buildPmaxCampaignOperations(baseInput);
    const opsWith = buildPmaxCampaignOperations({ ...baseInput, endDateYYYYMMDD: '20261231' });
    expect((opsWithout[1].resource as Record<string, unknown>).end_date).toBeUndefined();
    expect((opsWith[1].resource as { end_date: string }).end_date).toBe('20261231');
  });

  it('inherits EU compliance from 6.3a/b', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    expect(
      (ops[1].resource as { contains_eu_political_advertising: string })
        .contains_eu_political_advertising,
    ).toBe('DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING');
  });

  it('AssetGroup name follows pattern "{campaign} - Asset Group 1"', () => {
    const ops = buildPmaxCampaignOperations(baseInput);
    expect((ops[2].resource as { name: string }).name).toBe('My PMax Campaign - Asset Group 1');
  });
});
