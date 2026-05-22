import { describe, it, expect } from 'vitest';
import {
  parseStatusEnum,
  getTargetStatus,
  isLearningPhase,
} from './status-validator.js';

describe('parseStatusEnum', () => {
  it('parses numeric 2 as ENABLED', () => {
    expect(parseStatusEnum(2)).toBe('ENABLED');
  });

  it('parses string "2" as ENABLED', () => {
    expect(parseStatusEnum('2')).toBe('ENABLED');
  });

  it('parses numeric 3 as PAUSED', () => {
    expect(parseStatusEnum(3)).toBe('PAUSED');
  });

  it('parses numeric 4 as REMOVED', () => {
    expect(parseStatusEnum(4)).toBe('REMOVED');
  });

  it('parses named string "ENABLED" (case-insensitive)', () => {
    expect(parseStatusEnum('ENABLED')).toBe('ENABLED');
    expect(parseStatusEnum('enabled')).toBe('ENABLED');
  });

  it('parses named strings PAUSED and REMOVED', () => {
    expect(parseStatusEnum('PAUSED')).toBe('PAUSED');
    expect(parseStatusEnum('REMOVED')).toBe('REMOVED');
  });

  it('returns UNKNOWN for unrecognized values', () => {
    expect(parseStatusEnum('FOO')).toBe('UNKNOWN');
    expect(parseStatusEnum(99)).toBe('UNKNOWN');
    expect(parseStatusEnum(0)).toBe('UNKNOWN');
  });

  it('returns UNKNOWN for null/undefined', () => {
    expect(parseStatusEnum(null)).toBe('UNKNOWN');
    expect(parseStatusEnum(undefined)).toBe('UNKNOWN');
  });

  it('trims whitespace before matching', () => {
    expect(parseStatusEnum('  ENABLED  ')).toBe('ENABLED');
  });
});

describe('getTargetStatus', () => {
  it('returns PAUSED for pause operation', () => {
    expect(getTargetStatus('pause')).toBe('PAUSED');
  });

  it('returns ENABLED for enable operation', () => {
    expect(getTargetStatus('enable')).toBe('ENABLED');
  });
});

describe('isLearningPhase', () => {
  const now = new Date('2026-05-22T12:00:00Z');

  it('returns true for date 1 day ago', () => {
    expect(isLearningPhase('2026-05-21T12:00:00Z', now)).toBe(true);
  });

  it('returns true for date 7 days ago', () => {
    expect(isLearningPhase('2026-05-15T12:00:00Z', now)).toBe(true);
  });

  it('returns true for date 13 days ago', () => {
    expect(isLearningPhase('2026-05-09T12:00:00Z', now)).toBe(true);
  });

  it('returns false for date EXACTLY 14 days ago (boundary)', () => {
    expect(isLearningPhase('2026-05-08T12:00:00Z', now)).toBe(false);
  });

  it('returns false for date 30 days ago', () => {
    expect(isLearningPhase('2026-04-22T12:00:00Z', now)).toBe(false);
  });

  it('returns false for undefined/empty input', () => {
    expect(isLearningPhase(undefined, now)).toBe(false);
    expect(isLearningPhase('', now)).toBe(false);
  });

  it('returns false for invalid date string', () => {
    expect(isLearningPhase('not-a-date', now)).toBe(false);
  });

  it('returns false for future dates (defensive)', () => {
    expect(isLearningPhase('2027-01-01', now)).toBe(false);
  });

  it('accepts date-only ISO format (YYYY-MM-DD)', () => {
    expect(isLearningPhase('2026-05-20', now)).toBe(true);
  });
});
