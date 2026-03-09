import { logger } from '../cli/logger.js';

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  shouldRetry?: (error: unknown) => boolean;
}

const RETRYABLE_NETWORK_CODES = new Set([
  'ENOTFOUND',
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'UND_ERR_CONNECT_TIMEOUT',
]);

function isRetryableError(error: unknown): boolean {
  const err = error as Record<string, unknown>;

  // Network errors
  if (typeof err['code'] === 'string' && RETRYABLE_NETWORK_CODES.has(err['code'])) {
    return true;
  }

  // HTTP 5xx server errors
  if (typeof err['status'] === 'number' && err['status'] >= 500) {
    return true;
  }

  // Rate limit (429) — retryable
  if (typeof err['status'] === 'number' && err['status'] === 429) {
    return true;
  }

  return false;
}

function getRetryAfter(error: unknown): number | null {
  const err = error as Record<string, unknown>;
  const headers = err['headers'] as Record<string, string> | undefined;
  if (headers?.['retry-after']) {
    const seconds = parseInt(headers['retry-after'], 10);
    if (!isNaN(seconds)) return seconds * 1000;
  }
  return null;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? 3;
  const baseDelay = options?.baseDelay ?? 1000;
  const shouldRetry = options?.shouldRetry ?? isRetryableError;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const retryAfter = getRetryAfter(error);
      const delay = retryAfter ?? baseDelay * Math.pow(3, attempt - 1);

      logger.warn(
        `Tentativa ${attempt}/${maxAttempts} falhou. Retentando em ${Math.round(delay / 1000)}s...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
