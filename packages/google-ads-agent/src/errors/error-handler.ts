import { logger } from '../cli/logger.js';
import { translateCode } from './error-map.js';
import { AppError, GoogleAdsApiError } from './types.js';
import { COLORS } from '../cli/display.js';

export interface ErrorResult {
  message: string;
  action: string;
  shouldLog: boolean;
}

interface ErrorWithCode {
  code?: string | number;
  message?: string;
  errors?: Array<{ error_code?: Record<string, string | number>; message?: string }>;
}

function isErrorWithCode(value: unknown): value is ErrorWithCode {
  return typeof value === 'object' && value !== null;
}

export function classifyError(err: unknown): ErrorResult {
  if (err instanceof AppError) {
    return {
      message: err.message,
      action: err.action ?? '',
      shouldLog: false,
    };
  }

  if (err instanceof GoogleAdsApiError) {
    const translation = translateCode(err.code);
    if (translation) {
      return { ...translation, shouldLog: false };
    }
    return {
      message: err.message,
      action: 'Verifique os logs para detalhes (GOOGLE_ADS_DEBUG=1).',
      shouldLog: true,
    };
  }

  if (isErrorWithCode(err)) {
    // Network errors (Node code: ENOTFOUND, ETIMEDOUT, etc)
    if (err.code) {
      const translation = translateCode(err.code);
      if (translation) {
        return { ...translation, shouldLog: false };
      }
    }
    // Google Ads SDK errors with nested errors array
    if (Array.isArray(err.errors) && err.errors.length > 0) {
      const first = err.errors[0];
      const codeMap = first?.error_code ?? {};
      // Try each value in the code map (Google Ads SDK can nest codes
      // under various keys: query_error, authentication_error, ...).
      for (const codeValue of Object.values(codeMap)) {
        const translation = translateCode(codeValue);
        if (translation) {
          return { ...translation, shouldLog: false };
        }
      }
      // Fallback: substring match on the original message (covers cases
      // where the SDK code key shape is unexpected).
      const msg = String(first?.message ?? '').toLowerCase();
      if (msg.includes('manager account')) {
        const t = translateCode('REQUESTED_METRICS_FOR_MANAGER');
        if (t) return { ...t, shouldLog: false };
      }
      return {
        message: first?.message ?? 'Erro desconhecido da API Google Ads.',
        action: 'Verifique os logs para detalhes.',
        shouldLog: true,
      };
    }
  }

  const fallbackMessage =
    err instanceof Error ? err.message : 'Erro desconhecido.';
  return {
    message: fallbackMessage,
    action: 'Verifique os logs para detalhes (GOOGLE_ADS_DEBUG=1).',
    shouldLog: true,
  };
}

export function handleError(err: unknown): ErrorResult {
  const result = classifyError(err);
  if (result.shouldLog) {
    logger.error({ err }, 'Unhandled error');
  } else {
    logger.debug({ err }, 'Handled error');
  }
  return result;
}

export function printError(err: unknown): void {
  const { message, action } = handleError(err);
  console.error(`${COLORS.red}✗ ${message}${COLORS.reset}`);
  if (action) {
    console.error(`${COLORS.dim}→ ${action}${COLORS.reset}`);
  }
}
