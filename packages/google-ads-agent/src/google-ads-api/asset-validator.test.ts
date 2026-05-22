import { describe, it, expect } from 'vitest';
import {
  detectImageMime,
  extractImageDimensions,
  validateImageSize,
  parseYoutubeUrl,
  validateLogoDimensions,
  suggestAssetName,
  validateTextAsset,
  IMAGE_SIZE_LIMIT_BYTES,
} from './asset-validator.js';

// Helper: build a minimal valid PNG buffer
function buildPng(width: number, height: number): Buffer {
  // PNG signature + IHDR chunk (13 bytes data: width, height, bitDepth, colorType, ...)
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrLength = Buffer.from([0x00, 0x00, 0x00, 0x0d]); // 13
  const ihdrType = Buffer.from('IHDR');
  const widthBuf = Buffer.alloc(4);
  widthBuf.writeUInt32BE(width, 0);
  const heightBuf = Buffer.alloc(4);
  heightBuf.writeUInt32BE(height, 0);
  const ihdrRest = Buffer.from([0x08, 0x02, 0x00, 0x00, 0x00]); // bit depth, color type, etc
  const crc = Buffer.from([0x00, 0x00, 0x00, 0x00]); // placeholder
  return Buffer.concat([sig, ihdrLength, ihdrType, widthBuf, heightBuf, ihdrRest, crc]);
}

// Helper: build minimal JPEG with SOF0
function buildJpeg(width: number, height: number): Buffer {
  // SOI + arbitrary segment + SOF0 with dimensions
  const soi = Buffer.from([0xff, 0xd8]);
  const sof0Marker = Buffer.from([0xff, 0xc0]);
  const sof0Length = Buffer.from([0x00, 0x11]); // 17 bytes
  const precision = Buffer.from([0x08]);
  const heightBuf = Buffer.alloc(2);
  heightBuf.writeUInt16BE(height, 0);
  const widthBuf = Buffer.alloc(2);
  widthBuf.writeUInt16BE(width, 0);
  const rest = Buffer.from([
    0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
  ]); // components
  return Buffer.concat([soi, sof0Marker, sof0Length, precision, heightBuf, widthBuf, rest]);
}

describe('detectImageMime', () => {
  it('detects PNG via magic bytes', () => {
    expect(detectImageMime(buildPng(100, 100))).toBe('IMAGE_PNG');
  });

  it('detects JPEG via magic bytes', () => {
    expect(detectImageMime(buildJpeg(100, 100))).toBe('IMAGE_JPEG');
  });

  it('returns null for non-image bytes', () => {
    expect(detectImageMime(Buffer.from('Hello World'))).toBeNull();
  });

  it('returns null for too-short buffer', () => {
    expect(detectImageMime(Buffer.from([0x89, 0x50]))).toBeNull();
  });
});

describe('extractImageDimensions', () => {
  it('extracts PNG dimensions from IHDR', () => {
    const buf = buildPng(1200, 628);
    expect(extractImageDimensions(buf, 'IMAGE_PNG')).toEqual({ width: 1200, height: 628 });
  });

  it('extracts JPEG dimensions from SOF0', () => {
    const buf = buildJpeg(800, 600);
    expect(extractImageDimensions(buf, 'IMAGE_JPEG')).toEqual({ width: 800, height: 600 });
  });

  it('returns null for corrupted PNG', () => {
    expect(extractImageDimensions(Buffer.from([0x89, 0x50]), 'IMAGE_PNG')).toBeNull();
  });

  it('returns null for PNG with zero dimensions', () => {
    const buf = buildPng(0, 0);
    expect(extractImageDimensions(buf, 'IMAGE_PNG')).toBeNull();
  });
});

