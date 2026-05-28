import { describe, it, expect } from 'vitest';
import { WhatsappCampaignStrategy } from '../../../../src/campaign/strategies/whatsapp.strategy.js';

describe('WhatsappCampaignStrategy', () => {
  const strategy = new WhatsappCampaignStrategy();

  describe('getCampaignParams', () => {
    it('should use OUTCOME_ENGAGEMENT objective', () => {
      expect(strategy.getCampaignParams()['objective']).toBe('OUTCOME_ENGAGEMENT');
    });

    it('should start PAUSED', () => {
      expect(strategy.getCampaignParams()['status']).toBe('PAUSED');
    });
  });

  describe('getAdSetParams', () => {
    const options = {
      campaignId: 'camp_123',
      dailyBudget: 30,
      pixelId: null,
      pageId: 'page_999',
    };

    it('should optimize for CONVERSATIONS', () => {
      expect(strategy.getAdSetParams(options)['optimization_goal']).toBe('CONVERSATIONS');
    });

    it('should set destination_type WHATSAPP', () => {
      expect(strategy.getAdSetParams(options)['destination_type']).toBe('WHATSAPP');
    });

    it('should set promoted_object with page_id', () => {
      expect(strategy.getAdSetParams(options)['promoted_object']).toEqual({ page_id: 'page_999' });
    });

    it('should NOT set promoted_object when pageId is missing', () => {
      expect(strategy.getAdSetParams({ ...options, pageId: undefined })['promoted_object']).toBeUndefined();
    });

    it('should convert budget to centavos when no CBO', () => {
      expect(strategy.getAdSetParams(options)['daily_budget']).toBe(3000);
    });
  });

  describe('getAdParams', () => {
    const options = {
      adSetId: 'adset_1',
      pageId: 'page_999',
      instagramAccountId: null,
      imageHash: 'hash_x',
      videoId: null,
      headline: 'Fale conosco',
      primaryText: 'Tire suas dúvidas',
      description: 'Atendimento rápido',
      callToAction: 'WHATSAPP_MESSAGE',
      websiteUrl: '',
      name: 'PPT_WHATSAPP_CONVERSA_28-05-26_Test_AD',
      whatsappNumber: '5511999998888',
    };

    it('should build link from whatsapp number', () => {
      const creative = strategy.getAdParams(options)['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;
      expect(linkData['link']).toBe('https://api.whatsapp.com/send?phone=5511999998888');
    });

    it('should use WHATSAPP_MESSAGE call to action with app_destination', () => {
      const creative = strategy.getAdParams(options)['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;
      const cta = linkData['call_to_action'] as Record<string, unknown>;
      expect(cta['type']).toBe('WHATSAPP_MESSAGE');
      expect((cta['value'] as Record<string, unknown>)['app_destination']).toBe('WHATSAPP');
    });

    it('should keep page_id in object_story_spec', () => {
      const creative = strategy.getAdParams(options)['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      expect(spec['page_id']).toBe('page_999');
    });
  });
});
