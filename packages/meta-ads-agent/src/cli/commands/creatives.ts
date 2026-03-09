import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { Command } from 'commander';
import { scanCreatives } from '../../creative/scanner.js';
import { validateAll } from '../../creative/validator.js';
import { formatFileSize } from '../../creative/validator.js';
import { buildBundle } from '../../creative/bundle-builder.js';
import { formatTable } from '../display.js';
import { CreativeError } from '../../errors/types.js';
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

export const creativesCommand = new Command('creatives')
  .description('Ler e validar criativos da pasta configurada')
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

      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);

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

      const validCount = validated.filter((a) => a.isValid).length;
      const invalidCount = validated.length - validCount;
      console.log(
        `\nEncontrados: ${validated.length} arquivos | Válidos: ${validCount} | Inválidos: ${invalidCount}`,
      );

      try {
        const bundle = buildBundle(validated);
        if (bundle.format === 'carousel') {
          console.log(
            `\n${BOLD}💡 Detectado formato carrossel com ${bundle.assets.length} imagens${RESET}`,
          );
        }
      } catch {
        // Bundle build failed (e.g., no valid assets) — already shown in table
      }
    } catch (error) {
      if (error instanceof CreativeError) {
        console.error(`${RED}✗ ${error.message}${RESET}`);
        process.exitCode = 1;
        return;
      }
      throw error;
    }
  });
