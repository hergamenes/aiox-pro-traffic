import { describe, it, expect } from 'vitest';
import { AppCampaignStrategy } from '../../../../src/campaign/strategies/app.strategy.js';

describe('AppCampaignStrategy', () => {
  const strategy = new AppCampaignStrategy();

  it('should use OUTCOME_APP_PROMOTION objective', () => {
    expect(strategy.getCampaignParams()['objective']).toBe('OUTCOME_APP_PROMOTION');
  });

  describe('getAdSetParams', () => {
    const options = {
      campaignId: 'c1',
      dailyBudget: 60,
      pixelId: null,
      applicationId: 'app_123',
      objectStoreUrl: 'https://play.google.com/store/apps/details?id=com.x',
    };

    it('should optimize for APP_INSTALLS', () => {
      expect(strategy.getAdSetParams(options)['optimization_goal']).toBe('APP_INSTALLS');
    });

    it('should set promoted_object with application_id and object_store_url', () => {
      expect(strategy.getAdSetParams(options)['promoted_object']).toEqual({
        application_id: 'app_123',
        object_store_url: 'https://play.google.com/store/apps/details?id=com.x',
      });
    });

    it('should NOT set promoted_object when app data is missing', () => {
      const params = strategy.getAdSetParams({ ...options, applicationId: null });
      expect(params['promoted_object']).toBeUndefined();
    });
  });

  describe('getAdParams', () => {
    const options = {
      adSetId: 'a1',
      pageId: 'page_1',
      instagramAccountId: null,
      imageHash: 'h1',
      videoId: null,
      headline: 'Baixe o app',
      primaryText: 'Grátis',
      description: 'Disponível agora',
      callToAction: 'INSTALL_MOBILE_APP',
      websiteUrl: '',
      name: 'AD',
      objectStoreUrl: 'https://apps.apple.com/app/id123',
    };

    it('should use store url as link with INSTALL_MOBILE_APP cta', () => {
      const creative = strategy.getAdParams(options)['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;
      expect(linkData['link']).toBe('https://apps.apple.com/app/id123');
      const cta = linkData['call_to_action'] as Record<string, unknown>;
      expect(cta['type']).toBe('INSTALL_MOBILE_APP');
    });
  });
});
