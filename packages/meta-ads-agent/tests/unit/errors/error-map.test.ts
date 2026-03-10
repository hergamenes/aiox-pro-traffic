import { describe, it, expect } from 'vitest';
import { translateMetaError } from '../../../src/errors/error-map.js';

describe('error-map', () => {
  describe('translateMetaError', () => {
    const mappedCodes = [
      { code: 1, message: 'Erro desconhecido da API Meta' },
      { code: 2, message: 'Erro temporário da API Meta' },
      { code: 4, message: 'Limite de chamadas da API atingido' },
      { code: 10, message: 'Permissão negada' },
      { code: 17, message: 'Conta atingiu o limite de campanhas' },
      { code: 32, message: 'Página indisponível' },
      { code: 100, message: 'Parâmetro inválido' },
      { code: 190, message: 'Token de acesso inválido ou expirado' },
      { code: 200, message: 'Permissão insuficiente para esta operação' },
      { code: 275, message: 'Conta em modo somente leitura' },
      { code: 294, message: 'Título do anúncio muito longo' },
      { code: 368, message: 'Conta temporariamente bloqueada' },
      { code: 506, message: 'Campanha duplicada detectada' },
      { code: 803, message: 'Recurso não encontrado' },
      { code: 900, message: 'Limite de campanhas ativas atingido' },
      { code: 1487390, message: 'Anúncio em processo de revisão' },
      { code: 1815149, message: 'Erro de segmentação' },
      { code: 2446, message: 'Criativo rejeitado pela Meta' },
      { code: 2635, message: 'Orçamento diário abaixo do mínimo' },
      { code: 80004, message: 'Limite de taxa para anúncios atingido' },
    ];

    it.each(mappedCodes)(
      'should return correct message for code $code',
      ({ code, message }) => {
        const result = translateMetaError(code);
        expect(result.message).toBe(message);
        expect(result.action).toBeTruthy();
      },
    );

    it('should return generic message for unknown error code', () => {
      const result = translateMetaError(99999);
      expect(result.message).toContain('99999');
      expect(result.action).toBeTruthy();
    });

    it('should interpolate detail when provided for mapped code', () => {
      const result = translateMetaError(100, 'campo X é obrigatório');
      expect(result.message).toBe('Parâmetro inválido: campo X é obrigatório');
      expect(result.action).toBe('Verifique os parâmetros da requisição');
    });

    it('should interpolate detail for unknown code', () => {
      const result = translateMetaError(99999, 'some API detail');
      expect(result.message).toContain('99999');
      expect(result.message).toContain('some API detail');
    });

    it('should return action for all 20 mapped codes', () => {
      for (const { code } of mappedCodes) {
        const result = translateMetaError(code);
        expect(result.action.length).toBeGreaterThan(0);
      }
    });
  });
});
