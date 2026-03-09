import { Command } from 'commander';
import { listAdAccounts } from '../../meta-api/adapter.js';
import { AuthError } from '../../errors/types.js';
import { formatTable, colorizeStatus } from '../display.js';

export const accountsCommand = new Command('accounts')
  .description('Listar contas de anúncio do Meta Ads')
  .action(async () => {
    try {
      const accounts = await listAdAccounts();

      if (accounts.length === 0) {
        console.log('Nenhuma conta de anúncio encontrada.');
        return;
      }

      const headers = ['ID', 'Nome', 'Status', 'Moeda'];
      const rows = accounts.map((a) => [
        a.accountId,
        a.name,
        colorizeStatus(a.statusLabel, a.status),
        a.currency,
      ]);

      console.log('\n' + formatTable(headers, rows) + '\n');
    } catch (error) {
      if (error instanceof AuthError) {
        console.error(`✗ Não autenticado. Execute: meta-ads auth setup`);
        process.exitCode = 1;
        return;
      }
      throw error;
    }
  });
