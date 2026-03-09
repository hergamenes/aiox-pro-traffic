import type { CreativeAsset, CreativeBundle } from '../types/creative.js';
import { CreativeError } from '../errors/types.js';

const MAX_CAROUSEL_IMAGES = 10;

export function buildBundle(assets: CreativeAsset[]): CreativeBundle {
  const validAssets = assets.filter((a) => a.isValid);

  if (validAssets.length === 0) {
    throw new CreativeError('Nenhum arquivo válido encontrado');
  }

  const images = validAssets.filter((a) => a.type === 'image');
  const videos = validAssets.filter((a) => a.type === 'video');

  // Mix of images and videos: video takes priority
  if (videos.length > 0) {
    return {
      format: 'single_video',
      assets: [videos[0]],
      uploadedIds: new Map(),
    };
  }

  if (images.length === 1) {
    return {
      format: 'single_image',
      assets: images,
      uploadedIds: new Map(),
    };
  }

  if (images.length > MAX_CAROUSEL_IMAGES) {
    throw new CreativeError(
      `Carrossel suporta no máximo ${MAX_CAROUSEL_IMAGES} imagens (${images.length} encontradas)`,
    );
  }

  // 2-10 images = carousel
  return {
    format: 'carousel',
    assets: images,
    uploadedIds: new Map(),
  };
}
