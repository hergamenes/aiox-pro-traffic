import { createRequire } from 'node:module';
import { logger } from '../cli/logger.js';
import { getAccessToken } from '../auth/token-manager.js';
import { MetaApiError, NetworkError } from '../errors/types.js';
import { translateMetaError } from '../errors/error-map.js';
import { withRetry } from '../utils/retry.js';
import {
  adAccountResponseSchema,
  pageResponseSchema,
  instagramResponseSchema,
  getStatusLabel,
} from './types.js';
import type { AdAccount, Page, InstagramAccount, MediaImage, MediaVideo, BudgetInfo } from './types.js';
import type { InsightsParams, RawInsightRow } from '../types/insights.js';
import { rawInsightRowSchema } from '../types/insights.js';

const require = createRequire(import.meta.url);
const bizSdk = require('facebook-nodejs-business-sdk') as typeof import('facebook-nodejs-business-sdk');

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

async function initApi(): Promise<string> {
  const token = await getAccessToken();
  bizSdk.FacebookAdsApi.init(token);
  return token;
}

const NETWORK_CODES = new Set(['ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED', 'ECONNRESET']);

function handleMetaError(error: unknown): never {
  if (error instanceof MetaApiError || error instanceof NetworkError) {
    throw error;
  }

  const err = error as Record<string, unknown>;
  const body = err['body'] as Record<string, unknown> | undefined;
  const metaError = body?.['error'] as Record<string, unknown> | undefined;

  if (metaError) {
    const code = (metaError['code'] as number) ?? 0;
    const detail = metaError['message'] as string | undefined;
    const translated = translateMetaError(code, detail);
    throw new MetaApiError(translated.message, code, translated.action);
  }

  const errCode = err['code'] as string | undefined;
  if (errCode && NETWORK_CODES.has(errCode)) {
    throw new NetworkError(
      'Erro de rede ao conectar com a API Meta.',
      'Verifique sua conexão e tente novamente.',
    );
  }

  throw new MetaApiError(
    'Erro inesperado ao comunicar com a API Meta.',
    0,
    '',
  );
}

export async function listAdAccounts(): Promise<AdAccount[]> {
  const token = await initApi();
  logger.debug('Fetching ad accounts');

  try {
    const url = `${BASE_URL}/me/adaccounts?fields=account_id,name,account_status,currency,timezone_name&access_token=${token}`;
    const response = await fetch(url);
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    const data = json['data'] as Record<string, unknown>[];
    if (!data) return [];

    return data.map((item) => {
      const parsed = adAccountResponseSchema.parse(item);
      return {
        accountId: parsed.account_id,
        name: parsed.name,
        status: parsed.account_status,
        statusLabel: getStatusLabel(parsed.account_status),
        currency: parsed.currency,
        timezone: parsed.timezone_name,
      };
    });
  } catch (error) {
    if (error instanceof MetaApiError || error instanceof NetworkError) {
      throw error;
    }
    handleMetaError(error);
  }
}

export async function listPages(): Promise<Page[]> {
  const token = await initApi();
  logger.debug('Fetching pages');

  try {
    const url = `${BASE_URL}/me/accounts?fields=id,name,category,instagram_business_account&access_token=${token}`;
    const response = await fetch(url);
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    const data = json['data'] as Record<string, unknown>[];
    if (!data) return [];

    return data.map((item) => {
      const parsed = pageResponseSchema.parse(item);
      return {
        id: parsed.id,
        name: parsed.name,
        category: parsed.category,
        instagramAccountId: parsed.instagram_business_account?.id ?? null,
      };
    });
  } catch (error) {
    if (error instanceof MetaApiError || error instanceof NetworkError) {
      throw error;
    }
    handleMetaError(error);
  }
}

export async function getInstagramAccount(
  pageId: string,
): Promise<InstagramAccount | null> {
  const token = await initApi();
  logger.debug({ pageId }, 'Fetching Instagram account for page');

  try {
    const url = `${BASE_URL}/${pageId}?fields=instagram_business_account{id,name,username}&access_token=${token}`;
    const response = await fetch(url);
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    const igData = json['instagram_business_account'] as Record<string, unknown> | undefined;
    if (!igData) return null;

    const parsed = instagramResponseSchema.parse(igData);
    return {
      id: parsed.id,
      name: parsed.name,
      username: parsed.username,
    };
  } catch (error) {
    if (error instanceof MetaApiError || error instanceof NetworkError) {
      throw error;
    }
    handleMetaError(error);
  }
}

export async function createCampaign(
  adAccountId: string,
  params: Record<string, unknown>,
): Promise<string> {
  const token = await getAccessToken();
  logger.debug({ adAccountId }, 'Creating campaign');

  return withRetry(async () => {
    const url = `${BASE_URL}/act_${adAccountId}/campaigns`;
    const body = { ...params, access_token: token };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    const id = json['id'] as string;
    logger.info({ campaignId: id }, 'Campaign created');
    return id;
  });
}

