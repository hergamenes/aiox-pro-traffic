import { describe, it, expect } from 'vitest';
import {
  validateAudienceName,
  validateMembershipDays,
  validateUserListResourceName,
  validateAudienceTargetLevel,
  validateAudienceTargetMode,
  parseCommaSeparatedList,
  validateCustomSegmentMembers,
  validateCustomAudienceType,
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

describe('validateUserListResourceName', () => {
  it('rejeita valor vazio', () => {
    const r = validateUserListResourceName('');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/obrigatório/i);
  });

  it('rejeita valor só com espaços', () => {
    expect(validateUserListResourceName('   ').valid).toBe(false);
  });

  it('rejeita formato inválido (falta userLists)', () => {
    const r = validateUserListResourceName('customers/123/campaigns/456');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/customers\/\{id\}\/userLists\/\{id\}/);
  });

  it('rejeita ID não numérico no resource_name', () => {
    expect(validateUserListResourceName('customers/abc/userLists/456').valid).toBe(false);
  });

  it('aceita um resource_name válido', () => {
    expect(validateUserListResourceName('customers/1112223333/userLists/999').valid).toBe(true);
  });

  it('aceita com espaços ao redor (trim)', () => {
    expect(validateUserListResourceName('  customers/1/userLists/2  ').valid).toBe(true);
  });
});

describe('validateAudienceTargetLevel', () => {
  it('rejeita quando ambos campaign-id e ad-group-id são informados (XOR)', () => {
    const r = validateAudienceTargetLevel({ campaignId: '555', adGroupId: '777' });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/apenas UM/i);
  });

  it('rejeita quando nenhum é informado', () => {
    const r = validateAudienceTargetLevel({});
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/exatamente um/i);
  });

  it('rejeita quando o valor informado é string vazia (equivale a nenhum)', () => {
    expect(validateAudienceTargetLevel({ campaignId: '  ' }).valid).toBe(false);
  });

  it('rejeita campaign-id não numérico', () => {
    const r = validateAudienceTargetLevel({ campaignId: 'abc' });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/--campaign-id/);
  });

  it('rejeita ad-group-id não numérico', () => {
    const r = validateAudienceTargetLevel({ adGroupId: '7x7' });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/--ad-group-id/);
  });

  it('aceita campaign-id numérico e resolve level=campaign', () => {
    const r = validateAudienceTargetLevel({ campaignId: '555' });
    expect(r.valid).toBe(true);
    expect(r.level).toBe('campaign');
  });

  it('aceita ad-group-id numérico e resolve level=ad_group', () => {
    const r = validateAudienceTargetLevel({ adGroupId: '777' });
    expect(r.valid).toBe(true);
    expect(r.level).toBe('ad_group');
  });
});

describe('validateAudienceTargetMode', () => {
  it("aceita 'observation'", () => {
    expect(validateAudienceTargetMode('observation').valid).toBe(true);
  });

  it("aceita 'targeting'", () => {
    expect(validateAudienceTargetMode('targeting').valid).toBe(true);
  });

  it('rejeita modo desconhecido', () => {
    const r = validateAudienceTargetMode('segment');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/observation.*targeting/i);
  });
});

// ============================================================================
// Story 9.3 — Custom segment validators
// ============================================================================

describe('parseCommaSeparatedList', () => {
  it('devolve [] para undefined', () => {
    expect(parseCommaSeparatedList(undefined)).toEqual([]);
  });

  it('devolve [] para string vazia', () => {
    expect(parseCommaSeparatedList('')).toEqual([]);
  });

  it('faz split por vírgula e trim de cada item', () => {
    expect(parseCommaSeparatedList('a, b ,c')).toEqual(['a', 'b', 'c']);
  });

  it('descarta itens vazios de vírgulas duplicadas', () => {
    expect(parseCommaSeparatedList('a,,b,')).toEqual(['a', 'b']);
  });

  it('descarta itens só com espaços', () => {
    expect(parseCommaSeparatedList('a,   ,b')).toEqual(['a', 'b']);
  });

  it('devolve [] quando tudo é vazio/espaço', () => {
    expect(parseCommaSeparatedList('  ,  , ')).toEqual([]);
  });

  it('preserva espaços internos de um item multi-palavra', () => {
    expect(parseCommaSeparatedList('ressonância magnética, tomografia')).toEqual([
      'ressonância magnética',
      'tomografia',
    ]);
  });
});

describe('validateCustomSegmentMembers', () => {
  it('rejeita quando não há keywords nem urls', () => {
    const r = validateCustomSegmentMembers({ keywords: [], urls: [] });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/palavra-chave|url/i);
  });

  it('aceita com ao menos uma keyword', () => {
    expect(validateCustomSegmentMembers({ keywords: ['k'], urls: [] }).valid).toBe(true);
  });

  it('aceita com ao menos uma url', () => {
    expect(validateCustomSegmentMembers({ keywords: [], urls: ['u'] }).valid).toBe(true);
  });

  it('aceita com keywords e urls', () => {
    expect(validateCustomSegmentMembers({ keywords: ['k'], urls: ['u'] }).valid).toBe(true);
  });
});

describe('validateCustomAudienceType', () => {
  it('aceita INTEREST (default)', () => {
    expect(validateCustomAudienceType('INTEREST').valid).toBe(true);
  });

  it('aceita AUTO, PURCHASE_INTENT e SEARCH', () => {
    expect(validateCustomAudienceType('AUTO').valid).toBe(true);
    expect(validateCustomAudienceType('PURCHASE_INTENT').valid).toBe(true);
    expect(validateCustomAudienceType('SEARCH').valid).toBe(true);
  });

  it('rejeita valor fora da lista fechada', () => {
    const r = validateCustomAudienceType('AFFINITY');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/INTEREST/);
  });

  it('rejeita minúsculas (enum é case-sensitive)', () => {
    expect(validateCustomAudienceType('interest').valid).toBe(false);
  });
});
