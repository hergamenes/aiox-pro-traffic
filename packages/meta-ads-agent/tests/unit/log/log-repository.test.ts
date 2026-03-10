import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

let testHomeDir: string;

vi.mock('node:os', async () => {
  const actual = await vi.importActual<typeof import('node:os')>('node:os');
  return {
    ...actual,
    homedir: () => testHomeDir,
  };
});

import type { CampaignResult } from '../../../src/types/campaign.js';
import type { CampaignLogEntry } from '../../../src/types/log.js';

function makeCampaignResult(overrides: Partial<CampaignResult> = {}): CampaignResult {
  return {
    campaignId: '120210123456',
    campaignName: 'PPT_VENDAS_COMPRA_09-03-26_Test',
    adSetId: '120210789012',
    adId: '120210345678',
    type: 'sales',
    dailyBudget: 50,
    status: 'ACTIVE',
    creativeFormat: 'single_image',
    adsManagerUrl: 'https://www.facebook.com/adsmanager/manage/campaigns?act=123&campaign_ids=120210123456',
    createdAt: new Date('2026-03-09T14:30:00.000Z'),
    ...overrides,
  };
}

function makeLogEntry(overrides: Partial<CampaignLogEntry> = {}): CampaignLogEntry {
  return {
    campaignId: '120210123456',
    campaignName: 'PPT_VENDAS_COMPRA_09-03-26_Test',
    type: 'sales',
    dailyBudget: 50,
    adSetId: '120210789012',
    adId: '120210345678',
    status: 'ACTIVE',
    creativeFormat: 'single_image',
    creativeFiles: ['img1.jpg'],
    pageId: '987654321',
    adsManagerUrl: 'https://www.facebook.com/adsmanager/manage/campaigns?act=123&campaign_ids=120210123456',
    createdAt: '2026-03-09T14:30:00.000Z',
    ...overrides,
  };
}

