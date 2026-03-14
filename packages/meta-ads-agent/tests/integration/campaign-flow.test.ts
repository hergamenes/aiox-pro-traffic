import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';

vi.mock('../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('keytar', () => ({
  default: {
    setPassword: vi.fn().mockResolvedValue(undefined),
    getPassword: vi.fn().mockResolvedValue('mock-access-token'),
    deletePassword: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('facebook-nodejs-business-sdk', () => ({
  default: { FacebookAdsApi: { init: vi.fn() } },
  FacebookAdsApi: { init: vi.fn() },
}));

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
  return {
    ...actual,
    readFile: vi.fn().mockResolvedValue(Buffer.from('mock-image-data')),
    stat: vi.fn().mockResolvedValue({ size: 2_000_000 }),
  };
});

import {
  campaignHandlers,
  campaignApiErrorHandler,
} from '../helpers/msw-handlers.js';
import { createCampaign } from '../../src/campaign/orchestrator.js';
import type { CampaignConfig } from '../../src/types/campaign.js';
import type { CreativeBundle } from '../../src/types/creative.js';

const server = setupServer(...campaignHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const config: CampaignConfig = {
  type: 'sales',
  name: 'IntegrationTest',
  dailyBudget: 50,
  adText: {
    headline: 'Oferta',
    primaryText: 'Compre agora',
    description: 'Desc',
    callToAction: 'SHOP_NOW',
  },
  pageId: 'page_123',
  instagramAccountId: 'ig_456',
  adAccountId: '789012',
  websiteUrl: 'https://example.com',
  landingPageUrl: null,
  pixelId: 'pixel_111',
};

const bundle: CreativeBundle = {
  format: 'single_image',
  assets: [
    {
      filePath: '/mock/image.jpg',
      fileName: 'image.jpg',
      type: 'image',
      mimeType: 'image/jpeg',
      width: 1080,
      height: 1080,
      fileSize: 100000,
      duration: null,
      isValid: true,
      validationErrors: [],
    },
  ],
  uploadedIds: new Map(),
};

describe('Campaign Flow Integration (MSW)', () => {
  it('should complete full sales campaign creation flow', async () => {
    const result = await createCampaign(config, bundle);

    expect(result.campaignId).toBeDefined();
    expect(result.adSetId).toBeDefined();
    expect(result.adId).toBeDefined();
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('sales');
    expect(result.campaignName).toBe('IntegrationTest');
    expect(result.adsManagerUrl).toContain('789012');
  });

  it('should return Portuguese error on campaign creation failure', async () => {
    server.use(
      campaignApiErrorHandler('campaigns', 2635, 'Daily budget too low'),
    );

    await expect(createCampaign(config, bundle)).rejects.toThrow(
      'Orçamento diário abaixo do mínimo',
    );
  });

  it('should rollback on ad set creation failure', async () => {
    server.use(
      campaignApiErrorHandler('adsets', 100, 'Invalid parameter'),
    );

    await expect(createCampaign(config, bundle)).rejects.toThrow(
      'Parâmetro inválido',
    );
    // Rollback should have been called (DELETE requests handled by deleteResourceHandler)
  });

  it('should complete full leads campaign creation flow', async () => {
    const leadsConfig: CampaignConfig = {
      type: 'leads',
      name: 'LeadsIntegration',
      dailyBudget: 30,
      adText: {
        headline: 'Cadastre-se',
        primaryText: 'Garanta sua vaga',
        description: 'Webinar gratuito',
        callToAction: 'LEARN_MORE',
      },
      pageId: 'page_123',
      instagramAccountId: 'ig_456',
      adAccountId: '789012',
      websiteUrl: null,
      landingPageUrl: 'https://minha-lp.com',
      pixelId: null,
    };

    const result = await createCampaign(leadsConfig, bundle);

    expect(result.campaignId).toBeDefined();
    expect(result.adSetId).toBeDefined();
    expect(result.adId).toBeDefined();
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('leads');
    expect(result.campaignName).toBe('LeadsIntegration');
    expect(result.adsManagerUrl).toContain('789012');
  });

  it('should create campaign with explicit pageId and instagramAccountId', async () => {
    const configWithPage: CampaignConfig = {
      type: 'sales',
      name: 'PageSelectionTest',
      dailyBudget: 40,
      adText: {
        headline: 'Oferta Especial',
        primaryText: 'Compre agora',
        description: 'Promoção',
        callToAction: 'SHOP_NOW',
      },
      pageId: 'page_explicit_999',
      instagramAccountId: 'ig_explicit_888',
      adAccountId: '789012',
      websiteUrl: 'https://example.com',
      landingPageUrl: null,
      pixelId: null,
    };

    const result = await createCampaign(configWithPage, bundle);

    expect(result.campaignId).toBeDefined();
    expect(result.adSetId).toBeDefined();
    expect(result.adId).toBeDefined();
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('sales');
  });

  it('should create leads campaign with null instagramAccountId', async () => {
    const leadsNoIg: CampaignConfig = {
      type: 'leads',
      name: 'LeadsNoInstagram',
      dailyBudget: 25,
      adText: {
        headline: 'Cadastre-se',
        primaryText: 'Webinar',
        description: 'Gratuito',
        callToAction: 'LEARN_MORE',
      },
      pageId: 'page_no_ig_777',
      instagramAccountId: null,
      adAccountId: '789012',
      websiteUrl: null,
      landingPageUrl: 'https://minha-lp.com',
      pixelId: null,
    };

    const result = await createCampaign(leadsNoIg, bundle);

    expect(result.campaignId).toBeDefined();
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('leads');
  });

  it('should complete up command flow with all params inline (sales)', async () => {
    const upConfig: CampaignConfig = {
      type: 'sales',
      name: 'UpCommandTest',
      dailyBudget: 60,
      adText: {
        headline: 'Promo Up',
        primaryText: 'Via meta-ads up',
        description: 'Teste integrado',
        callToAction: 'SHOP_NOW',
      },
      pageId: 'page_up_111',
      instagramAccountId: 'ig_up_222',
      adAccountId: '789012',
      websiteUrl: 'https://up-test.com',
      landingPageUrl: null,
      pixelId: null,
    };

    const result = await createCampaign(upConfig, bundle);

    expect(result.campaignId).toBeDefined();
    expect(result.adSetId).toBeDefined();
    expect(result.adId).toBeDefined();
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('sales');
    expect(result.campaignName).toBe('UpCommandTest');
  });

  it('should complete up command flow with leads type', async () => {
    const upLeadsConfig: CampaignConfig = {
      type: 'leads',
      name: 'UpLeadsTest',
      dailyBudget: 35,
      adText: {
        headline: 'Cadastro Up',
        primaryText: 'Via meta-ads up leads',
        description: 'Teste leads',
        callToAction: 'LEARN_MORE',
      },
      pageId: 'page_up_333',
      instagramAccountId: null,
      adAccountId: '789012',
      websiteUrl: null,
      landingPageUrl: 'https://up-leads.com',
      pixelId: null,
    };

    const result = await createCampaign(upLeadsConfig, bundle);

    expect(result.campaignId).toBeDefined();
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('leads');
    expect(result.campaignName).toBe('UpLeadsTest');
  });

  it('should return Portuguese error on leads campaign creation failure', async () => {
    server.use(
      campaignApiErrorHandler('campaigns', 2635, 'Daily budget too low'),
    );

    const leadsConfig: CampaignConfig = {
      type: 'leads',
      name: 'LeadsError',
      dailyBudget: 1,
      adText: {
        headline: 'Test',
        primaryText: 'Test',
        description: 'Test',
        callToAction: 'LEARN_MORE',
      },
      pageId: 'page_123',
      instagramAccountId: null,
      adAccountId: '789012',
      websiteUrl: null,
      landingPageUrl: 'https://minha-lp.com',
      pixelId: null,
    };

    await expect(createCampaign(leadsConfig, bundle)).rejects.toThrow(
      'Orçamento diário abaixo do mínimo',
    );
  });
});
