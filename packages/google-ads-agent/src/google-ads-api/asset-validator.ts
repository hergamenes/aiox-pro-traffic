/**
 * Pure validators for Google Ads asset uploads (Story 6.6).
 *
 * No SDK runtime imports — file IO + binary parsing only. These helpers
 * detect MIME via magic bytes, extract image dimensions from headers,
 * and parse YouTube URLs without external libraries.
 */

import { basename, extname } from 'node:path';

export type ImageMime = 'IMAGE_PNG' | 'IMAGE_JPEG';
export type AssetType = 'IMAGE' | 'LOGO_IMAGE' | 'YOUTUBE_VIDEO' | 'TEXT';

export const IMAGE_SIZE_LIMIT_BYTES = 5_242_880; // 5 MB Google Ads limit
export const TEXT_LENGTH_MAX = 300;

/**
 * Detects PNG or JPEG via magic bytes. Returns null if neither.
 *
 *   PNG: 89 50 4E 47 0D 0A 1A 0A (\x89PNG\r\n\x1a\n)
 *   JPEG: FF D8 FF
 */
export function detectImageMime(buffer: Buffer): ImageMime | null {
  if (buffer.length < 8) return null;

  // PNG signature
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'IMAGE_PNG';
  }

  // JPEG signature
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'IMAGE_JPEG';
  }

  return null;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Extracts image dimensions from PNG IHDR chunk or JPEG SOF0 marker.
 * Returns null if dimensions cannot be parsed.
 */
export function extractImageDimensions(
  buffer: Buffer,
  mime: ImageMime,
): ImageDimensions | null {
  if (mime === 'IMAGE_PNG') {
    // PNG IHDR is at offset 16 (8 signature + 8 IHDR header)
    // Width = bytes 16-19, Height = bytes 20-23 (big-endian)
    if (buffer.length < 24) return null;
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    if (width === 0 || height === 0) return null;
    return { width, height };
  }

  if (mime === 'IMAGE_JPEG') {
    // Walk JPEG markers looking for SOF0 (0xFFC0) — contains dimensions
    let offset = 2; // skip SOI (0xFFD8)
    while (offset < buffer.length - 9) {
      if (buffer[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buffer[offset + 1];
      // SOF0..SOF15 markers (excluding 0xFFC4 DHT and 0xFFC8 reserved)
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        // SOF segment: marker(2) + length(2) + precision(1) + height(2) + width(2)
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        if (width === 0 || height === 0) return null;
        return { width, height };
      }
      // Skip this segment (length is big-endian at offset+2)
      const segmentLength = buffer.readUInt16BE(offset + 2);
      offset += 2 + segmentLength;
    }
    return null;
  }

  return null;
}

export interface ImageSizeCheck {
  sizeBytes: number;
  exceedsLimit: boolean;
  limitBytes: number;
}

export function validateImageSize(buffer: Buffer): ImageSizeCheck {
  return {
    sizeBytes: buffer.length,
    exceedsLimit: buffer.length > IMAGE_SIZE_LIMIT_BYTES,
    limitBytes: IMAGE_SIZE_LIMIT_BYTES,
  };
}

export interface YoutubeUrlParsed {
  videoId: string;
  originalUrl: string;
}

/**
 * Parses a YouTube URL (or raw video id) and extracts the video_id.
 *
 * Accepts:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   VIDEO_ID (raw, 11-char YouTube ID)
 */
export function parseYoutubeUrl(input: string): YoutubeUrlParsed | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Raw 11-char YouTube ID pattern
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { videoId: trimmed, originalUrl: trimmed };
  }

  // youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    return { videoId: watchMatch[1], originalUrl: trimmed };
  }

  // youtu.be/ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    return { videoId: shortMatch[1], originalUrl: trimmed };
  }

  // youtube.com/embed/ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) {
    return { videoId: embedMatch[1], originalUrl: trimmed };
  }

  return null;
}

export interface LogoDimensionCheck {
  ratio: '1:1' | '4:1' | 'other';
  isRecommended: boolean;
  width: number;
  height: number;
}

/**
 * Validates LOGO_IMAGE dimensions against Google's recommended specs:
 *   - 1:1 square (1200×1200 ±10%)
 *   - 4:1 horizontal (1200×300 ±10%)
 */
export function validateLogoDimensions(dims: ImageDimensions): LogoDimensionCheck {
  const { width, height } = dims;
  const ratio = width / height;

  // 1:1 = ratio ~1.0 (±10%)
  if (ratio >= 0.9 && ratio <= 1.1) {
    const isRecommended = width >= 1080 && height >= 1080; // some slack below 1200
    return { ratio: '1:1', isRecommended, width, height };
  }

  // 4:1 = ratio ~4.0 (±10%)
  if (ratio >= 3.6 && ratio <= 4.4) {
    const isRecommended = width >= 1200 && height >= 300;
    return { ratio: '4:1', isRecommended, width, height };
  }

  return { ratio: 'other', isRecommended: false, width, height };
}

/**
 * Derives a sensible asset name from a file path.
 *
 *   suggestAssetName('/path/to/hero-product.png') → 'hero-product'
 */
export function suggestAssetName(filePath: string): string {
  const ext = extname(filePath);
  let base = basename(filePath, ext);
  // Files starting with '.' (hidden, no real name) → empty after basename strip
  if (base.startsWith('.')) base = base.slice(1);
  // Sanitize: keep alphanumeric + dash/underscore/space
  const sanitized = base.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim();
  return sanitized || 'unnamed-asset';
}

export interface TextAssetValidation {
  valid: boolean;
  error?: string;
}

export function validateTextAsset(text: string): TextAssetValidation {
  if (typeof text !== 'string' || text.trim() === '') {
    return { valid: false, error: 'Text asset não pode ser vazio.' };
  }
  if (text.length > TEXT_LENGTH_MAX) {
    return {
      valid: false,
      error: `Text asset excede ${TEXT_LENGTH_MAX} chars (atual: ${text.length}).`,
    };
  }
  return { valid: true };
}
