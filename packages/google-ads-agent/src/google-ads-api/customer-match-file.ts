/**
 * Parser de arquivo CSV de contatos para Customer Match (Story 9.4 — Epic 9).
 *
 * ⚠️ SEGURANÇA/PII (R2): este módulo lê e-mail/telefone em claro do disco e os
 * transforma IMEDIATAMENTE em hash (via `customer-match-hashing`). O resultado
 * (`HashedIdentifier[]`) NUNCA carrega o valor em claro — só o hash. Nenhuma
 * função aqui loga ou serializa o conteúdo do arquivo.
 *
 * Formato de entrada (documentado no `--help` do comando):
 *   - CSV com cabeçalho obrigatório contendo as colunas `email` e/ou `phone`.
 *   - Uma linha por contato. Colunas extras são ignoradas.
 *   - Linhas em branco são ignoradas (não contam). Linhas com conteúdo mas sem
 *     NENHUM identificador válido (e-mail e telefone ambos inválidos/vazios)
 *     são descartadas e CONTADAS em `skippedCount` (R4).
 *
 * Sem dependência de biblioteca de CSV: o formato é fixo (2 colunas simples,
 * sem aspas/escapes complexos esperados em listas de contato), então um parser
 * mínimo é suficiente e evita adicionar dependência nova (Task 2 / Artigo I).
 */

import { readFile } from 'node:fs/promises';
import { hashNormalizedEmail, hashNormalizedPhone } from './customer-match-hashing.js';
import { AppError } from '../errors/types.js';
import type { HashedIdentifier } from '../types/audience.js';

/** Resultado do parsing — SOMENTE hashes e contagens, nunca PII em claro. */
export interface ParsedCustomerMatchFile {
  /** Identificadores hasheados prontos para o SDK (um por contato válido). */
  identifiers: HashedIdentifier[];
  /** Total de linhas de dados consideradas (não conta cabeçalho nem linhas em branco). */
  totalRows: number;
  /** Quantos contatos válidos foram extraídos (== identifiers.length). */
  validCount: number;
  /** Quantas linhas de dados foram descartadas por não terem identificador válido. */
  skippedCount: number;
}

/**
 * Divide uma linha CSV simples em células por vírgula, com trim. NÃO trata
 * aspas/escapes — o formato de lista de contato esperado é plano.
 */
function splitCsvLine(line: string): string[] {
  return line.split(',').map((cell) => cell.trim());
}

/**
 * Parser PURO — recebe o CONTEÚDO do CSV (string) e devolve identificadores
 * hasheados + contagens. Separado do I/O de arquivo para ser trivialmente
 * testável sem mockar o filesystem.
 *
 * @throws AppError se o cabeçalho não tiver nenhuma coluna `email`/`phone`.
 */
export function parseCustomerMatchCsv(content: string): ParsedCustomerMatchFile {
  const lines = content.split(/\r?\n/);

  // Primeira linha NÃO vazia = cabeçalho.
  let headerIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '') {
      headerIndex = i;
      break;
    }
  }
  if (headerIndex === -1) {
    throw new AppError(
      'VALIDATION',
      'Arquivo CSV vazio.',
      'O arquivo precisa de um cabeçalho com as colunas "email" e/ou "phone" e ao menos uma linha de contato.',
    );
  }

  const header = splitCsvLine(lines[headerIndex]).map((h) => h.toLowerCase());
  const emailIdx = header.indexOf('email');
  const phoneIdx = header.indexOf('phone');

  if (emailIdx === -1 && phoneIdx === -1) {
    throw new AppError(
      'VALIDATION',
      'Cabeçalho do CSV não tem coluna "email" nem "phone".',
      'Inclua um cabeçalho na primeira linha com pelo menos uma das colunas: email,phone',
    );
  }

  const identifiers: HashedIdentifier[] = [];
  let totalRows = 0;
  let skippedCount = 0;

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const raw = lines[i];
    // Linha em branco: não é um contato — ignora sem contar.
    if (raw.trim() === '') {
      continue;
    }
    totalRows++;

    const cells = splitCsvLine(raw);
    const emailCell = emailIdx >= 0 ? (cells[emailIdx] ?? '') : '';
    const phoneCell = phoneIdx >= 0 ? (cells[phoneIdx] ?? '') : '';

    const hashedEmail = emailCell ? hashNormalizedEmail(emailCell) : null;
    const hashedPhoneNumber = phoneCell ? hashNormalizedPhone(phoneCell) : null;

    if (hashedEmail === null && hashedPhoneNumber === null) {
      // Nenhum identificador válido nesta linha → descarta e conta (R4).
      skippedCount++;
      continue;
    }

    const identifier: HashedIdentifier = {};
    if (hashedEmail !== null) {
      identifier.hashedEmail = hashedEmail;
    }
    if (hashedPhoneNumber !== null) {
      identifier.hashedPhoneNumber = hashedPhoneNumber;
    }
    identifiers.push(identifier);
  }

  return {
    identifiers,
    totalRows,
    validCount: identifiers.length,
    skippedCount,
  };
}

/**
 * Lê o CSV do disco e delega para `parseCustomerMatchCsv`. Erros de leitura
 * (arquivo ausente, sem permissão) viram AppError PT-BR acionável (AC#10).
 *
 * @param path caminho do CSV (`--from-file`)
 */
export async function parseCustomerMatchFile(path: string): Promise<ParsedCustomerMatchFile> {
  let content: string;
  try {
    content = await readFile(path, 'utf8');
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ENOENT') {
      throw new AppError(
        'NOT_FOUND',
        `Arquivo não encontrado: ${path}`,
        'Confira o caminho passado em --from-file.',
      );
    }
    throw new AppError(
      'VALIDATION',
      `Não foi possível ler o arquivo: ${path}`,
      'Confira o caminho e as permissões do arquivo em --from-file.',
    );
  }
  return parseCustomerMatchCsv(content);
}
