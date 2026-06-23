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

/**
 * Limite acima do qual o upload simples (não-resumable) é arriscado.
 * A Meta recomenda upload chunked/resumable para vídeos grandes; aqui só
 * avisamos. LIMITAÇÃO CONHECIDA: este uploader faz POST único para /advideos
 * (não implementa chunked/resumable upload). Para vídeos muito grandes o
 * upload pode falhar por timeout — nesse caso, comprima o vídeo ou suba pelo
 * Gerenciador de Anúncios e use a biblioteca de mídia (createCampaignFromLibrary).
 */
const VIDEO_LARGE_FILE_WARN_BYTES = 1_000_000_000; // ~1GB

/** Polling de processamento de vídeo: timeout e intervalo. */
const VIDEO_PROCESSING_TIMEOUT_MS = 120_000; // 120s
const VIDEO_PROCESSING_POLL_INTERVAL_MS = 3_000; // 3s

/**
 * Aguarda o vídeo terminar o processamento na Meta antes de prosseguir.
 *
 * Criar o ad imediatamente após o upload, enquanto `video_status` ainda é
 * `processing`, faz a criação do anúncio falhar. Fazemos polling de
 * GET /{video_id}?fields=status até `processing_phase` ficar `complete` (ou
 * o status virar `ready`), com timeout.
 */
export async function waitForVideoReady(videoId: string, token: string): Promise<void> {
  const deadline = Date.now() + VIDEO_PROCESSING_TIMEOUT_MS;

  while (Date.now() < deadline) {
    // O token vai no header Authorization: Bearer (não na query string), para
    // evitar vazamento do access_token em logs de URL — mesmo padrão dos GETs
    // do adapter.ts. `fields=status` permanece na query.
    const url = `${BASE_URL}/${videoId}?fields=status`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await response.json()) as Record<string, unknown>;

    if (!json['error'] && response.ok !== false) {
      const status = json['status'] as Record<string, unknown> | undefined;
      const videoStatus = status?.['video_status'] as string | undefined;
      const processingPhase = (status?.['processing_phase'] as Record<string, unknown> | undefined)?.[
        'status'
      ] as string | undefined;

      if (videoStatus === 'ready' || processingPhase === 'complete') {
        logger.debug({ videoId }, 'Video processing complete');
        return;
      }
      if (videoStatus === 'error' || processingPhase === 'error') {
        throw new UploadError('O vídeo falhou no processamento da Meta.', {
          filePath: videoId,
          adAccountId: '',
          assetType: 'video',
          action: 'Verifique se o formato/codec do vídeo é compatível e tente novamente.',
        });
      }
    }

    await new Promise((resolve) => setTimeout(resolve, VIDEO_PROCESSING_POLL_INTERVAL_MS));
  }

  // Timeout: avisamos mas não bloqueamos — a criação do ad ainda pode aguardar
  // (ou o usuário pode tentar de novo). Lançar aqui seria mais seguro, mas
  // alguns vídeos demoram mais que o timeout e ficam prontos logo depois.
  logger.warn(
    { videoId },
    'Tempo limite aguardando o processamento do vídeo. Prosseguindo — se a criação do anúncio falhar, aguarde e tente novamente.',
  );
}

function handleUploadError(error: unknown, filePath: string, assetType: 'image' | 'video'): never {
  if (error instanceof UploadError || error instanceof MetaApiError || error instanceof NetworkError) {
    throw error;
  }

  const err = error as Record<string, unknown>;
  const body = err['body'] as Record<string, unknown> | undefined;
  const metaError = body?.['error'] as Record<string, unknown> | undefined;
  const httpStatus = typeof err['httpStatus'] === 'number' ? (err['httpStatus'] as number) : undefined;

  if (metaError) {
    const message = (metaError['message'] as string) ?? 'Erro desconhecido da API Meta';
    const code = metaError['code'] as number | undefined;
    const subcode = metaError['error_subcode'] as number | undefined;
    throw new UploadError(
      `Falha no upload ${assetType === 'image' ? 'da imagem' : 'do vídeo'}: ${message}`,
      { filePath, adAccountId: '', assetType, metaErrorCode: code, subcode, httpStatus },
    );
  }

  // HTTP não-2xx sem campo `error`: tratar como falha de upload, não sucesso.
  if (httpStatus !== undefined) {
    throw new UploadError(
      `Falha no upload ${assetType === 'image' ? 'da imagem' : 'do vídeo'}: HTTP ${httpStatus}`,
      { filePath, adAccountId: '', assetType, httpStatus },
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
      handleUploadError({ body: json, httpStatus: response.status }, filePath, 'image');
    }
    if (response.ok === false) {
      handleUploadError({ httpStatus: response.status ?? 0 }, filePath, 'image');
    }

    const parsed = imageUploadResponseSchema.parse(json);
    const images = parsed.images;
    const firstKey = Object.keys(images)[0];
    // A Meta normalmente devolve `images: { <fileName>: { hash } }`, mas se vier
    // um objeto vazio (`images: {}`) o acesso por chave dispararia um TypeError
    // genérico. Tratamos explicitamente com um UploadError claro em pt-BR.
    if (firstKey === undefined) {
      throw new UploadError('A API Meta não retornou o hash da imagem enviada.', {
        filePath,
        adAccountId,
        assetType: 'image',
        action: 'Tente novamente. Se persistir, verifique o formato da imagem ou o status da API Meta.',
      });
    }
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

  if (fileStat.size > VIDEO_LARGE_FILE_WARN_BYTES) {
    logger.warn(
      { fileName, size: fileStat.size },
      'Vídeo acima de ~1GB: este uploader faz envio simples (não-chunked) e pode falhar por timeout. Considere comprimir o vídeo ou subi-lo pelo Gerenciador de Anúncios.',
    );
  }

  const videoId = await withRetry(async () => {
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
      handleUploadError({ body: json, httpStatus: response.status }, filePath, 'video');
    }
    if (response.ok === false) {
      handleUploadError({ httpStatus: response.status ?? 0 }, filePath, 'video');
    }

    const parsed = videoUploadResponseSchema.parse(json);
    return parsed.id;
  });

  // Aguarda o processamento do vídeo antes de devolver o ID, evitando que o
  // orchestrator crie o ad enquanto o vídeo ainda está em `processing`.
  await waitForVideoReady(videoId, token);

  onProgress?.(100);

  logger.info({ fileName, videoId }, 'Video uploaded successfully');
  return videoId;
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
