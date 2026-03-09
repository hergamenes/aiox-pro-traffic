import { describe, it, expect } from 'vitest';
import { buildBundle } from '../../../src/creative/bundle-builder.js';
import { CreativeError } from '../../../src/errors/types.js';
import type { CreativeAsset } from '../../../src/types/creative.js';

function makeAsset(overrides: Partial<CreativeAsset> = {}): CreativeAsset {
  return {
    filePath: '/mock/photo.jpg',
    fileName: 'photo.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1080,
    fileSize: 2_000_000,
    duration: null,
    isValid: true,
    validationErrors: [],
    ...overrides,
  };
}

describe('buildBundle', () => {
  it('should detect single_image for 1 image', () => {
    const bundle = buildBundle([makeAsset()]);
    expect(bundle.format).toBe('single_image');
    expect(bundle.assets).toHaveLength(1);
    expect(bundle.uploadedIds.size).toBe(0);
  });

  it('should detect single_video for 1 video', () => {
    const bundle = buildBundle([
      makeAsset({ type: 'video', mimeType: 'video/mp4', fileName: 'clip.mp4', duration: 30 }),
    ]);
    expect(bundle.format).toBe('single_video');
    expect(bundle.assets).toHaveLength(1);
  });

  it('should detect carousel for 2-10 images', () => {
    const assets = Array.from({ length: 5 }, (_, i) =>
      makeAsset({ fileName: `img${i}.jpg`, filePath: `/mock/img${i}.jpg` }),
    );
    const bundle = buildBundle(assets);
    expect(bundle.format).toBe('carousel');
    expect(bundle.assets).toHaveLength(5);
  });

  it('should throw CreativeError for >10 images', () => {
    const assets = Array.from({ length: 11 }, (_, i) =>
      makeAsset({ fileName: `img${i}.jpg`, filePath: `/mock/img${i}.jpg` }),
    );
    expect(() => buildBundle(assets)).toThrow(CreativeError);
    expect(() => buildBundle(assets)).toThrow('máximo 10 imagens (11 encontradas)');
  });

  it('should throw CreativeError when no valid assets', () => {
    const assets = [makeAsset({ isValid: false })];
    expect(() => buildBundle(assets)).toThrow(CreativeError);
    expect(() => buildBundle(assets)).toThrow('Nenhum arquivo válido encontrado');
  });

  it('should prioritize video when mix of images and videos', () => {
    const assets = [
      makeAsset(),
      makeAsset({
        type: 'video',
        mimeType: 'video/mp4',
        fileName: 'clip.mp4',
        filePath: '/mock/clip.mp4',
        duration: 15,
      }),
    ];
    const bundle = buildBundle(assets);
    expect(bundle.format).toBe('single_video');
    expect(bundle.assets).toHaveLength(1);
    expect(bundle.assets[0].type).toBe('video');
  });
});
