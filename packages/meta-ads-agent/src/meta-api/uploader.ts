import { readFile, stat } from 'node:fs/promises';
import { basename } from 'node:path';
import { logger } from '../cli/logger.js';
import { getAccessToken } from '../auth/token-manager.js';
import { MetaApiError, NetworkError, UploadError } from '../errors/types.js';
import { imageUploadResponseSchema, videoUploadResponseSchema } from './types.js';
import { withRetry } from '../utils/retry.js';
import type { CreativeBundle } from '../types/creative.js';

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

function handleUploadError(error: unknown, filePath: string, assetType: 'image' | 'video'): never {
  if (error instanceof UploadError || error instanceof MetaApiError || error instanceof NetworkError) {
    throw error;
  }

  const err = error as Record<string, unknown>;
  const body = err['body'] as Record<string, unknown> | undefined;
  const metaError = body?.['error'] as Record<string, unknown> | undefined;

  if (metaError) {
    const message = (metaError['message'] as string) ?? 'Erro desconhecido da API Meta';
    throw new UploadError(
      `Falha no upload ${assetType === 'image' ? 'da imagem' : 'do vídeo'}: ${message}`,
      { filePath, adAccountId: '', assetType },
    );
  }

  if (err['code'] === 'ENOENT') {
    throw new UploadError(`Arquivo não encontrado: ${filePath}`, {
      filePath,
      adAccountId: '',
      assetType,
    });
  }

  if (err['code'] === 'ENOTFOUND' || err['code'] === 'ETIMEDOUT') {
    throw new NetworkError(
      'Tempo limite atingido durante o upload.',
      'Verifique sua conexão e tente novamente.',
    );
  }

  throw new UploadError(
    `Falha no upload ${assetType === 'image' ? 'da imagem' : 'do vídeo'}: Erro inesperado`,
    { filePath, adAccountId: '', assetType },
  );
}

export async function uploadImage(
  adAccountId: string,
  filePath: string,
): Promise<string> {
  const token = await getAccessToken();
  const fileName = basename(filePath);
  logger.debug({ adAccountId, filePath }, 'Uploading image');

  return withRetry(async () => {
    const fileBuffer = await readFile(filePath);
    const formData = new FormData();
    formData.append('filename', new Blob([fileBuffer]), fileName);
    formData.append('access_token', token);

    const url = `${BASE_URL}/act_${adAccountId}/adimages`;
    const response = await fetch(url, { method: 'POST', body: formData });
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleUploadError({ body: json }, filePath, 'image');
    }

    const parsed = imageUploadResponseSchema.parse(json);
    const images = parsed.images;
    const firstKey = Object.keys(images)[0];
    const hash = images[firstKey].hash;

    logger.info({ fileName, hash }, 'Image uploaded successfully');
    return hash;
  });
}

export async function uploadVideo(
  adAccountId: string,
  filePath: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const token = await getAccessToken();
  const fileName = basename(filePath);
  const fileStat = await stat(filePath);
  logger.debug({ adAccountId, filePath, size: fileStat.size }, 'Uploading video');

  return withRetry(async () => {
    const fileBuffer = await readFile(filePath);

    onProgress?.(10);

    const formData = new FormData();
    formData.append('source', new Blob([fileBuffer]), fileName);
    formData.append('access_token', token);

    onProgress?.(30);

    const url = `${BASE_URL}/act_${adAccountId}/advideos`;
    const response = await fetch(url, { method: 'POST', body: formData });

    onProgress?.(80);

    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      handleUploadError({ body: json }, filePath, 'video');
    }

    const parsed = videoUploadResponseSchema.parse(json);
    const videoId = parsed.id;

    onProgress?.(100);

    logger.info({ fileName, videoId }, 'Video uploaded successfully');
    return videoId;
  });
}

export async function uploadBundle(
  adAccountId: string,
  bundle: CreativeBundle,
  onProgress?: (asset: string, pct: number) => void,
): Promise<CreativeBundle> {
  for (const asset of bundle.assets) {
    if (asset.type === 'image') {
      onProgress?.(asset.fileName, 0);
      const hash = await uploadImage(adAccountId, asset.filePath);
      bundle.uploadedIds.set(asset.filePath, hash);
      onProgress?.(asset.fileName, 100);
    } else {
      const videoId = await uploadVideo(adAccountId, asset.filePath, (pct) => {
        onProgress?.(asset.fileName, pct);
      });
      bundle.uploadedIds.set(asset.filePath, videoId);
    }
  }

  return bundle;
}
