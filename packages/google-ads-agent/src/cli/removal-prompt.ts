/**
 * Triple-tier confirmation UX for IRREVERSIBLE removal operations
 * (Story 6.7).
 *
 * Tier 1 — PAUSE-suggestion: recommend pause before remove
 * Tier 2 — Exact phrase: "remover {full-campaign-name}"
 * Tier 3 — Conditional spend confirm: when spend_24h > 0
 *
 * UX intentionally cautious — removal is permanent.
 */

import { input } from '@inquirer/prompts';
import { formatMicros } from '../google-ads-api/budget-validator.js';
import type {
  CampaignRemovalSnapshot,
  AdGroupRemovalSnapshot,
} from '../google-ads-api/mutations.js';
import { COLORS } from './display.js';

export interface RemovalConfirmation {
  confirmed: boolean;
  operatorConfirmedPhrase?: string;
  tripleConfirmRequired: boolean;
  cancelReason?: string;
}

/**
 * Formats the campaign pre-removal snapshot for operator review.
 */
export function formatCampaignRemovalSnapshot(
  snapshot: CampaignRemovalSnapshot,
  customerId: string,
  customerName?: string,
): string {
  const lines: string[] = [];
  const customerLabel = customerName ? `${customerId} (${customerName})` : customerId;
  const c = snapshot.currencyCode;

  lines.push(
    `${COLORS.bold}📋 Snapshot pré-remoção — Campanha ${snapshot.campaignName}${COLORS.reset}`,
  );
  lines.push('━'.repeat(56));
  lines.push(`Customer ID:         ${customerLabel}`);
  lines.push(`Campaign ID:         ${snapshot.campaignId}`);
  lines.push(`Status atual:        ${snapshot.status}`);
  lines.push(`Budget diário:       ${formatMicros(snapshot.budgetMicros, c)}`);
  lines.push(`Bidding strategy:    ${snapshot.biddingStrategy}`);
  lines.push(
    `Ad groups ativos:    ${snapshot.adGroupCount}   ← serão removidos em cascata`,
  );
  lines.push(`Ads ativos:          ${snapshot.adCount}  ← serão removidos em cascata`);
  lines.push(`Gasto 90d:           ${formatMicros(snapshot.spend90dMicros, c)}`);
  lines.push(`Gasto 7d:            ${formatMicros(snapshot.spend7dMicros, c)}`);

  const spend24h = formatMicros(snapshot.spend24hMicros, c);
  const recentWarning = snapshot.spend24hMicros > 0 ? ` ${COLORS.yellow}⚠️ gasto recente detectado${COLORS.reset}` : '';
  lines.push(`Gasto 24h:           ${spend24h}${recentWarning}`);

  lines.push('');
  lines.push(
    `${COLORS.red}⚠️ AÇÃO IRREVERSÍVEL: campanha + ${snapshot.adGroupCount} ad_groups + ${snapshot.adCount} ads serão marcados REMOVED.${COLORS.reset}`,
  );
  lines.push(
    `${COLORS.dim}⚠️ Dados históricos (incluindo gasto) permanecem nos relatórios.${COLORS.reset}`,
  );
  lines.push(
    `${COLORS.dim}⚠️ Após REMOVE, campanha NÃO aparece em queries default — use filtro removed na UI.${COLORS.reset}`,
  );

  return lines.join('\n');
}

/**
 * Formats the ad_group pre-removal snapshot (simpler than campaign).
 */
export function formatAdGroupRemovalSnapshot(
  snapshot: AdGroupRemovalSnapshot,
  customerId: string,
): string {
  const lines: string[] = [];
  lines.push(`${COLORS.bold}📋 Snapshot pré-remoção — Ad Group ${snapshot.adGroupName}${COLORS.reset}`);
  lines.push('━'.repeat(56));
  lines.push(`Customer ID:         ${customerId}`);
  lines.push(`Ad Group ID:         ${snapshot.adGroupId}`);
  lines.push(`Campanha pai:        ${snapshot.campaignName} (${snapshot.campaignId})`);
  lines.push(`Status atual:        ${snapshot.status}`);
  lines.push(`Ads ativos:          ${snapshot.adCount}   ← serão removidos em cascata`);
  lines.push(`Keywords ativas:     ${snapshot.keywordCount}   ← serão removidas em cascata`);
  lines.push('');
  lines.push(
    `${COLORS.red}⚠️ AÇÃO IRREVERSÍVEL: ad_group + ${snapshot.adCount} ads + ${snapshot.keywordCount} keywords serão marcados REMOVED.${COLORS.reset}`,
  );
  return lines.join('\n');
}

