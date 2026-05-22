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
