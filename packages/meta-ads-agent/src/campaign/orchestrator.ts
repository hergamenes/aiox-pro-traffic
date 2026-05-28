import { logger } from '../cli/logger.js';
import { campaignConfigSchema } from '../types/campaign.js';
import type { CampaignConfig, CampaignResult, CampaignType } from '../types/campaign.js';
import type { CreativeBundle } from '../types/creative.js';
import { uploadBundle } from '../meta-api/uploader.js';
import * as adapter from '../meta-api/adapter.js';
import { SalesCampaignStrategy } from './strategies/sales.strategy.js';
import { LeadsCampaignStrategy } from './strategies/leads.strategy.js';
import { GenericCampaignStrategy } from './strategies/generic.strategy.js';
import { WhatsappCampaignStrategy } from './strategies/whatsapp.strategy.js';
import { LeadFormCampaignStrategy } from './strategies/leadform.strategy.js';
import { AppCampaignStrategy } from './strategies/app.strategy.js';
import type { CampaignStrategy } from './strategies/campaign-strategy.js';
import { applyPlacements } from './placements.js';
import { ValidationError } from '../errors/types.js';
import { validatePreConditions } from '../errors/pre-validators.js';
import { logCampaign } from '../log/log-repository.js';

function getStrategy(type: string): CampaignStrategy {
  switch (type) {
    case 'sales':
      return new SalesCampaignStrategy();
    case 'leads':
      return new LeadsCampaignStrategy();
    case 'awareness':
    case 'traffic':
    case 'engagement':
      return new GenericCampaignStrategy(type as CampaignType);
    case 'whatsapp':
      return new WhatsappCampaignStrategy();
    case 'leadform':
      return new LeadFormCampaignStrategy();
    case 'app':
      return new AppCampaignStrategy();
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

/**
 * Create a campaign with local creative upload.
 */
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
  // Pré-condições reais antes de gastar qualquer upload: token válido, conta,
  // página, criativos presentes e orçamento. Falha cedo, com mensagem em pt-BR.
  await validatePreConditions(config, bundle);
  callbacks?.onProgress?.('validate', 100);

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
  const creativeFormat = uploadedBundle.format;
  const creativeFiles = bundle.assets.map((a) => a.fileName);

  return executeCampaignCreation(config, imageHash, videoId, creativeFormat, creativeFiles, callbacks);
}

/**
 * Create a campaign using a creative already in the Media Library (no upload needed).
 */
export async function createCampaignFromLibrary(
  config: CampaignConfig,
  callbacks?: OrchestratorCallbacks,
): Promise<CampaignResult> {
  // Phase 1: Validate config
  callbacks?.onProgress?.('validate', 0);
  const parseResult = campaignConfigSchema.safeParse(config);
  if (!parseResult.success) {
    const errors = parseResult.error.errors.map((e) => e.message).join('; ');
    throw new ValidationError(`Configuração inválida: ${errors}`);
  }

  if (!config.imageHash && !config.videoId) {
    throw new ValidationError('imageHash ou videoId é obrigatório para criação via biblioteca de mídia');
  }
  callbacks?.onProgress?.('validate', 100);

  // Skip upload phase
  callbacks?.onProgress?.('upload', 100);

  const imageHash = config.imageHash ?? null;
  const videoId = config.videoId ?? null;
  const creativeFormat = videoId ? 'video' : 'single_image';
  const creativeLabel = videoId ? `video:${videoId}` : `image:${imageHash}`;

  return executeCampaignCreation(config, imageHash, videoId, creativeFormat, [creativeLabel], callbacks);
}

async function executeCampaignCreation(
  config: CampaignConfig,
  imageHash: string | null,
  videoId: string | null,
  creativeFormat: string,
  creativeFiles: string[],
  callbacks?: OrchestratorCallbacks,
): Promise<CampaignResult> {
  const strategy = getStrategy(config.type);
  const campaignName = config.name;

  let campaignId: string | null = null;
  let adSetId: string | null = null;
  let adId: string | null = null;
  // Formulário de Lead Ads criado por nós (para rollback). Não inclui um
  // leadFormId pré-existente passado via config — esse não deve ser deletado.
  let createdLeadFormId: string | null = null;

  try {
    // Phase 3: Create campaign
    callbacks?.onProgress?.('campaign', 0);
    const campaignParams = {
      ...strategy.getCampaignParams({
        cboEnabled: config.cboEnabled,
        dailyBudget: config.dailyBudget,
      }),
      name: campaignName,
    };
    campaignId = await adapter.createCampaign(config.adAccountId, campaignParams);
    callbacks?.onProgress?.('campaign', 100);

    // Phase 4: Create ad set + ad
    callbacks?.onProgress?.('adset', 0);
    const adSetName = config.adSetName ?? `${campaignName}_ADSET`;
    const adSetParams: Record<string, unknown> = {
      ...strategy.getAdSetParams({
        campaignId,
        dailyBudget: config.dailyBudget,
        pixelId: config.pixelId,
        cboEnabled: config.cboEnabled,
        ageMin: config.ageMin,
        startTime: config.startTime,
        pageId: config.pageId,
        applicationId: config.applicationId,
        objectStoreUrl: config.objectStoreUrl,
      }),
      name: adSetName,
    };

    // Aplica restrição de placements (Instagram/Facebook) quando solicitado.
    const targeting = adSetParams['targeting'] as Record<string, unknown> | undefined;
    if (targeting) {
      applyPlacements(targeting, config.platform);
    }

    adSetId = await adapter.createAdSet(config.adAccountId, adSetParams);

    const adNameFinal = config.adName ?? `${campaignName}_AD`;

    // Lead Ads: cria o formulário nativo (se ainda não houver um) antes do ad.
    let leadFormId: string | null = config.leadFormId ?? null;
    if (config.type === 'leadform' && !leadFormId) {
      // A Graph API exige `questions` e `privacy_policy` como strings
      // JSON-encoded (mesmo em body JSON), não como objetos aninhados.
      leadFormId = await adapter.createLeadForm(config.pageId, {
        name: `${campaignName}_FORM`,
        locale: 'PT_BR',
        questions: JSON.stringify([
          { type: 'FULL_NAME' },
          { type: 'EMAIL' },
          { type: 'PHONE' },
        ]),
        privacy_policy: JSON.stringify({
          url: config.leadFormPrivacyUrl,
          link_text: 'Política de Privacidade',
        }),
      });
      createdLeadFormId = leadFormId;
    }

    // Fetch video thumbnail if needed
    let videoThumbnailUrl: string | null = null;
    if (videoId) {
      videoThumbnailUrl = await adapter.getVideoThumbnailUrl(videoId);
    }

    const adParams = strategy.getAdParams({
      adSetId,
      pageId: config.pageId,
      instagramAccountId: config.instagramAccountId,
      imageHash,
      videoId,
      videoThumbnailUrl,
      storiesImageHash: config.storiesImageHash,
      headline: config.adText.headline,
      primaryText: config.adText.primaryText,
      description: config.adText.description,
      callToAction: config.adText.callToAction,
      websiteUrl: config.type === 'leads' ? (config.landingPageUrl ?? '') : (config.websiteUrl ?? ''),
      name: adNameFinal,
      urlTags: config.urlTags,
      whatsappNumber: config.whatsappNumber,
      leadFormId,
      objectStoreUrl: config.objectStoreUrl,
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
      creativeFormat,
      adsManagerUrl: buildAdsManagerUrl(config.adAccountId, campaignId),
      createdAt: new Date(),
    };

    // Fire-and-forget campaign logging
    try {
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
    if (createdLeadFormId) {
      await adapter.deleteLeadForm(createdLeadFormId, config.pageId);
    }

    throw error;
  }
}
