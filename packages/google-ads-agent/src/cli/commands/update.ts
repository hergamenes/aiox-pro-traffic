import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  updateCampaignBudget,
  updateCampaignBidding,
  readCampaignBudgetSnapshot,
  type BiddingStrategyKind,
} from '../../google-ads-api/mutations.js';
import { getDefaults } from '../../config/config-repository.js';
import {
  parseMicros,
  calculateBudgetDelta,
  formatMicros,
} from '../../google-ads-api/budget-validator.js';
import {
  formatBudgetMutationDiff,
  requireDoubleConfirm,
  buildBudgetConfirmPhrase,
} from '../mutation-prompt.js';
import { appendMutationLog } from '../../log/mutation-log.js';
import { COLORS } from '../display.js';
import { printError } from '../../errors/error-handler.js';
import { logger } from '../logger.js';
import { checkSessionLimit, addToSessionBudget } from '../session-budget-tracker.js';

/** Default anti-runaway ceiling for the cumulative daily-budget exposure added in a session (BRL). */
const DEFAULT_MAX_SESSION_BUDGET_BRL = 500;

const VALID_STRATEGIES: BiddingStrategyKind[] = [
  'maximize_conversions',
  'target_cpa',
  'target_roas',
  'manual_cpc',
  'maximize_conversion_value',
];

const AUTOMATED_STRATEGIES = new Set<BiddingStrategyKind>([
  'maximize_conversions',
  'target_cpa',
  'target_roas',
  'maximize_conversion_value',
]);

export const updateCommand = new Command('update')
  .description('Atualizar campanhas existentes (budget, bidding strategy)');

