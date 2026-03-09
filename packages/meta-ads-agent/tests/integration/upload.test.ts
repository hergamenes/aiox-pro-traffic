import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';

vi.mock('../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('keytar', () => ({
  default: {
    setPassword: vi.fn().mockResolvedValue(undefined),
    getPassword: vi.fn().mockResolvedValue('mock-access-token'),
    deletePassword: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('facebook-nodejs-business-sdk', () => ({
  default: { FacebookAdsApi: { init: vi.fn() } },
  FacebookAdsApi: { init: vi.fn() },
}));

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
  return {
    ...actual,
    readFile: vi.fn().mockResolvedValue(Buffer.from('mock-image-data')),
    stat: vi.fn().mockResolvedValue({ size: 2_000_000 }),
  };
});

import {
  defaultHandlers,
  metaApiErrorHandler,
} from '../helpers/msw-handlers.js';
import { uploadImage, uploadVideo } from '../../src/meta-api/uploader.js';

const server = setupServer(...defaultHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Upload Integration (MSW)', () => {
  it('should complete full image upload flow and receive hash', async () => {
    const hash = await uploadImage('test_account', '/mock/photo.jpg');

    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.startsWith('hash_')).toBe(true);
  });

  it('should complete full video upload flow and receive video ID', async () => {
    const videoId = await uploadVideo('test_account', '/mock/video.mp4');

    expect(videoId).toBeDefined();
    expect(typeof videoId).toBe('string');
    expect(videoId.startsWith('video_')).toBe(true);
  });

  it('should return Portuguese error on Meta API error (190 - token expired)', async () => {
    server.use(
      metaApiErrorHandler(190, 'Invalid OAuth access token'),
    );

    await expect(uploadImage('test_account', '/mock/photo.jpg')).rejects.toThrow(
      'Falha no upload da imagem',
    );
  });

  it('should handle video upload with progress callback', async () => {
    const progress: number[] = [];
    const videoId = await uploadVideo('test_account', '/mock/video.mp4', (pct) => {
      progress.push(pct);
    });

    expect(videoId).toBeDefined();
    expect(progress.length).toBeGreaterThan(0);
    expect(progress[progress.length - 1]).toBe(100);
  });
});
