/**
 * Normalização + hashing de dados de contato para Customer Match
 * (Story 9.4 — Epic 9). LÓGICA PURA — sem I/O, sem rede, sem SDK.
 *
 * ⚠️ SEGURANÇA/PII (R2, NÃO NEGOCIÁVEL): este módulo é a fronteira onde o dado
 * de contato em claro (e-mail/telefone) é transformado em hash irreversível.
 * A PARTIR do retorno de `hashSha256Hex`, o programa só carrega hashes — nenhum
 * e-mail/telefone em claro deve sobreviver. Nenhuma função aqui loga, imprime
 * ou serializa o valor recebido.
 *
 * Fonte da regra de normalização (Artigo IV — No Invention): documentação
 * oficial do Google Ads Customer Match / OfflineUserDataJobService:
 *   - E-mail: remover espaços em branco nas pontas + converter para minúsculas,
 *     então SHA-256 (hex minúsculo). O Google NÃO remove pontos/aliases do
 *     Gmail no lado do cliente — apenas trim + lowercase.
 *   - Telefone: converter para o formato E.164 (código do país + número, sem
 *     espaços/traços/parênteses), então SHA-256 (hex minúsculo).
 * Referência: https://developers.google.com/google-ads/api/docs/remarketing/audience-types/customer-match
 */

import { createHash } from 'node:crypto';

/**
 * Regex estrutural mínima de e-mail — NÃO é um validador RFC completo, apenas
 * um filtro barato para descartar lixo óbvio antes de hashear (ex.: string sem
 * `@`, ou sem domínio com ponto). Exige: parte local + `@` + domínio com pelo
 * menos um ponto, sem espaços.
 */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Faixa de dígitos aceita em um número E.164 (mín. 8, máx. 15 — padrão E.164). */
const E164_DIGITS = /^\d{8,15}$/;

/**
 * Normaliza um e-mail conforme a regra oficial do Google Customer Match:
 * `trim` + `toLowerCase`. Retorna `null` quando o valor claramente não é um
 * e-mail (descartar em vez de enviar lixo — R4/R5).
 *
 * @param raw valor bruto vindo do arquivo (célula `email`)
 * @returns e-mail normalizado, ou `null` se inválido
 */
export function normalizeEmail(raw: string): string | null {
  if (typeof raw !== 'string') {
    return null;
  }
  const normalized = raw.trim().toLowerCase();
  if (!EMAIL_SHAPE.test(normalized)) {
    return null;
  }
  return normalized;
}

/**
 * Normaliza um telefone para E.164 (`+<código do país><número>`).
 *
 * LIMITAÇÃO DELIBERADA (best-effort, documentada): E.164 exige código do país
 * explícito. Como não dá para inferir o país de um número local com segurança,
 * só normalizamos números que já trazem o código internacional — via prefixo
 * `+` ou o prefixo de discagem internacional `00` (convertido em `+`). Números
 * sem código do país são DESCARTADOS (retorna `null`, contam como inválidos),
 * porque enviar um hash de número ambíguo nunca daria match no lado do Google
 * e ainda poluiria a lista (R5).
 *
 * @param raw valor bruto vindo do arquivo (célula `phone`)
 * @returns telefone E.164 normalizado (`+...`), ou `null` se não normalizável
 */
export function normalizePhoneE164(raw: string): string | null {
  if (typeof raw !== 'string') {
    return null;
  }
  // Remove separadores comuns (espaços, traços, parênteses, pontos).
  const cleaned = raw.trim().replace(/[\s().-]/g, '');
  if (cleaned === '') {
    return null;
  }
  // Prefixo de discagem internacional 00 → +
  const candidate = cleaned.startsWith('00') ? `+${cleaned.slice(2)}` : cleaned;
  if (!candidate.startsWith('+')) {
    // Sem código do país explícito → não é seguro normalizar.
    return null;
  }
  const digits = candidate.slice(1);
  if (!E164_DIGITS.test(digits)) {
    return null;
  }
  return `+${digits}`;
}

/**
 * SHA-256 de uma string, em hexadecimal minúsculo — o formato que o Google
 * espera nos campos `hashed_email`/`hashed_phone_number` do `UserIdentifier`.
 * Puro e determinístico.
 *
 * @param value valor JÁ normalizado (nunca chame com dado bruto)
 */
export function hashSha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/**
 * Normaliza + hasheia um e-mail em um passo. Retorna `null` se o e-mail for
 * inválido (não normalizável). O valor em claro nunca sai desta função.
 */
export function hashNormalizedEmail(raw: string): string | null {
  const normalized = normalizeEmail(raw);
  return normalized === null ? null : hashSha256Hex(normalized);
}

/**
 * Normaliza + hasheia um telefone em um passo. Retorna `null` se o telefone
 * não puder ser normalizado para E.164. O valor em claro nunca sai desta função.
 */
export function hashNormalizedPhone(raw: string): string | null {
  const normalized = normalizePhoneE164(raw);
  return normalized === null ? null : hashSha256Hex(normalized);
}
