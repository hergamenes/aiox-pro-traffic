import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  createSearchCampaign,
  readCustomerCurrencyAndTz,
  checkCampaignNameExists,
} from '../../google-ads-api/mutations.js';
import {
  validateBiddingStrategy,
  parseStartDate,
  type BiddingStrategy,
} from '../../google-ads-api/campaign-builder.js';
import { parseMicros } from '../../google-ads-api/budget-validator.js';
import { getDefaults } from '../../config/config-repository.js';
import {
  formatCampaignCreatePreview,
  requireSimpleConfirm,
} from '../mutation-prompt.js';
import {
  checkSessionLimit,
  addToSessionBudget,
} from '../session-budget-tracker.js';
import { appendMutationLog } from '../../log/mutation-log.js';
import { COLORS } from '../display.js';
import { printError } from '../../errors/error-handler.js';
import { logger } from '../logger.js';

const VALID_BIDDING_STRATEGIES: BiddingStrategy[] = [
  'maximize_conversions',
  'target_cpa',
  'target_roas',
  'manual_cpc',
  'maximize_conversion_value',
];

const DEFAULT_MAX_SESSION_BUDGET_BRL = 500;

export const createCommand = new Command('create')
  .description('Criar novas entidades no Google Ads (campaign, ad-group, ad)');

