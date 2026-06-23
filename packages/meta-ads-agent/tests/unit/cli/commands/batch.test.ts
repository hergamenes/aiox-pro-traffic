import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseDelay } from '../../../../src/cli/commands/batch.js';

describe('batch/parseDelay', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('uses the default 2000ms when --delay is omitted', () => {
    expect(parseDelay(undefined)).toBe(2000);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('parses a valid numeric delay', () => {
    expect(parseDelay('5000')).toBe(5000);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('accepts zero (no pause between campaigns)', () => {
    expect(parseDelay('0')).toBe(0);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('falls back to default and warns when value is non-numeric (NaN)', () => {
    expect(parseDelay('abc')).toBe(2000);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toContain('inválido');
  });

  it('falls back to default and warns when value is negative', () => {
    expect(parseDelay('-500')).toBe(2000);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toContain('inválido');
  });
});
