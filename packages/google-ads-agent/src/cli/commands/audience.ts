import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  buildRemarketingUserListOperation,
  createRemarketingUserList,
} from '../../google-ads-api/audience.js';
import {
  buildApplyAudienceTargetOperations,
  applyAudienceTarget,
} from '../../google-ads-api/audience-target.js';
import {
  validateAudienceName,
  validateMembershipDays,
  validateUserListResourceName,
  validateAudienceTargetLevel,
  validateAudienceTargetMode,
} from '../../google-ads-api/audience-validator.js';
import { getDefaults } from '../../config/config-repository.js';
import {
  formatAudienceRemarketingPreview,
  formatAudienceTargetPreview,
  requireSimpleConfirm,
} from '../mutation-prompt.js';
import { appendMutationLog } from '../../log/mutation-log.js';
import { COLORS } from '../display.js';
import { printError } from '../../errors/error-handler.js';
import type { AudienceTargetMode } from '../../types/audience.js';

/**
 * Registra `create audience-remarketing` como subcomando do `create` existente
 * (Story 9.1 — Epic 9). Mesmo padrão de `registerAdSubcommands` (`ad.ts`).
 *
 * Criar uma lista de remarketing NÃO gasta dinheiro — por isso não porta
 * checkSessionLimit/budget do fluxo de campanhas.
 *
 * BOUNDARY: este arquivo NÃO importa 'google-ads-api'; toda chamada ao SDK
 * fica em `src/google-ads-api/audience.ts`.
 */
