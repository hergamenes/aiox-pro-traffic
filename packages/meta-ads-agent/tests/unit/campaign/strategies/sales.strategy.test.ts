import { describe, it, expect } from 'vitest';
import { SalesCampaignStrategy } from '../../../../src/campaign/strategies/sales.strategy.js';

describe('SalesCampaignStrategy', () => {
  const strategy = new SalesCampaignStrategy();

  describe('getCampaignParams', () => {
    it('should return OUTCOME_SALES objective', () => {
      const params = strategy.getCampaignParams();
      expect(params['objective']).toBe('OUTCOME_SALES');
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
      dailyBudget: 50,
      pixelId: 'pixel_456',
    };

    it('should return OFFSITE_CONVERSIONS optimization goal', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['optimization_goal']).toBe('OFFSITE_CONVERSIONS');
    });

    it('should convert dailyBudget to centavos (multiply by 100)', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['daily_budget']).toBe(5000);
    });

    it('should set billing_event to IMPRESSIONS', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['billing_event']).toBe('IMPRESSIONS');
    });

    it('should return WEBSITE destination type', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['destination_type']).toBe('WEBSITE');
    });

    it('should include promoted_object with pixel_id and PURCHASE event', () => {
      const params = strategy.getAdSetParams(options);
      expect(params['promoted_object']).toEqual({
        pixel_id: 'pixel_456',
        custom_event_type: 'PURCHASE',
      });
    });

    it('should not include promoted_object when pixelId is null', () => {
      const params = strategy.getAdSetParams({ ...options, pixelId: null });
      expect(params['promoted_object']).toBeUndefined();
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
  });

  describe('getAdParams', () => {
    const options = {
      adSetId: 'adset_789',
      pageId: 'page_111',
      instagramAccountId: 'ig_222',
      imageHash: 'hash_abc',
      videoId: null,
      headline: 'Oferta',
      primaryText: 'Compre agora',
      description: 'Desc',
      callToAction: 'SHOP_NOW',
      websiteUrl: 'https://example.com',
      name: 'PPT_VENDAS_COMPRA_09-03-26_Test_AD',
    };

    it('should build correct object_story_spec with image_hash', () => {
      const params = strategy.getAdParams(options);
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;

      expect(linkData['image_hash']).toBe('hash_abc');
      expect(linkData['link']).toBe('https://example.com');
      expect(linkData['message']).toBe('Compre agora');
      expect(linkData['name']).toBe('Oferta');
      expect(linkData['description']).toBe('Desc');
    });

    it('should use video_data with video_id when imageHash is null', () => {
      const videoOptions = { ...options, imageHash: null, videoId: 'vid_123' };
      const params = strategy.getAdParams(videoOptions);
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const videoData = spec['video_data'] as Record<string, unknown>;

      expect(videoData['video_id']).toBe('vid_123');
      expect(spec['link_data']).toBeUndefined();
    });

    it('should include instagram_user_id when provided', () => {
      const params = strategy.getAdParams(options);
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;

      expect(spec['instagram_user_id']).toBe('ig_222');
    });

    it('should not include instagram_user_id when null', () => {
      const params = strategy.getAdParams({ ...options, instagramAccountId: null });
      const creative = params['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;

      expect(spec['instagram_user_id']).toBeUndefined();
    });

    it('should set adset_id correctly', () => {
      const params = strategy.getAdParams(options);
      expect(params['adset_id']).toBe('adset_789');
    });
  });
});
