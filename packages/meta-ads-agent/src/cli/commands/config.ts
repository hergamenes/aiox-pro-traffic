import { Command } from 'commander';
import { select } from '@inquirer/prompts';
import { listAdAccounts, listPages, getInstagramAccount } from '../../meta-api/adapter.js';
import { setDefault } from '../../config/config-repository.js';
import { AuthError } from '../../errors/types.js';

export const configCommand = new Command('config')
  .description('Gerenciar configurações do Meta Ads Agent');

configCommand
  .command('set-default')
  .description('Definir conta de anúncio, página e perfil do Instagram padrão')
  .action(async () => {
    try {
      const accounts = await listAdAccounts();
      const pages = await listPages();

      if (accounts.length === 0) {
        console.log('Nenhuma conta de anúncio encontrada.');
        return;
      }

      const selectedAccountId = await select({
        message: 'Selecione a Ad Account padrão:',
        choices: accounts.map((a) => ({
          name: `${a.accountId} — ${a.name} (${a.statusLabel})`,
          value: a.accountId,
        })),
      });
      await setDefault('adAccountId', selectedAccountId);

      if (pages.length === 0) {
        console.log('Nenhuma página encontrada. Apenas Ad Account salva.');
        console.log('\n✓ Configurações padrão salvas!');
        console.log(`  Ad Account: ${selectedAccountId}`);
        return;
      }

      const selectedPageId = await select({
        message: 'Selecione a Página do Facebook padrão:',
        choices: pages.map((p) => ({
          name: `${p.id} — ${p.name} (${p.category})`,
          value: p.id,
        })),
      });
      await setDefault('pageId', selectedPageId);

      const igAccount = await getInstagramAccount(selectedPageId);
      let selectedIgId: string | null = null;

      if (igAccount) {
        const confirmIg = await select({
          message: `Instagram detectado: @${igAccount.username} (${igAccount.name}). Usar como padrão?`,
          choices: [
            { name: `Sim — @${igAccount.username}`, value: igAccount.id },
            { name: 'Pular', value: '' },
          ],
        });
        if (confirmIg) {
          selectedIgId = confirmIg;
          await setDefault('instagramAccountId', confirmIg);
        }
      }

      console.log('\n✓ Configurações padrão salvas!');
      console.log(`  Ad Account: ${selectedAccountId}`);
      console.log(`  Página: ${selectedPageId}`);
      if (selectedIgId) {
        console.log(`  Instagram: ${selectedIgId}`);
      }
    } catch (error) {
      if (error instanceof AuthError) {
        console.error(`✗ Não autenticado. Execute: meta-ads auth setup`);
        process.exitCode = 1;
        return;
      }
      throw error;
    }
  });
