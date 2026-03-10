import { logger } from '../cli/logger.js';
import { campaignConfigSchema } from '../types/campaign.js';
import type { CampaignConfig, CampaignResult } from '../types/campaign.js';
import type { CreativeBundle } from '../types/creative.js';
import { uploadBundle } from '../meta-api/uploader.js';
import * as adapter from '../meta-api/adapter.js';
import { generateCampaignName } from './naming.js';
import { SalesCampaignStrategy } from './strategies/sales.strategy.js';
import { LeadsCampaignStrategy } from './strategies/leads.strategy.js';
import type { CampaignStrategy } from './strategies/campaign-strategy.js';
import { ValidationError } from '../errors/types.js';
import { logCampaign } from '../log/log-repository.js';

function getStrategy(type: string): CampaignStrategy {
  switch (type) {
    case 'sales':
      return new SalesCampaignStrategy();
    case 'leads':
      return new LeadsCampaignStrategy();
    default:
      throw new ValidationError(`Tipo de campanha não suportado: ${type}`);
  }
}

function buildAdsManagerUrl(adAccountId: string, campaignId: string): string {
  return `https://www.facebook.com/adsmanager/manage/campaigns?act=${adAccountId}&campaign_ids=${campaignId}`;
}

export interface OrchestratorCallbacks {
  onProgress?: (step: string, pct: number) => void;
  onUploadProgress?: (asset: string, pct: number) => void;
}

export async function createCampaign(
  config: CampaignConfig,
  bundle: CreativeBundle,
  callbacks?: OrchestratorCallbacks,
): Promise<CampaignResult> {
  // Phase 1: Validate config
  callbacks?.onProgress?.('validate', 0);
  const parseResult = campaignConfigSchema.safeParse(config);
  if (!parseResult.success) {
    const errors = parseResult.error.errors.map((e) => e.message).join('; ');
    throw new ValidationError(`Configuração inválida: ${errors}`);
  }
  callbacks?.onProgress?.('validate', 100);

  const strategy = getStrategy(config.type);
  const campaignName = generateCampaignName(config.type, config.name);

  // Phase 2: Upload creatives
  callbacks?.onProgress?.('upload', 0);
  const uploadedBundle = await uploadBundle(config.adAccountId, bundle, (asset, pct) => {
    callbacks?.onUploadProgress?.(asset, pct);
  });
  callbacks?.onProgress?.('upload', 100);

  // Determine creative IDs
  const firstAsset = uploadedBundle.assets[0];
  const uploadedId = uploadedBundle.uploadedIds.get(firstAsset.filePath) ?? null;
  const imageHash = firstAsset.type === 'image' ? uploadedId : null;
  const videoId = firstAsset.type === 'video' ? uploadedId : null;

  let campaignId: string | null = null;
  let adSetId: string | null = null;
  let adId: string | null = null;

  try {
    // Phase 3: Create campaign
    callbacks?.onProgress?.('campaign', 0);
    const campaignParams = {
      ...strategy.getCampaignParams(),
      name: campaignName,
    };
    campaignId = await adapter.createCampaign(config.adAccountId, campaignParams);
    callbacks?.onProgress?.('campaign', 100);

    // Phase 4: Create ad set + ad
    callbacks?.onProgress?.('adset', 0);
    const adSetParams = {
      ...strategy.getAdSetParams({
        campaignId,
        dailyBudget: config.dailyBudget,
        pixelId: config.pixelId,
      }),
      name: `${campaignName}_ADSET`,
    };
    adSetId = await adapter.createAdSet(config.adAccountId, adSetParams);

    const adParams = strategy.getAdParams({
      adSetId,
      pageId: config.pageId,
      instagramAccountId: config.instagramAccountId,
      imageHash,
      videoId,
      headline: config.adText.headline,
      primaryText: config.adText.primaryText,
      description: config.adText.description,
      callToAction: config.adText.callToAction,
      websiteUrl: config.type === 'leads' ? (config.landingPageUrl ?? '') : (config.websiteUrl ?? ''),
      name: `${campaignName}_AD`,
    });
    adId = await adapter.createAd(config.adAccountId, adParams);
    callbacks?.onProgress?.('adset', 100);

    // Phase 5: Activate campaign
    callbacks?.onProgress?.('activate', 0);
    await adapter.updateCampaignStatus(campaignId, 'ACTIVE');
    callbacks?.onProgress?.('activate', 100);

    logger.info({ campaignId, campaignName }, 'Campaign created successfully');

    const result: CampaignResult = {
      campaignId,
      campaignName,
      adSetId,
      adId,
      type: config.type,
      dailyBudget: config.dailyBudget,
      status: 'ACTIVE',
      creativeFormat: uploadedBundle.format,
      adsManagerUrl: buildAdsManagerUrl(config.adAccountId, campaignId),
      createdAt: new Date(),
    };

    // Fire-and-forget campaign logging
    try {
      const creativeFiles = bundle.assets.map((a) => a.fileName);
      await logCampaign(result, creativeFiles, config.pageId);
    } catch (logError) {
      logger.warn({ err: logError }, 'Failed to log campaign to history');
    }

    return result;
  } catch (error) {
    // Rollback on failure
    logger.warn('Campaign creation failed, rolling back...');

    if (adId) {
      await adapter.deleteAd(adId);
    }
    if (adSetId) {
      await adapter.deleteAdSet(adSetId);
    }
    if (campaignId) {
      await adapter.deleteCampaign(campaignId);
    }

    throw error;
  }
}
