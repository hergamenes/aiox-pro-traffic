import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('keytar', () => ({
  default: {
    setPassword: vi.fn().mockResolvedValue(undefined),
    getPassword: vi.fn().mockResolvedValue('mock-token'),
    deletePassword: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('facebook-nodejs-business-sdk', () => ({
  default: { FacebookAdsApi: { init: vi.fn() } },
  FacebookAdsApi: { init: vi.fn() },
}));

vi.mock('../../../src/meta-api/adapter.js', () => ({
  listPages: vi.fn(),
  getInstagramAccount: vi.fn(),
}));

vi.mock('node:readline/promises', () => ({
  createInterface: vi.fn(() => ({
    question: vi.fn(),
    close: vi.fn(),
  })),
}));

import { resolvePageId } from '../../../src/cli/page-resolver.js';
import { listPages, getInstagramAccount } from '../../../src/meta-api/adapter.js';
import { createInterface } from 'node:readline/promises';
import type { AppConfig } from '../../../src/types/config.js';

const mockListPages = vi.mocked(listPages);
const mockGetInstagram = vi.mocked(getInstagramAccount);
const mockCreateInterface = vi.mocked(createInterface);

const baseConfig: AppConfig = {
  version: 1,
  defaults: {
    adAccountId: 'act_123',
    pageId: null,
    instagramAccountId: null,
  },
  creativesPath: '~/Downloads/criativos-meta/',
  logPath: '~/.meta-ads/campaigns.log',
  app: { appId: '', callbackPort: 3000 },
};

describe('resolvePageId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetInstagram.mockResolvedValue({ id: 'ig_999', name: 'IG Account', username: 'iguser' });
  });

  it('should use --page flag when provided', async () => {
    const result = await resolvePageId({ pageFlag: 'page_flag_123', config: baseConfig });

    expect(result.pageId).toBe('page_flag_123');
    expect(mockListPages).not.toHaveBeenCalled();
    expect(mockGetInstagram).toHaveBeenCalledWith('page_flag_123');
  });

  it('should fall back to default pageId from config when no flag', async () => {
    const config = { ...baseConfig, defaults: { ...baseConfig.defaults, pageId: 'page_default_456' } };

    const result = await resolvePageId({ config });

    expect(result.pageId).toBe('page_default_456');
    expect(mockListPages).not.toHaveBeenCalled();
    expect(mockGetInstagram).toHaveBeenCalledWith('page_default_456');
  });

  it('should auto-select single page when no default and only one page', async () => {
    mockListPages.mockResolvedValue([
      { id: 'page_single', name: 'Only Page', category: 'Business', instagramAccountId: null },
    ]);

    const result = await resolvePageId({ config: baseConfig });

    expect(result.pageId).toBe('page_single');
    expect(mockListPages).toHaveBeenCalled();
  });

  it('should list pages and prompt when no default and multiple pages', async () => {
    mockListPages.mockResolvedValue([
      { id: 'page_1', name: 'Page One', category: 'Business', instagramAccountId: null },
      { id: 'page_2', name: 'Page Two', category: 'Brand', instagramAccountId: 'ig_222' },
    ]);

    const mockRl = { question: vi.fn().mockResolvedValue('2'), close: vi.fn() };
    mockCreateInterface.mockReturnValue(mockRl as unknown as ReturnType<typeof createInterface>);

    const result = await resolvePageId({ config: baseConfig });

    expect(result.pageId).toBe('page_2');
    expect(mockRl.question).toHaveBeenCalled();
    expect(mockRl.close).toHaveBeenCalled();
  });

  it('should throw error when no pages available', async () => {
    mockListPages.mockResolvedValue([]);

    await expect(resolvePageId({ config: baseConfig })).rejects.toThrow(
      'Nenhuma página encontrada',
    );
  });

  it('should fetch Instagram account for resolved pageId', async () => {
    mockGetInstagram.mockResolvedValue({ id: 'ig_555', name: 'My IG', username: 'myig' });

    const result = await resolvePageId({ pageFlag: 'page_abc', config: baseConfig });

    expect(result.instagramAccountId).toBe('ig_555');
    expect(mockGetInstagram).toHaveBeenCalledWith('page_abc');
  });

  it('should return null instagramAccountId when page has no Instagram connected', async () => {
    mockGetInstagram.mockResolvedValue(null);

    const result = await resolvePageId({ pageFlag: 'page_no_ig', config: baseConfig });

    expect(result.instagramAccountId).toBeNull();
  });

  it('should propagate Meta API error when fetching pages fails', async () => {
    mockListPages.mockRejectedValue(new Error('API Error'));

    await expect(resolvePageId({ config: baseConfig })).rejects.toThrow('API Error');
  });
});
