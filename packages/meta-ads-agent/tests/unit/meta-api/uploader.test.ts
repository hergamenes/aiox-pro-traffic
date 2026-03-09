import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('keytar', () => ({
  default: {
    setPassword: vi.fn().mockResolvedValue(undefined),
    getPassword: vi.fn().mockResolvedValue(null),
    deletePassword: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('facebook-nodejs-business-sdk', () => ({
  default: { FacebookAdsApi: { init: vi.fn() } },
  FacebookAdsApi: { init: vi.fn() },
}));

vi.mock('../../../src/auth/token-manager.js', () => ({
  getAccessToken: vi.fn().mockResolvedValue('mock-token-123'),
}));

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
  return {
    ...actual,
    readFile: vi.fn().mockResolvedValue(Buffer.from('mock-file-data')),
    stat: vi.fn().mockResolvedValue({ size: 1_000_000 }),
  };
});

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { uploadImage, uploadVideo, uploadBundle } from '../../../src/meta-api/uploader.js';
import type { CreativeBundle, CreativeAsset } from '../../../src/types/creative.js';

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

describe('uploadImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send correct multipart POST and return hash', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          images: { 'photo.jpg': { hash: 'abc123hash' } },
        }),
    });

    const hash = await uploadImage('12345', '/mock/photo.jpg');

    expect(hash).toBe('abc123hash');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://graph.facebook.com/v21.0/act_12345/adimages');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
  });

  it('should throw on Meta API error', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          error: { code: 190, message: 'Invalid access token' },
        }),
    });

    await expect(uploadImage('12345', '/mock/photo.jpg')).rejects.toThrow(
      'Falha no upload da imagem',
    );
  });
});

describe('uploadVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send correct POST and return video ID', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ id: 'video_789' }),
    });

    const videoId = await uploadVideo('12345', '/mock/clip.mp4');

    expect(videoId).toBe('video_789');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url] = mockFetch.mock.calls[0] as [string];
    expect(url).toBe('https://graph.facebook.com/v21.0/act_12345/advideos');
  });

  it('should call onProgress callback with percentage', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ id: 'video_789' }),
    });

    const onProgress = vi.fn();
    await uploadVideo('12345', '/mock/clip.mp4', onProgress);

    expect(onProgress).toHaveBeenCalled();
    const calls = onProgress.mock.calls.map((c) => c[0] as number);
    expect(calls[calls.length - 1]).toBe(100);
  });

  it('should throw Portuguese error on failure', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          error: { code: 2446, message: 'Creative rejected' },
        }),
    });

    await expect(uploadVideo('12345', '/mock/clip.mp4')).rejects.toThrow(
      'Falha no upload do vídeo',
    );
  });
});

describe('uploadBundle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload all assets and populate uploadedIds', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          images: { 'photo.jpg': { hash: 'hash_1' } },
        }),
    });

    const bundle: CreativeBundle = {
      format: 'single_image',
      assets: [makeAsset()],
      uploadedIds: new Map(),
    };

    const result = await uploadBundle('12345', bundle);

    expect(result.uploadedIds.size).toBe(1);
    expect(result.uploadedIds.get('/mock/photo.jpg')).toBe('hash_1');
  });

  it('should handle carousel (multiple images) sequentially', async () => {
    let callCount = 0;
    mockFetch.mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            images: { [`img${callCount}.jpg`]: { hash: `hash_${callCount}` } },
          }),
      });
    });

    const assets = [
      makeAsset({ filePath: '/mock/img1.jpg', fileName: 'img1.jpg' }),
      makeAsset({ filePath: '/mock/img2.jpg', fileName: 'img2.jpg' }),
      makeAsset({ filePath: '/mock/img3.jpg', fileName: 'img3.jpg' }),
    ];

    const bundle: CreativeBundle = {
      format: 'carousel',
      assets,
      uploadedIds: new Map(),
    };

    const result = await uploadBundle('12345', bundle);

    expect(result.uploadedIds.size).toBe(3);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should handle video in bundle', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ id: 'video_999' }),
    });

    const bundle: CreativeBundle = {
      format: 'single_video',
      assets: [
        makeAsset({
          type: 'video',
          mimeType: 'video/mp4',
          fileName: 'clip.mp4',
          filePath: '/mock/clip.mp4',
          duration: 30,
        }),
      ],
      uploadedIds: new Map(),
    };

    const result = await uploadBundle('12345', bundle);

    expect(result.uploadedIds.size).toBe(1);
    expect(result.uploadedIds.get('/mock/clip.mp4')).toBe('video_999');
  });
});