export async function createAdSet(
  adAccountId: string,
  params: Record<string, unknown>,
): Promise<string> {
  const token = await getAccessToken();
  logger.debug({ adAccountId }, 'Creating ad set');

  return withRetry(async () => {
    const url = `${BASE_URL}/act_${adAccountId}/adsets`;
    const body = { ...params, access_token: token };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    const id = json['id'] as string;
    logger.info({ adSetId: id }, 'Ad set created');
    return id;
  });
}

export async function createAd(
  adAccountId: string,
  params: Record<string, unknown>,
): Promise<string> {
  const token = await getAccessToken();
  logger.debug({ adAccountId }, 'Creating ad');

  return withRetry(async () => {
    const url = `${BASE_URL}/act_${adAccountId}/ads`;
    const body = { ...params, access_token: token };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    const id = json['id'] as string;
    logger.info({ adId: id }, 'Ad created');
    return id;
  });
}

export async function updateCampaignStatus(
  campaignId: string,
  status: string,
): Promise<void> {
  const token = await getAccessToken();
  logger.debug({ campaignId, status }, 'Updating campaign status');

  return withRetry(async () => {
    const url = `${BASE_URL}/${campaignId}`;
    const body = { status, access_token: token };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    logger.info({ campaignId, status }, 'Campaign status updated');
  });
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  const token = await getAccessToken();
  logger.debug({ campaignId }, 'Deleting campaign (rollback)');

  try {
    const url = `${BASE_URL}/${campaignId}?access_token=${token}`;
    const response = await fetch(url, { method: 'DELETE' });
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      logger.warn({ campaignId }, 'Failed to delete campaign during rollback');
    } else {
      logger.info({ campaignId }, 'Campaign deleted (rollback)');
    }
  } catch {
    logger.warn({ campaignId }, 'Failed to delete campaign during rollback');
  }
}

export async function deleteAdSet(adSetId: string): Promise<void> {
  const token = await getAccessToken();
  logger.debug({ adSetId }, 'Deleting ad set (rollback)');

  try {
    const url = `${BASE_URL}/${adSetId}?access_token=${token}`;
    const response = await fetch(url, { method: 'DELETE' });
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      logger.warn({ adSetId }, 'Failed to delete ad set during rollback');
    } else {
      logger.info({ adSetId }, 'Ad set deleted (rollback)');
    }
  } catch {
    logger.warn({ adSetId }, 'Failed to delete ad set during rollback');
  }
}

export async function deleteAd(adId: string): Promise<void> {
  const token = await getAccessToken();
  logger.debug({ adId }, 'Deleting ad (rollback)');

  try {
    const url = `${BASE_URL}/${adId}?access_token=${token}`;
    const response = await fetch(url, { method: 'DELETE' });
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      logger.warn({ adId }, 'Failed to delete ad during rollback');
    } else {
      logger.info({ adId }, 'Ad deleted (rollback)');
    }
  } catch {
    logger.warn({ adId }, 'Failed to delete ad during rollback');
  }
}

export async function getVideoThumbnailUrl(videoId: string): Promise<string> {
  const token = await initApi();
  logger.debug({ videoId }, 'Fetching video thumbnail');

  try {
    const url = `${BASE_URL}/${videoId}?fields=picture&access_token=${token}`;
    const response = await fetch(url);
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    return (json['picture'] as string) ?? '';
  } catch (error) {
    if (error instanceof MetaApiError || error instanceof NetworkError) {
      throw error;
    }
    handleMetaError(error);
  }
}

export async function listMediaImages(adAccountId: string): Promise<MediaImage[]> {
  const token = await initApi();
  logger.debug({ adAccountId }, 'Fetching media images');

  const images: MediaImage[] = [];
  let url: string | null = `${BASE_URL}/act_${adAccountId}/adimages?fields=name,hash,url_128,created_time,status&limit=100&access_token=${token}`;

  while (url) {
    const response = await fetch(url);
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    const data = json['data'] as Record<string, unknown>[] | undefined;
    if (!data) break;

    for (const item of data) {
      images.push({
        name: (item['name'] as string) ?? 'untitled',
        hash: item['hash'] as string,
        url128: (item['url_128'] as string) ?? '',
        createdTime: item['created_time'] as string,
        status: (item['status'] as string) ?? 'ACTIVE',
      });
    }

    const paging = json['paging'] as Record<string, unknown> | undefined;
    url = (paging?.['next'] as string) ?? null;
  }

  return images;
}

export function periodToDateRange(
  period: string,
  from?: string,
  to?: string,
): { since: string; until: string } {
  if (from && to) {
    return { since: from, until: to };
  }

  const now = new Date();
  const until = now.toISOString().split('T')[0];
  const daysMap: Record<string, number> = { '7d': 7, '14d': 14, '30d': 30 };
  const days = daysMap[period] ?? 7;
  const sinceDate = new Date(now);
  sinceDate.setDate(sinceDate.getDate() - days);
  const since = sinceDate.toISOString().split('T')[0];

  return { since, until };
}