/**
 * Tier 1: Suggests PAUSE before REMOVE (the reversible alternative).
 * Asks operator to acknowledge before proceeding.
 */
export async function showPauseSuggestionTier1(entityName: string): Promise<boolean> {
  console.log('');
  console.log(`${COLORS.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
  console.log(`${COLORS.yellow}⚠️  CONSIDERE PAUSE EM VEZ DE REMOVE${COLORS.reset}`);
  console.log(`${COLORS.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
  console.log('');
  console.log(`A maioria dos casos de "remover campanha" resolve melhor com PAUSE:`);
  console.log(`  • PAUSE é REVERSÍVEL (1 comando re-ativa)`);
  console.log(`  • REMOVE é PERMANENTE (não há restore via API)`);
  console.log(`  • Campanha pausada não aparece em queries default — mesmo benefício`);
  console.log('');
  console.log(`${COLORS.dim}Comando alternativo:${COLORS.reset}`);
  console.log(`${COLORS.dim}  google-ads pause campaign ${entityName}${COLORS.reset}`);
  console.log('');

  try {
    const answer = await input({
      message: 'Continuar com REMOVE mesmo assim? [s/N]:',
      default: 'n',
    });
    const normalized = answer.trim().toLowerCase();
    return normalized === 's' || normalized === 'sim' || normalized === 'y' || normalized === 'yes';
  } catch {
    return false;
  }
}

/**
 * Tier 2: Requires the operator to type the EXACT phrase
 * "remover {full-campaign-name}" (case-insensitive, trim).
 */
export async function requireRemovalPhrase(entityName: string): Promise<string | null> {
  const phrase = `remover ${entityName}`;
  try {
    const answer = await input({
      message: `Digite "${phrase}" para confirmar:`,
      validate: (raw: string) => {
        if (raw.trim().toLowerCase() === phrase.toLowerCase()) {
          return true;
        }
        return `Frase não bate. Digite exatamente: "${phrase}"`;
      },
    });
    return answer.trim();
  } catch {
    return null;
  }
}

/**
 * Tier 3 (conditional — only when spend_24h > 0): operator must type
 * the fixed phrase "sim, remover campanha com gasto recente".
 */
export async function requireRecentSpendPhrase(spend24hMicros: number, currencyCode: string): Promise<boolean> {
  const expected = 'sim, remover campanha com gasto recente';
  const spend = formatMicros(spend24hMicros, currencyCode);
  console.log('');
  console.log(
    `${COLORS.yellow}⚠️ Esta campanha gastou ${spend} nas últimas 24h. Está em uso recente.${COLORS.reset}`,
  );
  try {
    const answer = await input({
      message: `Digite "${expected}" para confirmar:`,
      validate: (raw: string) => {
        if (raw.trim().toLowerCase() === expected.toLowerCase()) return true;
        return `Frase não bate. Digite exatamente: "${expected}"`;
      },
    });
    return answer.trim().toLowerCase() === expected.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Orchestrates the full triple-tier confirmation flow for campaign removal.
 */
export async function tripleConfirmCampaignRemoval(
  snapshot: CampaignRemovalSnapshot,
): Promise<RemovalConfirmation> {
  // Tier 1: PAUSE suggestion
  const proceedFromTier1 = await showPauseSuggestionTier1(snapshot.campaignName);
  if (!proceedFromTier1) {
    return {
      confirmed: false,
      tripleConfirmRequired: snapshot.spend24hMicros > 0,
      cancelReason: 'Tier 1: operator chose PAUSE alternative or cancelled',
    };
  }

  // Tier 2: exact phrase
  const phrase = await requireRemovalPhrase(snapshot.campaignName);
  if (!phrase) {
    return {
      confirmed: false,
      tripleConfirmRequired: snapshot.spend24hMicros > 0,
      cancelReason: 'Tier 2: operator did not provide exact removal phrase',
    };
  }

  // Tier 3 (conditional)
  const tripleConfirmRequired = snapshot.spend24hMicros > 0;
  if (tripleConfirmRequired) {
    const confirmed3 = await requireRecentSpendPhrase(snapshot.spend24hMicros, snapshot.currencyCode);
    if (!confirmed3) {
      return {
        confirmed: false,
        operatorConfirmedPhrase: phrase,
        tripleConfirmRequired: true,
        cancelReason: 'Tier 3: operator did not confirm recent-spend phrase',
      };
    }
  }

  return {
    confirmed: true,
    operatorConfirmedPhrase: phrase,
    tripleConfirmRequired,
  };
}
