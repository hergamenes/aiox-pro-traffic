import { Command } from 'commander';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  listAccessibleCustomersDetailed,
  listMccTree,
  type CustomerInfo,
  type TreeNodeInfo,
} from '../../google-ads-api/accounts.js';
import { getDefaults } from '../../config/config-repository.js';
import { COLORS, formatTable, formatTree } from '../display.js';
import { printError } from '../../errors/error-handler.js';
import { logger } from '../logger.js';

export const accountsCommand = new Command('accounts')
  .description('Listar contas de anúncio acessíveis via Google Ads API')
  .option('--format <format>', 'Formato: table, json', 'table')
  .option(
    '--tree',
    'Expande contas filhas para cada Manager Account (MCC) acessível',
    false,
  )
  .action(async (options: { format?: string; tree?: boolean }) => {
    try {
      const creds = await ensureValidAuth();
      const defaults = await getDefaults();
      const loginCustomerId = defaults.loginCustomerId ?? creds.loginCustomerId;

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

      if (!options.tree) {
        // Legacy flat output (Story 5.2 behavior — non-breaking)
        renderFlat(accounts, options.format);
        return;
      }

      // --tree mode: try to expand each accessibleCustomer as MCC
      const tree: TreeNodeInfo[] = [];
      let mccFound = 0;

      for (const acct of accounts) {
        try {
          const subtree = await listMccTree(client, creds.refreshToken, acct.customerId);
          mccFound++;
          // Override the root node's metadata with our enriched data
          // from listAccessibleCustomersDetailed when available
          for (const node of subtree) {
            const isRoot = node.customerId === acct.customerId;
            tree.push({
              ...node,
              ...(isRoot && acct.name ? { name: acct.name } : {}),
              ...(isRoot && acct.currencyCode ? { currencyCode: acct.currencyCode } : {}),
              ...(isRoot && acct.status ? { status: acct.status } : {}),
            });
          }
        } catch (err) {
          logger.debug({ customerId: acct.customerId, err }, 'Not an MCC or expansion failed; treating as leaf');
          tree.push({
            customerId: acct.customerId,
            ...(acct.name ? { name: acct.name } : {}),
            ...(acct.currencyCode ? { currencyCode: acct.currencyCode } : {}),
            ...(acct.status ? { status: acct.status } : {}),
            level: 0,
            isManager: false,
          });
        }
      }

      // Output JSON
      if (options.format === 'json') {
        console.log(JSON.stringify(tree, null, 2));
        return;
      }

      // Table output
      if (tree.length === 0) {
        console.log(`${COLORS.dim}Nenhuma conta acessível.${COLORS.reset}`);
        return;
      }

      console.log(formatTree(tree));

      // Warnings
      const mccsWithoutChildren = tree.filter(
        (n) => n.isManager && !tree.some((m) => m.parentId === n.customerId),
      );

      if (mccFound === 0) {
        console.log(
          `\n${COLORS.dim}Nenhuma Manager Account (MCC) encontrada — --tree não tem efeito; mostrando lista plana.${COLORS.reset}`,
        );
      } else if (mccsWithoutChildren.length > 0) {
        for (const mcc of mccsWithoutChildren) {
          console.log(
            `\n${COLORS.dim}MCC ${mcc.customerId} (${mcc.name ?? 'sem nome'}) tem 0 contas filhas — crie uma conta cliente no Google Ads UI antes de continuar.${COLORS.reset}`,
          );
        }
      } else {
        const totalChildren = tree.filter((n) => n.level > 0).length;
        console.log(
          `\n${COLORS.dim}Total: ${mccFound} MCC(s) + ${totalChildren} conta(s) cliente. Use 'google-ads config set-default' para definir uma conta cliente como padrão (NÃO use a MCC — métricas falham).${COLORS.reset}`,
        );
      }
    } catch (err) {
      printError(err);
      process.exitCode = 1;
    }
  });

function renderFlat(accounts: CustomerInfo[], format: string | undefined): void {
  if (format === 'json') {
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
    `\n${COLORS.dim}Total: ${accounts.length} conta(s). Use 'google-ads config set-default' para definir uma como padrão. Para expandir Manager Accounts (MCC), rode com --tree.${COLORS.reset}`,
  );
}
