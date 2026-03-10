import { describe, it, expect } from 'vitest';
import { LeadsCampaignStrategy } from '../../../../src/campaign/strategies/leads.strategy.js';

describe('LeadsCampaignStrategy', () => {
  const strategy = new LeadsCampaignStrategy();

  describe('getCampaignParams', () => {
    it('should return OUTCOME_LEADS objective', () => {
      const params = strategy.getCampaignParams();
      expect(params['objective']).toBe('OUTCOME_LEADS');
    });

    it('should return empty special_ad_categories', () => {
      const params = strategy.getCampaignParams();
      expect(params['special_ad_categories']).toEqual([]);
    });

    it('should start campaign as PAUSED', () => {
      const params = strategy.getCampaignParams();
      expect(params['status']).toBe('PAUSED');
    });
  });

  describe('getAdSetParams', () => {
    const options = {
      campaignId: 'camp_123',
      dailyBudget: 30,
      pixelId: null,
    };

    it('should return LANDING_PAGE_VIEWS optimization goal', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['optimization_goal']).toBe('LANDING_PAGE_VIEWS');
    });

    it('should return WEBSITE destination type', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['destination_type']).toBe('WEBSITE');
    });

    it('should convert dailyBudget to centavos (multiply by 100)', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['daily_budget']).toBe(3000);
    });

    it('should set billing_event to IMPRESSIONS', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['billing_event']).toBe('IMPRESSIONS');
    });

    it('should set campaign_id', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['campaign_id']).toBe('camp_123');
    });

    it('should target Brazil by default (Advantage+ audience)', () => {
      const params = strategy.getAdSetParams(options);
      const targeting = params['targeting'] as Record<string, unknown>;
      const geoLocations = targeting['geo_locations'] as Record<string, unknown>;
      expect(geoLocations['countries']).toEqual(['BR']);
    });

    it('should not include promoted_object', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['promoted_object']).toBeUndefined();
    });
  });

  describe('getAdParams', () => {
    const options = {
      adSetId: 'adset_789',
      pageId: 'page_111',
      instagramAccountId: 'ig_222',
      imageHash: 'hash_abc',
      videoId: null,
      headline: 'Cadastre-se',
      primaryText: 'Garanta sua vaga',
      description: 'Webinar gratuito',
      callToAction: 'LEARN_MORE',
      websiteUrl: 'https://minha-lp.com',
      name: 'PPT_LEADS_LP_10-03-26_Webinar_AD',
    };

    it('should build correct object_story_spec with link_data', () => {
      const params = strategy.getAdParams(options);
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;

      expect(linkData['link']).toBe('https://minha-lp.com');
      expect(linkData['message']).toBe('Garanta sua vaga');
      expect(linkData['name']).toBe('Cadastre-se');
      expect(linkData['description']).toBe('Webinar gratuito');
    });

    it('should use call_to_action type LEARN_MORE', () => {
      const params = strategy.getAdParams(options);
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;
      const cta = linkData['call_to_action'] as Record<string, unknown>;

      expect(cta['type']).toBe('LEARN_MORE');
    });

    it('should include image_hash when provided', () => {
      const params = strategy.getAdParams(options);
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;

      expect(linkData['image_hash']).toBe('hash_abc');
    });

    it('should use video_id when imageHash is null', () => {
      const videoOptions = { ...options, imageHash: null, videoId: 'vid_123' };
      const params = strategy.getAdParams(videoOptions);
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;

      expect(linkData['video_id']).toBe('vid_123');
      expect(linkData['image_hash']).toBeUndefined();
    });

    it('should include instagram_actor_id when provided', () => {
      const params = strategy.getAdParams(options);
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;

      expect(spec['instagram_actor_id']).toBe('ig_222');
    });

    it('should not include instagram_actor_id when null', () => {
      const params = strategy.getAdParams({ ...options, instagramAccountId: null });
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;

      expect(spec['instagram_actor_id']).toBeUndefined();
    });

    it('should set adset_id correctly', () => {
      const params = strategy.getAdParams(options);
      expect(params['adset_id']).toBe('adset_789');
    });

    it('should set ad name correctly', () => {
      const params = strategy.getAdParams(options);
      expect(params['name']).toBe('PPT_LEADS_LP_10-03-26_Webinar_AD');
    });
  });
});
