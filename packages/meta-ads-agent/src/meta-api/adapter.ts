import { createRequire } from 'node:module';
import { logger } from '../cli/logger.js';
import { getAccessToken } from '../auth/token-manager.js';
import { MetaApiError, NetworkError } from '../errors/types.js';
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

const META_ERROR_MAP: Record<number, { message: string; action: string }> = {
  190: {
    message: 'Token de acesso inválido ou expirado',
    action: 'Execute: meta-ads auth setup',
  },
  100: {
    message: 'Parâmetro inválido',
    action: 'Verifique os parâmetros da requisição',
  },
  4: {
    message: 'Limite de chamadas da API atingido',
    action: 'Aguarde alguns minutos',
  },
  10: {
    message: 'Permissão negada',
    action: 'Verifique permissões do Meta App',
  },
  2446: {
    message: 'Criativo rejeitado pela Meta',
    action: 'Verifique políticas de anúncios',
  },
  368: {
    message: 'Conta temporariamente bloqueada',
    action: 'Acesse o Gerenciador para resolver',
  },
};

async function initApi(): Promise<string> {
  const token = await getAccessToken();
  bizSdk.FacebookAdsApi.init(token);
  return token;
}

function handleMetaError(error: unknown): never {
  if (error instanceof MetaApiError || error instanceof NetworkError) {
    throw error;
  }

  const err = error as Record<string, unknown>;
  const body = err['body'] as Record<string, unknown> | undefined;
  const metaError = body?.['error'] as Record<string, unknown> | undefined;

  if (metaError) {
    const code = (metaError['code'] as number) ?? 0;
    const mapped = META_ERROR_MAP[code];
    const message = mapped?.message ?? (metaError['message'] as string) ?? 'Erro desconhecido da API Meta';
    const action = mapped?.action ?? '';
    throw new MetaApiError(message, code, action);
  }

  if (err['code'] === 'ENOTFOUND' || err['code'] === 'ETIMEDOUT') {
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
