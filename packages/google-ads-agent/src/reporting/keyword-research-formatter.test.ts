import { describe, it, expect } from 'vitest';
import {
  formatKeywordIdeasTable,
  formatKeywordIdeasJson,
} from './keyword-research-formatter.js';
import type { KeywordIdea } from '../types/keyword-research.js';

const SAMPLE: KeywordIdea[] = [
  {
    keyword: 'escrever livro com IA',
    avgMonthlySearches: 1300,
    competition: 'MEDIUM',
    competitionIndex: 45,
    lowTopOfPageBid: 1.5,
    highTopOfPageBid: 4,
  },
  {
    keyword: 'criar ebook com IA',
    avgMonthlySearches: 880,
    competition: 'LOW',
  },
];

describe('formatKeywordIdeasTable', () => {
  it('renders a message when empty', () => {
    expect(formatKeywordIdeasTable([])).toContain('Nenhuma ideia');
  });

  it('includes keyword text and PT-BR competition labels', () => {
    const out = formatKeywordIdeasTable(SAMPLE);
    expect(out).toContain('escrever livro com IA');
    expect(out).toContain('Média');
    expect(out).toContain('Baixa');
  });

  it('formats bids in BRL and uses dash for missing values', () => {
    const out = formatKeywordIdeasTable(SAMPLE);
    expect(out).toContain('R$ 1.50');
    expect(out).toContain('R$ 4.00');
    expect(out).toContain('—'); // missing index/bids on second row
  });

  it('formats large volumes with pt-BR grouping', () => {
    const out = formatKeywordIdeasTable([
      { keyword: 'x', avgMonthlySearches: 12000, competition: 'HIGH' },
    ]);
    expect(out).toContain('12.000');
  });
});

describe('formatKeywordIdeasJson', () => {
  it('returns valid parseable JSON matching the model', () => {
    const json = formatKeywordIdeasJson(SAMPLE);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].keyword).toBe('escrever livro com IA');
    expect(parsed[0].lowTopOfPageBid).toBe(1.5);
  });
});
