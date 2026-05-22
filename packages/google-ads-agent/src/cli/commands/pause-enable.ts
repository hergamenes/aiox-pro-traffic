import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  readCampaignStatusSnapshot,
  readAdGroupStatusSnapshot,
  setCampaignStatus,
  setAdGroupStatus,
  type CampaignStatusSnapshot,
  type AdGroupStatusSnapshot,
} from '../../google-ads-api/mutations.js';
import {
  parseStatusEnum,
  getTargetStatus,
} from '../../google-ads-api/status-validator.js';
import { getDefaults } from '../../config/config-repository.js';
import {
  formatStatusMutationDiff,
  requireSimpleConfirm,
} from '../mutation-prompt.js';
import { appendMutationLog } from '../../log/mutation-log.js';
import { COLORS } from '../display.js';
import { printError } from '../../errors/error-handler.js';
import { logger } from '../logger.js';

type Operation = 'pause' | 'enable';
type EntityType = 'campaign' | 'ad-group';

interface HandlerOptions {
  customerId?: string;
  loginCustomerId?: string;
  dryRun?: boolean;
}

async function handleStatusMutation(
  operation: Operation,
  entityType: EntityType,
  entityId: string,
  options: HandlerOptions,
): Promise<void> {
  try {
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
    const dryRun = Boolean(options.dryRun);
    const targetStatus = getTargetStatus(operation);

    const client = createClient({
      clientId: creds.clientId,
      clientSecret: creds.clientSecret,
      developerToken: creds.developerToken,
    });

    // Pre-fetch snapshot
    let snapshot: CampaignStatusSnapshot | AdGroupStatusSnapshot;
    if (entityType === 'campaign') {
      snapshot = await readCampaignStatusSnapshot(
        client,
        creds.refreshToken,
        customerId,
        entityId,
        loginCustomerId,
      );
    } else {
      snapshot = await readAdGroupStatusSnapshot(
        client,
        creds.refreshToken,
        customerId,
        entityId,
        loginCustomerId,
      );
    }

    const currentStatus = parseStatusEnum(snapshot.status);

    // Veto: REMOVED entities cannot be re-status-mutated
    if (currentStatus === 'REMOVED') {
      console.error(
        `${COLORS.red}Não é possível alterar status de ${entityType === 'campaign' ? 'campanha' : 'ad_group'} removida. Crie uma nova via 'create campaign'.${COLORS.reset}`,
      );
      process.exitCode = 1;
      return;
    }

    // Idempotency: skip mutate if already at target status
    if (currentStatus === targetStatus) {
      const entityName =
        entityType === 'campaign'
          ? (snapshot as CampaignStatusSnapshot).campaignName
          : (snapshot as AdGroupStatusSnapshot).adGroupName;
      const verb = targetStatus === 'PAUSED' ? 'pausada' : 'ativa';
      console.log(
        `${COLORS.dim}${entityType === 'campaign' ? 'Campanha' : 'Ad Group'} "${entityName}" já está ${verb} — nenhuma mudança aplicada.${COLORS.reset}`,
      );
      return;
    }

    // Learning-phase warning is POST-MVP for 6.2 — campaign.start_date is NOT a
    // valid GAQL selectable field (per smoke). Future story can fetch
    // bidding_strategy.last_modified_time via a separate query if needed.
    const learningWarning = false;
    const learningDays: number | undefined = undefined;

    // Display diff
    const name =
      entityType === 'campaign'
        ? (snapshot as CampaignStatusSnapshot).campaignName
        : (snapshot as AdGroupStatusSnapshot).adGroupName;
    const parentCampaignName =
      entityType === 'ad-group'
        ? (snapshot as AdGroupStatusSnapshot).campaignName
        : undefined;

    console.log('');
    console.log(
      formatStatusMutationDiff({
        entityType: entityType === 'campaign' ? 'campaign' : 'ad_group',
        name,
        entityId,
        before: currentStatus,
        after: targetStatus,
        customerId,
        ...(parentCampaignName ? { parentCampaignName } : {}),
        learningPhaseWarning: learningWarning,
        ...(learningDays !== undefined ? { learningPhaseDays: learningDays } : {}),
      }),
    );
    console.log('');

    // Confirmation (simple s/N — operation is reversible)
    const confirmed = await requireSimpleConfirm('Confirme a mudança');
    if (!confirmed) {
      console.log(`${COLORS.yellow}Mutação cancelada pelo operador.${COLORS.reset}`);
      await appendMutationLog({
        customerId,
        campaignId: entityType === 'campaign' ? entityId : (snapshot as AdGroupStatusSnapshot).campaignId,
        operation:
          entityType === 'campaign'
            ? operation === 'pause'
              ? 'pause_campaign'
              : 'enable_campaign'
            : operation === 'pause'
              ? 'pause_ad_group'
              : 'enable_ad_group',
        before: { status: currentStatus },
        after: { status: targetStatus },
        dryRun,
        success: false,
        error: 'Operador não confirmou a mutação',
      });
      return;
    }

    // Apply mutation
    const setFn = entityType === 'campaign' ? setCampaignStatus : setAdGroupStatus;
    const result = await setFn(client, {
      customerId,
      targetId: entityId,
      newStatus: targetStatus,
      refreshToken: creds.refreshToken,
      ...(loginCustomerId ? { loginCustomerId } : {}),
      dryRun,
    });

    // Audit log
    await appendMutationLog({
      customerId,
      campaignId:
        entityType === 'campaign' ? entityId : (snapshot as AdGroupStatusSnapshot).campaignId,
      operation:
        entityType === 'campaign'
          ? operation === 'pause'
            ? 'pause_campaign'
            : 'enable_campaign'
          : operation === 'pause'
            ? 'pause_ad_group'
            : 'enable_ad_group',
      before: { status: result.before.status },
      after: { status: result.after.status },
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
        `${COLORS.green}✓ ${entityType === 'campaign' ? 'Campanha' : 'Ad Group'} ${operation === 'pause' ? 'pausada' : 'reativada'}: ${result.before.status} → ${result.after.status}${COLORS.reset}`,
      );
    }
    console.log(`  Resource: ${result.resourceName}`);
    console.log(
      `  Ads Manager: https://ads.google.com/aw/campaigns?ocid=&__c=${customerId.replace(/-/g, '')}`,
    );
    if (entityType === 'ad-group' && operation === 'pause' && !dryRun) {
      console.log('');
      console.log(
        `${COLORS.dim}  Nota: apenas este ad_group foi pausado. Outros ad_groups da campanha continuam no status anterior.${COLORS.reset}`,
      );
    }
    if (!dryRun) {
      console.log(
        `${COLORS.dim}  Mudanças podem levar ~30min para propagarem nos relatórios.${COLORS.reset}`,
      );
    }
  } catch (err) {
    try {
      await appendMutationLog({
        customerId: options.customerId ?? '?',
        campaignId: entityType === 'campaign' ? entityId : '?',
        operation:
          entityType === 'campaign'
            ? operation === 'pause'
              ? 'pause_campaign'
              : 'enable_campaign'
            : operation === 'pause'
              ? 'pause_ad_group'
              : 'enable_ad_group',
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
}

// ============================================================================
// Command exports
// ============================================================================

export const pauseCommand = new Command('pause').description(
  'Pausar campanha ou ad_group (operação reversível)',
);

pauseCommand
  .command('campaign <campaign-id>')
  .description('Pausa uma campanha (status ENABLED → PAUSED)')
  .option('--customer-id <id>', 'Customer ID (default: do config)')
  .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
  .option('--dry-run', 'Apenas validar; não aplicar mudança', false)
  .action((campaignId: string, options: HandlerOptions) =>
    handleStatusMutation('pause', 'campaign', campaignId, options),
  );

pauseCommand
  .command('ad-group <ad-group-id>')
  .description('Pausa um ad_group (status ENABLED → PAUSED)')
  .option('--customer-id <id>', 'Customer ID (default: do config)')
  .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
  .option('--dry-run', 'Apenas validar; não aplicar mudança', false)
  .action((adGroupId: string, options: HandlerOptions) =>
    handleStatusMutation('pause', 'ad-group', adGroupId, options),
  );

export const enableCommand = new Command('enable').description(
  'Reativar campanha ou ad_group (status PAUSED → ENABLED)',
);

enableCommand
  .command('campaign <campaign-id>')
  .description('Reativa uma campanha (status PAUSED → ENABLED)')
  .option('--customer-id <id>', 'Customer ID (default: do config)')
  .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
  .option('--dry-run', 'Apenas validar; não aplicar mudança', false)
  .action((campaignId: string, options: HandlerOptions) =>
    handleStatusMutation('enable', 'campaign', campaignId, options),
  );

enableCommand
  .command('ad-group <ad-group-id>')
  .description('Reativa um ad_group (status PAUSED → ENABLED)')
  .option('--customer-id <id>', 'Customer ID (default: do config)')
  .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
  .option('--dry-run', 'Apenas validar; não aplicar mudança', false)
  .action((adGroupId: string, options: HandlerOptions) =>
    handleStatusMutation('enable', 'ad-group', adGroupId, options),
  );
