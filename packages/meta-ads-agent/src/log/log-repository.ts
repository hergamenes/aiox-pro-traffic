import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import { appendFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { logger } from '../cli/logger.js';
import { campaignLogEntrySchema } from '../types/log.js';
import type { CampaignLogEntry, HistoryFilter } from '../types/log.js';
import type { CampaignResult } from '../types/campaign.js';

const LOG_FILE = 'campaigns.log';
const MAX_ENTRIES = 10_000;

function getLogDir(): string {
  return join(homedir(), '.meta-ads');
}

function getLogPath(): string {
  return join(getLogDir(), LOG_FILE);
}

export async function logCampaign(
  result: CampaignResult,
  creativeFiles: string[],
  pageId: string,
): Promise<void> {
  await mkdir(getLogDir(), { recursive: true });

  const entry: CampaignLogEntry = {
    campaignId: result.campaignId,
    campaignName: result.campaignName,
    type: result.type,
    dailyBudget: result.dailyBudget,
    adSetId: result.adSetId,
    adId: result.adId,
    status: result.status,
    creativeFormat: result.creativeFormat,
    creativeFiles,
    pageId,
    adsManagerUrl: result.adsManagerUrl,
    createdAt: result.createdAt.toISOString(),
  };

  const line = JSON.stringify(entry) + '\n';
  await appendFile(getLogPath(), line, 'utf-8');

  // Check rotation
  const count = await countLines();
  if (count >= MAX_ENTRIES) {
    await rotateLog();
  }
}

export async function readHistory(filter?: HistoryFilter): Promise<CampaignLogEntry[]> {
  const logPath = getLogPath();

  let content: string;
  try {
    content = await readFile(logPath, 'utf-8');
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const lines = content.split('\n').filter(Boolean);
  let entries: CampaignLogEntry[] = [];

  for (const line of lines) {
    try {
      const parsed = campaignLogEntrySchema.parse(JSON.parse(line));
      entries.push(parsed);
    } catch {
      logger.warn({ line: line.substring(0, 80) }, 'Skipping malformed log entry');
    }
  }

  // Sort DESC by date
  entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply filters
  if (filter?.type) {
    entries = entries.filter((e) => e.type === filter.type);
  }

  if (filter?.date) {
    entries = entries.filter((e) => {
      const d = new Date(e.createdAt);
      const parts = filter.date!.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = 2000 + parseInt(parts[2], 10);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  // Apply limit
  if (!filter?.all) {
    const limit = filter?.limit ?? 20;
    entries = entries.slice(0, limit);
  }

  return entries;
}

export async function rotateLog(): Promise<void> {
  const logPath = getLogPath();
  const now = new Date();
  const dateSuffix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const archivePath = join(getLogDir(), `campaigns-${dateSuffix}.log`);

  await rename(logPath, archivePath);
  await writeFile(logPath, '', 'utf-8');

  logger.info({ archivePath }, 'Campaign log rotated');
}

export function formatCsv(entries: CampaignLogEntry[]): string {
  const BOM = '\uFEFF';
  const headers = 'Nome,Tipo,Orçamento,Status,Criativo,Data';

  const rows = entries.map((e) => {
    const name = escapeCsv(e.campaignName);
    const type = e.type;
    const budget = e.dailyBudget.toFixed(2);
    const status = e.status;
    const creative = escapeCsv(e.creativeFiles.join('; '));
    const date = formatDate(e.createdAt);
    return `${name},${type},${budget},${status},${creative},${date}`;
  });

  return BOM + [headers, ...rows].join('\n') + '\n';
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(2);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function countLines(): Promise<number> {
  const logPath = getLogPath();
  try {
    const info = await stat(logPath);
    if (info.size === 0) return 0;
    const content = await readFile(logPath, 'utf-8');
    return content.split('\n').filter(Boolean).length;
  } catch {
    return 0;
  }
}
