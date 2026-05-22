import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  createSearchCampaign,
  createDisplayCampaign,
  createPmaxCampaign,
  readCustomerCurrencyAndTz,
  checkCampaignNameExists,
  checkConversionActionsEnabled,
} from '../../google-ads-api/mutations.js';
import {
  validateBiddingStrategy,
  validateDisplayBiddingStrategy,
  validatePmaxBidding,
  parseStartDate,
  type BiddingStrategy,
  type DisplayBiddingStrategy,
  type PmaxBiddingStrategy,
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

const VALID_DISPLAY_BIDDING_STRATEGIES: DisplayBiddingStrategy[] = [
  'maximize_conversions',
  'target_cpa',
  'maximize_conversion_value',
  'maximize_clicks',
];

const VALID_PMAX_BIDDING_STRATEGIES: PmaxBiddingStrategy[] = [
  'maximize_conversion_value',
  'target_roas',
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

// ============================================================================
// Story 6.3b — create campaign-display
// ============================================================================

createCommand
  .command('campaign-display')
  .description('Cria uma campanha Display (CampaignBudget + Campaign em status PAUSED)')
  .requiredOption('--name <text>', 'Nome da campanha (max 255 chars)')
  .requiredOption('--daily <amount>', 'Orçamento diário na moeda da conta')
  .option(
    '--bidding <strategy>',
    `Estratégia (default: maximize_conversions). Display: ${VALID_DISPLAY_BIDDING_STRATEGIES.join(', ')}`,
    'maximize_conversions',
  )
  .option('--target <value>', 'Target CPA — apenas para target_cpa')
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
        if (options.name.length > 255) {
          console.error(`${COLORS.red}Erro: --name excede 255 caracteres.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        const strategy = options.bidding.toLowerCase() as DisplayBiddingStrategy;
        if (!VALID_DISPLAY_BIDDING_STRATEGIES.includes(strategy)) {
          console.error(
            `${COLORS.red}Estratégia inválida para Display: ${options.bidding}${COLORS.reset}\nOpções: ${VALID_DISPLAY_BIDDING_STRATEGIES.join(', ')}`,
          );
          process.exitCode = 1;
          return;
        }

        // Parse target
        let targetMicros: number | undefined;
        if (options.target !== undefined) {
          if (strategy === 'target_cpa') {
            targetMicros = parseMicros(options.target);
          } else {
            console.error(
              `${COLORS.red}Estratégia ${strategy} NÃO aceita --target. Use apenas com target_cpa.${COLORS.reset}`,
            );
            process.exitCode = 1;
            return;
          }
        }

        const biddingValidation = validateDisplayBiddingStrategy(strategy, targetMicros);
        if (!biddingValidation.ok) {
          console.error(`${COLORS.red}${biddingValidation.error}${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        const dailyMicros = parseMicros(options.daily);
        const maxSessionBudgetMicros = parseMicros(
          options.maxSessionBudget ?? String(DEFAULT_MAX_SESSION_BUDGET_BRL),
        );
        const dryRun = Boolean(options.dryRun);

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

        const ctx = await readCustomerCurrencyAndTz(
          client,
          creds.refreshToken,
          customerId,
          loginCustomerId,
        );

        if (ctx.isManager) {
          console.error(
            `${COLORS.red}Conta ${customerId} é Manager Account (MCC). Use uma conta cliente filha.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const exists = await checkCampaignNameExists(
          client,
          creds.refreshToken,
          customerId,
          options.name,
          loginCustomerId,
        );
        if (exists) {
          console.error(
            `${COLORS.red}Já existe campanha '${options.name}' nesta conta.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const sessionCheck = await checkSessionLimit(dailyMicros, maxSessionBudgetMicros);
        if (sessionCheck.exceedsLimit && !options.forceMaxSessionBudget) {
          console.error(
            `${COLORS.red}Soma de --daily nesta sessão (${sessionCheck.proposedTotalMicros / 1_000_000} ${ctx.currencyCode}) ultrapassa --max-session-budget (${maxSessionBudgetMicros / 1_000_000} ${ctx.currencyCode}).${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const startDateYYYYMMDD = parseStartDate(options.startDate, ctx.timeZone);

        console.log('');
        console.log(
          formatCampaignCreatePreview({
            customerId,
            campaignType: 'Display',
            name: options.name,
            dailyMicros,
            currencyCode: ctx.currencyCode,
            timeZone: ctx.timeZone,
            bidding: strategy,
            ...(targetMicros !== undefined ? { targetMicros } : {}),
            startDateYYYYMMDD,
            network: 'Display Network (Search OFF)',
            sessionBudgetCurrentMicros: sessionCheck.currentMicros,
            sessionBudgetProposedMicros: sessionCheck.proposedTotalMicros,
            sessionBudgetLimitMicros: maxSessionBudgetMicros,
            sessionBudgetExceedsHalf: sessionCheck.exceedsHalf,
            sessionBudgetExceedsLimit: sessionCheck.exceedsLimit,
            nextSteps: [
              'google-ads create ad-group <ad-group-id> ... (Story 6.4)',
              'google-ads create ad rda <ad-group-id> ... (Story 6.5 — RDA para Display)',
              'google-ads enable campaign <campaign-id> (Story 6.2)',
            ],
          }),
        );
        console.log('');

        const confirmed = await requireSimpleConfirm('Confirmar criação');
        if (!confirmed) {
          console.log(`${COLORS.yellow}Criação cancelada pelo operador.${COLORS.reset}`);
          await appendMutationLog({
            customerId,
            campaignId: '-',
            operation: 'create_campaign_display',
            before: {},
            after: { name: options.name, dailyMicros, status: 'PAUSED' },
            dryRun,
            success: false,
            error: 'Operador não confirmou criação',
          });
          return;
        }

        const result = await createDisplayCampaign(client, {
          customerId,
          name: options.name,
          dailyMicros,
          bidding: strategy,
          ...(targetMicros !== undefined ? { targetMicros } : {}),
          startDateYYYYMMDD,
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          dryRun,
        });

        if (!dryRun) {
          await addToSessionBudget(dailyMicros);
        }

        await appendMutationLog({
          customerId,
          campaignId: result.campaignId,
          operation: 'create_campaign_display',
          before: {},
          after: {
            name: options.name,
            dailyMicros,
            bidding: strategy,
            ...(targetMicros !== undefined ? { targetMicros } : {}),
            startDate: startDateYYYYMMDD,
            status: 'PAUSED',
            channelType: 'DISPLAY',
            campaignResourceName: result.campaignResourceName,
            budgetResourceName: result.budgetResourceName,
          },
          dryRun,
          success: true,
        });

        console.log('');
        if (dryRun) {
          console.log(`${COLORS.green}✓ Dry-run validado — NENHUMA campanha foi criada.${COLORS.reset}`);
          console.log(`  Resource preview: ${result.campaignResourceName}`);
        } else {
          console.log(`${COLORS.green}✓ Campanha Display criada: ${result.campaignResourceName}${COLORS.reset}`);
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
          `${COLORS.dim}  2. google-ads create ad rda <ad-group-id> ... (Story 6.5 — Display usa RDA)${COLORS.reset}`,
        );
        console.log(
          `${COLORS.dim}  3. google-ads enable campaign ${result.campaignId} (Story 6.2)${COLORS.reset}`,
        );
      } catch (err) {
        try {
          await appendMutationLog({
            customerId: options.customerId ?? '?',
            campaignId: '-',
            operation: 'create_campaign_display',
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


// ============================================================================
// Story 6.3c — create campaign-pmax
// ============================================================================

createCommand
  .command('campaign-pmax')
  .description('Cria uma campanha Performance Max (Budget + Campaign + AssetGroup skeleton, todos PAUSED)')
  .requiredOption('--name <text>', 'Nome da campanha (max 255 chars)')
  .requiredOption('--daily <amount>', 'Orçamento diário na moeda da conta')
  .requiredOption('--final-url <url>', 'URL final obrigatória (PMax exige)')
  .option(
    '--bidding <strategy>',
    `Estratégia PMax (default: maximize_conversion_value). Opções: ${VALID_PMAX_BIDDING_STRATEGIES.join(', ')}`,
    'maximize_conversion_value',
  )
  .option('--target-roas <decimal>', 'Target ROAS (decimal, ex: 2.5) — apenas para target_roas')
  .option('--start-date <YYYY-MM-DD>', 'Data de início')
  .option('--end-date <YYYY-MM-DD>', 'Data de término (opcional)')
  .option('--customer-id <id>', 'Customer ID (default: do config)')
  .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
  .option('--dry-run', 'Apenas validar; não criar nada real', false)
  .option(
    '--max-session-budget <amount>',
    `Limite anti-runaway (default: ${DEFAULT_MAX_SESSION_BUDGET_BRL})`,
    String(DEFAULT_MAX_SESSION_BUDGET_BRL),
  )
  .option('--force-max-session-budget', 'Override explícito do limite', false)
  .action(
    async (options: {
      name: string;
      daily: string;
      finalUrl: string;
      bidding: string;
      targetRoas?: string;
      startDate?: string;
      endDate?: string;
      customerId?: string;
      loginCustomerId?: string;
      dryRun?: boolean;
      maxSessionBudget?: string;
      forceMaxSessionBudget?: boolean;
    }) => {
      try {
        if (options.name.length > 255) {
          console.error(`${COLORS.red}Erro: --name excede 255 caracteres.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }
        if (!options.finalUrl.startsWith('https://') && !options.finalUrl.startsWith('http://')) {
          console.error(`${COLORS.red}Erro: --final-url deve ser uma URL completa (http:// ou https://).${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        const strategy = options.bidding.toLowerCase() as PmaxBiddingStrategy;
        if (!VALID_PMAX_BIDDING_STRATEGIES.includes(strategy)) {
          console.error(
            `${COLORS.red}Estratégia inválida para PMax: ${options.bidding}${COLORS.reset}\nPMax aceita: ${VALID_PMAX_BIDDING_STRATEGIES.join(', ')}`,
          );
          process.exitCode = 1;
          return;
        }

        let targetRoas: number | undefined;
        if (options.targetRoas !== undefined) {
          targetRoas = Number(options.targetRoas);
          if (!Number.isFinite(targetRoas)) {
            console.error(`${COLORS.red}--target-roas deve ser decimal (ex: 2.5)${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }
        }

        const biddingValidation = validatePmaxBidding(strategy, targetRoas);
        if (!biddingValidation.ok) {
          console.error(`${COLORS.red}${biddingValidation.error}${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }
        // Warning case (ok=true but with error message)
        if (biddingValidation.ok && biddingValidation.error) {
          console.log(`${COLORS.yellow}⚠️  ${biddingValidation.error}${COLORS.reset}`);
        }

        const dailyMicros = parseMicros(options.daily);
        const maxSessionBudgetMicros = parseMicros(
          options.maxSessionBudget ?? String(DEFAULT_MAX_SESSION_BUDGET_BRL),
        );
        const dryRun = Boolean(options.dryRun);

        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(`${COLORS.red}Erro: customer-id não fornecido e não há default.${COLORS.reset}`);
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

        const ctx = await readCustomerCurrencyAndTz(client, creds.refreshToken, customerId, loginCustomerId);
        if (ctx.isManager) {
          console.error(`${COLORS.red}Conta ${customerId} é Manager Account (MCC). Use uma conta cliente.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        // PMax-specific: conversion_action prerequisite
        const conversionActionsCount = await checkConversionActionsEnabled(
          client,
          creds.refreshToken,
          customerId,
          loginCustomerId,
        );
        if (conversionActionsCount === 0) {
          console.error(
            `${COLORS.red}❌ Conta ${customerId} não tem nenhuma conversion_action ativa.${COLORS.reset}`,
          );
          console.error(
            `${COLORS.red}PMax exige pelo menos 1 conversion_action ENABLED para funcionar.${COLORS.reset}`,
          );
          console.error(
            `${COLORS.dim}Configure no Google Ads UI: Ferramentas → Conversões → Nova ação de conversão.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const exists = await checkCampaignNameExists(client, creds.refreshToken, customerId, options.name, loginCustomerId);
        if (exists) {
          console.error(`${COLORS.red}Já existe campanha '${options.name}' nesta conta.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        const sessionCheck = await checkSessionLimit(dailyMicros, maxSessionBudgetMicros);
        if (sessionCheck.exceedsLimit && !options.forceMaxSessionBudget) {
          console.error(
            `${COLORS.red}Soma de --daily nesta sessão ultrapassa --max-session-budget.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const startDateYYYYMMDD = parseStartDate(options.startDate, ctx.timeZone);
        const endDateYYYYMMDD = options.endDate ? parseStartDate(options.endDate, ctx.timeZone) : undefined;

        console.log('');
        console.log(
          formatCampaignCreatePreview({
            customerId,
            campaignType: 'Performance Max',
            name: options.name,
            dailyMicros,
            currencyCode: ctx.currencyCode,
            timeZone: ctx.timeZone,
            bidding: targetRoas !== undefined ? `target_roas (${targetRoas.toFixed(2)})` : strategy,
            ...(targetRoas !== undefined ? { targetRoas } : {}),
            startDateYYYYMMDD,
            network: 'Performance Max (multi-channel — Search + Display + YouTube + Discovery)',
            sessionBudgetCurrentMicros: sessionCheck.currentMicros,
            sessionBudgetProposedMicros: sessionCheck.proposedTotalMicros,
            sessionBudgetLimitMicros: maxSessionBudgetMicros,
            sessionBudgetExceedsHalf: sessionCheck.exceedsHalf,
            sessionBudgetExceedsLimit: sessionCheck.exceedsLimit,
            nextSteps: [
              `Anexar assets ao AssetGroup (Story 6.6 — REQUIRED antes de ativar)`,
              `google-ads enable campaign <campaign-id> (Story 6.2)`,
            ],
          }),
        );
        console.log('');
        console.log(`${COLORS.yellow}⚠️  AVISOS PMax:${COLORS.reset}`);
        console.log(`${COLORS.yellow}   • Asset group será criado vazio — campanha NÃO servirá impressões até anexar assets${COLORS.reset}`);
        console.log(`${COLORS.yellow}   • PMax pode canibalizar Search/Display existentes — considere brand exclusion${COLORS.reset}`);
        console.log(`${COLORS.yellow}   • Learning phase de 7-14 dias após ativar${COLORS.reset}`);
        console.log(`${COLORS.green}   ✓ ${conversionActionsCount} conversion_action(s) ENABLED encontradas${COLORS.reset}`);
        console.log('');

        const confirmed = await requireSimpleConfirm('Confirmar criação');
        if (!confirmed) {
          console.log(`${COLORS.yellow}Criação cancelada pelo operador.${COLORS.reset}`);
          await appendMutationLog({
            customerId,
            campaignId: '-',
            operation: 'create_campaign_pmax',
            before: {},
            after: { name: options.name, dailyMicros, status: 'PAUSED' },
            dryRun,
            success: false,
            error: 'Operador não confirmou criação',
          });
          return;
        }

        const result = await createPmaxCampaign(client, {
          customerId,
          name: options.name,
          dailyMicros,
          finalUrl: options.finalUrl,
          bidding: strategy,
          ...(targetRoas !== undefined ? { targetRoas } : {}),
          startDateYYYYMMDD,
          ...(endDateYYYYMMDD ? { endDateYYYYMMDD } : {}),
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          dryRun,
        });

        if (!dryRun) {
          await addToSessionBudget(dailyMicros);
        }

        await appendMutationLog({
          customerId,
          campaignId: result.campaignId,
          operation: 'create_campaign_pmax',
          before: {},
          after: {
            name: options.name,
            dailyMicros,
            bidding: strategy,
            ...(targetRoas !== undefined ? { targetRoas } : {}),
            finalUrl: options.finalUrl,
            startDate: startDateYYYYMMDD,
            ...(endDateYYYYMMDD ? { endDate: endDateYYYYMMDD } : {}),
            status: 'PAUSED',
            channelType: 'PERFORMANCE_MAX',
            campaignResourceName: result.campaignResourceName,
            budgetResourceName: result.budgetResourceName,
            assetGroupResourceName: result.assetGroupResourceName,
          },
          dryRun,
          success: true,
        });

        console.log('');
        if (dryRun) {
          console.log(`${COLORS.green}✓ Dry-run validado — NENHUMA campanha foi criada.${COLORS.reset}`);
          console.log(`  Campaign preview:    ${result.campaignResourceName}`);
          console.log(`  AssetGroup preview:  ${result.assetGroupResourceName}`);
        } else {
          console.log(`${COLORS.green}✅ Campanha PMax criada (PAUSED)${COLORS.reset}`);
          console.log(`  Campaign:    ${result.campaignResourceName}`);
          console.log(`  Budget:      ${result.budgetResourceName}`);
          console.log(`  Asset Group: ${result.assetGroupResourceName}`);
          console.log(`  Ads Manager: https://ads.google.com/aw/campaigns?ocid=&__c=${customerId.replace(/-/g, '')}`);
        }
        console.log('');
        console.log(`${COLORS.dim}PRÓXIMOS PASSOS:${COLORS.reset}`);
        console.log(`${COLORS.dim}  1. Anexar assets (logos, imagens, headlines, descriptions) ao AssetGroup (Story 6.6)${COLORS.reset}`);
        console.log(`${COLORS.dim}  2. google-ads enable campaign ${result.campaignId} (Story 6.2) — APENAS depois de anexar assets${COLORS.reset}`);
      } catch (err) {
        try {
          await appendMutationLog({
            customerId: options.customerId ?? '?',
            campaignId: '-',
            operation: 'create_campaign_pmax',
            before: {},
            after: { name: options.name, daily: options.daily, finalUrl: options.finalUrl },
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
