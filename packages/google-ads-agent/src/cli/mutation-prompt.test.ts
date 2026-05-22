import { describe, it, expect } from 'vitest';
import {
  formatBudgetMutationDiff,
  buildBudgetConfirmPhrase,
  formatStatusMutationDiff,
} from './mutation-prompt.js';
import { calculateBudgetDelta } from '../google-ads-api/budget-validator.js';

// Strip ANSI codes for assertions
function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

describe('formatBudgetMutationDiff', () => {
  it('renders a basic diff with campaign name and budget values', () => {
    const out = stripAnsi(
      formatBudgetMutationDiff({
        campaignId: 'C123',
        campaignName: 'My Search Campaign',
        customerId: '5562216599',
        beforeMicros: 30_000_000,
        afterMicros: 35_000_000,
        currency: 'BRL',
        delta: calculateBudgetDelta(30_000_000, 35_000_000),
        thresholdPct: 50,
      }),
    );
    expect(out).toContain('My Search Campaign');
    expect(out).toContain('C123');
    expect(out).toContain('R$ 30,00');
    expect(out).toContain('R$ 35,00');
    expect(out).toContain('+16.7%');
  });

  it('flags exceeding threshold with explicit warning', () => {
    const out = stripAnsi(
      formatBudgetMutationDiff({
        campaignId: 'C1',
        campaignName: 'X',
        customerId: '5562216599',
        beforeMicros: 30_000_000,
        afterMicros: 60_000_000,
        currency: 'BRL',
        delta: calculateBudgetDelta(30_000_000, 60_000_000),
        thresholdPct: 50,
      }),
    );
    expect(out).toContain('ACIMA DO LIMITE 50%');
    expect(out).toContain('+100.0%');
    expect(out).toContain('excede limite anti-runaway');
  });

  it('does NOT flag when change is within threshold', () => {
    const out = stripAnsi(
      formatBudgetMutationDiff({
        campaignId: 'C1',
        campaignName: 'X',
        customerId: '5562216599',
        beforeMicros: 30_000_000,
        afterMicros: 33_000_000, // +10%
        currency: 'BRL',
        delta: calculateBudgetDelta(30_000_000, 33_000_000),
        thresholdPct: 50,
      }),
    );
    expect(out).not.toContain('ACIMA DO LIMITE');
    expect(out).not.toContain('excede limite anti-runaway');
  });

  it('warns on massive reduction (>=90%)', () => {
    const out = stripAnsi(
      formatBudgetMutationDiff({
        campaignId: 'C1',
        campaignName: 'X',
        customerId: '5562216599',
        beforeMicros: 100_000_000,
        afterMicros: 5_000_000, // -95%
        currency: 'BRL',
        delta: calculateBudgetDelta(100_000_000, 5_000_000),
        thresholdPct: 50,
      }),
    );
    expect(out).toContain('Redução >=90%');
  });

  it('includes customer name when provided', () => {
    const out = stripAnsi(
      formatBudgetMutationDiff({
        campaignId: 'C1',
        campaignName: 'X',
        customerId: '5562216599',
        customerName: 'Solaro Marketing e Vendas',
        beforeMicros: 30_000_000,
        afterMicros: 35_000_000,
        currency: 'BRL',
        delta: calculateBudgetDelta(30_000_000, 35_000_000),
        thresholdPct: 50,
      }),
    );
    expect(out).toContain('Solaro Marketing e Vendas');
  });
});

describe('buildBudgetConfirmPhrase', () => {
  it('builds "aumentar" phrase when budget increases', () => {
    expect(buildBudgetConfirmPhrase(30_000_000, 60_000_000, 'BRL')).toBe(
      'sim, aumentar de R$ 30,00 para R$ 60,00',
    );
  });

  it('builds "reduzir" phrase when budget decreases', () => {
    expect(buildBudgetConfirmPhrase(60_000_000, 30_000_000, 'BRL')).toBe(
      'sim, reduzir de R$ 60,00 para R$ 30,00',
    );
  });

  it('uses correct currency formatting', () => {
    const phrase = buildBudgetConfirmPhrase(30_000_000, 60_000_000, 'USD');
    expect(phrase).toContain('$ 30.00');
    expect(phrase).toContain('$ 60.00');
  });
});

describe('formatStatusMutationDiff', () => {
  it('renders campaign diff (basic, no warning)', () => {
    const out = stripAnsi(
      formatStatusMutationDiff({
        entityType: 'campaign',
        name: 'My Campaign',
        entityId: 'C123',
        before: 'ENABLED',
        after: 'PAUSED',
        customerId: '5562216599',
      }),
    );
    expect(out).toContain('Campanha My Campaign (C123)');
    expect(out).toContain('Status atual:     ENABLED');
    expect(out).toContain('Status novo:      PAUSED');
    expect(out).toContain('Conta:            5562216599');
    expect(out).not.toContain('learning phase');
    expect(out).not.toContain('learning phase');
  });

  it('renders campaign diff with learning phase warning', () => {
    const out = stripAnsi(
      formatStatusMutationDiff({
        entityType: 'campaign',
        name: 'X',
        entityId: 'C1',
        before: 'ENABLED',
        after: 'PAUSED',
        customerId: '5562216599',
        learningPhaseWarning: true,
        learningPhaseDays: 7,
      }),
    );
    expect(out).toContain('Bidding strategy modificada há 7 dia(s)');
    expect(out).toContain('learning phase');
  });

  it('renders ad_group diff including parent campaign name', () => {
    const out = stripAnsi(
      formatStatusMutationDiff({
        entityType: 'ad_group',
        name: 'AG1',
        entityId: 'AG-1',
        before: 'ENABLED',
        after: 'PAUSED',
        customerId: '5562216599',
        parentCampaignName: 'Search Campaign',
      }),
    );
    expect(out).toContain('Ad Group AG1 (AG-1)');
    expect(out).toContain('Campanha pai:     Search Campaign');
  });

  it('shows customer name when provided', () => {
    const out = stripAnsi(
      formatStatusMutationDiff({
        entityType: 'campaign',
        name: 'X',
        entityId: 'C1',
        before: 'PAUSED',
        after: 'ENABLED',
        customerId: '5562216599',
        customerName: 'Solaro Marketing e Vendas',
      }),
    );
    expect(out).toContain('5562216599 (Solaro Marketing e Vendas)');
  });
});