createCommand
  .command('campaign-search')
  .description('Cria uma campanha Search (CampaignBudget + Campaign em status PAUSED)')
  .requiredOption('--name <text>', 'Nome da campanha (max 255 chars)')
  .requiredOption('--daily <amount>', 'Orçamento diário na moeda da conta (ex: 50, "R$ 50,00")')
  .option(
    '--bidding <strategy>',
    `Estratégia de lance (default: maximize_conversions). Opções: ${VALID_BIDDING_STRATEGIES.join(', ')}`,
    'maximize_conversions',
  )
  .option('--target <value>', 'Target CPA (currency) ou ROAS (decimal) — apenas para target_cpa/target_roas')
  .option('--start-date <YYYY-MM-DD>', 'Data de início (default: hoje na timezone da conta)')
  .option('--customer-id <id>', 'Customer ID (default: do config)')
  .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
  .option('--dry-run', 'Apenas validar; não criar nada real', false)
  .option(
    '--max-session-budget <amount>',
    `Limite anti-runaway de soma de --daily na sessão (default: ${DEFAULT_MAX_SESSION_BUDGET_BRL})`,
    String(DEFAULT_MAX_SESSION_BUDGET_BRL),
  )
  .option('--force-max-session-budget', 'Override explícito do limite de sessão', false)
  .action(
    async (options: {
      name: string;
      daily: string;
      bidding: string;
      target?: string;
      startDate?: string;
      customerId?: string;
      loginCustomerId?: string;
      dryRun?: boolean;
      maxSessionBudget?: string;
      forceMaxSessionBudget?: boolean;
    }) => {
      try {
        // ============ Validate inputs ============
        if (options.name.length > 255) {
          console.error(
            `${COLORS.red}Erro: --name excede 255 caracteres (limite do Google).${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const strategy = options.bidding.toLowerCase() as BiddingStrategy;
        if (!VALID_BIDDING_STRATEGIES.includes(strategy)) {
          console.error(
            `${COLORS.red}Estratégia inválida: ${options.bidding}${COLORS.reset}\nOpções: ${VALID_BIDDING_STRATEGIES.join(', ')}`,
          );
          process.exitCode = 1;
          return;
        }

        // Parse target value if provided
        let targetMicros: number | undefined;
        let targetRoas: number | undefined;
        if (options.target !== undefined) {
          if (strategy === 'target_cpa') {
            targetMicros = parseMicros(options.target);
          } else if (strategy === 'target_roas') {
            targetRoas = Number(options.target);
            if (!Number.isFinite(targetRoas)) {
              console.error(`${COLORS.red}--target para target_roas deve ser decimal (ex: 2.5)${COLORS.reset}`);
              process.exitCode = 1;
              return;
            }
          } else {
            // --target passed but strategy doesn't accept it
            console.error(
              `${COLORS.red}Estratégia ${strategy} NÃO aceita --target. Use apenas com target_cpa ou target_roas.${COLORS.reset}`,
            );
            process.exitCode = 1;
            return;
          }
        }

        const biddingValidation = validateBiddingStrategy(strategy, targetMicros, targetRoas);
        if (!biddingValidation.ok) {
          console.error(`${COLORS.red}${biddingValidation.error}${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        const dailyMicros = parseMicros(options.daily);
        const maxSessionBudgetMicros = parseMicros(options.maxSessionBudget ?? String(DEFAULT_MAX_SESSION_BUDGET_BRL));
        const dryRun = Boolean(options.dryRun);

        // ============ Resolve auth + customer ============
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

        const client = createClient({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          developerToken: creds.developerToken,
        });

        // ============ Pre-fetch customer context ============
        const ctx = await readCustomerCurrencyAndTz(
          client,
          creds.refreshToken,
          customerId,
          loginCustomerId,
        );

        // R4 veto: cannot create in MCC
        if (ctx.isManager) {
          console.error(
            `${COLORS.red}Conta ${customerId} é Manager Account (MCC) — não suporta criação de campanhas. Use uma conta cliente filha.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        // R5 veto: name already exists
        const exists = await checkCampaignNameExists(
          client,
          creds.refreshToken,
          customerId,
          options.name,
          loginCustomerId,
        );
        if (exists) {
          console.error(
            `${COLORS.red}Já existe campanha '${options.name}' nesta conta. Use --name diferente (ex: --name "${options.name} v2").${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        // ============ Session budget check ============
        const sessionCheck = await checkSessionLimit(dailyMicros, maxSessionBudgetMicros);
        if (sessionCheck.exceedsLimit && !options.forceMaxSessionBudget) {
          console.error(
            `${COLORS.red}Soma de --daily nesta sessão (${sessionCheck.proposedTotalMicros / 1_000_000} ${ctx.currencyCode}) ultrapassa --max-session-budget (${maxSessionBudgetMicros / 1_000_000} ${ctx.currencyCode}).${COLORS.reset}`,
          );
          console.error(
            `${COLORS.dim}Use --force-max-session-budget para override explícito.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        // ============ Parse start date ============
        const startDateYYYYMMDD = parseStartDate(options.startDate, ctx.timeZone);

        // ============ Display preview ============
        console.log('');
        console.log(
          formatCampaignCreatePreview({
            customerId,
            campaignType: 'Search',
            name: options.name,
            dailyMicros,
            currencyCode: ctx.currencyCode,
            timeZone: ctx.timeZone,
            bidding: strategy,
            ...(targetMicros !== undefined ? { targetMicros } : {}),
            ...(targetRoas !== undefined ? { targetRoas } : {}),
            startDateYYYYMMDD,
            network: 'Google Search + Search Partners (Display OFF)',
            sessionBudgetCurrentMicros: sessionCheck.currentMicros,
            sessionBudgetProposedMicros: sessionCheck.proposedTotalMicros,
            sessionBudgetLimitMicros: maxSessionBudgetMicros,
            sessionBudgetExceedsHalf: sessionCheck.exceedsHalf,
            sessionBudgetExceedsLimit: sessionCheck.exceedsLimit,
            nextSteps: [
              'google-ads create ad-group <ad-group-id> ... (Story 6.4)',
              'google-ads create ad rsa <ad-group-id> ... (Story 6.5)',
              'google-ads enable campaign <campaign-id> (Story 6.2)',
            ],
          }),
        );
        console.log('');

        // ============ Confirmation ============
        const confirmed = await requireSimpleConfirm('Confirmar criação');
        if (!confirmed) {
          console.log(`${COLORS.yellow}Criação cancelada pelo operador.${COLORS.reset}`);
          await appendMutationLog({
            customerId,
            campaignId: '-',
            operation: 'create_campaign_search',
            before: {},
            after: { name: options.name, dailyMicros, status: 'PAUSED' },
            dryRun,
            success: false,
            error: 'Operador não confirmou criação',
          });
          return;
        }

        // ============ Apply mutation ============
        const result = await createSearchCampaign(client, {
          customerId,
          name: options.name,
          dailyMicros,
          bidding: strategy,
          ...(targetMicros !== undefined ? { targetMicros } : {}),
          ...(targetRoas !== undefined ? { targetRoas } : {}),
          startDateYYYYMMDD,
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          dryRun,
        });

        // ============ Persist session budget (only if NOT dry-run) ============
        if (!dryRun) {
          await addToSessionBudget(dailyMicros);
        }

        // ============ Audit log ============
        await appendMutationLog({
          customerId,
          campaignId: result.campaignId,
          operation: 'create_campaign_search',
          before: {},
          after: {
            name: options.name,
            dailyMicros,
            bidding: strategy,
            ...(targetMicros !== undefined ? { targetMicros } : {}),
            ...(targetRoas !== undefined ? { targetRoas } : {}),
            startDate: startDateYYYYMMDD,
            status: 'PAUSED',
            campaignResourceName: result.campaignResourceName,
            budgetResourceName: result.budgetResourceName,
          },
          dryRun,
          success: true,
        });

        // ============ Output ============
        console.log('');
        if (dryRun) {
          console.log(
            `${COLORS.green}✓ Dry-run validado — NENHUMA campanha foi criada.${COLORS.reset}`,
          );
          console.log(`  Resource preview: ${result.campaignResourceName}`);
        } else {
          console.log(
            `${COLORS.green}✓ Campanha criada: ${result.campaignResourceName}${COLORS.reset}`,
          );
          console.log(`  Campaign ID: ${result.campaignId}`);
          console.log(`  Budget ID:   ${result.budgetId}`);
          console.log(
            `  Ads Manager: https://ads.google.com/aw/campaigns?ocid=&__c=${customerId.replace(/-/g, '')}`,
          );
        }
        console.log('');
        console.log(`${COLORS.dim}PRÓXIMOS PASSOS:${COLORS.reset}`);
        console.log(
          `${COLORS.dim}  1. google-ads create ad-group ${result.campaignId} ... (Story 6.4)${COLORS.reset}`,
        );
        console.log(
          `${COLORS.dim}  2. google-ads create ad rsa <ad-group-id> ... (Story 6.5)${COLORS.reset}`,
        );
        console.log(
          `${COLORS.dim}  3. google-ads enable campaign ${result.campaignId} (Story 6.2 — só depois de hierarquia completa)${COLORS.reset}`,
        );
      } catch (err) {
        try {
          await appendMutationLog({
            customerId: options.customerId ?? '?',
            campaignId: '-',
            operation: 'create_campaign_search',
            before: {},
            after: { name: options.name, daily: options.daily },
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
