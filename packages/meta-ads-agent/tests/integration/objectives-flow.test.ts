import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
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
  leadFormHandlers,
  campaignApiErrorHandler,
} from '../helpers/msw-handlers.js';
import { createCampaign } from '../../src/campaign/orchestrator.js';
import type { CampaignConfig } from '../../src/types/campaign.js';
import type { CreativeBundle } from '../../src/types/creative.js';

const BASE_URL = 'https://graph.facebook.com/v21.0';
const server = setupServer(...leadFormHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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

function baseConfig(overrides: Partial<CampaignConfig>): CampaignConfig {
  return {
    type: 'sales',
    name: 'Test',
    dailyBudget: 30,
    adText: { headline: 'H', primaryText: 'P', description: 'D', callToAction: 'LEARN_MORE' },
    pageId: 'page_123',
    instagramAccountId: null,
    adAccountId: '789012',
    websiteUrl: null,
    landingPageUrl: null,
    pixelId: null,
    ...overrides,
  };
}

describe('Objectives Flow Integration (MSW)', () => {
  it('should complete awareness campaign flow', async () => {
    const result = await createCampaign(
      baseConfig({ type: 'awareness', name: 'Aware', websiteUrl: 'https://x.com' }),
      bundle,
    );
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('awareness');
  });

  it('should complete traffic campaign flow', async () => {
    const result = await createCampaign(
      baseConfig({ type: 'traffic', name: 'Traf', websiteUrl: 'https://x.com' }),
      bundle,
    );
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('traffic');
  });

  it('should complete engagement campaign flow', async () => {
    const result = await createCampaign(
      baseConfig({ type: 'engagement', name: 'Eng', websiteUrl: 'https://x.com' }),
      bundle,
    );
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('engagement');
  });

  it('should complete whatsapp (CTWA) campaign flow', async () => {
    const result = await createCampaign(
      baseConfig({ type: 'whatsapp', name: 'Wpp', whatsappNumber: '5511999998888' }),
      bundle,
    );
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('whatsapp');
  });

  it('should complete app promotion campaign flow', async () => {
    const result = await createCampaign(
      baseConfig({
        type: 'app',
        name: 'App',
        applicationId: 'app_123',
        objectStoreUrl: 'https://play.google.com/store/apps/details?id=com.x',
      }),
      bundle,
    );
    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('app');
  });

  it('should complete leadform flow and send questions as JSON string (fix #2)', async () => {
    let capturedBody: Record<string, unknown> | null = null;
    server.use(
      http.post(`${BASE_URL}/:pageId/leadgen_forms`, async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ id: 'form_abc' });
      }),
    );

    const result = await createCampaign(
      baseConfig({ type: 'leadform', name: 'LF', leadFormPrivacyUrl: 'https://x.com/privacy' }),
      bundle,
    );

    expect(result.status).toBe('ACTIVE');
    expect(result.type).toBe('leadform');
    expect(capturedBody).not.toBeNull();
    // A Graph API exige questions/privacy_policy como STRING JSON-encoded.
    expect(typeof capturedBody!['questions']).toBe('string');
    expect(typeof capturedBody!['privacy_policy']).toBe('string');
    expect(JSON.parse(capturedBody!['questions'] as string)).toEqual([
      { type: 'FULL_NAME' },
      { type: 'EMAIL' },
      { type: 'PHONE' },
    ]);
  });

  it('should inject publisher_platforms when platform=instagram', async () => {
    let adSetBody: Record<string, unknown> | null = null;
    server.use(
      http.post(`${BASE_URL}/act_:adAccountId/adsets`, async ({ request }) => {
        adSetBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ id: 'adset_ig' });
      }),
    );

    await createCampaign(
      baseConfig({ type: 'traffic', name: 'IG', websiteUrl: 'https://x.com', platform: 'instagram' }),
      bundle,
    );

    const targeting = adSetBody!['targeting'] as Record<string, unknown>;
    expect(targeting['publisher_platforms']).toEqual(['instagram']);
  });

  it('should NOT inject publisher_platforms when platform is omitted', async () => {
    let adSetBody: Record<string, unknown> | null = null;
    server.use(
      http.post(`${BASE_URL}/act_:adAccountId/adsets`, async ({ request }) => {
        adSetBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ id: 'adset_auto' });
      }),
    );

    await createCampaign(
      baseConfig({ type: 'traffic', name: 'Auto', websiteUrl: 'https://x.com' }),
      bundle,
    );

    const targeting = adSetBody!['targeting'] as Record<string, unknown>;
    expect(targeting['publisher_platforms']).toBeUndefined();
  });

  it('should rollback (delete) the created lead form when ad creation fails (fix #4)', async () => {
    const deletedIds: string[] = [];
    server.use(
      http.post(`${BASE_URL}/:pageId/leadgen_forms`, () =>
        HttpResponse.json({ id: 'form_rollback' }),
      ),
      campaignApiErrorHandler('ads', 100, 'Invalid parameter'),
      http.delete(`${BASE_URL}/:resourceId`, ({ params }) => {
        deletedIds.push(params.resourceId as string);
        return HttpResponse.json({ success: true });
      }),
    );

    await expect(
      createCampaign(
        baseConfig({ type: 'leadform', name: 'LFRollback', leadFormPrivacyUrl: 'https://x.com/privacy' }),
        bundle,
      ),
    ).rejects.toThrow('Parâmetro inválido');

    expect(deletedIds).toContain('form_rollback');
  });

  it('should NOT delete a pre-existing leadFormId on rollback', async () => {
    const deletedIds: string[] = [];
    server.use(
      campaignApiErrorHandler('ads', 100, 'Invalid parameter'),
      http.delete(`${BASE_URL}/:resourceId`, ({ params }) => {
        deletedIds.push(params.resourceId as string);
        return HttpResponse.json({ success: true });
      }),
    );

    await expect(
      createCampaign(
        baseConfig({ type: 'leadform', name: 'LFExisting', leadFormId: 'form_preexisting' }),
        bundle,
      ),
    ).rejects.toThrow('Parâmetro inválido');

    expect(deletedIds).not.toContain('form_preexisting');
  });
});
