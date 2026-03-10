import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { handleError } from '../../../src/errors/error-handler.js';
import {
  MetaApiError,
  NetworkError,
  ValidationError,
  CreativeError,
  AuthError,
} from '../../../src/errors/types.js';

describe('error-handler', () => {
  describe('handleError', () => {
    it('should handle MetaApiError and translate', () => {
      const error = new MetaApiError('Token de acesso inválido ou expirado', 190, 'Execute: meta-ads auth setup');
      const result = handleError(error);
      expect(result.message).toContain('Token');
      expect(result.action).toBeTruthy();
      expect(result.shouldLog).toBe(false);
    });

    it('should handle ValidationError', () => {
      const error = new ValidationError('Campo obrigatório', 'Preencha o campo');
      const result = handleError(error);
      expect(result.message).toBe('Campo obrigatório');
      expect(result.action).toBe('Preencha o campo');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle NetworkError', () => {
      const error = new NetworkError('Erro de rede', 'Tente novamente');
      const result = handleError(error);
      expect(result.message).toBe('Erro de rede');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle CreativeError', () => {
      const error = new CreativeError('Imagem inválida');
      const result = handleError(error);
      expect(result.message).toBe('Imagem inválida');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle AuthError', () => {
      const error = new AuthError('Token não encontrado', 'Execute auth setup');
      const result = handleError(error);
      expect(result.message).toBe('Token não encontrado');
      expect(result.action).toBe('Execute auth setup');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle ENOTFOUND network error', () => {
      const error = { code: 'ENOTFOUND', message: 'getaddrinfo ENOTFOUND' };
      const result = handleError(error);
      expect(result.message).toContain('Servidor não encontrado');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle ETIMEDOUT network error', () => {
      const error = { code: 'ETIMEDOUT' };
      const result = handleError(error);
      expect(result.message).toContain('Tempo de conexão esgotado');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle ECONNREFUSED network error', () => {
      const error = { code: 'ECONNREFUSED' };
      const result = handleError(error);
      expect(result.message).toContain('Conexão recusada');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle ECONNRESET network error', () => {
      const error = { code: 'ECONNRESET' };
      const result = handleError(error);
      expect(result.message).toContain('Conexão interrompida');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle ERR_NETWORK error', () => {
      const error = { code: 'ERR_NETWORK' };
      const result = handleError(error);
      expect(result.message).toContain('Erro de rede');
      expect(result.shouldLog).toBe(false);
    });

    it('should handle unexpected Error with shouldLog=true', () => {
      const error = new Error('Something broke');
      const result = handleError(error);
      expect(result.message).toBe('Erro inesperado. Detalhes salvos em log.');
      expect(result.shouldLog).toBe(true);
    });

    it('should handle unexpected string error with shouldLog=true', () => {
      const result = handleError('some random string');
      expect(result.message).toBe('Erro inesperado. Detalhes salvos em log.');
      expect(result.shouldLog).toBe(true);
    });

    it('should handle null error gracefully', () => {
      const result = handleError(null);
      expect(result.message).toBe('Erro inesperado. Detalhes salvos em log.');
      expect(result.shouldLog).toBe(true);
    });
  });
});
