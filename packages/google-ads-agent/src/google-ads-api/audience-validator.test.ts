import { describe, it, expect } from 'vitest';
import {
  validateAudienceName,
  validateMembershipDays,
  MAX_AUDIENCE_NAME_LENGTH,
} from './audience-validator.js';

describe('validateAudienceName', () => {
  it('rejeita nome vazio', () => {
    const r = validateAudienceName('');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/vazio/i);
  });

  it('rejeita nome só com espaços', () => {
    expect(validateAudienceName('   ').valid).toBe(false);
  });

  it('rejeita nome com 256 caracteres', () => {
    const r = validateAudienceName('a'.repeat(MAX_AUDIENCE_NAME_LENGTH + 1));
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/255/);
  });

  it('aceita nome no limite exato de 255 caracteres', () => {
    expect(validateAudienceName('a'.repeat(MAX_AUDIENCE_NAME_LENGTH)).valid).toBe(true);
  });

  it('aceita um nome normal', () => {
    expect(validateAudienceName('Remarketing - todos os visitantes').valid).toBe(true);
  });
});

describe('validateMembershipDays', () => {
  it('rejeita 0 (abaixo da faixa)', () => {
    const r = validateMembershipDays(0);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/faixa/i);
  });

  it('rejeita 541 (acima da faixa)', () => {
    const r = validateMembershipDays(541);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/540/);
  });

  it('rejeita valor não inteiro', () => {
    expect(validateMembershipDays(30.5).valid).toBe(false);
  });

  it('rejeita NaN', () => {
    expect(validateMembershipDays(Number.NaN).valid).toBe(false);
  });

  it('aceita o limite inferior 1', () => {
    expect(validateMembershipDays(1).valid).toBe(true);
  });

  it('aceita o limite superior 540', () => {
    expect(validateMembershipDays(540).valid).toBe(true);
  });

  it('aceita um valor no meio da faixa', () => {
    expect(validateMembershipDays(90).valid).toBe(true);
  });
});
