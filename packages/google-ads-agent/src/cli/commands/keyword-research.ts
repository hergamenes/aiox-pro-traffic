import { readFileSync } from 'node:fs';
import { Command } from 'commander';
import { generateKeywordIdeas } from '../../google-ads-api/keyword-ideas.js';
import {
  resolveGeoConstant,
  resolveLanguageConstant,
  validateSeeds,
  supportedGeoCodes,
  supportedLangCodes,
} from '../../google-ads-api/keyword-research-validator.js';
import {
  formatKeywordIdeasTable,
  formatKeywordIdeasJson,
} from '../../reporting/keyword-research-formatter.js';
import { printError } from '../../errors/error-handler.js';
import { AppError } from '../../errors/types.js';
import { COLORS } from '../display.js';
import type { KeywordPlanNetwork } from '../../types/keyword-research.js';

/** Mapeia o atalho de rede para o enum da API. */
function resolveNetwork(value: string): KeywordPlanNetwork | null {
  const v = value.trim().toUpperCase();
  if (v === 'SEARCH' || v === 'GOOGLE_SEARCH') return 'GOOGLE_SEARCH';
  if (v === 'SEARCH_AND_PARTNERS' || v === 'GOOGLE_SEARCH_AND_PARTNERS') {
    return 'GOOGLE_SEARCH_AND_PARTNERS';
  }
  return null;
}

/** Lê seeds de --seeds (vírgula) e/ou --seeds-file (uma por linha). */
function collectSeeds(seedsOpt?: string, seedsFile?: string): string[] {
  const seeds: string[] = [];
  if (seedsOpt) {
    seeds.push(...seedsOpt.split(','));
  }
  if (seedsFile) {
    let content: string;
    try {
      content = readFileSync(seedsFile, 'utf8');
    } catch {
      throw new AppError(
        'VALIDATION',
        `Não foi possível ler o arquivo de sementes: ${seedsFile}`,
        'Confira o caminho e as permissões do arquivo.',
      );
    }
    seeds.push(...content.split(/\r?\n/));
  }
  return seeds;
}

export const keywordResearchCommand = new Command('keyword-research')
  .description('Pesquisa de volume de busca (Keyword Planner / GenerateKeywordIdeas)')
  .option('--seeds <list>', 'Palavras-semente separadas por vírgula')
  .option('--seeds-file <path>', 'Arquivo texto com uma palavra-semente por linha')
  .option('--geo <code>', 'Geo: código (BR, US, PT...) ou ID numérico', 'BR')
  .option('--lang <code>', 'Idioma: código (pt, en, es...) ou ID numérico', 'pt')
  .option('--customer-id <id>', 'Customer ID (10 dígitos; usa default se omitido)')
  .option('--login-customer-id <mcc>', 'Override do login customer (MCC)')
  .option('--network <network>', 'Rede: SEARCH ou SEARCH_AND_PARTNERS', 'SEARCH')
  .option('--format <format>', 'Formato: table, json', 'table')
  .option('--limit <n>', 'Limita às N ideias de maior volume')
  .action(
    async (options: {
      seeds?: string;
      seedsFile?: string;
      geo?: string;
      lang?: string;
      customerId?: string;
      loginCustomerId?: string;
      network?: string;
      format?: string;
      limit?: string;
    }) => {
      try {
        // Seeds
        const rawSeeds = collectSeeds(options.seeds, options.seedsFile);
        const seedsResult = validateSeeds(rawSeeds);
        if (!seedsResult.valid) {
          throw new AppError('VALIDATION', seedsResult.error ?? 'Sementes inválidas.');
        }

        // Geo
        const geoConstant = resolveGeoConstant(options.geo ?? 'BR');
        if (!geoConstant) {
          throw new AppError(
            'VALIDATION',
            `--geo inválido: ${options.geo}. Use um código (${supportedGeoCodes().join(', ')}) ou o ID numérico do geo target.`,
          );
        }

        // Lang
        const languageConstant = resolveLanguageConstant(options.lang ?? 'pt');
        if (!languageConstant) {
          throw new AppError(
            'VALIDATION',
            `--lang inválido: ${options.lang}. Use um código (${supportedLangCodes().join(', ')}) ou o ID numérico do idioma.`,
          );
        }

        // Network
        const network = resolveNetwork(options.network ?? 'SEARCH');
        if (!network) {
          throw new AppError(
            'VALIDATION',
            `--network inválido: ${options.network}. Opções: SEARCH, SEARCH_AND_PARTNERS.`,
          );
        }

        // Format
        const format = options.format ?? 'table';
        if (format !== 'table' && format !== 'json') {
          throw new AppError(
            'VALIDATION',
            `--format inválido: ${format}. Opções: table, json.`,
          );
        }

        // Limit
        let limit: number | undefined;
        if (options.limit !== undefined) {
          limit = Number(options.limit);
          if (!Number.isInteger(limit) || limit <= 0) {
            throw new AppError(
              'VALIDATION',
              `--limit inválido: ${options.limit}. Use um inteiro positivo.`,
            );
          }
        }

        let ideas = await generateKeywordIdeas({
          seeds: seedsResult.seeds,
          geoConstant,
          languageConstant,
          network,
          ...(options.customerId ? { customerId: options.customerId } : {}),
          ...(options.loginCustomerId ? { loginCustomerId: options.loginCustomerId } : {}),
        });

        if (limit !== undefined) {
          ideas = ideas.slice(0, limit);
        }

        if (format === 'json') {
          console.log(formatKeywordIdeasJson(ideas));
          return;
        }

        console.log(formatKeywordIdeasTable(ideas));
        console.log(
          `\n${COLORS.dim}Total: ${ideas.length} ideia(s) — ${seedsResult.seeds.length} semente(s), geo=${options.geo}, lang=${options.lang}${COLORS.reset}`,
        );
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );
