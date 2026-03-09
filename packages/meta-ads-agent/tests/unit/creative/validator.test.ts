import { describe, it, expect } from 'vitest';
import {
  validateAsset,
  validateAll,
  formatFileSize,
} from '../../../src/creative/validator.js';
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

describe('validateAsset', () => {
  it('should validate image with valid dimensions (1080x1080+)', () => {
    const asset = validateAsset(makeAsset({ width: 1080, height: 1080 }));
    expect(asset.isValid).toBe(true);
    expect(asset.validationErrors).toHaveLength(0);
  });

  it('should reject image with small dimensions', () => {
    const asset = validateAsset(makeAsset({ width: 500, height: 500 }));
    expect(asset.isValid).toBe(false);
    expect(asset.validationErrors[0]).toContain('Dimensões mínimas não atingidas');
    expect(asset.validationErrors[0]).toContain('500x500');
    expect(asset.validationErrors[0]).toContain('mínimo 1080x1080');
  });

  it('should reject image exceeding 30MB', () => {
    const size = 31 * 1024 * 1024; // 31 MB
    const asset = validateAsset(makeAsset({ fileSize: size }));
    expect(asset.isValid).toBe(false);
    expect(asset.validationErrors[0]).toContain('excede 30MB');
  });

  it('should validate video with valid dimensions', () => {
    const asset = validateAsset(
      makeAsset({
        type: 'video',
        mimeType: 'video/mp4',
        width: 1920,
        height: 1080,
        fileSize: 100_000_000,
        duration: 30,
      }),
    );
    expect(asset.isValid).toBe(true);
  });

  it('should reject video exceeding 4GB', () => {
    const size = 5 * 1024 * 1024 * 1024; // 5 GB
    const asset = validateAsset(
      makeAsset({
        type: 'video',
        mimeType: 'video/mp4',
        fileSize: size,
        duration: 60,
      }),
    );
    expect(asset.isValid).toBe(false);
    expect(asset.validationErrors[0]).toContain('excede 4GB');
  });

  it('should collect multiple validation errors', () => {
    const asset = validateAsset(
      makeAsset({ width: 500, height: 500, fileSize: 31 * 1024 * 1024 }),
    );
    expect(asset.isValid).toBe(false);
    expect(asset.validationErrors).toHaveLength(2);
  });
});

describe('validateAll', () => {
  it('should validate multiple assets', () => {
    const assets = validateAll([
      makeAsset({ width: 1920, height: 1080 }),
      makeAsset({ width: 500, height: 500 }),
    ]);
    expect(assets).toHaveLength(2);
    expect(assets[0].isValid).toBe(true);
    expect(assets[1].isValid).toBe(false);
  });
});

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(2.3 * 1024 * 1024 * 1024)).toBe('2.3 GB');
  });
});
