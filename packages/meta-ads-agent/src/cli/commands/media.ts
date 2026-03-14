import { Command } from 'commander';
import ora from 'ora';
import { listMediaImages, listMediaVideos } from '../../meta-api/adapter.js';
import { formatTable } from '../display.js';
import { COLORS } from '../progress.js';
import { handleError } from '../../errors/error-handler.js';
import * as configRepo from '../../config/config-repository.js';

export const mediaCommand = new Command('media')
  .description('Gerenciar biblioteca de mídia da conta de anúncios');

mediaCommand
  .command('list')
  .description('Listar imagens e vídeos da biblioteca de mídia')
  .option('--images', 'Listar apenas imagens')
  .option('--videos', 'Listar apenas vídeos')
  .option('--filter <text>', 'Filtrar por nome')
  .action(async (options: { images?: boolean; videos?: boolean; filter?: string }) => {
    try {
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${COLORS.RED}✗ Nenhuma conta de anúncios configurada.${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const showImages = !options.videos || options.images;
      const showVideos = !options.images || options.videos;
      const filter = options.filter?.toLowerCase();

      if (showImages) {
        const spinner = ora('Buscando imagens...').start();
        const images = await listMediaImages(adAccountId);
        const filtered = filter
          ? images.filter((i) => i.name.toLowerCase().includes(filter))
          : images;
        spinner.succeed(`${filtered.length} imagens encontradas`);

        if (filtered.length > 0) {
          const rows = filtered.map((img) => [
            img.name.substring(0, 40) + (img.name.length > 40 ? '...' : ''),
            img.hash,
            img.status,
            img.createdTime?.split('T')[0] ?? '',
          ]);
          console.log(formatTable(['Nome', 'Hash (usar no CSV)', 'Status', 'Data'], rows));
        }
      }

      if (showVideos) {
        const spinner = ora('Buscando vídeos...').start();
        const videos = await listMediaVideos(adAccountId);
        const filtered = filter
          ? videos.filter((v) => v.title.toLowerCase().includes(filter))
          : videos;
        spinner.succeed(`${filtered.length} vídeos encontrados`);

        if (filtered.length > 0) {
          const rows = filtered.map((vid) => [
            vid.title.substring(0, 50) + (vid.title.length > 50 ? '...' : ''),
            vid.id,
            `${Math.round(vid.duration)}s`,
            vid.status,
            vid.createdTime?.split('T')[0] ?? '',
          ]);
          console.log(formatTable(['Título', 'ID (usar no CSV)', 'Duração', 'Status', 'Data'], rows));
        }
      }
    } catch (error) {
      const result = handleError(error);
      console.error(`${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) console.error(`  ${result.action}`);
      process.exitCode = 1;
    }
  });
