import { Command } from 'commander';
import { listPages } from '../../meta-api/adapter.js';
import { AuthError } from '../../errors/types.js';
import { formatTable } from '../display.js';

export const pagesCommand = new Command('pages')
  .description('Listar páginas do Facebook')
  .action(async () => {
    try {
      const pages = await listPages();

      if (pages.length === 0) {
        console.log('Nenhuma página encontrada.');
        return;
      }

      const headers = ['ID', 'Nome', 'Categoria', 'Instagram'];
      const rows = pages.map((p) => [
        p.id,
        p.name,
        p.category,
        p.instagramAccountId ?? '—',
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