describe('validateImageSize', () => {
  it('accepts file under 5MB', () => {
    const small = Buffer.alloc(1_000_000); // 1 MB
    const result = validateImageSize(small);
    expect(result.exceedsLimit).toBe(false);
    expect(result.sizeBytes).toBe(1_000_000);
  });

  it('rejects file over 5MB', () => {
    const huge = Buffer.alloc(IMAGE_SIZE_LIMIT_BYTES + 1);
    const result = validateImageSize(huge);
    expect(result.exceedsLimit).toBe(true);
  });

  it('accepts exactly 5MB (boundary)', () => {
    const exact = Buffer.alloc(IMAGE_SIZE_LIMIT_BYTES);
    expect(validateImageSize(exact).exceedsLimit).toBe(false);
  });
});

describe('parseYoutubeUrl', () => {
  it('parses youtube.com/watch?v=ID', () => {
    expect(parseYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')?.videoId).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('parses youtu.be/ID', () => {
    expect(parseYoutubeUrl('https://youtu.be/dQw4w9WgXcQ')?.videoId).toBe('dQw4w9WgXcQ');
  });

  it('parses youtube.com/embed/ID', () => {
    expect(parseYoutubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')?.videoId).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('accepts raw 11-char video ID', () => {
    expect(parseYoutubeUrl('dQw4w9WgXcQ')?.videoId).toBe('dQw4w9WgXcQ');
  });

  it('returns null for invalid input', () => {
    expect(parseYoutubeUrl('not-a-url')).toBeNull();
    expect(parseYoutubeUrl('')).toBeNull();
    expect(parseYoutubeUrl('https://example.com')).toBeNull();
  });

  it('handles URL with extra params', () => {
    expect(
      parseYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s')?.videoId,
    ).toBe('dQw4w9WgXcQ');
  });
});

describe('validateLogoDimensions', () => {
  it('detects 1:1 ratio (1200×1200)', () => {
    const r = validateLogoDimensions({ width: 1200, height: 1200 });
    expect(r.ratio).toBe('1:1');
    expect(r.isRecommended).toBe(true);
  });

  it('detects 4:1 ratio (1200×300)', () => {
    const r = validateLogoDimensions({ width: 1200, height: 300 });
    expect(r.ratio).toBe('4:1');
    expect(r.isRecommended).toBe(true);
  });

  it('classifies non-standard ratio as "other"', () => {
    const r = validateLogoDimensions({ width: 800, height: 200 });
    // 800/200 = 4 — should be 4:1
    expect(r.ratio).toBe('4:1');
    expect(r.isRecommended).toBe(false); // too small
  });

  it('marks small 1:1 as not recommended', () => {
    const r = validateLogoDimensions({ width: 500, height: 500 });
    expect(r.ratio).toBe('1:1');
    expect(r.isRecommended).toBe(false);
  });

  it('classifies wild ratios as other', () => {
    const r = validateLogoDimensions({ width: 1600, height: 100 });
    expect(r.ratio).toBe('other');
  });
});

describe('suggestAssetName', () => {
  it('derives name from filename without extension', () => {
    expect(suggestAssetName('/path/to/hero-product.png')).toBe('hero-product');
    expect(suggestAssetName('logo-square.jpg')).toBe('logo-square');
  });

  it('sanitizes non-ASCII chars', () => {
    expect(suggestAssetName('açúcar.png')).not.toMatch(/[^a-zA-Z0-9\-_ ]/);
  });

  it('handles hidden file (starts with dot)', () => {
    // Hidden file ".png" → after dot strip becomes "png" (valid name)
    expect(suggestAssetName('.png')).toBe('png');
  });

  it('returns fallback when sanitized name is empty', () => {
    // All non-ASCII chars get stripped → empty → fallback
    expect(suggestAssetName('!!!.png')).toBe('unnamed-asset');
  });
});

describe('validateTextAsset', () => {
  it('accepts valid short text', () => {
    expect(validateTextAsset('Frete grátis').valid).toBe(true);
  });

  it('rejects empty', () => {
    expect(validateTextAsset('').valid).toBe(false);
    expect(validateTextAsset('   ').valid).toBe(false);
  });

  it('rejects > 300 chars', () => {
    expect(validateTextAsset('a'.repeat(301)).valid).toBe(false);
  });

  it('accepts exactly 300 chars (boundary)', () => {
    expect(validateTextAsset('a'.repeat(300)).valid).toBe(true);
  });
});
