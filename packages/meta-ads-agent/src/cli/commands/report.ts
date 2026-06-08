import { Command } from 'commander';
import { getInsights, getAdSetBudgets } from '../../meta-api/adapter.js';
import { parseInsightRow } from '../../reporting/insights-parser.js';
import { filterByTag } from '../../reporting/campaign-filter.js';
import { formatTable, formatJson } from '../../reporting/report-formatter.js';
import { handleError } from '../../errors/error-handler.js';
import { load as loadConfig } from '../../config/config-repository.js';
import type { InsightsParams, InsightsLevel, InsightsPeriod, ParsedMetrics } from '../../types/insights.js';

const COLORS = {
  RED: '\x1b[31m',
  DIM: '\x1b[2m',
  BOLD: '\x1b[1m',
  RESET: '\x1b[0m',
} as const;

export const reportCommand = new Command('report')
  .description('Relatório de performance das campanhas')
  .argument('[ad-account-id]', 'ID da conta de anúncios (usa padrão se não informado)')
  .option('--period <period>', 'Período: 7d, 14d, 30d', '7d')
  .option('--from <date>', 'Data início (YYYY-MM-DD)')
  .option('--to <date>', 'Data fim (YYYY-MM-DD)')
  .option('--level <level>', 'Nível: account, campaign, adset, ad')
  .option('--format <format>', 'Formato: table, json', 'table')
  .option('--campaign-id <id>', 'Filtrar por ID da campanha')
  .option('--tag <tag>', 'Filtrar por tag no nome da campanha')
  .action(async (adAccountIdArg?: string, options?: {
    period?: string;
    from?: string;
    to?: string;
    level?: string;
    format?: string;
    campaignId?: string;
    tag?: string;
  }) => {
    try {
      const opts = options ?? {};

      // Validate --from and --to must be used together
      if ((opts.from && !opts.to) || (!opts.from && opts.to)) {
        console.error(`${COLORS.RED}✗ As opções --from e --to devem ser usadas juntas.${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      // Resolve ad account ID
      let adAccountId = adAccountIdArg;
      if (!adAccountId) {
        const config = await loadConfig();
        adAccountId = config?.defaults?.adAccountId ?? undefined;
        if (!adAccountId) {
          console.error(
            `${COLORS.RED}✗ Nenhuma conta informada. Use: meta-ads report <ad-account-id> ou configure uma conta padrão com: meta-ads config set-default${COLORS.RESET}`,
          );
          process.exitCode = 1;
          return;
        }
      }

      // Determine level (default changes when filter is active)
      const hasFilter = !!(opts.campaignId || opts.tag);
      const levelExplicit = !!opts.level;
      const level: InsightsLevel = (opts.level as InsightsLevel) ??
        (hasFilter && !levelExplicit ? 'adset' : 'campaign');

      // Build params
      const period: InsightsPeriod = opts.from ? 'custom' : (opts.period as InsightsPeriod) ?? '7d';
      const params: InsightsParams = {
        adAccountId,
        period,
        from: opts.from,
        to: opts.to,
        level,
        filter: {
          campaignId: opts.campaignId,
          tag: opts.tag,
        },
      };

      // Fetch insights
      console.error(`${COLORS.DIM}Consultando dados de performance...${COLORS.RESET}`);
      let rows = await getInsights(params);

      // Apply tag filter (client-side)
      if (opts.tag) {
        rows = filterByTag(rows, opts.tag);
        if (rows.length === 0) {
          console.error(
            `\n${COLORS.DIM}Nenhuma campanha encontrada com a tag '${opts.tag}'.${COLORS.RESET}`,
          );
          return;
        }
      }

      if (rows.length === 0) {
        console.error(`\n${COLORS.DIM}Nenhum dado encontrado para o período selecionado.${COLORS.RESET}`);
        return;
      }

      // Parse rows
      const parsed: ParsedMetrics[] = rows.map(parseInsightRow);

      // Enrich with budget data
      try {
        const budgets = await getAdSetBudgets(adAccountId);
        for (const m of parsed) {
          const match = budgets.find(
            (b) => b.campaignId === m.campaignId || b.adsetName === m.adsetName,
          );
          if (match) {
            m.budget = match.dailyBudget ?? match.lifetimeBudget;
          }
        }
      } catch {
        // Budget enrichment is optional — continue without it
      }

      // Format output
      if (opts.format === 'json') {
        console.log(formatJson(parsed));
      } else {
        console.log(formatTable(parsed, level));
      }

      // Footer with delay notice
      console.error(
        `\n${COLORS.DIM}Nota: dados podem ter delay de até 30 minutos.${COLORS.RESET}`,
      );
    } catch (error) {
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });
