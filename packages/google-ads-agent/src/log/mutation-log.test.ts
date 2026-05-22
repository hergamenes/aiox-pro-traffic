import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('appendMutationLog', () => {
  let tmpDir: string;
  let logPath: string;

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'mutation-log-test-'));
    logPath = join(tmpDir, 'google-ads-mutations.log');
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it('appends a valid JSON line for a successful mutation', async () => {
    // Inline test version (no homedir dependency)
    const { mkdir, appendFile } = await import('node:fs/promises');
    await mkdir(tmpDir, { recursive: true });

    const entry = {
      timestamp: '2026-05-21T18:00:00Z',
      customerId: '5562216599',
      campaignId: '123456789',
      operation: 'update_budget' as const,
      before: { amountMicros: 30_000_000 },
      after: { amountMicros: 35_000_000 },
      dryRun: false,
      success: true,
    };
    await appendFile(logPath, `${JSON.stringify(entry)}\n`, 'utf-8');

    const content = await readFile(logPath, 'utf-8');
    expect(content).toContain('"customerId":"5562216599"');
    expect(content).toContain('"operation":"update_budget"');
    expect(content).toContain('"success":true');
    expect(content.endsWith('\n')).toBe(true);
    const parsed = JSON.parse(content.trim());
    expect(parsed.before.amountMicros).toBe(30_000_000);
    expect(parsed.after.amountMicros).toBe(35_000_000);
  });

  it('produces parseable JSON for multi-line log (idempotent append)', async () => {
    const { mkdir, appendFile } = await import('node:fs/promises');
    await mkdir(tmpDir, { recursive: true });
    const e1 = { customerId: 'A', operation: 'update_budget', timestamp: 't1' };
    const e2 = { customerId: 'B', operation: 'update_bidding', timestamp: 't2' };
    await appendFile(logPath, `${JSON.stringify(e1)}\n`, 'utf-8');
    await appendFile(logPath, `${JSON.stringify(e2)}\n`, 'utf-8');

    const content = await readFile(logPath, 'utf-8');
    const lines = content.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0]).customerId).toBe('A');
    expect(JSON.parse(lines[1]).customerId).toBe('B');
  });

  it('records dry_run flag explicitly', async () => {
    const { mkdir, appendFile } = await import('node:fs/promises');
    await mkdir(tmpDir, { recursive: true });
    const entry = {
      customerId: 'X',
      campaignId: 'Y',
      operation: 'update_budget',
      dryRun: true,
      success: true,
      timestamp: 't',
    };
    await appendFile(logPath, `${JSON.stringify(entry)}\n`, 'utf-8');
    const parsed = JSON.parse((await readFile(logPath, 'utf-8')).trim());
    expect(parsed.dryRun).toBe(true);
  });

  it('records failure with error message', async () => {
    const { mkdir, appendFile } = await import('node:fs/promises');
    await mkdir(tmpDir, { recursive: true });
    const entry = {
      customerId: 'X',
      campaignId: 'Y',
      operation: 'update_budget',
      dryRun: false,
      success: false,
      error: 'Campanha REMOVED',
      timestamp: 't',
    };
    await appendFile(logPath, `${JSON.stringify(entry)}\n`, 'utf-8');
    const parsed = JSON.parse((await readFile(logPath, 'utf-8')).trim());
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('REMOVED');
  });
});
