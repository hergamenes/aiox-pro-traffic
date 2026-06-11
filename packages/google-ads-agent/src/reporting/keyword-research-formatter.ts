/**
 * Renderização da saída do comando `keyword-research`.
 * Funções puras — recebem KeywordIdea[] e devolvem string.
 */

import { formatTable } from '../cli/display.js';
import type { KeywordIdea, CompetitionLevel } from '../types/keyword-research.js';

const COMPETITION_PT: Record<CompetitionLevel, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  UNKNOWN: '—',
};

function fmtInt(value: number): string {
  return value.toLocaleString('pt-BR');
}

function fmtBid(value: number | undefined): string {
  if (value === undefined) return '—';
  return `R$ ${value.toFixed(2)}`;
}

/** Tabela legível em PT-BR, já ordenada por volume (vem do parser). */
export function formatKeywordIdeasTable(ideas: KeywordIdea[]): string {
  if (ideas.length === 0) {
    return 'Nenhuma ideia de palavra-chave encontrada para as sementes informadas.';
  }
  const headers = [
    'Palavra-chave',
    'Vol. mensal',
    'Concorrência',
    'Índice',
    'CPC (piso)',
    'CPC (teto)',
  ];
  const rows = ideas.map((i) => [
    i.keyword,
    fmtInt(i.avgMonthlySearches),
    COMPETITION_PT[i.competition],
    i.competitionIndex !== undefined ? String(i.competitionIndex) : '—',
    fmtBid(i.lowTopOfPageBid),
    fmtBid(i.highTopOfPageBid),
  ]);
  return formatTable(headers, rows);
}

/** JSON estruturado, consumível por relatório do Performance Analyst. */
export function formatKeywordIdeasJson(ideas: KeywordIdea[]): string {
  return JSON.stringify(ideas, null, 2);
}
