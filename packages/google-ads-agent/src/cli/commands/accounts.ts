import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import { listAccessibleCustomersDetailed } from '../../google-ads-api/accounts.js';
import { getDefaults } from '../../config/config-repository.js';
import { COLORS, formatTable } from '../display.js';
import { printError } from '../../errors/error-handler.js';

export const accountsCommand = new Command('accounts')
  .description('Listar contas de anúncio acessíveis via Google Ads API')
  .option('--format <format>', 'Formato: table, json', 'table')
  .action(async (options: { format?: string }) => {
    try {
      const creds = await ensureValidAuth();
      const defaults = await getDefaults();
      const loginCustomerId =
        defaults.loginCustomerId ?? creds.loginCustomerId;

      const client = createClient({
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        developerToken: creds.developerToken,
      });

      const accounts = await listAccessibleCustomersDetailed(
        client,
        creds.refreshToken,
        loginCustomerId,
      );

      if (options.format === 'json') {
        console.log(JSON.stringify(accounts, null, 2));
        return;
      }

      if (accounts.length === 0) {
        console.log(`${COLORS.dim}Nenhuma conta acessível.${COLORS.reset}`);
        return;
      }

      const rows = accounts.map((a) => [
        a.customerId,
        a.name ?? '—',
        a.currencyCode ?? '—',
        a.status ?? '—',
      ]);
      console.log(formatTable(['ID', 'Nome', 'Moeda', 'Status'], rows));
      console.log(
        `\n${COLORS.dim}Total: ${accounts.length} conta(s). Use 'google-ads config set-default' para definir uma como padrão.${COLORS.reset}`,
      );
    } catch (err) {
      printError(err);
      process.exitCode = 1;
    }
  });