export async function getInsights(params: InsightsParams): Promise<RawInsightRow[]> {
  const token = await initApi();
  logger.debug({ adAccountId: params.adAccountId, level: params.level }, 'Fetching insights');

  const { since, until } = periodToDateRange(params.period, params.from, params.to);

  const baseFields = 'spend,impressions,cpm,frequency,actions,cost_per_action_type,website_ctr,purchase_roas';
  const levelFields: Record<string, string> = {
    campaign: ',campaign_name,campaign_id',
    adset: ',campaign_name,campaign_id,adset_name,adset_id',
    ad: ',campaign_name,campaign_id,adset_name,adset_id,ad_name,ad_id',
  };
  const fields = baseFields + (levelFields[params.level] ?? '');

  const queryParams = new URLSearchParams({
    fields,
    time_range: JSON.stringify({ since, until }),
    access_token: token,
    limit: '500',
  });

  if (params.level !== 'account') {
    queryParams.set('level', params.level);
  }

  if (params.filter?.campaignId) {
    queryParams.set(
      'filtering',
      JSON.stringify([
        { field: 'campaign.id', operator: 'EQUAL', value: params.filter.campaignId },
      ]),
    );
  }

  const rows: RawInsightRow[] = [];
  let url: string | null =
    `${BASE_URL}/act_${params.adAccountId}/insights?${queryParams.toString()}`;

  try {
    while (url) {
      const response = await fetch(url);
      const json = (await response.json()) as Record<string, unknown>;

      if (json['error']) {
        handleMetaError({ body: json });
      }

      const data = json['data'] as Record<string, unknown>[] | undefined;
      if (!data) break;

      for (const item of data) {
        rows.push(rawInsightRowSchema.parse(item));
      }

      const paging = json['paging'] as Record<string, unknown> | undefined;
      url = (paging?.['next'] as string) ?? null;
    }
  } catch (error) {
    if (error instanceof MetaApiError || error instanceof NetworkError) {
      throw error;
    }
    handleMetaError(error);
  }

  return rows;
}

export async function getAdSetBudgets(adAccountId: string): Promise<BudgetInfo[]> {
  const token = await initApi();
  logger.debug({ adAccountId }, 'Fetching ad set budgets');

  const budgets: BudgetInfo[] = [];
  let url: string | null =
    `${BASE_URL}/act_${adAccountId}/adsets?fields=name,daily_budget,lifetime_budget,campaign_id&limit=500&access_token=${token}`;

  try {
    while (url) {
      const response = await fetch(url);
      const json = (await response.json()) as Record<string, unknown>;

      if (json['error']) {
        handleMetaError({ body: json });
      }

      const data = json['data'] as Record<string, unknown>[] | undefined;
      if (!data) break;

      for (const item of data) {
        const dailyRaw = item['daily_budget'] as string | undefined;
        const lifetimeRaw = item['lifetime_budget'] as string | undefined;
        budgets.push({
          adsetName: (item['name'] as string) ?? '',
          dailyBudget: dailyRaw ? parseInt(dailyRaw, 10) / 100 : null,
          lifetimeBudget: lifetimeRaw ? parseInt(lifetimeRaw, 10) / 100 : null,
          campaignId: (item['campaign_id'] as string) ?? '',
        });
      }

      const paging = json['paging'] as Record<string, unknown> | undefined;
      url = (paging?.['next'] as string) ?? null;
    }
  } catch (error) {
    if (error instanceof MetaApiError || error instanceof NetworkError) {
      throw error;
    }
    handleMetaError(error);
  }

  return budgets;
}

export async function listMediaVideos(adAccountId: string): Promise<MediaVideo[]> {
  const token = await initApi();
  logger.debug({ adAccountId }, 'Fetching media videos');

  const videos: MediaVideo[] = [];
  let url: string | null = `${BASE_URL}/act_${adAccountId}/advideos?fields=title,id,created_time,length,status&limit=100&access_token=${token}`;

  while (url) {
    const response = await fetch(url);
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleMetaError({ body: json });
    }

    const data = json['data'] as Record<string, unknown>[] | undefined;
    if (!data) break;

    for (const item of data) {
      const statusObj = item['status'] as Record<string, unknown> | undefined;
      videos.push({
        id: item['id'] as string,
        title: (item['title'] as string) ?? 'untitled',
        createdTime: item['created_time'] as string,
        duration: (item['length'] as number) ?? 0,
        status: (statusObj?.['video_status'] as string) ?? 'unknown',
      });
    }

    const paging = json['paging'] as Record<string, unknown> | undefined;
    url = (paging?.['next'] as string) ?? null;
  }

  return videos;
}
