import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { withRetry } from '../../../src/utils/retry.js';

describe('withRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should succeed on first attempt without retrying', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const result = await withRetry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on 5xx error and succeed on second attempt', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ status: 500, message: 'Internal Server Error' })
      .mockResolvedValue('success');

    const promise = withRetry(fn, { baseDelay: 10 });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should retry on network error (ENOTFOUND) and succeed', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ code: 'ENOTFOUND' })
      .mockResolvedValue('recovered');

    const promise = withRetry(fn, { baseDelay: 10 });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;

    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should NOT retry on 4xx error (throws immediately)', async () => {
    const error = { status: 400, message: 'Bad Request' };
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn)).rejects.toEqual(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should exhaust max attempts and throw last error', async () => {
    vi.useRealTimers();
    const error = { status: 500, message: 'Server Error' };
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxAttempts: 3, baseDelay: 1 })).rejects.toEqual(error);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should apply exponential backoff delays (baseDelay * 3^n)', async () => {
    vi.useRealTimers();
    const error = { status: 500, message: 'Server Error' };
    const fn = vi.fn().mockRejectedValue(error);

    const start = Date.now();
    await expect(withRetry(fn, { maxAttempts: 3, baseDelay: 10 })).rejects.toEqual(error);
    const elapsed = Date.now() - start;

    // baseDelay=10: delays are 10ms (10*3^0) + 30ms (10*3^1) = ~40ms total
    expect(elapsed).toBeGreaterThanOrEqual(30);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should respect Retry-After header for 429 responses', async () => {
    const error = {
      status: 429,
      headers: { 'retry-after': '5' },
    };
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('ok');

    const promise = withRetry(fn, { baseDelay: 1000 });

    // Should wait 5 seconds (from Retry-After), not 1 second (baseDelay)
    await vi.advanceTimersByTimeAsync(5000);
    const result = await promise;

    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should use custom shouldRetry function', async () => {
    const error = new Error('custom error');
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(fn, { shouldRetry: () => false }),
    ).rejects.toThrow('custom error');

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
