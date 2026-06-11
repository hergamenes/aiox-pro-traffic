import { describe, it, expect } from 'vitest';
import {
  parseKeywordIdeasResponse,
  isPermissionError,
  extractErrorText,
  type RawKeywordIdeaResult,
} from './keyword-ideas.js';

describe('parseKeywordIdeasResponse', () => {
  it('maps a full result and converts micros to currency unit', () => {
    const raw: RawKeywordIdeaResult[] = [
      {
        text: 'escrever livro com IA',
        keyword_idea_metrics: {
          avg_monthly_searches: 1300,
          competition: 'MEDIUM',
          competition_index: 45,
          low_top_of_page_bid_micros: 1_500_000,
          high_top_of_page_bid_micros: 4_000_000,
        },
      },
    ];
    const [idea] = parseKeywordIdeasResponse(raw);
    expect(idea.keyword).toBe('escrever livro com IA');
    expect(idea.avgMonthlySearches).toBe(1300);
    expect(idea.competition).toBe('MEDIUM');
    expect(idea.competitionIndex).toBe(45);
    expect(idea.lowTopOfPageBid).toBe(1.5);
    expect(idea.highTopOfPageBid).toBe(4);
  });

  it('handles int64 fields delivered as strings', () => {
    const raw: RawKeywordIdeaResult[] = [
      {
        text: 'criar ebook com IA',
        keyword_idea_metrics: {
          avg_monthly_searches: '880',
          competition: 'LOW',
          low_top_of_page_bid_micros: '500000',
        },
      },
    ];
    const [idea] = parseKeywordIdeasResponse(raw);
    expect(idea.avgMonthlySearches).toBe(880);
    expect(idea.lowTopOfPageBid).toBe(0.5);
  });

  it('normalizes numeric competition enum values', () => {
    const raw: RawKeywordIdeaResult[] = [
      { text: 'a', keyword_idea_metrics: { competition: 2 } },
      { text: 'b', keyword_idea_metrics: { competition: 3 } },
      { text: 'c', keyword_idea_metrics: { competition: 4 } },
      { text: 'd', keyword_idea_metrics: { competition: 1 } },
    ];
    const ideas = parseKeywordIdeasResponse(raw);
    const byKw = Object.fromEntries(ideas.map((i) => [i.keyword, i.competition]));
    expect(byKw.a).toBe('LOW');
    expect(byKw.b).toBe('MEDIUM');
    expect(byKw.c).toBe('HIGH');
    expect(byKw.d).toBe('UNKNOWN');
  });

  it('defaults missing metrics gracefully', () => {
    const raw: RawKeywordIdeaResult[] = [{ text: 'sem métricas' }];
    const [idea] = parseKeywordIdeasResponse(raw);
    expect(idea.avgMonthlySearches).toBe(0);
    expect(idea.competition).toBe('UNKNOWN');
    expect(idea.competitionIndex).toBeUndefined();
    expect(idea.lowTopOfPageBid).toBeUndefined();
  });

  it('drops results without text (related-idea noise)', () => {
    const raw: RawKeywordIdeaResult[] = [
      { text: 'válido', keyword_idea_metrics: { avg_monthly_searches: 10 } },
      { text: '', keyword_idea_metrics: { avg_monthly_searches: 99 } },
      { keyword_idea_metrics: { avg_monthly_searches: 99 } },
    ];
    const ideas = parseKeywordIdeasResponse(raw);
    expect(ideas).toHaveLength(1);
    expect(ideas[0].keyword).toBe('válido');
  });

  it('sorts by average monthly searches descending (incl. related ideas)', () => {
    const raw: RawKeywordIdeaResult[] = [
      { text: 'seed', keyword_idea_metrics: { avg_monthly_searches: 100 } },
      { text: 'ideia relacionada forte', keyword_idea_metrics: { avg_monthly_searches: 5000 } },
      { text: 'ideia fraca', keyword_idea_metrics: { avg_monthly_searches: 20 } },
    ];
    const ideas = parseKeywordIdeasResponse(raw);
    expect(ideas.map((i) => i.keyword)).toEqual([
      'ideia relacionada forte',
      'seed',
      'ideia fraca',
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(parseKeywordIdeasResponse([])).toEqual([]);
  });
});

describe('extractErrorText', () => {
  it('reads nested SDK errors[].message and error_code values', () => {
    const sdkErr = {
      errors: [
        {
          error_code: { authorization_error: 'DEVELOPER_TOKEN_NOT_APPROVED' },
          message: 'This method is not allowed for use with explorer access.',
        },
      ],
    };
    const text = extractErrorText(sdkErr);
    expect(text).toContain('explorer access');
    expect(text).toContain('developer_token_not_approved');
  });

  it('reads top-level message', () => {
    expect(extractErrorText({ message: 'Some Failure' })).toBe('some failure');
  });
});

describe('isPermissionError', () => {
  it('detects the real explorer-access developer token error', () => {
    const sdkErr = {
      errors: [
        {
          error_code: { authorization_error: 'DEVELOPER_TOKEN_NOT_APPROVED' },
          message:
            'This method is not allowed for use with explorer access. Please apply for basic or standard access.',
        },
      ],
    };
    expect(isPermissionError(sdkErr)).toBe(true);
  });

  it('does not flag unrelated errors', () => {
    expect(isPermissionError({ message: 'Network timeout ETIMEDOUT' })).toBe(false);
  });
});
