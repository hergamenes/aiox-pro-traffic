import { Command } from 'commander';
import { getInsights } from '../../google-ads-api/adapter.js';
import { filterByTag } from '../../reporting/campaign-filter.js';
import {
  formatJson,
  formatTableReport,
} from '../../reporting/report-formatter.js';
import { isValidIsoDate } from '../../google-ads-api/gaql-builder.js';
import { printError } from '../../errors/error-handler.js';
import { COLORS } from '../display.js';
import { AppError } from '../../errors/types.js';
import type {
  InsightsLevel,
  InsightsParams,
  InsightsPeriod,
} from '../../types/insights.js';

const VALID_LEVELS: InsightsLevel[] = ['account', 'campaign', 'ad_group', 'ad', 'keyword'];
const VALID_PERIODS: InsightsPeriod[] = ['7d', '14d', '30d'];

export const reportCommand = new Command('report')
  .description('Relatório de performance via Google Ads API (real-time)')
  .argument('[customer-id]', 'Customer ID (10 dígitos; usa default se omitido)')
  .option('--period <period>', 'Período: 7d, 14d, 30d', '7d')
  .option('--from <date>', 'Data início (YYYY-MM-DD)')
  .option('--to <date>', 'Data fim (YYYY-MM-DD)')
  .option('--level <level>', 'Nível: account, campaign, ad_group, ad, keyword')
  .option('--format <format>', 'Formato: table, json', 'table')
  .option('--campaign-id <id>', 'Filtrar por ID de campanha (server-side)')
  .option('--tag <substring>', 'Filtrar por substring no nome (client-side)')
  .option('--login-customer-id <mcc>', 'Override do login customer (MCC)')
  .action(
    async (
      customerIdArg: string | undefined,
      options: {
        period?: string;
        from?: string;
        to?: string;
        level?: string;
        format?: string;
        campaignId?: string;
        tag?: string;
        loginCustomerId?: string;
      },
    ) => {
      try {
        // Validate --from / --to consistency
        if ((options.from && !options.to) || (!options.from && options.to)) {
          throw new AppError(
            'VALIDATION',
            '--from e --to devem ser usados juntos.',
            'Exemplo: --from 2026-05-01 --to 2026-05-07',
          );
        }
        if (options.from && !isValidIsoDate(options.from)) {
          throw new AppError('VALIDATION', `--from inválido: ${options.from}. Formato YYYY-MM-DD.`);
        }
        if (options.to && !isValidIsoDate(options.to)) {
          throw new AppError('VALIDATION', `--to inválido: ${options.to}. Formato YYYY-MM-DD.`);
        }

        // Resolve level
        const hasFilter = Boolean(options.campaignId || options.tag);
        const levelExplicit = Boolean(options.level);
        let level: InsightsLevel;
        if (options.level) {
          if (!VALID_LEVELS.includes(options.level as InsightsLevel)) {
            throw new AppError(
              'VALIDATION',
              `--level inválido: ${options.level}. Opções: ${VALID_LEVELS.join(', ')}.`,
            );
          }
          level = options.level as InsightsLevel;
        } else {
          level = hasFilter ? 'ad_group' : 'campaign';
        }
        void levelExplicit;

        // Resolve period
        const period: InsightsPeriod = options.from
          ? 'custom'
          : ((options.period as InsightsPeriod) ?? '7d');
        if (period !== 'custom' && !VALID_PERIODS.includes(period)) {
          throw new AppError(
            'VALIDATION',
            `--period inválido: ${options.period}. Opções: ${VALID_PERIODS.join(', ')}, ou use --from/--to.`,
          );
        }

        const params: InsightsParams = {
          customerId: customerIdArg ?? '',
          period,
          ...(options.from ? { from: options.from } : {}),
          ...(options.to ? { to: options.to } : {}),
          level,
          ...(options.loginCustomerId ? { loginCustomerId: options.loginCustomerId } : {}),
          ...(options.campaignId || options.tag
            ? {
                filter: {
                  ...(options.campaignId ? { campaignId: options.campaignId } : {}),
                  ...(options.tag ? { tag: options.tag } : {}),
                },
              }
            : {}),
        };

        let metrics = await getInsights(params);

        if (options.tag) {
          metrics = filterByTag(metrics, options.tag);
        }

        const format = options.format ?? 'table';
        if (format === 'json') {
          console.log(formatJson(metrics));
          return;
        }
        if (format !== 'table') {
          throw new AppError(
            'VALIDATION',
            `--format inválido: ${format}. Opções: table, json.`,
          );
        }
        if (metrics.length === 0) {
          console.log(`${COLORS.dim}Nenhum dado de performance para o período.${COLORS.reset}`);
          return;
        }
        console.log(formatTableReport(metrics));
        console.log(`\n${COLORS.dim}Total: ${metrics.length} linha(s) — level=${level}, period=${period}${COLORS.reset}`);
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );
