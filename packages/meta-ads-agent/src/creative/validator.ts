import type { CreativeAsset } from '../types/creative.js';

const MIN_WIDTH = 1080;
const MIN_HEIGHT = 1080;
const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30 MB
const MAX_VIDEO_SIZE = 4 * 1024 * 1024 * 1024; // 4 GB

export function validateAsset(asset: CreativeAsset): CreativeAsset {
  const errors: string[] = [];

  if (asset.width < MIN_WIDTH || asset.height < MIN_HEIGHT) {
    errors.push(
      `Dimensões mínimas não atingidas: ${asset.width}x${asset.height} (mínimo ${MIN_WIDTH}x${MIN_HEIGHT})`,
    );
  }

  if (asset.type === 'image' && asset.fileSize > MAX_IMAGE_SIZE) {
    errors.push(`Tamanho do arquivo excede 30MB: ${formatFileSize(asset.fileSize)}`);
  }

  if (asset.type === 'video' && asset.fileSize > MAX_VIDEO_SIZE) {
    errors.push(`Tamanho do arquivo excede 4GB: ${formatFileSize(asset.fileSize)}`);
  }

  asset.isValid = errors.length === 0;
  asset.validationErrors = errors;

  return asset;
}

export function validateAll(assets: CreativeAsset[]): CreativeAsset[] {
  return assets.map(validateAsset);
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}
