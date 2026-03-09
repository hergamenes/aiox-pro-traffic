import { describe, it, expect, vi, beforeEach } from 'vitest';
import { join } from 'node:path';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    metadata: vi.fn().mockResolvedValue({
      width: 1920,
      height: 1080,
      format: 'jpeg',
      size: 2_000_000,
    }),
  })),
}));

vi.mock('fluent-ffmpeg', () => {
  const ffprobe = vi.fn(
    (_path: string, cb: (err: null, data: object) => void) => {
      cb(null, {
        streams: [{ codec_type: 'video', width: 1920, height: 1080 }],
        format: { duration: 30.5 },
      });
    },
  );
  const fn = vi.fn();
  fn.setFfprobePath = vi.fn();
  fn.ffprobe = ffprobe;
  return { default: fn, ffprobe };
});

vi.mock('ffprobe-static', () => ({ path: '/mock/ffprobe' }));

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
  return {
    ...actual,
    access: vi.fn().mockResolvedValue(undefined),
    readdir: vi.fn().mockResolvedValue([]),
    stat: vi.fn().mockResolvedValue({ size: 2_000_000 }),
  };
});

import { scanCreatives } from '../../../src/creative/scanner.js';
import { CreativeError } from '../../../src/errors/types.js';
import { access, readdir } from 'node:fs/promises';

const mockedAccess = vi.mocked(access);
const mockedReaddir = vi.mocked(readdir);

function makeDirent(name: string, isFile = true) {
  return {
    name,
    isFile: () => isFile,
    isDirectory: () => !isFile,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => false,
    isSocket: () => false,
    isSymbolicLink: () => false,
    path: '/mock',
    parentPath: '/mock',
  };
}

describe('scanCreatives', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAccess.mockResolvedValue(undefined);
  });

  it('should find supported image files (JPG, PNG, WEBP)', async () => {
    mockedReaddir.mockResolvedValue([
      makeDirent('photo.jpg'),
      makeDirent('banner.png'),
      makeDirent('hero.webp'),
    ] as never);

    const assets = await scanCreatives('/mock/creatives');

    expect(assets).toHaveLength(3);
    expect(assets[0].type).toBe('image');
    expect(assets[0].mimeType).toBe('image/jpeg');
    expect(assets[1].mimeType).toBe('image/png');
    expect(assets[2].mimeType).toBe('image/webp');
  });

  it('should find supported video files (MP4, MOV)', async () => {
    mockedReaddir.mockResolvedValue([
      makeDirent('video.mp4'),
      makeDirent('clip.mov'),
    ] as never);

    const assets = await scanCreatives('/mock/creatives');

    expect(assets).toHaveLength(2);
    expect(assets[0].type).toBe('video');
    expect(assets[0].mimeType).toBe('video/mp4');
    expect(assets[1].mimeType).toBe('video/quicktime');
    expect(assets[0].duration).toBe(30.5);
  });

  it('should ignore unsupported file types', async () => {
    mockedReaddir.mockResolvedValue([
      makeDirent('photo.jpg'),
      makeDirent('readme.txt'),
      makeDirent('document.pdf'),
    ] as never);

    const assets = await scanCreatives('/mock/creatives');

    expect(assets).toHaveLength(1);
    expect(assets[0].fileName).toBe('photo.jpg');
  });

  it('should ignore hidden files', async () => {
    mockedReaddir.mockResolvedValue([
      makeDirent('.DS_Store'),
      makeDirent('.hidden.jpg'),
      makeDirent('visible.jpg'),
    ] as never);

    const assets = await scanCreatives('/mock/creatives');

    expect(assets).toHaveLength(1);
    expect(assets[0].fileName).toBe('visible.jpg');
  });

  it('should throw CreativeError for non-existent folder', async () => {
    mockedAccess.mockRejectedValue(new Error('ENOENT'));

    await expect(scanCreatives('/nonexistent')).rejects.toThrow(CreativeError);
    await expect(scanCreatives('/nonexistent')).rejects.toThrow(
      'Pasta de criativos não encontrada: /nonexistent',
    );
  });

  it('should throw CreativeError for empty folder', async () => {
    mockedReaddir.mockResolvedValue([] as never);

    await expect(scanCreatives('/mock/empty')).rejects.toThrow(CreativeError);
    await expect(scanCreatives('/mock/empty')).rejects.toThrow(
      'Nenhum arquivo encontrado na pasta de criativos',
    );
  });

  it('should ignore subdirectories', async () => {
    mockedReaddir.mockResolvedValue([
      makeDirent('subfolder', false),
      makeDirent('photo.jpg'),
    ] as never);

    const assets = await scanCreatives('/mock/creatives');

    expect(assets).toHaveLength(1);
    expect(assets[0].fileName).toBe('photo.jpg');
  });
});
