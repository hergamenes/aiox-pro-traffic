import { describe, it, expect } from 'vitest';
import {
  normalizeEmail,
  normalizePhoneE164,
  hashSha256Hex,
  hashNormalizedEmail,
  hashNormalizedPhone,
} from './customer-match-hashing.js';

// ⚠️ NENHUM PII REAL — apenas dados fake determinísticos.

// Vetores de teste SHA-256 fixos (hex minúsculo), computados com node:crypto.
const SHA256_EMAIL = '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b'; // 'test@example.com'
const SHA256_PHONE = '6ff01b83d6cd5a652fbd5730a4aa124c3ca8f7e65c805f3323fea3e726d93678'; // '+5511999998888'
const SHA256_ABC = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'; // 'abc'

describe('normalizeEmail — puro', () => {
  it('faz trim + lowercase', () => {
    expect(normalizeEmail('  TEST@Example.COM ')).toBe('test@example.com');
  });

  it('mantém pontos do local-part (Google NÃO faz dot-stripping)', () => {
    expect(normalizeEmail('John.Doe@Gmail.com')).toBe('john.doe@gmail.com');
  });

  it('retorna null para string sem @', () => {
    expect(normalizeEmail('semarroba.com')).toBeNull();
  });

  it('retorna null para domínio sem ponto', () => {
    expect(normalizeEmail('a@localhost')).toBeNull();
  });

  it('retorna null para vazio/espaços', () => {
    expect(normalizeEmail('')).toBeNull();
    expect(normalizeEmail('   ')).toBeNull();
  });

  it('retorna null quando há espaço interno', () => {
    expect(normalizeEmail('a b@example.com')).toBeNull();
  });
});

describe('normalizePhoneE164 — puro', () => {
  it('mantém número já em E.164', () => {
    expect(normalizePhoneE164('+5511999998888')).toBe('+5511999998888');
  });

  it('remove separadores comuns (espaços, traços, parênteses)', () => {
    expect(normalizePhoneE164('+55 (11) 99999-8888')).toBe('+5511999998888');
  });

  it('converte prefixo internacional 00 em +', () => {
    expect(normalizePhoneE164('005511999998888')).toBe('+5511999998888');
  });

  it('descarta número sem código do país (sem +)', () => {
    expect(normalizePhoneE164('11999998888')).toBeNull();
  });

  it('descarta número curto demais', () => {
    expect(normalizePhoneE164('+123')).toBeNull();
  });

  it('descarta número longo demais (>15 dígitos)', () => {
    expect(normalizePhoneE164('+1234567890123456')).toBeNull();
  });

  it('descarta vazio', () => {
    expect(normalizePhoneE164('')).toBeNull();
    expect(normalizePhoneE164('   ')).toBeNull();
  });

  it('descarta quando há letras', () => {
    expect(normalizePhoneE164('+55ABC99998888')).toBeNull();
  });
});

describe('hashSha256Hex — puro e determinístico', () => {
  it('bate com o vetor conhecido de "abc"', () => {
    expect(hashSha256Hex('abc')).toBe(SHA256_ABC);
  });

  it('é determinístico (mesma entrada → mesmo hash)', () => {
    expect(hashSha256Hex('qualquer-coisa')).toBe(hashSha256Hex('qualquer-coisa'));
  });

  it('produz hex minúsculo de 64 chars', () => {
    const h = hashSha256Hex('abc');
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('hashNormalizedEmail — normaliza + hasheia', () => {
  it('normaliza e bate com o vetor de "test@example.com"', () => {
    expect(hashNormalizedEmail('  TEST@Example.com ')).toBe(SHA256_EMAIL);
  });

  it('retorna null para e-mail inválido (não hasheia lixo)', () => {
    expect(hashNormalizedEmail('nao-eh-email')).toBeNull();
  });
});

describe('hashNormalizedPhone — normaliza + hasheia', () => {
  it('normaliza e bate com o vetor de "+5511999998888"', () => {
    expect(hashNormalizedPhone('+55 (11) 99999-8888')).toBe(SHA256_PHONE);
  });

  it('retorna null para telefone sem código do país', () => {
    expect(hashNormalizedPhone('11999998888')).toBeNull();
  });
});
