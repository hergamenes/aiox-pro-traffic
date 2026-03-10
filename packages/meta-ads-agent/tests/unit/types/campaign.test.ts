import { describe, it, expect } from 'vitest';
import { campaignConfigSchema, adTextSchema } from '../../../src/types/campaign.js';

describe('campaignConfigSchema', () => {
  const validConfig = {
    type: 'sales' as const,
    name: 'BlackFriday',
    dailyBudget: 50,
    adText: {
      headline: 'Oferta Imperdível',
      primaryText: 'Compre agora com desconto',
      description: 'Até 50% off',
      callToAction: 'SHOP_NOW',
    },
    pageId: '123456',
    instagramAccountId: null,
    adAccountId: '789012',
    websiteUrl: 'https://example.com',
    landingPageUrl: null,
    pixelId: null,
  };

  it('should validate a valid sales config', () => {
    const result = campaignConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it('should reject config with empty name', () => {
    const result = campaignConfigSchema.safeParse({ ...validConfig, name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject config with negative dailyBudget', () => {
    const result = campaignConfigSchema.safeParse({ ...validConfig, dailyBudget: -10 });
    expect(result.success).toBe(false);
  });

  it('should reject config with zero dailyBudget', () => {
    const result = campaignConfigSchema.safeParse({ ...validConfig, dailyBudget: 0 });
    expect(result.success).toBe(false);
  });

  it('should require websiteUrl for sales campaigns', () => {
    const result = campaignConfigSchema.safeParse({ ...validConfig, websiteUrl: null });
    expect(result.success).toBe(false);
  });

  it('should allow null websiteUrl for leads campaigns with landingPageUrl', () => {
    const leadsConfig = {
      ...validConfig,
      type: 'leads' as const,
      websiteUrl: null,
      landingPageUrl: 'https://minha-lp.com',
    };
    const result = campaignConfigSchema.safeParse(leadsConfig);
    expect(result.success).toBe(true);
  });

  it('should require landingPageUrl for leads campaigns', () => {
    const leadsConfig = {
      ...validConfig,
      type: 'leads' as const,
      websiteUrl: null,
      landingPageUrl: null,
    };
    const result = campaignConfigSchema.safeParse(leadsConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      expect(messages).toContain('URL da landing page é obrigatória para campanhas de leads');
    }
  });

  it('should allow null landingPageUrl for sales campaigns', () => {
    const result = campaignConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
    expect(validConfig.landingPageUrl).toBeNull();
  });

  it('should reject invalid websiteUrl', () => {
    const result = campaignConfigSchema.safeParse({ ...validConfig, websiteUrl: 'not-a-url' });
    expect(result.success).toBe(false);
  });
});

describe('adTextSchema', () => {
  it('should validate valid ad text', () => {
    const result = adTextSchema.safeParse({
      headline: 'Title',
      primaryText: 'Body',
      description: 'Desc',
      callToAction: 'SHOP_NOW',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty headline', () => {
    const result = adTextSchema.safeParse({
      headline: '',
      primaryText: 'Body',
      description: 'Desc',
      callToAction: 'SHOP_NOW',
    });
    expect(result.success).toBe(false);
  });
});