updateCommand
  .command('budget <campaign-id>')
  .description('Alterar orçamento diário de uma campanha existente')
  .option('--daily <amount>', 'Novo orçamento diário (ex: 50, "R$ 50,00", 50.00)')
  .option('--customer-id <id>', 'Customer ID (default: do config)')
  .option('--login-customer-id <id>', 'Login Customer ID — MCC parent (default: do config)')
  .option('--dry-run', 'Apenas validar; não aplicar mudança', false)
  .option(
    '--max-budget-increase <pct>',
    'Threshold (%) acima do qual exige double-confirm',
    '50',
  )
  .option(
    '--max-session-budget <amount>',
    `Limite anti-runaway da soma de aumentos de --daily na sessão (default: ${DEFAULT_MAX_SESSION_BUDGET_BRL})`,
    String(DEFAULT_MAX_SESSION_BUDGET_BRL),
  )
  .option('--force-max-session-budget', 'Override explícito do limite de sessão', false)
  .action(
    async (
      campaignId: string,
      options: {
        daily?: string;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
        maxBudgetIncrease?: string;
        maxSessionBudget?: string;
        forceMaxSessionBudget?: boolean;
      },
    ) => {
      try {
        if (!options.daily) {
          console.error(
            `${COLORS.red}Erro: --daily é obrigatório (ex: --daily 50)${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(
            `${COLORS.red}Erro: customer-id não fornecido e não há default. Use --customer-id ou rode 'google-ads config set-default'.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const loginCustomerId =
          options.loginCustomerId ?? defaults.loginCustomerId ?? creds.loginCustomerId;
        const thresholdPct = Number(options.maxBudgetIncrease ?? 50);
        const dryRun = Boolean(options.dryRun);

        const newAmountMicros = parseMicros(options.daily);

        const client = createClient({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          developerToken: creds.developerToken,
        });

        // Pre-fetch snapshot
        const snapshot = await readCampaignBudgetSnapshot(
          client,
          creds.refreshToken,
          customerId,
          campaignId,
          loginCustomerId,
        );

        const currency = snapshot.currencyCode ?? 'BRL';
        const delta = calculateBudgetDelta(snapshot.budgetAmountMicros, newAmountMicros);

        // ============ No-op veto ============
        // If the new amount equals the current amount, there is nothing to change.
        // Skip the API call entirely — sending a no-op mutation just burns quota
        // and pollutes the audit log with a meaningless entry.
        if (newAmountMicros === snapshot.budgetAmountMicros) {
          console.error(
            `${COLORS.yellow}Nenhuma mudança: o orçamento já é ${formatMicros(snapshot.budgetAmountMicros, currency)}. Mutação não enviada.${COLORS.reset}`,
          );
          await appendMutationLog({
            customerId,
            campaignId,
            operation: 'update_budget',
            before: { amountMicros: snapshot.budgetAmountMicros },
            after: { amountMicros: newAmountMicros },
            dryRun,
            success: false,
            error: 'No-op: novo valor igual ao valor atual',
          });
          process.exitCode = 1;
          return;
        }

        // ============ Session budget check (anti-runaway) ============
        // Track the INCREASE in daily exposure (reductions add nothing to runaway
        // risk). Consistent with `create`, which adds the full daily to the session.
        const maxSessionBudgetMicros = parseMicros(
          options.maxSessionBudget ?? String(DEFAULT_MAX_SESSION_BUDGET_BRL),
        );
        const sessionIncreaseMicros = Math.max(
          0,
          newAmountMicros - snapshot.budgetAmountMicros,
        );
        const sessionCheck = await checkSessionLimit(
          sessionIncreaseMicros,
          maxSessionBudgetMicros,
        );
        if (sessionCheck.exceedsLimit && !options.forceMaxSessionBudget) {
          console.error(
            `${COLORS.red}Soma de aumentos de orçamento nesta sessão (${sessionCheck.proposedTotalMicros / 1_000_000} ${currency}) ultrapassa --max-session-budget (${maxSessionBudgetMicros / 1_000_000} ${currency}).${COLORS.reset}`,
          );
          console.error(
            `${COLORS.dim}Use --force-max-session-budget para override explícito.${COLORS.reset}`,
          );
          await appendMutationLog({
            customerId,
            campaignId,
            operation: 'update_budget',
            before: { amountMicros: snapshot.budgetAmountMicros },
            after: { amountMicros: newAmountMicros },
            dryRun,
            success: false,
            error: 'Limite de sessão (--max-session-budget) excedido',
          });
          process.exitCode = 1;
          return;
        }

        // Show diff to operator
        console.log('');
        console.log(
          formatBudgetMutationDiff({
            campaignId: snapshot.campaignId,
            campaignName: snapshot.campaignName,
            customerId,
            beforeMicros: snapshot.budgetAmountMicros,
            afterMicros: newAmountMicros,
            currency,
            delta,
            thresholdPct,
          }),
        );
        console.log('');

        // Anti-runaway veto
        if (delta.exceedsThreshold(thresholdPct)) {
          const phrase = buildBudgetConfirmPhrase(
            snapshot.budgetAmountMicros,
            newAmountMicros,
            currency,
          );
          const confirmed = await requireDoubleConfirm(phrase);
          if (!confirmed) {
            console.log(`${COLORS.yellow}Mutação cancelada pelo operador.${COLORS.reset}`);
            await appendMutationLog({
              customerId,
              campaignId,
              operation: 'update_budget',
              before: { amountMicros: snapshot.budgetAmountMicros },
              after: { amountMicros: newAmountMicros },
              dryRun,
              success: false,
              error: 'Operador não confirmou double-confirm anti-runaway',
            });
            return;
          }
        }

        // Apply mutation
        const result = await updateCampaignBudget(client, {
          customerId,
          campaignId,
          newAmountMicros,
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          dryRun,
        });

        // Persist session budget (only if NOT dry-run) — consistent with `create`.
        if (!dryRun) {
          await addToSessionBudget(sessionIncreaseMicros);
        }

        // Persist audit log
        await appendMutationLog({
          customerId,
          campaignId,
          operation: 'update_budget',
          before: { amountMicros: result.before.amountMicros },
          after: { amountMicros: result.after.amountMicros },
          dryRun,
          success: true,
        });

        // Success output
        console.log('');
        if (dryRun) {
          console.log(
            `${COLORS.green}✓ Dry-run validado — mudança NÃO foi aplicada.${COLORS.reset}`,
          );
        } else {
          console.log(
            `${COLORS.green}✓ Budget atualizado: ${formatMicros(result.before.amountMicros, currency)} → ${formatMicros(result.after.amountMicros, currency)}${COLORS.reset}`,
          );
        }
        console.log(`  Resource: ${result.resourceName}`);
        console.log(
          `  Ads Manager: https://ads.google.com/aw/campaigns?ocid=&__c=${customerId.replace(/-/g, '')}`,
        );
        if (!dryRun) {
          console.log(
            `${COLORS.dim}  Nota: mudanças podem levar ~30min para propagarem nos relatórios.${COLORS.reset}`,
          );
        }
      } catch (err) {
        try {
          // Best-effort failure log
          await appendMutationLog({
            customerId: options.customerId ?? '?',
            campaignId,
            operation: 'update_budget',
            before: {},
            after: {},
            dryRun: Boolean(options.dryRun),
            success: false,
            error: err instanceof Error ? err.message : String(err),
          });
        } catch (logErr) {
          logger.warn({ logErr }, 'Failed to write failure log');
        }
        printError(err);
        process.exitCode = 1;
      }
    },
  );

updateCommand
  .command('bidding <campaign-id>')
  .description('Alterar estratégia de lance de uma campanha existente')
  .option(
    '--strategy <strategy>',
    'Estratégia: maximize_conversions, target_cpa, target_roas, manual_cpc, maximize_conversion_value',
  )
  .option('--target <value>', 'Target: CPA em currency (target_cpa) ou ROAS decimal (target_roas)')
  .option('--customer-id <id>', 'Customer ID (default: do config)')
  .option('--login-customer-id <id>', 'Login Customer ID — MCC parent (default: do config)')
  .option('--dry-run', 'Apenas validar; não aplicar mudança', false)
  .action(
    async (
      campaignId: string,
      options: {
        strategy?: string;
        target?: string;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      },
    ) => {
      try {
        if (!options.strategy) {
          console.error(
            `${COLORS.red}Erro: --strategy é obrigatório.${COLORS.reset}\nOpções: ${VALID_STRATEGIES.join(', ')}`,
          );
          process.exitCode = 1;
          return;
        }
        const strategy = options.strategy.toLowerCase() as BiddingStrategyKind;
        if (!VALID_STRATEGIES.includes(strategy)) {
          console.error(
            `${COLORS.red}Estratégia inválida: ${options.strategy}${COLORS.reset}\nOpções: ${VALID_STRATEGIES.join(', ')}`,
          );
          process.exitCode = 1;
          return;
        }
        if ((strategy === 'target_cpa' || strategy === 'target_roas') && !options.target) {
          console.error(
            `${COLORS.red}Erro: estratégia ${strategy} exige --target${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(
            `${COLORS.red}Erro: customer-id não fornecido e não há default.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const loginCustomerId =
          options.loginCustomerId ?? defaults.loginCustomerId ?? creds.loginCustomerId;
        const dryRun = Boolean(options.dryRun);

        const client = createClient({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          developerToken: creds.developerToken,
        });

        // Build target args
        const updateInput: Parameters<typeof updateCampaignBidding>[1] = {
          customerId,
          campaignId,
          strategy,
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          dryRun,
        };

        if (strategy === 'target_cpa' && options.target) {
          updateInput.targetMicros = parseMicros(options.target);
        } else if (strategy === 'target_roas' && options.target) {
          updateInput.targetRoas = Number(options.target);
          if (!Number.isFinite(updateInput.targetRoas)) {
            console.error(`${COLORS.red}target_roas exige valor decimal (ex: 3.5)${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }
        }

        const result = await updateCampaignBidding(client, updateInput);

        // Warning when switching automation regime
        const wasAutomated = AUTOMATED_STRATEGIES.has(
          result.before.strategy.toLowerCase() as BiddingStrategyKind,
        );
        const willBeAutomated = AUTOMATED_STRATEGIES.has(strategy);
        const regimeChanged = wasAutomated !== willBeAutomated;

        await appendMutationLog({
          customerId,
          campaignId,
          operation: 'update_bidding',
          before: result.before as Record<string, unknown>,
          after: result.after as Record<string, unknown>,
          dryRun,
          success: true,
        });

        console.log('');
        if (dryRun) {
          console.log(
            `${COLORS.green}✓ Dry-run validado — bidding strategy NÃO foi alterada.${COLORS.reset}`,
          );
        } else {
          console.log(
            `${COLORS.green}✓ Bidding strategy atualizada:${COLORS.reset}`,
          );
        }
        console.log(`  Antes: ${result.before.strategy}`);
        console.log(`  Depois: ${result.after.strategy}`);
        console.log(`  Resource: ${result.resourceName}`);
        if (regimeChanged) {
          console.log('');
          console.log(
            `${COLORS.yellow}⚠️  Mudança de regime (manual ↔ automated). Esperar ~7-14 dias de janela de aprendizado antes de avaliar performance.${COLORS.reset}`,
          );
        }
      } catch (err) {
        try {
          await appendMutationLog({
            customerId: options.customerId ?? '?',
            campaignId,
            operation: 'update_bidding',
            before: {},
            after: {},
            dryRun: Boolean(options.dryRun),
            success: false,
            error: err instanceof Error ? err.message : String(err),
          });
        } catch (logErr) {
          logger.warn({ logErr }, 'Failed to write failure log');
        }
        printError(err);
        process.exitCode = 1;
      }
    },
  );
