import { Command } from 'commander';
import { readHistory, formatCsv } from '../../log/log-repository.js';
import { formatTable } from '../display.js';
import { handleError } from '../../errors/error-handler.js';
import type { HistoryFilter } from '../../types/log.js';
import type { CampaignType } from '../../types/campaign.js';

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  DIM: '\x1b[2m',
  RESET: '\x1b[0m',
} as const;

function formatBudget(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(2);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function colorizeStatus(status: string): string {
  if (status === 'ACTIVE') return `${COLORS.GREEN}${status}${COLORS.RESET}`;
  if (status === 'ERROR') return `${COLORS.RED}${status}${COLORS.RESET}`;
  if (status === 'PAUSED') return `${COLORS.YELLOW}${status}${COLORS.RESET}`;
  return status;
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.substring(0, max - 3) + '...';
}

export const historyCommand = new Command('history')
  .description('Exibir histórico de campanhas criadas')
  .option('--all', 'Exibir histórico completo')
  .option('--type <type>', 'Filtrar por tipo (sales ou leads)')
  .option('--date <date>', 'Filtrar por data (DD-MM-YY)')
  .option('--export <format>', 'Exportar (csv)')
  .action(async (options: { all?: boolean; type?: string; date?: string; export?: string }) => {
    try {
      const filter: HistoryFilter = {};

      if (options.all) filter.all = true;
      if (options.type) filter.type = options.type as CampaignType;
      if (options.date) filter.date = options.date;

      const entries = await readHistory(filter);

      if (entries.length === 0) {
        console.log(`${COLORS.DIM}Nenhuma campanha encontrada.${COLORS.RESET}`);
        return;
      }

      // CSV export
      if (options.export === 'csv') {
        const csv = formatCsv(entries);
        process.stdout.write(csv);
        return;
      }

      // Table output
      const headers = ['Nome', 'Tipo', 'Orçamento', 'Status', 'Data'];
      const rows = entries.map((e) => [
        truncate(e.campaignName, 30),
        e.type,
        formatBudget(e.dailyBudget),
        colorizeStatus(e.status),
        formatDate(e.createdAt),
      ]);

      console.log(`\n${formatTable(headers, rows)}\n`);

      if (!options.all && entries.length === 20) {
        console.log(`${COLORS.DIM}Exibindo últimas 20 campanhas. Use --all para ver todas.${COLORS.RESET}`);
      }
    } catch (error) {
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });
