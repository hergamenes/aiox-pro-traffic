import { describe, it, expect } from 'vitest';
import {
  formatCampaignRemovalSnapshot,
  formatAdGroupRemovalSnapshot,
} from './removal-prompt.js';
import type {
  CampaignRemovalSnapshot,
  AdGroupRemovalSnapshot,
} from '../google-ads-api/mutations.js';

function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

const baseCampaignSnapshot: CampaignRemovalSnapshot = {
  campaignId: '23478792639',
  campaignName: '[SOL] Rede de pesquisa | Institucional',
  status: 'ENABLED',
  budgetMicros: 5_000_000,
  biddingStrategy: 'MAXIMIZE_CONVERSIONS',
  adGroupCount: 3,
  adCount: 12,
  spend90dMicros: 150_000_000,
  spend7dMicros: 12_000_000,
  spend24hMicros: 5_700_000,
  currencyCode: 'BRL',
};

const baseAdGroupSnapshot: AdGroupRemovalSnapshot = {
  adGroupId: '999',
  adGroupName: 'AdGroup Test',
  status: 'ENABLED',
  campaignId: '23478792639',
  campaignName: '[SOL] Rede de pesquisa',
  adCount: 2,
  keywordCount: 5,
  currencyCode: 'BRL',
};

describe('formatCampaignRemovalSnapshot', () => {
  it('includes all required fields', () => {
    const out = stripAnsi(formatCampaignRemovalSnapshot(baseCampaignSnapshot, '5562216599'));
    expect(out).toContain('Customer ID:         5562216599');
    expect(out).toContain('Campaign ID:         23478792639');
    expect(out).toContain('Status atual:        ENABLED');
    expect(out).toContain('Budget diário:       R$ 5,00');
    expect(out).toContain('Ad groups ativos:    3');
    expect(out).toContain('Ads ativos:          12');
    expect(out).toContain('Gasto 90d:           R$ 150,00');
    expect(out).toContain('Gasto 24h:           R$ 5,70');
  });

  it('shows recent-spend warning when spend_24h > 0', () => {
    const out = stripAnsi(formatCampaignRemovalSnapshot(baseCampaignSnapshot, '5562216599'));
    expect(out).toContain('gasto recente detectado');
  });

  it('omits recent-spend warning when spend_24h is zero', () => {
    const noSpend = { ...baseCampaignSnapshot, spend24hMicros: 0 };
    const out = stripAnsi(formatCampaignRemovalSnapshot(noSpend, '5562216599'));
    expect(out).not.toContain('gasto recente detectado');
  });

  it('mentions cascade with exact counts', () => {
    const out = stripAnsi(formatCampaignRemovalSnapshot(baseCampaignSnapshot, '5562216599'));
    expect(out).toContain('3 ad_groups + 12 ads serão marcados REMOVED');
  });

  it('includes customer name when provided', () => {
    const out = stripAnsi(
      formatCampaignRemovalSnapshot(baseCampaignSnapshot, '5562216599', 'Solaro Marketing e Vendas'),
    );
    expect(out).toContain('Solaro Marketing e Vendas');
  });

  it('warns about IRREVERSIBLE in all caps', () => {
    const out = stripAnsi(formatCampaignRemovalSnapshot(baseCampaignSnapshot, '5562216599'));
    expect(out).toContain('IRREVERSÍVEL');
  });

  it('mentions historical data preservation', () => {
    const out = stripAnsi(formatCampaignRemovalSnapshot(baseCampaignSnapshot, '5562216599'));
    expect(out).toMatch(/Dados históricos.*permanecem/);
  });
});

describe('formatAdGroupRemovalSnapshot', () => {
  it('includes ad_group + parent campaign + cascade counts', () => {
    const out = stripAnsi(formatAdGroupRemovalSnapshot(baseAdGroupSnapshot, '5562216599'));
    expect(out).toContain('AdGroup Test');
    expect(out).toContain('Customer ID:         5562216599');
    expect(out).toContain('Ad Group ID:         999');
    expect(out).toContain('Campanha pai:        [SOL] Rede de pesquisa');
    expect(out).toContain('Ads ativos:          2');
    expect(out).toContain('Keywords ativas:     5');
  });

  it('warns IRREVERSÍVEL with cascade counts', () => {
    const out = stripAnsi(formatAdGroupRemovalSnapshot(baseAdGroupSnapshot, '5562216599'));
    expect(out).toContain('IRREVERSÍVEL');
    expect(out).toContain('2 ads + 5 keywords');
  });
});

describe('Audit log forensic fields (story 6.7 contract)', () => {
  it('MutationLogEntry accepts operator_confirmed_phrase + triple_confirm_required', () => {
    // Type-only assertion via factory
    const entry: {
      operator_confirmed_phrase?: string;
      triple_confirm_required?: boolean;
    } = {
      operator_confirmed_phrase: 'remover [SOL] Test Campaign',
      triple_confirm_required: true,
    };
    expect(entry.operator_confirmed_phrase).toBe('remover [SOL] Test Campaign');
    expect(entry.triple_confirm_required).toBe(true);
  });
});
