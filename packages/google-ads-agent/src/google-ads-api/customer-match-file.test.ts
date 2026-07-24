import { describe, it, expect, vi } from 'vitest';
import { parseCustomerMatchCsv } from './customer-match-file.js';
import { hashNormalizedEmail, hashNormalizedPhone } from './customer-match-hashing.js';

// ⚠️ NENHUM PII REAL — apenas dados fake determinísticos.

describe('parseCustomerMatchCsv — parser puro', () => {
  it('parseia email + phone e hasheia (sem carregar dado em claro)', () => {
    const csv = ['email,phone', 'a@example.com,+5511999998888', 'b@example.com,'].join('\n');
    const result = parseCustomerMatchCsv(csv);

    expect(result.totalRows).toBe(2);
    expect(result.validCount).toBe(2);
    expect(result.skippedCount).toBe(0);
    expect(result.identifiers).toHaveLength(2);

    // Linha 1: email + phone → dois hashes
    expect(result.identifiers[0].hashedEmail).toBe(hashNormalizedEmail('a@example.com'));
    expect(result.identifiers[0].hashedPhoneNumber).toBe(hashNormalizedPhone('+5511999998888'));

    // Linha 2: só email
    expect(result.identifiers[1].hashedEmail).toBe(hashNormalizedEmail('b@example.com'));
    expect(result.identifiers[1].hashedPhoneNumber).toBeUndefined();
  });

  it('NUNCA expõe o valor em claro no resultado', () => {
    const csv = ['email,phone', 'segredo@example.com,+5511988887777'].join('\n');
    const result = parseCustomerMatchCsv(csv);
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('segredo@example.com');
    expect(serialized).not.toContain('+5511988887777');
    expect(serialized).not.toContain('5511988887777');
  });

  it('conta linhas sem identificador válido como skipped', () => {
    const csv = [
      'email,phone',
      'valido@example.com,',
      'invalido,semtelefone', // email sem @, phone sem código do país
      ',',
    ].join('\n');
    const result = parseCustomerMatchCsv(csv);

    expect(result.totalRows).toBe(3);
    expect(result.validCount).toBe(1);
    expect(result.skippedCount).toBe(2);
  });

  it('ignora linhas em branco sem contá-las', () => {
    const csv = ['email,phone', '', 'a@example.com,', '   ', ''].join('\n');
    const result = parseCustomerMatchCsv(csv);
    expect(result.totalRows).toBe(1);
    expect(result.validCount).toBe(1);
    expect(result.skippedCount).toBe(0);
  });

  it('respeita a ordem das colunas do cabeçalho (phone antes de email)', () => {
    const csv = ['phone,email', '+5511999998888,a@example.com'].join('\n');
    const result = parseCustomerMatchCsv(csv);
    expect(result.identifiers[0].hashedEmail).toBe(hashNormalizedEmail('a@example.com'));
    expect(result.identifiers[0].hashedPhoneNumber).toBe(hashNormalizedPhone('+5511999998888'));
  });

  it('aceita CSV só com coluna email', () => {
    const csv = ['email', 'a@example.com', 'b@example.com'].join('\n');
    const result = parseCustomerMatchCsv(csv);
    expect(result.validCount).toBe(2);
    expect(result.identifiers.every((i) => i.hashedPhoneNumber === undefined)).toBe(true);
  });

  it('aceita CSV só com coluna phone', () => {
    const csv = ['phone', '+5511999998888'].join('\n');
    const result = parseCustomerMatchCsv(csv);
    expect(result.validCount).toBe(1);
    expect(result.identifiers[0].hashedEmail).toBeUndefined();
  });

  it('ignora cabeçalho case-insensitive e espaços', () => {
    const csv = [' Email , Phone ', 'a@example.com,+5511999998888'].join('\n');
    const result = parseCustomerMatchCsv(csv);
    expect(result.validCount).toBe(1);
    expect(result.identifiers[0].hashedEmail).toBe(hashNormalizedEmail('a@example.com'));
  });

  it('lança erro para arquivo vazio', () => {
    expect(() => parseCustomerMatchCsv('   \n  \n')).toThrow(/vazio/i);
  });

  it('lança erro quando o cabeçalho não tem email nem phone', () => {
    const csv = ['nome,idade', 'joao,30'].join('\n');
    expect(() => parseCustomerMatchCsv(csv)).toThrow(/email.*phone|phone/i);
  });
});

describe('parseCustomerMatchFile — wrapper com leitura de arquivo mockada', () => {
  it('lê o arquivo e delega para o parser puro', async () => {
    vi.resetModules();
    vi.doMock('node:fs/promises', () => ({
      readFile: vi.fn(async () => 'email,phone\na@example.com,+5511999998888\n'),
    }));
    const { parseCustomerMatchFile: parse } = await import('./customer-match-file.js');
    const result = await parse('/qualquer/caminho.csv');
    expect(result.validCount).toBe(1);
    vi.doUnmock('node:fs/promises');
    vi.resetModules();
  });

  it('lança AppError PT-BR quando o arquivo não existe (ENOENT)', async () => {
    vi.resetModules();
    vi.doMock('node:fs/promises', () => ({
      readFile: vi.fn(async () => {
        const e = new Error('not found') as NodeJS.ErrnoException;
        e.code = 'ENOENT';
        throw e;
      }),
    }));
    const { parseCustomerMatchFile: parse } = await import('./customer-match-file.js');
    await expect(parse('/nao/existe.csv')).rejects.toThrow(/não encontrado/i);
    vi.doUnmock('node:fs/promises');
    vi.resetModules();
  });
});
