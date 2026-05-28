import { describe, it, expect } from 'vitest';
import { LeadFormCampaignStrategy } from '../../../../src/campaign/strategies/leadform.strategy.js';

describe('LeadFormCampaignStrategy', () => {
  const strategy = new LeadFormCampaignStrategy();

  it('should use OUTCOME_LEADS objective', () => {
    expect(strategy.getCampaignParams()['objective']).toBe('OUTCOME_LEADS');
  });

  describe('getAdSetParams', () => {
    const options = { campaignId: 'c1', dailyBudget: 40, pixelId: null, pageId: 'page_7' };

    it('should optimize for LEAD_GENERATION', () => {
      expect(strategy.getAdSetParams(options)['optimization_goal']).toBe('LEAD_GENERATION');
    });

    it('should set destination_type ON_AD', () => {
      expect(strategy.getAdSetParams(options)['destination_type']).toBe('ON_AD');
    });

    it('should set promoted_object with page_id', () => {
      expect(strategy.getAdSetParams(options)['promoted_object']).toEqual({ page_id: 'page_7' });
    });
  });

  describe('getAdParams', () => {
    const options = {
      adSetId: 'a1',
      pageId: 'page_7',
      instagramAccountId: null,
      imageHash: 'h1',
      videoId: null,
      headline: 'Cadastre-se',
      primaryText: 'Receba novidades',
      description: 'É rápido',
      callToAction: 'SIGN_UP',
      websiteUrl: '',
      name: 'AD',
      leadFormId: 'form_555',
    };

    it('should attach lead_gen_form_id via SIGN_UP cta', () => {
      const creative = strategy.getAdParams(options)['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;
      const cta = linkData['call_to_action'] as Record<string, unknown>;
      expect(cta['type']).toBe('SIGN_UP');
      expect((cta['value'] as Record<string, unknown>)['lead_gen_form_id']).toBe('form_555');
    });

    it('should use fallback link when websiteUrl is empty', () => {
      const creative = strategy.getAdParams(options)['creative'] as Record<string, unknown>;
      const spec = creative['object_story_spec'] as Record<string, unknown>;
      const linkData = spec['link_data'] as Record<string, unknown>;
      expect(linkData['link']).toBe('https://fb.com/');
    });
  });
});
