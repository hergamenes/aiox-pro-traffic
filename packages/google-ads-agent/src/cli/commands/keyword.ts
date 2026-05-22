import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  createAdGroup,
  addKeyword,
  removeKeyword,
  updateKeywordBid,
  readCampaignContext,
  readAdGroupContext,
  readKeywordSnapshot,
} from '../../google-ads-api/mutations.js';
import {
  validateKeywordText,
  isAutomatedBidding,
  type KeywordMatchType,
} from '../../google-ads-api/keyword-validator.js';
import { calculatePercentDelta, parseMicros, formatMicros } from '../../google-ads-api/budget-validator.js';
import { getDefaults } from '../../config/config-repository.js';
import { requireSimpleConfirm, requireDoubleConfirm } from '../mutation-prompt.js';
import { appendMutationLog } from '../../log/mutation-log.js';
import { COLORS } from '../display.js';
import { printError } from '../../errors/error-handler.js';

const VALID_MATCH_TYPES: KeywordMatchType[] = ['BROAD', 'PHRASE', 'EXACT'];

// ============================================================================
// `create ad-group <campaign-id>` — attached to existing `create` command via import
// ============================================================================

export function registerAdGroupSubcommand(createCmd: Command): void {
  createCmd
    .command('ad-group <campaign-id>')
    .description('Cria um novo ad_group dentro de uma campanha Search existente (status PAUSED)')
    .requiredOption('--name <text>', 'Nome do ad_group')
    .option('--cpc-bid <amount>', 'Lance CPC inicial (opcional, usado em manual_cpc)')
    .option('--customer-id <id>', 'Customer ID (default: do config)')
    .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
    .option('--dry-run', 'Apenas validar; não criar nada real', false)
    .action(
      async (
        campaignId: string,
        options: {
          name: string;
          cpcBid?: string;
          customerId?: string;
          loginCustomerId?: string;
          dryRun?: boolean;
        },
      ) => {
        try {
          if (options.name.length > 255) {
            console.error(`${COLORS.red}Erro: --name excede 255 caracteres.${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }

          const dryRun = Boolean(options.dryRun);
          const cpcBidMicros = options.cpcBid !== undefined ? parseMicros(options.cpcBid) : undefined;

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

          // Pre-fetch campaign context
          const ctx = await readCampaignContext(
            client,
            creds.refreshToken,
            customerId,
            campaignId,
            loginCustomerId,
          );

          if (ctx.advertisingChannelType !== 'SEARCH' && ctx.advertisingChannelType !== '2') {
            console.error(
              `${COLORS.red}❌ Esta campanha é ${ctx.advertisingChannelType}. Esta story suporta apenas campanhas Search.${COLORS.reset}`,
            );
            console.error(
              `${COLORS.dim}   Para criar ad_group em Display, aguarde Story 6.4b.${COLORS.reset}`,
            );
            process.exitCode = 1;
            return;
          }

          // Show preview
          console.log('');
          console.log(`${COLORS.bold}📋 Criar ad_group em campanha ${ctx.campaignName} (${campaignId})${COLORS.reset}`);
          console.log('━'.repeat(50));
          console.log(`Ad group:         ${options.name}`);
          console.log(`Status inicial:   PAUSED`);
          if (cpcBidMicros !== undefined) {
            console.log(`CPC bid:          ${formatMicros(cpcBidMicros, 'BRL')}`);
          }
          console.log(`Conta:            ${customerId}`);
          console.log('');

          const confirmed = await requireSimpleConfirm('Confirmar criação');
          if (!confirmed) {
            console.log(`${COLORS.yellow}Criação cancelada.${COLORS.reset}`);
            return;
          }

          const result = await createAdGroup(client, {
            customerId,
            campaignId,
            name: options.name,
            ...(cpcBidMicros !== undefined ? { cpcBidMicros } : {}),
            refreshToken: creds.refreshToken,
            ...(loginCustomerId ? { loginCustomerId } : {}),
            dryRun,
          });

          await appendMutationLog({
            customerId,
            campaignId,
            operation: 'create_ad_group',
            before: {},
            after: {
              adGroupId: result.adGroupId,
              name: options.name,
              ...(cpcBidMicros !== undefined ? { cpcBidMicros } : {}),
              status: 'PAUSED',
            },
            dryRun,
            success: true,
          });

          console.log('');
          if (dryRun) {
            console.log(`${COLORS.green}✓ Dry-run validado — ad_group NÃO foi criado.${COLORS.reset}`);
          } else {
            console.log(`${COLORS.green}✓ Ad group criado (PAUSED): ${result.adGroupResourceName}${COLORS.reset}`);
            console.log(`  Ad Group ID: ${result.adGroupId}`);
          }
          console.log(`${COLORS.dim}  Próximos passos: google-ads keyword add ${result.adGroupId} "<keyword>" --match BROAD --cpc-bid <amount>${COLORS.reset}`);
        } catch (err) {
          printError(err);
          process.exitCode = 1;
        }
      },
    );
}

// ============================================================================
// `keyword` command (parent)
// ============================================================================

export const keywordCommand = new Command('keyword')
  .description('Gerenciar keywords de campanhas Search (add, remove, update-bid)');

keywordCommand
  .command('add <ad-group-id> <text>')
  .description('Adiciona uma keyword a um ad_group')
  .option('--match <type>', `Match type: ${VALID_MATCH_TYPES.join('|')}`, 'BROAD')
  .option('--cpc-bid <amount>', 'Lance CPC para esta keyword')
  .option('--force', 'Força adição mesmo em campanha com bidding automatizado', false)
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .option('--dry-run', '', false)
  .action(
    async (
      adGroupId: string,
      text: string,
      options: {
        match: string;
        cpcBid?: string;
        force?: boolean;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      },
    ) => {
      try {
        const matchType = options.match.toUpperCase() as KeywordMatchType;
        if (!VALID_MATCH_TYPES.includes(matchType)) {
          console.error(`${COLORS.red}Match type inválido: ${options.match}${COLORS.reset}\nOpções: ${VALID_MATCH_TYPES.join(', ')}`);
          process.exitCode = 1;
          return;
        }

        const validation = validateKeywordText(text, matchType);
        if (!validation.ok) {
          console.error(`${COLORS.red}${validation.error}${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }
        for (const w of validation.warnings) {
          console.log(`${COLORS.dim}ℹ️  ${w}${COLORS.reset}`);
        }
        const normalizedText = validation.normalized as string;

        const dryRun = Boolean(options.dryRun);
        const cpcBidMicros = options.cpcBid !== undefined ? parseMicros(options.cpcBid) : undefined;

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

        // Pre-fetch ad_group context
        const adCtx = await readAdGroupContext(client, creds.refreshToken, customerId, adGroupId, loginCustomerId);

        if (adCtx.campaign.advertisingChannelType !== 'SEARCH' && adCtx.campaign.advertisingChannelType !== '2') {
          console.error(
            `${COLORS.red}❌ Campanha pai é ${adCtx.campaign.advertisingChannelType}. Keywords só funcionam em Search.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        // Automated bidding warning
        const automated = isAutomatedBidding(adCtx.campaign.biddingStrategyType);
        if (automated && cpcBidMicros !== undefined && !options.force) {
          console.log(`${COLORS.yellow}⚠️  Esta campanha usa bidding automatizado (${adCtx.campaign.biddingStrategyType}).${COLORS.reset}`);
          console.log(`${COLORS.yellow}   O lance informado será registrado mas IGNORADO no leilão — o algoritmo decide.${COLORS.reset}`);
          console.log(`${COLORS.yellow}   Use --force para confirmar mesmo assim.${COLORS.reset}`);
          process.exitCode = 0;
          return;
        }

        // Preview
        console.log('');
        console.log(`${COLORS.bold}📋 Adicionar keyword em ad_group ${adCtx.adGroupName}${COLORS.reset}`);
        console.log('━'.repeat(50));
        console.log(`Keyword:          ${normalizedText} (match: ${matchType})`);
        if (cpcBidMicros !== undefined) {
          console.log(`Lance (CPC):      ${formatMicros(cpcBidMicros, 'BRL')}/clique`);
        }
        console.log(`Ad group:         ${adGroupId} — ${adCtx.adGroupName}`);
        console.log(`Campanha:         ${adCtx.campaign.campaignId} — ${adCtx.campaign.campaignName}`);
        console.log(`Bidding strategy: ${adCtx.campaign.biddingStrategyType ?? 'desconhecido'}${automated ? ' (automatizado — bid informativo)' : ''}`);
        console.log('');

        const confirmed = await requireSimpleConfirm('Confirmar');
        if (!confirmed) {
          console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
          return;
        }

        const result = await addKeyword(client, {
          customerId,
          adGroupId,
          keywordText: normalizedText,
          matchType,
          ...(cpcBidMicros !== undefined ? { cpcBidMicros } : {}),
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          dryRun,
        });

        await appendMutationLog({
          customerId,
          campaignId: adCtx.campaign.campaignId,
          operation: 'add_keyword',
          before: {},
          after: {
            adGroupId,
            criterionId: result.criterionId,
            keywordText: normalizedText,
            matchType,
            ...(cpcBidMicros !== undefined ? { cpcBidMicros } : {}),
            ...(automated ? { automatedBiddingWarning: true } : {}),
          },
          dryRun,
          success: true,
        });

        console.log('');
        console.log(`${COLORS.green}✓ ${dryRun ? 'Dry-run validado' : 'Keyword adicionada'}: ${result.criterionResourceName}${COLORS.reset}`);
        console.log(`  Criterion ID: ${result.criterionId}`);
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );

keywordCommand
  .command('remove <criterion-id>')
  .description('Remove uma keyword (irreversível pela API; criar nova exige re-add)')
  .option('--ad-group-id <id>', 'Ad group ID (necessário para construir resource_name)')
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .option('--dry-run', '', false)
  .action(
    async (
      criterionId: string,
      options: {
        adGroupId?: string;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      },
    ) => {
      try {
        const dryRun = Boolean(options.dryRun);
        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(`${COLORS.red}Erro: customer-id não fornecido.${COLORS.reset}`);
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

        const snapshot = await readKeywordSnapshot(
          client,
          creds.refreshToken,
          customerId,
          criterionId,
          loginCustomerId,
        );

        const adGroupId = options.adGroupId ?? snapshot.adGroupId;

        console.log('');
        console.log(`${COLORS.bold}📋 Remover keyword${COLORS.reset}`);
        console.log('━'.repeat(50));
        console.log(`Keyword:          "${snapshot.keywordText}" (${snapshot.matchType})`);
        console.log(`Criterion ID:     ${criterionId}`);
        console.log(`Ad group:         ${adGroupId}`);
        console.log(`Campanha:         ${snapshot.campaign.campaignName}`);
        console.log('');

        const confirmed = await requireSimpleConfirm('Confirmar remoção');
        if (!confirmed) {
          console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
          return;
        }

        const result = await removeKeyword(client, customerId, adGroupId, criterionId, creds.refreshToken, loginCustomerId, dryRun);

        await appendMutationLog({
          customerId,
          campaignId: snapshot.campaign.campaignId,
          operation: 'remove_keyword',
          before: {
            criterionId,
            keywordText: snapshot.keywordText,
            matchType: snapshot.matchType,
            cpcBidMicros: snapshot.cpcBidMicros,
          },
          after: { status: 'REMOVED' },
          dryRun,
          success: true,
        });

        console.log('');
        console.log(`${COLORS.green}✓ ${dryRun ? 'Dry-run validado' : 'Keyword removida'}: ${result.criterionResourceName}${COLORS.reset}`);
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );

keywordCommand
  .command('update-bid <criterion-id>')
  .description('Atualiza o cpc_bid de uma keyword (+50% threshold anti-bid-shock)')
  .requiredOption('--cpc-bid <amount>', 'Novo lance CPC')
  .option('--ad-group-id <id>', 'Ad group ID (necessário se snapshot não retornar)')
  .option('--max-bid-increase <pct>', 'Threshold % para double-confirm (default 50)', '50')
  .option('--force', 'Suprime warning de bidding automatizado', false)
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .option('--dry-run', '', false)
  .action(
    async (
      criterionId: string,
      options: {
        cpcBid: string;
        adGroupId?: string;
        maxBidIncrease?: string;
        force?: boolean;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      },
    ) => {
      try {
        const newCpcBidMicros = parseMicros(options.cpcBid);
        const thresholdPct = Number(options.maxBidIncrease ?? 50);
        const dryRun = Boolean(options.dryRun);

        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(`${COLORS.red}Erro: customer-id não fornecido.${COLORS.reset}`);
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

        const snapshot = await readKeywordSnapshot(client, creds.refreshToken, customerId, criterionId, loginCustomerId);
        const adGroupId = options.adGroupId ?? snapshot.adGroupId;

        // Automated bidding warning
        const automated = isAutomatedBidding(snapshot.campaign.biddingStrategyType);
        if (automated && !options.force) {
          console.log(`${COLORS.yellow}⚠️  Campanha usa bidding automatizado (${snapshot.campaign.biddingStrategyType}). Lance será ignorado pelo algoritmo.${COLORS.reset}`);
          console.log(`${COLORS.yellow}   Use --force para confirmar mesmo assim.${COLORS.reset}`);
          return;
        }

        const delta = calculatePercentDelta(snapshot.cpcBidMicros, newCpcBidMicros);
        const before = formatMicros(snapshot.cpcBidMicros, 'BRL');
        const after = formatMicros(newCpcBidMicros, 'BRL');
        const pctStr =
          delta.pct === Number.POSITIVE_INFINITY
            ? '+∞%'
            : `${delta.pct >= 0 ? '+' : ''}${delta.pct.toFixed(1)}%`;

        console.log('');
        console.log(`${COLORS.bold}📋 Atualizar bid da keyword "${snapshot.keywordText}" (${snapshot.matchType})${COLORS.reset}`);
        console.log('━'.repeat(50));
        console.log(`Criterion ID:     ${criterionId}`);
        console.log(`Bid atual:        ${before}/clique`);
        console.log(`Bid novo:         ${after}/clique (${pctStr})`);
        console.log(`Ad group:         ${adGroupId}`);
        console.log(`Campanha:         ${snapshot.campaign.campaignName}`);
        if (delta.exceedsThreshold(thresholdPct)) {
          console.log('');
          console.log(`${COLORS.yellow}⚠️  Aumento de ${pctStr} excede limite anti-bid-shock (${thresholdPct}%).${COLORS.reset}`);
        }
        console.log('');

        // Anti-bid-shock double-confirm
        if (delta.exceedsThreshold(thresholdPct)) {
          const verb = newCpcBidMicros > snapshot.cpcBidMicros ? 'aumentar' : 'reduzir';
          const phrase = `sim, ${verb} bid de ${before} para ${after}`;
          const confirmed = await requireDoubleConfirm(phrase);
          if (!confirmed) {
            console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
            return;
          }
        } else {
          const confirmed = await requireSimpleConfirm('Confirmar update');
          if (!confirmed) {
            console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
            return;
          }
        }

        const result = await updateKeywordBid(client, customerId, adGroupId, criterionId, newCpcBidMicros, creds.refreshToken, loginCustomerId, dryRun);

        await appendMutationLog({
          customerId,
          campaignId: snapshot.campaign.campaignId,
          operation: 'update_keyword_bid',
          before: { cpcBidMicros: snapshot.cpcBidMicros },
          after: { cpcBidMicros: newCpcBidMicros, deltaPct: delta.pct },
          dryRun,
          success: true,
        });

        console.log('');
        console.log(`${COLORS.green}✓ ${dryRun ? 'Dry-run validado' : 'Bid atualizado'}: ${before} → ${after}${COLORS.reset}`);
        console.log(`  Resource: ${result.criterionResourceName}`);
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );
