import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { logger } from './logger.js';

export const SESSION_BUDGET_DIR = join(homedir(), '.aiox');
export const SESSION_BUDGET_FILE = join(SESSION_BUDGET_DIR, 'google-ads-session.json');

/** Reset session after 2 hours of inactivity. */
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

interface SessionState {
  totalMicros: number;
  sessionStart: string; // ISO timestamp
  lastUpdate: string;   // ISO timestamp
}

const EMPTY_STATE = (): SessionState => ({
  totalMicros: 0,
  sessionStart: new Date().toISOString(),
  lastUpdate: new Date().toISOString(),
});

function isStale(state: SessionState, now: Date): boolean {
  const last = new Date(state.lastUpdate);
  if (Number.isNaN(last.getTime())) return true;
  return now.getTime() - last.getTime() > SESSION_TTL_MS;
}

/**
 * Reads current session budget. Returns zeroed state if file doesn't
 * exist, is malformed, or is older than the TTL.
 */
export async function getSessionBudgetTracker(now: Date = new Date()): Promise<SessionState> {
  try {
    const raw = await readFile(SESSION_BUDGET_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as SessionState;
    if (
      typeof parsed.totalMicros !== 'number' ||
      typeof parsed.sessionStart !== 'string' ||
      typeof parsed.lastUpdate !== 'string'
    ) {
      return EMPTY_STATE();
    }
    if (isStale(parsed, now)) {
      logger.debug({ lastUpdate: parsed.lastUpdate }, 'Session budget expired — resetting');
      return EMPTY_STATE();
    }
    return parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      logger.debug({ err }, 'Session budget file unreadable — starting fresh');
    }
    return EMPTY_STATE();
  }
}

/**
 * Increments session budget total and persists. Fire-and-forget — fs
 * failures are logged but do not block the caller.
 */
export async function addToSessionBudget(micros: number, now: Date = new Date()): Promise<void> {
  try {
    const current = await getSessionBudgetTracker(now);
    const updated: SessionState = {
      totalMicros: current.totalMicros + micros,
      sessionStart: current.sessionStart,
      lastUpdate: now.toISOString(),
    };
    await mkdir(SESSION_BUDGET_DIR, { recursive: true });
    await writeFile(SESSION_BUDGET_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    logger.warn({ err }, 'Failed to persist session budget — mutation outcome unaffected');
  }
}

export interface SessionLimitCheck {
  ok: boolean;
  currentMicros: number;
  proposedTotalMicros: number;
  limitMicros: number;
  percent: number;
  exceedsLimit: boolean;
  exceedsHalf: boolean;
}

/**
 * Checks if adding `additionalMicros` would exceed the session limit.
 * Does NOT mutate state — caller decides whether to proceed.
 */
export async function checkSessionLimit(
  additionalMicros: number,
  limitMicros: number,
  now: Date = new Date(),
): Promise<SessionLimitCheck> {
  const current = await getSessionBudgetTracker(now);
  const proposedTotal = current.totalMicros + additionalMicros;
  const percent = limitMicros > 0 ? (proposedTotal / limitMicros) * 100 : 0;
  return {
    ok: proposedTotal <= limitMicros,
    currentMicros: current.totalMicros,
    proposedTotalMicros: proposedTotal,
    limitMicros,
    percent,
    exceedsLimit: proposedTotal > limitMicros,
    exceedsHalf: proposedTotal > limitMicros / 2,
  };
}