export function registerAudienceSubcommands(createCmd: Command): void {
  createCmd
    .command('audience-remarketing')
    .description(
      'Cria uma lista de remarketing rule-based (user_list) — "todos os visitantes do site" por default',
    )
    .requiredOption('--name <text>', 'Nome da lista (max 255 chars)')
    .option('--description <text>', 'Descrição da lista')
    .option(
      '--url-contains <texto>',
      'Trecho de URL que define quem entra na lista (ex: seu-dominio.com.br). Omitido = todos os visitantes',
    )
    .option(
      '--membership-days <n>',
      'Duração de associação em dias (faixa 1..540)',
      '540',
    )
    .option('--customer-id <id>', 'Customer ID (default: do config)')
    .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
    .option('--dry-run', 'Apenas validar; não criar nada real', false)
    .action(
      async (options: {
        name: string;
        description?: string;
        urlContains?: string;
        membershipDays?: string;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      }) => {
        try {
          // ============ Validate inputs ============
          const nameValidation = validateAudienceName(options.name);
          if (!nameValidation.valid) {
            console.error(`${COLORS.red}Erro: ${nameValidation.error}${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }

          const membershipDays = Number(options.membershipDays ?? '540');
          const daysValidation = validateMembershipDays(membershipDays);
          if (!daysValidation.valid) {
            console.error(`${COLORS.red}Erro: ${daysValidation.error}${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }

          const dryRun = Boolean(options.dryRun);

          // MNT-001: normaliza uma vez só — vazio/whitespace vira "curinga"
          // (undefined), mantendo builder, preview e audit-log consistentes.
          const urlContains = options.urlContains?.trim() || undefined;

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

          // ============ Build operation (pure) ============
          const operation = buildRemarketingUserListOperation({
            name: options.name,
            ...(options.description !== undefined ? { description: options.description } : {}),
            membershipDurationDays: membershipDays,
            ...(urlContains !== undefined ? { urlContains } : {}),
          });

          // ============ Display preview ============
          console.log('');
          console.log(
            formatAudienceRemarketingPreview({
              customerId,
              name: options.name,
              ...(options.description !== undefined ? { description: options.description } : {}),
              ...(urlContains !== undefined ? { urlContains } : {}),
              membershipDurationDays: membershipDays,
            }),
          );
          console.log('');

          // ============ Confirmation ============
          const confirmed = await requireSimpleConfirm('Confirmar criação');
          if (!confirmed) {
            console.log(`${COLORS.yellow}Criação cancelada pelo operador.${COLORS.reset}`);
            await appendMutationLog({
              customerId,
              operation: 'create_audience_remarketing',
              before: {},
              after: {
                name: options.name,
                membershipDays,
                ...(urlContains !== undefined ? { urlContains } : {}),
              },
              dryRun,
              success: false,
              error: 'Operador não confirmou criação',
            });
            return;
          }

          // ============ Apply mutation ============
          const result = await createRemarketingUserList(client, {
            customerId,
            refreshToken: creds.refreshToken,
            ...(loginCustomerId ? { loginCustomerId } : {}),
            operation,
            dryRun,
          });

          // ============ Audit log ============
          await appendMutationLog({
            customerId,
            operation: 'create_audience_remarketing',
            before: {},
            after: {
              name: options.name,
              ...(options.description !== undefined ? { description: options.description } : {}),
              membershipDays,
              rule:
                urlContains !== undefined
                  ? `url__ CONTAINS "${urlContains}"`
                  : 'url__ CONTAINS "http" (todos os visitantes)',
              ...(result.resourceName ? { resourceName: result.resourceName } : {}),
            },
            dryRun,
            success: true,
          });

          // ============ Output ============
          console.log('');
          if (dryRun) {
            console.log(
              `${COLORS.green}✓ Dry-run validado — NENHUMA lista foi criada.${COLORS.reset}`,
            );
          } else {
            console.log(
              `${COLORS.green}✓ Lista de remarketing criada: ${result.resourceName}${COLORS.reset}`,
            );
          }
          console.log('');
          console.log(`${COLORS.dim}PRÓXIMOS PASSOS:${COLORS.reset}`);
          console.log(
            `${COLORS.dim}  1. A lista começa VAZIA e passa a coletar visitantes conforme o tráfego chega.${COLORS.reset}`,
          );
          console.log(
            `${COLORS.dim}  2. Para segmentar, aplique esta lista a uma campanha/grupo de anúncios com "create audience-target --user-list <resourceName> --campaign-id <id>".${COLORS.reset}`,
          );
        } catch (err) {
          try {
            await appendMutationLog({
              customerId: options.customerId ?? '?',
              operation: 'create_audience_remarketing',
              before: {},
              after: { name: options.name },
              dryRun: Boolean(options.dryRun),
              success: false,
              error: err instanceof Error ? err.message : String(err),
            });
          } catch {
            // Audit log é fire-and-forget; falha aqui não afeta o erro reportado.
          }
          printError(err);
          process.exitCode = 1;
        }
      },
    );

  // ==========================================================================
  // Story 9.2 — create audience-target
  // ==========================================================================
  createCmd
    .command('audience-target')
    .description(
      'Aplica uma user_list existente a uma campanha OU grupo de anúncios (observação ou segmentação)',
    )
    .requiredOption(
      '--user-list <resourceName>',
      'Resource name da lista a aplicar (customers/{id}/userLists/{id})',
    )
    .option('--campaign-id <id>', 'ID da campanha (XOR com --ad-group-id)')
    .option('--ad-group-id <id>', 'ID do grupo de anúncios (XOR com --campaign-id)')
    .option(
      '--mode <observation|targeting>',
      "observation (default, NÃO restringe) ou targeting (RESTRINGE alcance)",
      'observation',
    )
    .option('--customer-id <id>', 'Customer ID (default: do config)')
    .option('--login-customer-id <id>', 'Login Customer ID — MCC parent')
    .option('--dry-run', 'Apenas validar; não aplicar nada real', false)
    .action(
      async (options: {
        userList: string;
        campaignId?: string;
        adGroupId?: string;
        mode?: string;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      }) => {
        try {
          // ============ Validate inputs ============
          const userListValidation = validateUserListResourceName(options.userList);
          if (!userListValidation.valid) {
            console.error(`${COLORS.red}Erro: ${userListValidation.error}${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }

          const modeRaw = options.mode ?? 'observation';
          const modeValidation = validateAudienceTargetMode(modeRaw);
          if (!modeValidation.valid) {
            console.error(`${COLORS.red}Erro: ${modeValidation.error}${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }

          const levelValidation = validateAudienceTargetLevel({
            ...(options.campaignId !== undefined ? { campaignId: options.campaignId } : {}),
            ...(options.adGroupId !== undefined ? { adGroupId: options.adGroupId } : {}),
          });
          if (!levelValidation.valid || !levelValidation.level) {
            console.error(`${COLORS.red}Erro: ${levelValidation.error}${COLORS.reset}`);
            process.exitCode = 1;
            return;
          }

          const level = levelValidation.level;
          const mode = modeRaw as AudienceTargetMode;
          const dryRun = Boolean(options.dryRun);
          const userList = options.userList.trim();
          const entityId = (
            level === 'campaign' ? options.campaignId : options.adGroupId
          )!.trim();

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

          // ============ Build operations (pure) ============
          const operations = buildApplyAudienceTargetOperations({
            customerId,
            userListResourceName: userList,
            ...(level === 'campaign' ? { campaignId: entityId } : { adGroupId: entityId }),
            mode,
          });

          // ============ Display preview ============
          console.log('');
          console.log(
            formatAudienceTargetPreview({
              customerId,
              userListResourceName: userList,
              level,
              entityId,
              mode,
            }),
          );
          console.log('');

          // ============ Confirmation ============
          const confirmed = await requireSimpleConfirm('Confirmar aplicação');
          if (!confirmed) {
            console.log(`${COLORS.yellow}Aplicação cancelada pelo operador.${COLORS.reset}`);
            await appendMutationLog({
              customerId,
              ...(level === 'campaign' ? { campaignId: entityId } : {}),
              operation: 'apply_audience_target',
              before: {},
              after: { userList, level, entityId, mode },
              dryRun,
              success: false,
              error: 'Operador não confirmou aplicação',
            });
            return;
          }

          // ============ Apply mutation ============
          const result = await applyAudienceTarget(client, {
            customerId,
            refreshToken: creds.refreshToken,
            ...(loginCustomerId ? { loginCustomerId } : {}),
            operations,
            dryRun,
          });

          // ============ Audit log ============
          await appendMutationLog({
            customerId,
            ...(level === 'campaign' ? { campaignId: entityId } : {}),
            operation: 'apply_audience_target',
            before: {},
            after: {
              userList,
              level,
              entityId,
              mode,
              ...(result.criterionResourceName
                ? { criterionResourceName: result.criterionResourceName }
                : {}),
            },
            dryRun,
            success: true,
          });

          // ============ Output ============
          console.log('');
          if (dryRun) {
            console.log(
              `${COLORS.green}✓ Dry-run validado — NADA foi aplicado.${COLORS.reset}`,
            );
          } else {
            console.log(
              `${COLORS.green}✓ Público aplicado. Criterion: ${result.criterionResourceName}${COLORS.reset}`,
            );
            if (mode === 'targeting') {
              const entityLabel = level === 'campaign' ? 'campanha' : 'grupo de anúncios';
              console.log(
                `${COLORS.yellow}⚠️  Modo SEGMENTAÇÃO: a ${entityLabel} ${entityId} agora está RESTRITA a este público.${COLORS.reset}`,
              );
            }
          }
        } catch (err) {
          try {
            await appendMutationLog({
              customerId: options.customerId ?? '?',
              operation: 'apply_audience_target',
              before: {},
              after: { userList: options.userList },
              dryRun: Boolean(options.dryRun),
              success: false,
              error: err instanceof Error ? err.message : String(err),
            });
          } catch {
            // Audit log é fire-and-forget; falha aqui não afeta o erro reportado.
          }
          printError(err);
          process.exitCode = 1;
        }
      },
    );
}
