import { describe, it, expect } from 'vitest';
import {
  buildSearchCampaignOperations,
  validateBiddingStrategy,
  parseStartDate,
  buildBiddingFields,
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
});