describe('log-repository', () => {
  let logDir: string;

  beforeEach(async () => {
    testHomeDir = await mkdtemp(join(tmpdir(), 'meta-ads-home-'));
    logDir = join(testHomeDir, '.meta-ads');
  });

  afterEach(async () => {
    await rm(testHomeDir, { recursive: true, force: true });
  });

  describe('logCampaign', () => {
    it('should append JSON line to log file', async () => {
      const { logCampaign } = await import('../../../src/log/log-repository.js');
      const result = makeCampaignResult();
      await logCampaign(result, ['img1.jpg'], '987654321');

      const logPath = join(logDir, 'campaigns.log');
      const content = await readFile(logPath, 'utf-8');
      const lines = content.split('\n').filter(Boolean);

      expect(lines).toHaveLength(1);
      const parsed = JSON.parse(lines[0]);
      expect(parsed.campaignId).toBe('120210123456');
      expect(parsed.creativeFiles).toEqual(['img1.jpg']);
      expect(parsed.pageId).toBe('987654321');
    });

    it('should append multiple entries', async () => {
      const { logCampaign } = await import('../../../src/log/log-repository.js');
      const result1 = makeCampaignResult({ campaignId: 'c1' });
      const result2 = makeCampaignResult({ campaignId: 'c2' });

      await logCampaign(result1, ['img1.jpg'], '123');
      await logCampaign(result2, ['img2.jpg'], '456');

      const logPath = join(logDir, 'campaigns.log');
      const content = await readFile(logPath, 'utf-8');
      const lines = content.split('\n').filter(Boolean);

      expect(lines).toHaveLength(2);
    });
  });

  describe('readHistory', () => {
    it('should return entries sorted DESC by date', async () => {
      const { readHistory } = await import('../../../src/log/log-repository.js');
      const entry1 = makeLogEntry({ createdAt: '2026-03-08T10:00:00.000Z', campaignName: 'Older' });
      const entry2 = makeLogEntry({ createdAt: '2026-03-09T14:30:00.000Z', campaignName: 'Newer' });

      await mkdir(logDir, { recursive: true });
      await writeFile(join(logDir, 'campaigns.log'), JSON.stringify(entry1) + '\n' + JSON.stringify(entry2) + '\n', 'utf-8');

      const entries = await readHistory();

      expect(entries).toHaveLength(2);
      expect(entries[0].campaignName).toBe('Newer');
      expect(entries[1].campaignName).toBe('Older');
    });

    it('should return empty array when file not found', async () => {
      const { readHistory } = await import('../../../src/log/log-repository.js');
      const entries = await readHistory();
      expect(entries).toEqual([]);
    });

    it('should filter by type', async () => {
      const { readHistory } = await import('../../../src/log/log-repository.js');
      const entry1 = makeLogEntry({ type: 'sales', campaignName: 'Sales1' });
      const entry2 = makeLogEntry({ type: 'leads', campaignName: 'Leads1' });

      await mkdir(logDir, { recursive: true });
      await writeFile(join(logDir, 'campaigns.log'), JSON.stringify(entry1) + '\n' + JSON.stringify(entry2) + '\n', 'utf-8');

      const entries = await readHistory({ type: 'sales' });

      expect(entries).toHaveLength(1);
      expect(entries[0].campaignName).toBe('Sales1');
    });

    it('should filter by date', async () => {
      const { readHistory } = await import('../../../src/log/log-repository.js');
      const entry1 = makeLogEntry({ createdAt: '2026-03-09T14:30:00.000Z', campaignName: 'Match' });
      const entry2 = makeLogEntry({ createdAt: '2026-03-10T10:00:00.000Z', campaignName: 'NoMatch' });

      await mkdir(logDir, { recursive: true });
      await writeFile(join(logDir, 'campaigns.log'), JSON.stringify(entry1) + '\n' + JSON.stringify(entry2) + '\n', 'utf-8');

      const entries = await readHistory({ date: '09-03-26' });

      expect(entries).toHaveLength(1);
      expect(entries[0].campaignName).toBe('Match');
    });

    it('should respect limit', async () => {
      const { readHistory } = await import('../../../src/log/log-repository.js');
      const lines: string[] = [];
      for (let i = 0; i < 30; i++) {
        lines.push(JSON.stringify(makeLogEntry({ campaignName: `Campaign ${i}` })));
      }

      await mkdir(logDir, { recursive: true });
      await writeFile(join(logDir, 'campaigns.log'), lines.join('\n') + '\n', 'utf-8');

      const entries = await readHistory({ limit: 5 });

      expect(entries).toHaveLength(5);
    });

    it('should default to 20 entries', async () => {
      const { readHistory } = await import('../../../src/log/log-repository.js');
      const lines: string[] = [];
      for (let i = 0; i < 30; i++) {
        lines.push(JSON.stringify(makeLogEntry({ campaignName: `Campaign ${i}` })));
      }

      await mkdir(logDir, { recursive: true });
      await writeFile(join(logDir, 'campaigns.log'), lines.join('\n') + '\n', 'utf-8');

      const entries = await readHistory();

      expect(entries).toHaveLength(20);
    });

    it('should return all entries with all flag', async () => {
      const { readHistory } = await import('../../../src/log/log-repository.js');
      const lines: string[] = [];
      for (let i = 0; i < 30; i++) {
        lines.push(JSON.stringify(makeLogEntry({ campaignName: `Campaign ${i}` })));
      }

      await mkdir(logDir, { recursive: true });
      await writeFile(join(logDir, 'campaigns.log'), lines.join('\n') + '\n', 'utf-8');

      const entries = await readHistory({ all: true });

      expect(entries).toHaveLength(30);
    });

    it('should skip malformed lines gracefully', async () => {
      const { readHistory } = await import('../../../src/log/log-repository.js');
      const valid = makeLogEntry({ campaignName: 'Valid' });

      await mkdir(logDir, { recursive: true });
      await writeFile(join(logDir, 'campaigns.log'), JSON.stringify(valid) + '\n' + 'not-json\n', 'utf-8');

      const entries = await readHistory();

      expect(entries).toHaveLength(1);
      expect(entries[0].campaignName).toBe('Valid');
    });
  });

  describe('rotateLog', () => {
    it('should rename file and create empty log', async () => {
      const { rotateLog } = await import('../../../src/log/log-repository.js');
      const logPath = join(logDir, 'campaigns.log');

      await mkdir(logDir, { recursive: true });
      await writeFile(logPath, JSON.stringify(makeLogEntry()) + '\n', 'utf-8');

      await rotateLog();

      const newContent = await readFile(logPath, 'utf-8');
      expect(newContent).toBe('');

      const { readdir } = await import('node:fs/promises');
      const files = await readdir(logDir);
      const archives = files.filter((f) => f.startsWith('campaigns-') && f.endsWith('.log'));
      expect(archives).toHaveLength(1);
    });
  });

  describe('formatCsv', () => {
    it('should generate valid CSV with headers', async () => {
      const { formatCsv } = await import('../../../src/log/log-repository.js');
      const entries = [makeLogEntry()];
      const csv = formatCsv(entries);

      expect(csv).toContain('\uFEFF');
      expect(csv).toContain('Nome,Tipo,Orçamento,Status,Criativo,Data');
      expect(csv).toContain('PPT_VENDAS_COMPRA_09-03-26_Test');
      expect(csv).toContain('sales');
      expect(csv).toContain('50.00');
    });

    it('should escape fields with commas', async () => {
      const { formatCsv } = await import('../../../src/log/log-repository.js');
      const entry = makeLogEntry({ campaignName: 'Name, with comma' });
      const csv = formatCsv([entry]);

      expect(csv).toContain('"Name, with comma"');
    });

    it('should escape fields with quotes', async () => {
      const { formatCsv } = await import('../../../src/log/log-repository.js');
      const entry = makeLogEntry({ campaignName: 'Name "quoted"' });
      const csv = formatCsv([entry]);

      expect(csv).toContain('"Name ""quoted"""');
    });

    it('should return CSV with only headers for empty array', async () => {
      const { formatCsv } = await import('../../../src/log/log-repository.js');
      const csv = formatCsv([]);

      expect(csv).toContain('Nome,Tipo');
      const lines = csv.split('\n').filter(Boolean);
      expect(lines).toHaveLength(1);
    });
  });
});
