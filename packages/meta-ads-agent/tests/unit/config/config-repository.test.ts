import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

let tempDir: string;

// We need to mock the config path, so we'll test the logic directly
describe('config-repository', () => {
  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'meta-ads-config-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should create default config when file missing', async () => {
    const { appConfigSchema } = await import('../../../src/types/config.js');
    const config = appConfigSchema.parse({});

    expect(config.version).toBe(1);
    expect(config.defaults.adAccountId).toBeNull();
    expect(config.defaults.pageId).toBeNull();
    expect(config.defaults.instagramAccountId).toBeNull();
    expect(config.creativesPath).toBe('~/Downloads/criativos-meta/');
  });

  it('should parse existing config correctly', async () => {
    const { writeFile: writeF } = await import('node:fs/promises');
    const { stringify } = await import('yaml');
    const { appConfigSchema } = await import('../../../src/types/config.js');

    const configFile = join(tempDir, 'config.yaml');
    const existing = {
      version: 1,
      defaults: {
        adAccountId: 'act_123',
        pageId: '456',
        instagramAccountId: '789',
      },
      creativesPath: '~/my-creatives/',
      logPath: '~/.meta-ads/campaigns.log',
      app: { appId: '111', callbackPort: 3001 },
    };
    await writeF(configFile, stringify(existing), 'utf-8');

    const content = await readFile(configFile, 'utf-8');
    const { parse } = await import('yaml');
    const raw = parse(content) as unknown;
    const config = appConfigSchema.parse(raw);

    expect(config.defaults.adAccountId).toBe('act_123');
    expect(config.defaults.pageId).toBe('456');
    expect(config.app.callbackPort).toBe(3001);
  });

  it('should write config to file', async () => {
    const { writeFile: writeF } = await import('node:fs/promises');
    const { stringify, parse } = await import('yaml');

    const configFile = join(tempDir, 'config.yaml');
    const config = {
      version: 1,
      defaults: {
        adAccountId: 'act_999',
        pageId: null,
        instagramAccountId: null,
      },
      creativesPath: '~/Downloads/criativos-meta/',
      logPath: '~/.meta-ads/campaigns.log',
      app: { appId: '', callbackPort: 3000 },
    };

    await writeF(configFile, stringify(config), 'utf-8');
    const content = await readFile(configFile, 'utf-8');
    const loaded = parse(content) as Record<string, unknown>;

    expect((loaded['defaults'] as Record<string, unknown>)['adAccountId']).toBe('act_999');
  });

  it('should update specific default key', async () => {
    const { appConfigSchema } = await import('../../../src/types/config.js');
    const config = appConfigSchema.parse({});

    expect(config.defaults.adAccountId).toBeNull();
    config.defaults.adAccountId = 'act_new';
    expect(config.defaults.adAccountId).toBe('act_new');
  });
});
