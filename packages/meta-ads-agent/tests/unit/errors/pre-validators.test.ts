import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('../../../src/auth/token-manager.js', () => ({
  getAccessToken: vi.fn().mockResolvedValue('valid-token-123'),
}));

import { validatePreConditions } from '../../../src/errors/pre-validators.js';
import { ValidationError } from '../../../src/errors/types.js';
import type { CampaignConfig } from '../../../src/types/campaign.js';
import type { CreativeBundle } from '../../../src/types/creative.js';

function makeConfig(overrides: Partial<CampaignConfig> = {}): CampaignConfig {
  return {
    type: 'sales',
    name: 'Test Campaign',
    dailyBudget: 10,
    adText: {
      headline: 'Test',
      primaryText: 'Test text',
      description: 'Test desc',
      callToAction: 'SHOP_NOW',
    },
    pageId: '123456',
    instagramAccountId: null,
    adAccountId: 'act_123',
    websiteUrl: 'https://example.com',
    landingPageUrl: null,
    pixelId: null,
    ...overrides,
  };
}

function makeBundle(assetCount = 1): CreativeBundle {
  const assets = Array.from({ length: assetCount }, (_, i) => ({
    filePath: `/path/image${i}.jpg`,
    fileName: `image${i}.jpg`,
    type: 'image' as const,
    mimeType: 'image/jpeg',
    sizeBytes: 1024,
    width: 1080,
    height: 1080,
  }));

  return {
    format: 'single_image',
    assets,
    uploadedIds: new Map(),
  };
}

describe('pre-validators', () => {
  describe('validatePreConditions', () => {
    it('should pass when all preconditions are met', async () => {
      const config = makeConfig();
      const bundle = makeBundle();
      await expect(validatePreConditions(config, bundle)).resolves.toBeUndefined();
    });

    it('should throw ValidationError when adAccountId is missing', async () => {
      const config = makeConfig({ adAccountId: '' });
      const bundle = makeBundle();
      await expect(validatePreConditions(config, bundle)).rejects.toThrow(ValidationError);
      await expect(validatePreConditions(config, bundle)).rejects.toThrow('Conta de anúncios');
    });

    it('should throw ValidationError when pageId is missing', async () => {
      const config = makeConfig({ pageId: '' });
      const bundle = makeBundle();
      await expect(validatePreConditions(config, bundle)).rejects.toThrow(ValidationError);
      await expect(validatePreConditions(config, bundle)).rejects.toThrow('Página do Facebook');
    });

    it('should throw ValidationError when bundle has no assets', async () => {
      const config = makeConfig();
      const bundle = makeBundle(0);
      await expect(validatePreConditions(config, bundle)).rejects.toThrow(ValidationError);
      await expect(validatePreConditions(config, bundle)).rejects.toThrow('Nenhum criativo');
    });

    it('should throw ValidationError when dailyBudget is zero', async () => {
      const config = makeConfig({ dailyBudget: 0 });
      const bundle = makeBundle();
      await expect(validatePreConditions(config, bundle)).rejects.toThrow(ValidationError);
      await expect(validatePreConditions(config, bundle)).rejects.toThrow('Orçamento');
    });

    it('should throw ValidationError when dailyBudget is negative', async () => {
      const config = makeConfig({ dailyBudget: -5 });
      const bundle = makeBundle();
      await expect(validatePreConditions(config, bundle)).rejects.toThrow(ValidationError);
      await expect(validatePreConditions(config, bundle)).rejects.toThrow('Orçamento');
    });

    it('should throw ValidationError when dailyBudget is below the Meta minimum (R$6)', async () => {
      const config = makeConfig({ dailyBudget: 5 });
      const bundle = makeBundle();
      await expect(validatePreConditions(config, bundle)).rejects.toThrow(ValidationError);
      await expect(validatePreConditions(config, bundle)).rejects.toThrow('mínimo');
    });
  });
});
