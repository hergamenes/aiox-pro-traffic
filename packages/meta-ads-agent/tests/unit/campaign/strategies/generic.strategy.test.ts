import { describe, it, expect } from 'vitest';
import { GenericCampaignStrategy } from '../../../../src/campaign/strategies/generic.strategy.js';
import { OBJECTIVE_SPECS } from '../../../../src/campaign/objectives.js';

const adSetOptions = {
  campaignId: 'camp_123',
  dailyBudget: 50,
  pixelId: null,
};

describe('GenericCampaignStrategy', () => {
  describe('awareness', () => {
    const strategy = new GenericCampaignStrategy('awareness');

    it('should return OUTCOME_AWARENESS objective', () => {
      expect(strategy.getCampaignParams()['objective']).toBe('OUTCOME_AWARENESS');
    });

    it('should start campaign as PAUSED', () => {
      expect(strategy.getCampaignParams()['status']).toBe('PAUSED');
    });

    it('should optimize for REACH', () => {
      expect(strategy.getAdSetParams(adSetOptions)['optimization_goal']).toBe('REACH');
    });

    it('should NOT set destination_type (no spec)', () => {
      expect(strategy.getAdSetParams(adSetOptions)['destination_type']).toBeUndefined();
    });
  });

  describe('traffic', () => {
    const strategy = new GenericCampaignStrategy('traffic');

    it('should return OUTCOME_TRAFFIC objective', () => {
      expect(strategy.getCampaignParams()['objective']).toBe('OUTCOME_TRAFFIC');
    });

    it('should optimize for LANDING_PAGE_VIEWS', () => {
      expect(strategy.getAdSetParams(adSetOptions)['optimization_goal']).toBe('LANDING_PAGE_VIEWS');
    });

    it('should set destination_type WEBSITE', () => {
      expect(strategy.getAdSetParams(adSetOptions)['destination_type']).toBe('WEBSITE');
    });
  });

  describe('engagement', () => {
    const strategy = new GenericCampaignStrategy('engagement');

    it('should return OUTCOME_ENGAGEMENT objective', () => {
      expect(strategy.getCampaignParams()['objective']).toBe('OUTCOME_ENGAGEMENT');
    });

    it('should optimize for POST_ENGAGEMENT', () => {
      expect(strategy.getAdSetParams(adSetOptions)['optimization_goal']).toBe('POST_ENGAGEMENT');
    });
  });

  describe('shared ad set behavior', () => {
    const strategy = new GenericCampaignStrategy('traffic');

    it('should convert dailyBudget to centavos when no CBO', () => {
      const params = strategy.getAdSetParams(adSetOptions);
      expect(params['daily_budget']).toBe(5000);
      expect(params['bid_strategy']).toBe('LOWEST_COST_WITHOUT_CAP');
    });

    it('should NOT set ad set budget when CBO is enabled', () => {
      const params = strategy.getAdSetParams({ ...adSetOptions, cboEnabled: true });
      expect(params['daily_budget']).toBeUndefined();
    });

    it('should set billing_event to IMPRESSIONS', () => {
      expect(strategy.getAdSetParams(adSetOptions)['billing_event']).toBe('IMPRESSIONS');
    });

    it('should target Brazil by default', () => {
      const targeting = strategy.getAdSetParams(adSetOptions)['targeting'] as Record<string, unknown>;
      const geo = targeting['geo_locations'] as Record<string, unknown>;
      expect(geo['countries']).toEqual(['BR']);
    });

    it('should apply age_min when provided', () => {
      const targeting = strategy.getAdSetParams({ ...adSetOptions, ageMin: 25 })['targeting'] as Record<string, unknown>;
      expect(targeting['age_min']).toBe(25);
    });
  });

  describe('getAdParams (shared from base)', () => {
    const strategy = new GenericCampaignStrategy('traffic');
    const adOptions = {
      adSetId: 'adset_789',
      pageId: 'page_111',
      instagramAccountId: 'ig_222',
      imageHash: 'hash_abc',
      videoId: null,
      headline: 'Conheça',
      primaryText: 'Visite o site',
      description: 'Desc',
      callToAction: 'LEARN_MORE',
      websiteUrl: 'https://example.com',
      name: 'PPT_TRAFEGO_LP_28-05-26_Test_AD',
    };

    it('should build link_data with image_hash and link', () => {
      const creative = strategy.getAdParams(adOptions)['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;
      expect(linkData['image_hash']).toBe('hash_abc');
      expect(linkData['link']).toBe('https://example.com');
    });

    it('should include instagram_user_id when provided', () => {
      const creative = strategy.getAdParams(adOptions)['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      expect(spec['instagram_user_id']).toBe('ig_222');
    });
  });
});

describe('OBJECTIVE_SPECS registry', () => {
  it('should define all supported types', () => {
    expect(Object.keys(OBJECTIVE_SPECS).sort()).toEqual(
      ['app', 'awareness', 'engagement', 'leadform', 'leads', 'sales', 'traffic', 'whatsapp'],
    );
  });

  it('should map each type to a valid ODAX objective', () => {
    expect(OBJECTIVE_SPECS.sales.objective).toBe('OUTCOME_SALES');
    expect(OBJECTIVE_SPECS.leads.objective).toBe('OUTCOME_LEADS');
    expect(OBJECTIVE_SPECS.awareness.objective).toBe('OUTCOME_AWARENESS');
    expect(OBJECTIVE_SPECS.traffic.objective).toBe('OUTCOME_TRAFFIC');
    expect(OBJECTIVE_SPECS.engagement.objective).toBe('OUTCOME_ENGAGEMENT');
  });
});
