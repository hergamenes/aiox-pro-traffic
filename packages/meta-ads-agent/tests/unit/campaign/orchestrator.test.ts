import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('keytar', () => ({
  default: {
    setPassword: vi.fn().mockResolvedValue(undefined),
    getPassword: vi.fn().mockResolvedValue('mock-token'),
    deletePassword: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('facebook-nodejs-business-sdk', () => ({
  default: { FacebookAdsApi: { init: vi.fn() } },
  FacebookAdsApi: { init: vi.fn() },
}));

vi.mock('../../../src/meta-api/uploader.js', () => ({
  uploadBundle: vi.fn(),
}));

vi.mock('../../../src/meta-api/adapter.js', () => ({
  createCampaign: vi.fn(),
  createAdSet: vi.fn(),
  createAd: vi.fn(),
  updateCampaignStatus: vi.fn(),
  deleteCampaign: vi.fn(),
  deleteAdSet: vi.fn(),
  deleteAd: vi.fn(),
}));

import { createCampaign } from '../../../src/campaign/orchestrator.js';
import { uploadBundle } from '../../../src/meta-api/uploader.js';
import * as adapter from '../../../src/meta-api/adapter.js';
import type { CampaignConfig } from '../../../src/types/campaign.js';
import type { CreativeBundle } from '../../../src/types/creative.js';

const mockUploadBundle = vi.mocked(uploadBundle);
const mockCreateCampaign = vi.mocked(adapter.createCampaign);
const mockCreateAdSet = vi.mocked(adapter.createAdSet);
const mockCreateAd = vi.mocked(adapter.createAd);
const mockUpdateStatus = vi.mocked(adapter.updateCampaignStatus);
const mockDeleteCampaign = vi.mocked(adapter.deleteCampaign);
const mockDeleteAdSet = vi.mocked(adapter.deleteAdSet);
const mockDeleteAd = vi.mocked(adapter.deleteAd);

describe('Campaign Orchestrator', () => {
  const config: CampaignConfig = {
    type: 'sales',
    name: 'BlackFriday',
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
        filePath: '/tmp/image.jpg',
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

  beforeEach(() => {
    vi.clearAllMocks();

    const uploadedBundle = {
      ...bundle,
      uploadedIds: new Map([['/tmp/image.jpg', 'hash_abc']]),
    };
    mockUploadBundle.mockResolvedValue(uploadedBundle);
    mockCreateCampaign.mockResolvedValue('camp_001');
    mockCreateAdSet.mockResolvedValue('adset_001');
    mockCreateAd.mockResolvedValue('ad_001');
    mockUpdateStatus.mockResolvedValue(undefined);
    mockDeleteCampaign.mockResolvedValue(undefined);
    mockDeleteAdSet.mockResolvedValue(undefined);
    mockDeleteAd.mockResolvedValue(undefined);
  });

  it('should execute full pipeline in correct order', async () => {
    const callOrder: string[] = [];
    mockUploadBundle.mockImplementation(async () => {
      callOrder.push('upload');
      return { ...bundle, uploadedIds: new Map([['/tmp/image.jpg', 'hash_abc']]) };
    });
    mockCreateCampaign.mockImplementation(async () => {
      callOrder.push('createCampaign');
      return 'camp_001';
    });
    mockCreateAdSet.mockImplementation(async () => {
      callOrder.push('createAdSet');
      return 'adset_001';
    });
    mockCreateAd.mockImplementation(async () => {
      callOrder.push('createAd');
      return 'ad_001';
    });
    mockUpdateStatus.mockImplementation(async () => {
      callOrder.push('activate');
    });

    await createCampaign(config, bundle);

    expect(callOrder).toEqual(['upload', 'createCampaign', 'createAdSet', 'createAd', 'activate']);
  });

  it('should return CampaignResult with all fields', async () => {
    const result = await createCampaign(config, bundle);

    expect(result.campaignId).toBe('camp_001');
    expect(result.adSetId).toBe('adset_001');
    expect(result.adId).toBe('ad_001');
    expect(result.type).toBe('sales');
    expect(result.dailyBudget).toBe(50);
    expect(result.status).toBe('ACTIVE');
    expect(result.creativeFormat).toBe('single_image');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.campaignName).toContain('PPT_VENDAS_COMPRA_');
  });

  it('should build correct adsManagerUrl', async () => {
    const result = await createCampaign(config, bundle);

    expect(result.adsManagerUrl).toBe(
      'https://www.facebook.com/adsmanager/manage/campaigns?act=789012&campaign_ids=camp_001',
    );
  });

  it('should rollback campaign on adSet creation failure', async () => {
    mockCreateAdSet.mockRejectedValue(new Error('AdSet failed'));

    await expect(createCampaign(config, bundle)).rejects.toThrow('AdSet failed');
    expect(mockDeleteCampaign).toHaveBeenCalledWith('camp_001');
    expect(mockDeleteAdSet).not.toHaveBeenCalled();
    expect(mockDeleteAd).not.toHaveBeenCalled();
  });

  it('should rollback adSet + campaign on ad creation failure', async () => {
    mockCreateAd.mockRejectedValue(new Error('Ad failed'));

    await expect(createCampaign(config, bundle)).rejects.toThrow('Ad failed');
    expect(mockDeleteAdSet).toHaveBeenCalledWith('adset_001');
    expect(mockDeleteCampaign).toHaveBeenCalledWith('camp_001');
    expect(mockDeleteAd).not.toHaveBeenCalled();
  });

  it('should rollback all on activation failure', async () => {
    mockUpdateStatus.mockRejectedValue(new Error('Activate failed'));

    await expect(createCampaign(config, bundle)).rejects.toThrow('Activate failed');
    expect(mockDeleteAd).toHaveBeenCalledWith('ad_001');
    expect(mockDeleteAdSet).toHaveBeenCalledWith('adset_001');
    expect(mockDeleteCampaign).toHaveBeenCalledWith('camp_001');
  });

  it('should reject invalid config', async () => {
    const invalidConfig = { ...config, name: '', dailyBudget: -1 };

    await expect(createCampaign(invalidConfig, bundle)).rejects.toThrow('Configuração inválida');
  });
});
