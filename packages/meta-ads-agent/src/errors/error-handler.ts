import { logger } from '../cli/logger.js';
import { translateMetaError } from './error-map.js';
import { AppError, MetaApiError } from './types.js';

interface ErrorResult {
  message: string;
  action: string;
  shouldLog: boolean;
}

const NETWORK_ERROR_CODES = new Set([
  'ENOTFOUND',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ECONNRESET',
  'ERR_NETWORK',
]);

const NETWORK_MESSAGES: Record<string, { message: string; action: string }> = {
  ENOTFOUND: {
    message: 'Servidor não encontrado. Verifique sua conexão com a internet.',
    action: 'Verifique sua conexão e tente novamente',
  },
  ETIMEDOUT: {
    message: 'Tempo de conexão esgotado.',
    action: 'Verifique sua conexão e tente novamente',
  },
  ECONNREFUSED: {
    message: 'Conexão recusada pelo servidor.',
    action: 'Tente novamente em alguns minutos',
  },
  ECONNRESET: {
    message: 'Conexão interrompida.',
    action: 'Verifique sua conexão e tente novamente',
  },
  ERR_NETWORK: {
    message: 'Erro de rede.',
    action: 'Verifique sua conexão e tente novamente',
  },
};

function isNetworkError(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null;
  const err = error as Record<string, unknown>;
  const code = err['code'] as string | undefined;
  if (code && NETWORK_ERROR_CODES.has(code)) {
    return code;
  }
  return null;
}

export function handleError(error: unknown): ErrorResult {
  // Known app errors — already have message + action
  if (error instanceof AppError) {
    if (error instanceof MetaApiError) {
      const translated = translateMetaError(error.metaErrorCode);
      return {
        message: error.message || translated.message,
        action: error.action || translated.action,
        shouldLog: false,
      };
    }
    return {
      message: error.message,
      action: error.action,
      shouldLog: false,
    };
  }

  // Network errors
  const networkCode = isNetworkError(error);
  if (networkCode) {
    const info = NETWORK_MESSAGES[networkCode]!;
    return {
      message: info.message,
      action: info.action,
      shouldLog: false,
    };
  }

  // Unexpected errors — log stack trace, return generic message
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error({ err, stack: err.stack }, 'Unexpected error');

  return {
    message: 'Erro inesperado. Detalhes salvos em log.',
    action: 'Se o erro persistir, contate o suporte',
    shouldLog: true,
  };
}
