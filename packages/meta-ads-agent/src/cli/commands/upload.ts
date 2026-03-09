import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { Command } from 'commander';
import ora from 'ora';
import { scanCreatives } from '../../creative/scanner.js';
import { validateAll, formatFileSize } from '../../creative/validator.js';
import { buildBundle } from '../../creative/bundle-builder.js';
import { uploadBundle } from '../../meta-api/uploader.js';
import { formatTable } from '../display.js';
import { CreativeError, UploadError, MetaApiError, NetworkError } from '../../errors/types.js';
import * as configRepo from '../../config/config-repository.js';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function resolvePath(inputPath: string): string {
  if (inputPath.startsWith('~')) {
    return resolve(homedir(), inputPath.slice(2));
  }
  return resolve(inputPath);
}

export const uploadCommand = new Command('upload')
  .description('Fazer upload de criativos para a Meta Ads')
  .argument('[path]', 'Caminho da pasta de criativos (opcional)')
  .action(async (pathArg?: string) => {
    try {
      let folderPath: string;

      if (pathArg) {
        folderPath = resolvePath(pathArg);
      } else {
        const config = await configRepo.load();
        folderPath = resolvePath(config.creativesPath);
      }

      // Step 1: Scan and validate
      const spinner = ora('Lendo criativos...').start();
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      spinner.succeed(`${validated.length} arquivo(s) encontrado(s)`);

      // Show validation summary
      const rows = validated.map((a) => [
        a.fileName,
        a.type === 'image' ? 'Imagem' : 'Vídeo',
        `${a.width}x${a.height}`,
        formatFileSize(a.fileSize),
        a.isValid
          ? `${GREEN}✓ Válido${RESET}`
          : `${RED}✗ ${a.validationErrors.join('; ')}${RESET}`,
      ]);
      console.log(formatTable(['Arquivo', 'Tipo', 'Dimensões', 'Tamanho', 'Status'], rows));

      // Step 2: Build bundle
      const bundle = buildBundle(validated);

      const validCount = bundle.assets.length;
      console.log(`\n${BOLD}Pronto para upload: ${validCount} arquivo(s)${RESET}\n`);

      // Step 3: Get ad account
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${RED}✗ Nenhuma conta de anúncios configurada. Execute: meta-ads config set-default ad-account <id>${RESET}`);
        process.exitCode = 1;
        return;
      }

      // Step 4: Upload with progress
      const uploadSpinner = ora('Iniciando upload...').start();
      const totalAssets = bundle.assets.length;
      let uploadedCount = 0;

      const result = await uploadBundle(adAccountId, bundle, (assetName, pct) => {
        if (pct === 100) {
          uploadedCount++;
          uploadSpinner.text = `Enviando (${uploadedCount}/${totalAssets}): ${assetName}... ${pct}%`;
        } else if (pct > 0) {
          uploadSpinner.text = `Enviando (${uploadedCount + 1}/${totalAssets}): ${assetName}... ${pct}%`;
        }
      });

      uploadSpinner.succeed(`Upload concluído! ${totalAssets} arquivo(s) enviado(s)`);

      // Step 5: Show results
      const resultRows = result.assets.map((a) => {
        const id = result.uploadedIds.get(a.filePath) ?? '—';
        return [
          a.fileName,
          a.type === 'image' ? 'Imagem' : 'Vídeo',
          id,
          `${GREEN}✓ Enviado${RESET}`,
        ];
      });

      console.log('\n' + formatTable(['Arquivo', 'Tipo', 'Hash/ID', 'Status'], resultRows));
    } catch (error) {
      if (
        error instanceof CreativeError ||
        error instanceof UploadError ||
        error instanceof MetaApiError ||
        error instanceof NetworkError
      ) {
        console.error(`${RED}✗ ${error.message}${RESET}`);
        if ('action' in error && error.action) {
          console.error(`  ${error.action}`);
        }
        process.exitCode = 1;
        return;
      }
      throw error;
    }
  });
