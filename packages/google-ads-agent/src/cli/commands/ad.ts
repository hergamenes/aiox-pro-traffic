import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  createRsa,
  createRda,
  readAdGroupContext,
  findMissingAssetIds,
} from '../../google-ads-api/mutations.js';
import {
  validateRsaInputs,
  validateRdaInputs,
} from '../../google-ads-api/ad-validator.js';
import { getDefaults } from '../../config/config-repository.js';
import { requireSimpleConfirm } from '../mutation-prompt.js';
import { appendMutationLog } from '../../log/mutation-log.js';
import { COLORS } from '../display.js';
import { printError } from '../../errors/error-handler.js';

/**
 * Factory to register `create ad rsa` and `create ad rda` as subcommands
 * of the parent `create` command (from Story 6.3a).
 *
 * Called from cli/index.ts after createCommand is built.
 */
export function registerAdSubcommands(createCmd: Command): void {
  const adCmd = createCmd
    .command('ad')
    .description('Criar novos anúncios (RSA para Search, RDA para Display)');

  // ============================================================================
  // create ad rsa <ad-group-id> — Responsive Search Ad
  // ============================================================================

  adCmd
    .command('rsa <ad-group-id>')
    .description('Cria Responsive Search Ad em ad_group de campanha SEARCH (status PAUSED)')
    .requiredOption('--final-url <url>', 'URL final (HTTPS obrigatório)')
    .requiredOption('--headlines <text...>', '3-15 headlines (max 30 chars cada)')
    .requiredOption('--descriptions <text...>', '2-4 descriptions (max 90 chars cada)')
    .option('--path1 <text>', 'Path 1 do display URL (max 15 chars)')
    .option('--path2 <text>', 'Path 2 do display URL (max 15 chars; exige path1)')
    .option('--pinned-headline-1 <text>', 'Pin uma headline na posição 1 (reduz otimização ML)')
    .option('--customer-id <id>', 'Customer ID (default: do config)')
    .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
    .option('--dry-run', 'Apenas validar; não criar nada real', false)
    .action(
      async (
        adGroupId: string,
        options: {
          finalUrl: string;
          headlines: string[];
          descriptions: string[];
          path1?: string;
          path2?: string;
          pinnedHeadline1?: string;
          customerId?: string;
          loginCustomerId?: string;
          dryRun?: boolean;
        },
      ) => {
        try {
          // Client-side validation
          const validation = validateRsaInputs({
            headlines: options.headlines,
            descriptions: options.descriptions,
            ...(options.path1 !== undefined ? { path1: options.path1 } : {}),
            ...(options.path2 !== undefined ? { path2: options.path2 } : {}),
            finalUrl: options.finalUrl,
            ...(options.pinnedHeadline1 !== undefined
              ? { pinnedHeadline1: options.pinnedHeadline1 }
              : {}),
          });
          if (!validation.valid) {
            console.error(`${COLORS.red}❌ Validação falhou:${COLORS.reset}`);
            for (const err of validation.errors) {
              console.error(`${COLORS.red}   • ${err}${COLORS.reset}`);
            }
            process.exitCode = 1;
            return;
          }

          // Pinning warning
          if (options.pinnedHeadline1) {
            console.log(
              `${COLORS.yellow}⚠️  Pinning de headline reduz otimização ML do Google. Use com moderação.${COLORS.reset}`,
            );
          }

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

          const adCtx = await readAdGroupContext(
            client,
            creds.refreshToken,
            customerId,
            adGroupId,
            loginCustomerId,
          );

          // Veto: RSA exige Search
          if (
            adCtx.campaign.advertisingChannelType !== 'SEARCH' &&
            adCtx.campaign.advertisingChannelType !== '2'
          ) {
            console.error(
              `${COLORS.red}❌ RSA só pode ser criado em campanhas Search; ad_group ${adGroupId} pertence a campanha tipo ${adCtx.campaign.advertisingChannelType}.${COLORS.reset}`,
            );
            process.exitCode = 1;
            return;
          }

          // Preview
          console.log('');
          console.log(`${COLORS.bold}📋 Criar Responsive Search Ad${COLORS.reset}`);
          console.log('━'.repeat(50));
          console.log(`Ad Group:        ${adCtx.adGroupName} (${adGroupId})`);
          console.log(`Campanha:        ${adCtx.campaign.campaignName} (${adCtx.campaign.campaignId})`);
          console.log(`Tipo:            SEARCH ✓`);
          console.log(`Conta:           ${customerId}`);
          console.log('');
          console.log(`Headlines (${options.headlines.length}):`);
          options.headlines.forEach((h, i) => {
            const pinned = options.pinnedHeadline1 === h ? ' [PINNED 1]' : '';
            console.log(`  ${i + 1}. ${h.padEnd(35)} (${h.length}/30 chars)${pinned}`);
          });
          console.log('');
          console.log(`Descriptions (${options.descriptions.length}):`);
          options.descriptions.forEach((d, i) => {
            console.log(`  ${i + 1}. ${d}`);
            console.log(`     (${d.length}/90 chars)`);
          });
          console.log('');
          console.log(`Final URL:       ${options.finalUrl}`);
          if (options.path1) console.log(`Path 1:          ${options.path1}`);
          if (options.path2) console.log(`Path 2:          ${options.path2}`);
          console.log(`Status inicial:  PAUSED`);
          console.log('');

          const confirmed = await requireSimpleConfirm('Confirmar criação');
          if (!confirmed) {
            console.log(`${COLORS.yellow}Criação cancelada.${COLORS.reset}`);
            return;
          }

          const result = await createRsa(client, {
            customerId,
            adGroupId,
            headlines: options.headlines,
            descriptions: options.descriptions,
            finalUrl: options.finalUrl,
            ...(options.path1 !== undefined ? { path1: options.path1 } : {}),
            ...(options.path2 !== undefined ? { path2: options.path2 } : {}),
            ...(options.pinnedHeadline1 !== undefined
              ? { pinnedHeadline1: options.pinnedHeadline1 }
              : {}),
            refreshToken: creds.refreshToken,
            ...(loginCustomerId ? { loginCustomerId } : {}),
            dryRun,
          });

          await appendMutationLog({
            customerId,
            campaignId: adCtx.campaign.campaignId,
            operation: 'create_rsa',
            before: {},
            after: {
              adGroupId,
              adId: result.adId,
              headlinesCount: options.headlines.length,
              descriptionsCount: options.descriptions.length,
              ...(options.path1 !== undefined ? { path1: options.path1 } : {}),
              ...(options.path2 !== undefined ? { path2: options.path2 } : {}),
              ...(options.pinnedHeadline1 !== undefined ? { pinnedHeadline1: true } : {}),
              finalUrl: options.finalUrl,
              status: 'PAUSED',
            },
            dryRun,
            success: true,
          });

          console.log('');
          if (dryRun) {
            console.log(`${COLORS.green}✓ Dry-run validado — RSA NÃO foi criado.${COLORS.reset}`);
          } else {
            console.log(`${COLORS.green}✓ RSA criado (PAUSED): ${result.adResourceName}${COLORS.reset}`);
            console.log(`  Ad ID: ${result.adId}`);
            console.log(`${COLORS.dim}  Google fará revisão de policy nas próximas horas; status pode mudar para DISAPPROVED se houver violação.${COLORS.reset}`);
            console.log(`${COLORS.dim}  Verifique: https://ads.google.com/policy${COLORS.reset}`);
          }
        } catch (err) {
          printError(err);
          process.exitCode = 1;
        }
      },
    );

  // ============================================================================
  // create ad rda <ad-group-id> — Responsive Display Ad
  // ============================================================================

  adCmd
    .command('rda <ad-group-id>')
    .description('Cria Responsive Display Ad em ad_group de campanha DISPLAY (requer assets via Story 6.6)')
    .requiredOption('--final-url <url>', 'URL final (HTTPS obrigatório)')
    .requiredOption('--headlines <text...>', '1-5 headlines (max 30 chars cada)')
    .requiredOption('--long-headline <text>', 'Long headline (max 90 chars)')
    .requiredOption('--descriptions <text...>', '1-5 descriptions (max 90 chars cada)')
    .requiredOption('--business-name <text>', 'Nome do negócio (max 25 chars)')
    .requiredOption('--logo-asset-id <id>', 'ID do asset de logo (upload via Story 6.6)')
    .requiredOption('--marketing-image-asset-id <ids...>', '1+ marketing image asset IDs')
    .option('--square-marketing-image-asset-id <ids...>', 'IDs adicionais de square marketing images')
    .option('--customer-id <id>')
    .option('--login-customer-id <id>')
    .option('--dry-run', '', false)
    .action(
      async (
        adGroupId: string,
        options: {
          finalUrl: string;
          headlines: string[];
          longHeadline: string;
          descriptions: string[];
          businessName: string;
          logoAssetId: string;
          marketingImageAssetId: string[];
          squareMarketingImageAssetId?: string[];
          customerId?: string;
          loginCustomerId?: string;
          dryRun?: boolean;
        },
      ) => {
        try {
          const validation = validateRdaInputs({
            headlines: options.headlines,
            longHeadline: options.longHeadline,
            descriptions: options.descriptions,
            businessName: options.businessName,
            finalUrl: options.finalUrl,
            logoAssetId: options.logoAssetId,
            marketingImageAssetIds: options.marketingImageAssetId,
            ...(options.squareMarketingImageAssetId
              ? { squareMarketingImageAssetIds: options.squareMarketingImageAssetId }
              : {}),
          });
          if (!validation.valid) {
            console.error(`${COLORS.red}❌ Validação falhou:${COLORS.reset}`);
            for (const err of validation.errors) {
              console.error(`${COLORS.red}   • ${err}${COLORS.reset}`);
            }
            process.exitCode = 1;
            return;
          }

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

          const adCtx = await readAdGroupContext(
            client,
            creds.refreshToken,
            customerId,
            adGroupId,
            loginCustomerId,
          );

          // Veto: RDA exige Display
          if (
            adCtx.campaign.advertisingChannelType !== 'DISPLAY' &&
            adCtx.campaign.advertisingChannelType !== '3'
          ) {
            console.error(
              `${COLORS.red}❌ RDA só pode ser criado em campanhas Display; ad_group ${adGroupId} pertence a campanha tipo ${adCtx.campaign.advertisingChannelType}.${COLORS.reset}`,
            );
            process.exitCode = 1;
            return;
          }

          // Verify asset IDs exist
          const allAssetIds = [
            options.logoAssetId,
            ...options.marketingImageAssetId,
            ...(options.squareMarketingImageAssetId ?? []),
          ];
          const missing = await findMissingAssetIds(
            client,
            creds.refreshToken,
            customerId,
            allAssetIds,
            loginCustomerId,
          );
          if (missing.length > 0) {
            console.error(
              `${COLORS.red}❌ Assets não encontrados na conta:${COLORS.reset}`,
            );
            for (const id of missing) {
              console.error(`${COLORS.red}   • ${id}${COLORS.reset}`);
            }
            console.error(`${COLORS.dim}   Upload via Story 6.6 antes de criar o RDA.${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }

          // Preview
          console.log('');
          console.log(`${COLORS.bold}📋 Criar Responsive Display Ad${COLORS.reset}`);
          console.log('━'.repeat(50));
          console.log(`Ad Group:        ${adCtx.adGroupName} (${adGroupId})`);
          console.log(`Campanha:        ${adCtx.campaign.campaignName}`);
          console.log(`Tipo:            DISPLAY ✓`);
          console.log('');
          console.log(`Headlines (${options.headlines.length}):`);
          options.headlines.forEach((h, i) => {
            console.log(`  ${i + 1}. ${h} (${h.length}/30)`);
          });
          console.log(`Long headline:   ${options.longHeadline} (${options.longHeadline.length}/90)`);
          console.log(`Descriptions (${options.descriptions.length}):`);
          options.descriptions.forEach((d, i) => {
            console.log(`  ${i + 1}. ${d} (${d.length}/90)`);
          });
          console.log(`Business name:   ${options.businessName} (${options.businessName.length}/25)`);
          console.log(`Logo asset:      ${options.logoAssetId}`);
          console.log(`Marketing:       ${options.marketingImageAssetId.length} asset(s)`);
          if (options.squareMarketingImageAssetId?.length) {
            console.log(`Square marketing: ${options.squareMarketingImageAssetId.length} asset(s)`);
          }
          console.log(`Final URL:       ${options.finalUrl}`);
          console.log(`Status inicial:  PAUSED`);
          console.log('');

          const confirmed = await requireSimpleConfirm('Confirmar criação');
          if (!confirmed) {
            console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
            return;
          }

          const result = await createRda(client, {
            customerId,
            adGroupId,
            headlines: options.headlines,
            longHeadline: options.longHeadline,
            descriptions: options.descriptions,
            businessName: options.businessName,
            finalUrl: options.finalUrl,
            logoAssetId: options.logoAssetId,
            marketingImageAssetIds: options.marketingImageAssetId,
            ...(options.squareMarketingImageAssetId
              ? { squareMarketingImageAssetIds: options.squareMarketingImageAssetId }
              : {}),
            refreshToken: creds.refreshToken,
            ...(loginCustomerId ? { loginCustomerId } : {}),
            dryRun,
          });

          await appendMutationLog({
            customerId,
            campaignId: adCtx.campaign.campaignId,
            operation: 'create_rda',
            before: {},
            after: {
              adGroupId,
              adId: result.adId,
              headlinesCount: options.headlines.length,
              longHeadline: options.longHeadline,
              descriptionsCount: options.descriptions.length,
              businessName: options.businessName,
              logoAssetId: options.logoAssetId,
              marketingImageAssetIds: options.marketingImageAssetId,
              finalUrl: options.finalUrl,
              status: 'PAUSED',
            },
            dryRun,
            success: true,
          });

          console.log('');
          if (dryRun) {
            console.log(`${COLORS.green}✓ Dry-run validado — RDA NÃO foi criado.${COLORS.reset}`);
          } else {
            console.log(`${COLORS.green}✓ RDA criado (PAUSED): ${result.adResourceName}${COLORS.reset}`);
            console.log(`  Ad ID: ${result.adId}`);
          }
        } catch (err) {
          printError(err);
          process.exitCode = 1;
        }
      },
    );
}
