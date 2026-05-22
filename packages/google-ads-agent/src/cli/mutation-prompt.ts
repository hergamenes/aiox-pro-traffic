import { input } from '@inquirer/prompts';
import { formatMicros, type BudgetDelta } from '../google-ads-api/budget-validator.js';
import { COLORS } from './display.js';

export interface BudgetMutationPreview {
  campaignId: string;
  campaignName: string;
  customerId: string;
  customerName?: string;
  beforeMicros: number;
  afterMicros: number;
  currency: string;
  delta: BudgetDelta;
  thresholdPct: number;
}

/**
 * Renders the diff between current and proposed budget for human review.
 * Highlights when the change exceeds the anti-runaway threshold.
 */
export function formatBudgetMutationDiff(preview: BudgetMutationPreview): string {
  const lines: string[] = [];
  const customerLabel = preview.customerName
    ? `${preview.customerId} (${preview.customerName})`
    : preview.customerId;

  const exceeds = preview.delta.exceedsThreshold(preview.thresholdPct);
  const massive = preview.delta.isMassiveReduction();

  const before = formatMicros(preview.beforeMicros, preview.currency);
  const after = formatMicros(preview.afterMicros, preview.currency);
  const pctStr =
    preview.delta.pct === Number.POSITIVE_INFINITY
      ? '+∞%'
      : `${preview.delta.pct >= 0 ? '+' : ''}${preview.delta.pct.toFixed(1)}%`;

  lines.push(
    `${COLORS.bold}📋 Mudança proposta — Campanha ${preview.campaignName} (${preview.campaignId})${COLORS.reset}`,
  );
  lines.push('━'.repeat(50));
  lines.push(`Budget atual:     ${before}/dia`);
  const exceedsLabel = exceeds ? ` ${COLORS.yellow}— ACIMA DO LIMITE ${preview.thresholdPct}%${COLORS.reset}` : '';
  lines.push(`Budget novo:      ${after}/dia (${pctStr}${exceedsLabel})`);
  lines.push(`Conta:            ${customerLabel}`);
  if (exceeds) {
    lines.push('');
    lines.push(
      `${COLORS.yellow}⚠️  Aumento de ${pctStr} excede limite anti-runaway (${preview.thresholdPct}%).${COLORS.reset}`,
    );
  }
  if (massive) {
    lines.push('');
    lines.push(
      `${COLORS.yellow}⚠️  Redução >=90% — confirme que isso é intencional.${COLORS.reset}`,
    );
  }
  return lines.join('\n');
}

/**
 * Prompts the user to type an EXACT confirmation phrase. Returns true
 * only when the input matches `expectedPhrase` character-for-character
 * (case-insensitive, whitespace-trimmed).
 *
 * This is stricter than a yes/no prompt — it forces the operator to
 * acknowledge the specific value change, not just "approve".
 */
export async function requireDoubleConfirm(expectedPhrase: string): Promise<boolean> {
  try {
    const answer = await input({
      message: `Confirme digitando "${expectedPhrase}":`,
      validate: (raw: string) => {
        if (raw.trim().toLowerCase() === expectedPhrase.toLowerCase()) {
          return true;
        }
        return 'Frase não bate — digite exatamente como mostrado, ou Ctrl+C para cancelar';
      },
    });
    return answer.trim().toLowerCase() === expectedPhrase.toLowerCase();
  } catch {
    // User pressed Ctrl+C
    return false;
  }
}

/**
 * Builds the confirmation phrase the operator must type, in the format
 * "sim, aumentar de R$ X para R$ Y" or "sim, alterar de X para Y".
 */
export function buildBudgetConfirmPhrase(beforeMicros: number, afterMicros: number, currency: string): string {
  const verb = afterMicros > beforeMicros ? 'aumentar' : 'reduzir';
  const before = formatMicros(beforeMicros, currency);
  const after = formatMicros(afterMicros, currency);
  return `sim, ${verb} de ${before} para ${after}`;
}

// ============================================================================
// Story 6.2 — Status mutation prompts (pause/enable)
// ============================================================================

export interface StatusMutationPreview {
  entityType: 'campaign' | 'ad_group';
  name: string;
  entityId: string;
  before: 'ENABLED' | 'PAUSED' | 'REMOVED' | 'UNKNOWN';
  after: 'ENABLED' | 'PAUSED';
  customerId: string;
  customerName?: string;
  parentCampaignName?: string;
  learningPhaseWarning?: boolean;
  learningPhaseDays?: number;
}

/**
 * Renders the before/after status diff for an entity (campaign or ad_group).
 * Simpler than the budget diff — no percentage, no threshold.
 */
export function formatStatusMutationDiff(preview: StatusMutationPreview): string {
  const lines: string[] = [];
  const customerLabel = preview.customerName
    ? `${preview.customerId} (${preview.customerName})`
    : preview.customerId;

  const entityLabel = preview.entityType === 'campaign' ? 'Campanha' : 'Ad Group';
  lines.push(
    `${COLORS.bold}📋 Mudança proposta — ${entityLabel} ${preview.name} (${preview.entityId})${COLORS.reset}`,
  );
  lines.push('━'.repeat(50));
  lines.push(`Status atual:     ${preview.before}`);
  lines.push(`Status novo:      ${preview.after}`);
  if (preview.parentCampaignName) {
    lines.push(`Campanha pai:     ${preview.parentCampaignName}`);
  }
  lines.push(`Conta:            ${customerLabel}`);

  if (preview.learningPhaseWarning) {
    lines.push('');
    const daysText =
      preview.learningPhaseDays !== undefined
        ? `há ${preview.learningPhaseDays} dia(s)`
        : 'recentemente';
    lines.push(
      `${COLORS.yellow}⚠️  Bidding strategy modificada ${daysText} (< 14d).${COLORS.reset}`,
    );
    lines.push(
      `${COLORS.yellow}    Pausar agora pode interromper o learning phase do Google.${COLORS.reset}`,
    );
  }

  return lines.join('\n');
}

/**
 * Simple s/N confirmation prompt. Accepts 's', 'sim', 'y', 'yes' (any case) as
 * true; everything else as false. Default is N (rejection-biased).
 */
export async function requireSimpleConfirm(message = 'Confirme'): Promise<boolean> {
  try {
    const answer = await input({
      message: `${message} [s/N]:`,
      default: 'n',
    });
    const normalized = answer.trim().toLowerCase();
    return normalized === 's' || normalized === 'sim' || normalized === 'y' || normalized === 'yes';
  } catch {
    return false;
  }
}

// ============================================================================
// Story 6.3a — Campaign create preview
// ============================================================================

export interface CampaignCreatePreviewInput {
  customerId: string;
  customerName?: string;
  campaignType: 'Search' | 'Display' | 'Performance Max';
  name: string;
  dailyMicros: number;
  currencyCode: string;
  timeZone: string;
  bidding: string;
  targetMicros?: number;
  targetRoas?: number;
  startDateYYYYMMDD: string;
  network: string;
  sessionBudgetCurrentMicros: number;
  sessionBudgetProposedMicros: number;
  sessionBudgetLimitMicros: number;
  sessionBudgetExceedsHalf: boolean;
  sessionBudgetExceedsLimit: boolean;
  conversionsLast30d?: number;
  nextSteps: string[];
}

/**
 * Renders the create-preview block before the operator confirms.
 * Used by `create campaign-search` (Story 6.3a) — and reused by 6.3b/6.3c.
 */
export function formatCampaignCreatePreview(p: CampaignCreatePreviewInput): string {
  const lines: string[] = [];
  const customerLabel = p.customerName ? `${p.customerId} (${p.customerName})` : p.customerId;

  const ddash = p.startDateYYYYMMDD;
  const startDateFmt =
    ddash.length === 8
      ? `${ddash.slice(0, 4)}-${ddash.slice(4, 6)}-${ddash.slice(6, 8)} (${p.timeZone})`
      : `${ddash} (${p.timeZone})`;

  let targetLine = '— (não aplicável)';
  if (p.bidding === 'target_cpa' && p.targetMicros !== undefined) {
    targetLine = `${formatMicros(p.targetMicros, p.currencyCode)} (CPA alvo)`;
  } else if (p.bidding === 'target_roas' && p.targetRoas !== undefined) {
    targetLine = `${p.targetRoas.toFixed(2)} (ROAS alvo)`;
  }

  lines.push(
    `${COLORS.bold}📋 Nova campanha ${p.campaignType} — conta ${customerLabel}${COLORS.reset}`,
  );
  lines.push('━'.repeat(50));
  lines.push(`Nome:             ${p.name}`);
  lines.push(
    `Budget diário:    ${formatMicros(p.dailyMicros, p.currencyCode)} (${p.currencyCode} — moeda da conta)`,
  );
  lines.push(`Bidding:          ${p.bidding}`);
  lines.push(`Target:           ${targetLine}`);
  lines.push(`Start date:       ${startDateFmt}`);
  lines.push(`Network:          ${p.network}`);
  lines.push(`Status inicial:   ${COLORS.yellow}PAUSED${COLORS.reset} (operação segura — campanha NÃO começa a rodar)`);

  // Session budget
  const sessionCurrent = formatMicros(p.sessionBudgetProposedMicros, p.currencyCode);
  const sessionLimit = formatMicros(p.sessionBudgetLimitMicros, p.currencyCode);
  lines.push('');
  const sessionLabel = p.sessionBudgetExceedsLimit
    ? `${COLORS.red}⚠️ Soma de --daily nesta sessão: ${sessionCurrent} / ${sessionLimit} (ULTRAPASSA limite anti-runaway)${COLORS.reset}`
    : p.sessionBudgetExceedsHalf
      ? `${COLORS.yellow}⚠️ Soma de --daily nesta sessão: ${sessionCurrent} / ${sessionLimit} (>50% do limite)${COLORS.reset}`
      : `${COLORS.dim}Soma de --daily nesta sessão: ${sessionCurrent} / ${sessionLimit}${COLORS.reset}`;
  lines.push(sessionLabel);

  // Conversions warning
  if (p.bidding === 'maximize_conversions' && p.conversionsLast30d !== undefined && p.conversionsLast30d < 30) {
    lines.push('');
    lines.push(
      `${COLORS.yellow}⚠️ Conta tem ${p.conversionsLast30d} conversões nos últimos 30d (<30).${COLORS.reset}`,
    );
    lines.push(
      `${COLORS.yellow}    Maximize Conversions pode ficar "limited" — considere manual_cpc para contas novas.${COLORS.reset}`,
    );
  }

  // Next steps
  if (p.nextSteps.length > 0) {
    lines.push('');
    lines.push(`${COLORS.dim}ℹ️ Próximos passos após esta criação:${COLORS.reset}`);
    p.nextSteps.forEach((step, idx) => {
      lines.push(`${COLORS.dim}   ${idx + 1}. ${step}${COLORS.reset}`);
    });
  }

  return lines.join('\n');
}
