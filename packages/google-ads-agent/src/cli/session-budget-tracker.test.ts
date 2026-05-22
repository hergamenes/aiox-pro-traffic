import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('session-budget-tracker', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'sbt-test-'));
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
    vi.resetModules();
  });

  it('returns empty state on first call (file missing)', async () => {
    vi.doMock('node:os', async () => {
      const actual = await vi.importActual<typeof import('node:os')>('node:os');
      return { ...actual, homedir: () => tmpDir };
    });
    const { getSessionBudgetTracker } = await import('./session-budget-tracker.js');
    const state = await getSessionBudgetTracker();
    expect(state.totalMicros).toBe(0);
    expect(state.sessionStart).toBeDefined();
    expect(state.lastUpdate).toBeDefined();
  });

  it('increments total via addToSessionBudget', async () => {
    vi.doMock('node:os', async () => {
      const actual = await vi.importActual<typeof import('node:os')>('node:os');
      return { ...actual, homedir: () => tmpDir };
    });
    const { addToSessionBudget, getSessionBudgetTracker } = await import('./session-budget-tracker.js');
    await addToSessionBudget(5_000_000);
    await addToSessionBudget(3_000_000);
    const state = await getSessionBudgetTracker();
    expect(state.totalMicros).toBe(8_000_000);
  });

  it('resets state after 2h TTL', async () => {
    vi.doMock('node:os', async () => {
      const actual = await vi.importActual<typeof import('node:os')>('node:os');
      return { ...actual, homedir: () => tmpDir };
    });
    const { addToSessionBudget, getSessionBudgetTracker } = await import('./session-budget-tracker.js');
    const now = new Date('2026-05-22T10:00:00Z');
    await addToSessionBudget(5_000_000, now);
    // Read 3h later — should be reset
    const later = new Date('2026-05-22T13:01:00Z');
    const state = await getSessionBudgetTracker(later);
    expect(state.totalMicros).toBe(0);
  });

  it('checkSessionLimit reports exceedsLimit + exceedsHalf correctly', async () => {
    vi.doMock('node:os', async () => {
      const actual = await vi.importActual<typeof import('node:os')>('node:os');
      return { ...actual, homedir: () => tmpDir };
    });
    const { addToSessionBudget, checkSessionLimit } = await import('./session-budget-tracker.js');
    const limit = 500_000_000; // R$ 500

    await addToSessionBudget(200_000_000); // R$ 200
    const check1 = await checkSessionLimit(50_000_000, limit); // proposed total R$ 250
    expect(check1.exceedsLimit).toBe(false);
    expect(check1.exceedsHalf).toBe(false);
    expect(check1.percent).toBeCloseTo(50, 0);

    const check2 = await checkSessionLimit(200_000_000, limit); // proposed total R$ 400
    expect(check2.exceedsLimit).toBe(false);
    expect(check2.exceedsHalf).toBe(true);

    const check3 = await checkSessionLimit(400_000_000, limit); // proposed total R$ 600
    expect(check3.exceedsLimit).toBe(true);
  });
});
