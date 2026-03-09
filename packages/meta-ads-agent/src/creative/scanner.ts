import { createRequire } from 'node:module';
import { readdir, stat, access } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';

import type { CreativeAsset } from '../types/creative.js';
import {
  SUPPORTED_EXTENSIONS,
  EXTENSION_TO_MIME,
  SUPPORTED_MIME_TYPES,
} from '../types/creative.js';
import { CreativeError } from '../errors/types.js';

const require = createRequire(import.meta.url);
const ffprobeStatic = require('ffprobe-static') as { path: string };
ffmpeg.setFfprobePath(ffprobeStatic.path);

export async function scanCreatives(folderPath: string): Promise<CreativeAsset[]> {
  try {
    await access(folderPath);
  } catch {
    throw new CreativeError(`Pasta de criativos não encontrada: ${folderPath}`);
  }

  const entries = await readdir(folderPath, { withFileTypes: true });

  const files = entries.filter(
    (entry) =>
      entry.isFile() &&
      !entry.name.startsWith('.') &&
      SUPPORTED_EXTENSIONS.includes(
        extname(entry.name).toLowerCase() as (typeof SUPPORTED_EXTENSIONS)[number],
      ),
  );

  if (files.length === 0) {
    throw new CreativeError('Nenhum arquivo encontrado na pasta de criativos');
  }

  const assets: CreativeAsset[] = [];

  for (const file of files) {
    const filePath = join(folderPath, file.name);
    const ext = extname(file.name).toLowerCase();
    const mimeType = EXTENSION_TO_MIME[ext] ?? '';
    const creativeType = SUPPORTED_MIME_TYPES[mimeType];

    if (!creativeType) continue;

    const fileStat = await stat(filePath);

    if (creativeType === 'image') {
      const metadata = await sharp(filePath).metadata();
      assets.push({
        filePath,
        fileName: file.name,
        type: 'image',
        mimeType,
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
        fileSize: fileStat.size,
        duration: null,
        isValid: true,
        validationErrors: [],
      });
    } else {
      const probeData = await probeVideo(filePath);
      assets.push({
        filePath,
        fileName: file.name,
        type: 'video',
        mimeType,
        width: probeData.width,
        height: probeData.height,
        fileSize: fileStat.size,
        duration: probeData.duration,
        isValid: true,
        validationErrors: [],
      });
    }
  }

  return assets;
}

function probeVideo(
  filePath: string,
): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        reject(new CreativeError(`Erro ao ler metadados do vídeo: ${filePath}`, { filePath }));
        return;
      }

      const videoStream = data.streams.find((s) => s.codec_type === 'video');
      resolve({
        width: videoStream?.width ?? 0,
        height: videoStream?.height ?? 0,
        duration: data.format.duration ?? 0,
      });
    });
  });
}
