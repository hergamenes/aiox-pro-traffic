import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  removeCampaign,
  removeAdGroup,
  readCampaignRemovalSnapshot,
  readAdGroupRemovalSnapshot,
} from '../../google-ads-api/mutations.js';
import { getDefaults } from '../../config/config-repository.js';
import {
  formatCampaignRemovalSnapshot,
  formatAdGroupRemovalSnapshot,
  tripleConfirmCampaignRemoval,
  showPauseSuggestionTier1,
  requireRemovalPhrase,
} from '../removal-prompt.js';
import { appendMutationLog } from '../../log/mutation-log.js';
import { COLORS } from '../display.js';
import { printError } from '../../errors/error-handler.js';

/**
 * `google-ads remove` — IRREVERSIBLE operations. --dry-run is the DEFAULT.
 * Operator MUST pass --confirm-delete to actually mutate.
 */
export const removeCommand = new Command('remove')
  .description('Remove (soft-delete) entidades — IRREVERSÍVEL. --dry-run é o DEFAULT (use --confirm-delete para mutar de verdade)');

removeCommand
  .command('campaign <campaign-id>')
  .description('Remove uma campanha (IRREVERSÍVEL). Cascateia ad_groups + ads.')
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .option('--confirm-delete', 'OBRIGATÓRIO para mutação real (sem ele, dry-run forçado)', false)
  .option('--all', '[REJEITADO]', false)
  .option('--batch <file>', '[REJEITADO]')
  .option('--from-file <file>', '[REJEITADO]')
  .action(
    async (
      campaignId: string,
      options: {
        customerId?: string;
        loginCustomerId?: string;
        confirmDelete?: boolean;
        all?: boolean;
        batch?: string;
        fromFile?: string;
      },
    ) => {
      try {
        // Veto batch operations
        if (options.all || options.batch || options.fromFile) {
          console.error(
            `${COLORS.red}❌ Remoção em lote não permitida — uma campanha por invocação.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        // Veto: requires --confirm-delete to actually mutate
        const dryRun = !options.confirmDelete;
        if (dryRun) {
          console.log(
            `${COLORS.yellow}ℹ️  Modo dry-run (default). Use --confirm-delete para aplicar a remoção real.${COLORS.reset}`,
          );
          console.log('');
        }

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

        const snapshot = await readCampaignRemovalSnapshot(
          client,
          creds.refreshToken,
          customerId,
          campaignId,
          loginCustomerId,
        );

        // Idempotent veto: already REMOVED
        if (snapshot.status === 'REMOVED') {
          console.log(
            `${COLORS.dim}Campanha ${campaignId} já está REMOVED — nenhuma mudança aplicada (idempotente).${COLORS.reset}`,
          );
          return;
        }

        // Show snapshot
        console.log('');
        console.log(formatCampaignRemovalSnapshot(snapshot, customerId));
        console.log('');

        // Triple-tier confirm
        const confirmResult = await tripleConfirmCampaignRemoval(snapshot);
        if (!confirmResult.confirmed) {
          console.log(`${COLORS.yellow}Remoção cancelada: ${confirmResult.cancelReason ?? 'operador não confirmou'}${COLORS.reset}`);
          await appendMutationLog({
            customerId,
            campaignId,
            operation: 'remove_campaign',
            before: {
              name: snapshot.campaignName,
              status: snapshot.status,
              budgetMicros: snapshot.budgetMicros,
              biddingStrategy: snapshot.biddingStrategy,
              adGroupCount: snapshot.adGroupCount,
              adCount: snapshot.adCount,
              spend_90d_micros: snapshot.spend90dMicros,
              spend_7d_micros: snapshot.spend7dMicros,
              spend_24h_micros: snapshot.spend24hMicros,
            },
            after: {},
            dryRun,
            success: false,
            error: confirmResult.cancelReason ?? 'cancelled',
            triple_confirm_required: confirmResult.tripleConfirmRequired,
          });
          return;
        }

        // Apply (or dry-run validate)
        const result = await removeCampaign(
          client,
          customerId,
          campaignId,
          creds.refreshToken,
          loginCustomerId,
          dryRun,
        );

        await appendMutationLog({
          customerId,
          campaignId,
          operation: 'remove_campaign',
          before: {
            name: snapshot.campaignName,
            status: snapshot.status,
            budgetMicros: snapshot.budgetMicros,
            biddingStrategy: snapshot.biddingStrategy,
            adGroupCount: snapshot.adGroupCount,
            adCount: snapshot.adCount,
            spend_90d_micros: snapshot.spend90dMicros,
            spend_7d_micros: snapshot.spend7dMicros,
            spend_24h_micros: snapshot.spend24hMicros,
          },
          after: { status: 'REMOVED' },
          dryRun,
          success: true,
          ...(confirmResult.operatorConfirmedPhrase
            ? { operator_confirmed_phrase: confirmResult.operatorConfirmedPhrase }
            : {}),
          triple_confirm_required: confirmResult.tripleConfirmRequired,
        });

        // Output
        console.log('');
        if (dryRun) {
          console.log(`${COLORS.green}✓ Dry-run validado — campanha NÃO foi removida.${COLORS.reset}`);
          console.log(`  Resource preview: ${result.resourceName}`);
          console.log(
            `${COLORS.dim}  Para aplicar de verdade: ${COLORS.reset}--confirm-delete`,
          );
        } else {
          console.log(`${COLORS.green}✅ Campanha removida (status = REMOVED).${COLORS.reset}`);
          console.log(`  Resource: ${result.resourceName}`);
          console.log(
            `  Cascade:  ${snapshot.adGroupCount} ad_groups + ${snapshot.adCount} ads também marcados REMOVED.`,
          );
          console.log(
            `${COLORS.dim}  ℹ️ Para localizar campanhas removidas: Google Ads UI > filtros > Status: Removed${COLORS.reset}`,
          );
          console.log(`${COLORS.dim}  Log de auditoria: ~/.aiox/google-ads-mutations.log${COLORS.reset}`);
        }
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );

removeCommand
  .command('ad-group <ad-group-id>')
  .description('Remove um ad_group (IRREVERSÍVEL). Cascateia ads + keywords.')
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .option('--confirm-delete', 'OBRIGATÓRIO para mutação real', false)
  .option('--all', '[REJEITADO]', false)
  .action(
    async (
      adGroupId: string,
      options: {
        customerId?: string;
        loginCustomerId?: string;
        confirmDelete?: boolean;
        all?: boolean;
      },
    ) => {
      try {
        if (options.all) {
          console.error(`${COLORS.red}❌ Remoção em lote não permitida.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        const dryRun = !options.confirmDelete;
        if (dryRun) {
          console.log(`${COLORS.yellow}ℹ️  Modo dry-run (default). Use --confirm-delete para aplicar.${COLORS.reset}`);
        }

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

        const snapshot = await readAdGroupRemovalSnapshot(
          client,
          creds.refreshToken,
          customerId,
          adGroupId,
          loginCustomerId,
        );

        if (snapshot.status === 'REMOVED') {
          console.log(
            `${COLORS.dim}Ad group ${adGroupId} já está REMOVED — nenhuma mudança.${COLORS.reset}`,
          );
          return;
        }

        console.log('');
        console.log(formatAdGroupRemovalSnapshot(snapshot, customerId));
        console.log('');

        // Two-tier confirm for ad_group (simpler than campaign — no spend tracking)
        const proceed1 = await showPauseSuggestionTier1(snapshot.adGroupName);
        if (!proceed1) {
          console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
          return;
        }

        const phrase = await requireRemovalPhrase(snapshot.adGroupName);
        if (!phrase) {
          console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
          return;
        }

        const result = await removeAdGroup(
          client,
          customerId,
          adGroupId,
          creds.refreshToken,
          loginCustomerId,
          dryRun,
        );

        await appendMutationLog({
          customerId,
          campaignId: snapshot.campaignId,
          operation: 'remove_ad_group',
          before: {
            adGroupId,
            adGroupName: snapshot.adGroupName,
            status: snapshot.status,
            adCount: snapshot.adCount,
            keywordCount: snapshot.keywordCount,
          },
          after: { status: 'REMOVED' },
          dryRun,
          success: true,
          operator_confirmed_phrase: phrase,
          triple_confirm_required: false,
        });

        console.log('');
        if (dryRun) {
          console.log(`${COLORS.green}✓ Dry-run validado — ad_group NÃO foi removido.${COLORS.reset}`);
        } else {
          console.log(`${COLORS.green}✅ Ad group removido: ${result.resourceName}${COLORS.reset}`);
          console.log(`  Cascade: ${snapshot.adCount} ads + ${snapshot.keywordCount} keywords também REMOVED.`);
        }
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );
