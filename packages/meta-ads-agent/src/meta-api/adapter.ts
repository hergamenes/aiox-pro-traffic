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
import type { AdAccount, Page, InstagramAccount } from './types.js';

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
