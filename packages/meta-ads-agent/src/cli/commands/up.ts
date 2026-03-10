import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { Command } from 'commander';
import ora from 'ora';
import { scanCreatives } from '../../creative/scanner.js';
import { validateAll } from '../../creative/validator.js';
import { buildBundle } from '../../creative/bundle-builder.js';
import { createCampaign } from '../../campaign/orchestrator.js';
import { formatTable } from '../display.js';
import { resolvePageId } from '../page-resolver.js';
import {
  promptCampaignType,
  promptAdName,
  promptBudget,
  promptWebsiteUrl,
  promptLandingPageUrl,
  promptAdTexts,
} from '../prompts.js';
import { MetaApiError, NetworkError, ValidationError, CreativeError, UploadError } from '../../errors/types.js';
import * as configRepo from '../../config/config-repository.js';
import type { CampaignConfig, CampaignType } from '../../types/campaign.js';

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

const VALID_TYPES: CampaignType[] = ['sales', 'leads'];

export const upCommand = new Command('up')
  .description('Criar campanha com comando único')
  .argument('[type]', 'Tipo de campanha (sales ou leads)')
  .argument('[name]', 'Nome do anúncio')
  .option('--budget <value>', 'Orçamento diário em R$')
  .option('--page <pageId>', 'ID da página do Facebook')
  .option('--url <url>', 'URL do site (sales) ou landing page (leads)')
  .action(async (typeArg: string | undefined, nameArg: string | undefined, options: { budget?: string; page?: string; url?: string }) => {
    try {
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${RED}✗ Nenhuma conta de anúncios configurada. Execute: meta-ads config set-default ad-account <id>${RESET}`);
        process.exitCode = 1;
        return;
      }

      // Resolve type
      let type: CampaignType;
      if (typeArg) {
        if (!VALID_TYPES.includes(typeArg as CampaignType)) {
          throw new ValidationError(`Tipo inválido: "${typeArg}". Use "sales" ou "leads".`);
        }
        type = typeArg as CampaignType;
      } else {
        type = await promptCampaignType();
      }

      // Resolve name
      const name = nameArg ?? await promptAdName();

      // Resolve budget
      let dailyBudget: number;
      if (options.budget) {
        dailyBudget = parseFloat(options.budget);
        if (isNaN(dailyBudget) || dailyBudget <= 0) {
          throw new ValidationError('Orçamento inválido. Informe um valor positivo.');
        }
      } else {
        dailyBudget = await promptBudget();
      }

      // Resolve URL
      let websiteUrl: string | null = null;
      let landingPageUrl: string | null = null;
      if (type === 'sales') {
        websiteUrl = options.url ?? await promptWebsiteUrl();
      } else {
        landingPageUrl = options.url ?? await promptLandingPageUrl();
      }

      // Resolve ad texts
      const adTexts = await promptAdTexts();
      const callToAction = type === 'sales' ? 'SHOP_NOW' : 'LEARN_MORE';

      // Resolve page
      const resolved = await resolvePageId({ pageFlag: options.page, config });

      // Step 1: Scan creatives
      const spinner = ora('[1/5] Validando criativos...').start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner.succeed('[1/5] Criativos validados');

      // Step 2-5: Create campaign
      const uploadSpinner = ora('[2/5] Fazendo upload...').start();

      const campaignConfig: CampaignConfig = {
        type,
        name,
        dailyBudget,
        adText: { ...adTexts, callToAction },
        pageId: resolved.pageId,
        instagramAccountId: resolved.instagramAccountId,
        adAccountId,
        websiteUrl,
        landingPageUrl,
        pixelId: null,
      };

      const result = await createCampaign(campaignConfig, bundle, {
        onProgress: (step, _pct) => {
          switch (step) {
            case 'upload':
              uploadSpinner.succeed('[2/5] Upload concluído');
              break;
            case 'campaign':
              ora('[3/5] Criando campanha...').start().succeed('[3/5] Campanha criada');
              break;
            case 'adset':
              ora('[4/5] Configurando anúncio...').start().succeed('[4/5] Anúncio configurado');
              break;
            case 'activate':
              ora('[5/5] Ativando...').start().succeed('[5/5] Campanha ativada!');
              break;
          }
        },
        onUploadProgress: (asset, pct) => {
          uploadSpinner.text = `[2/5] Fazendo upload... ${asset} ${pct}%`;
        },
      });

      // Show result
      console.log(`\n${GREEN}${BOLD}✓ Campanha criada com sucesso!${RESET}\n`);

      const rows = [
        ['Nome', result.campaignName],
        ['ID Campanha', result.campaignId],
        ['ID Conjunto', result.adSetId],
        ['ID Anúncio', result.adId],
        ['Orçamento', `R$ ${result.dailyBudget.toFixed(2)}/dia`],
        ['Criativo', result.creativeFormat],
        ['Status', `${GREEN}${result.status}${RESET}`],
        ['Link', result.adsManagerUrl],
      ];

      console.log(formatTable(['Campo', 'Valor'], rows));
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof CreativeError ||
        error instanceof UploadError ||
        error instanceof MetaApiError ||
        error instanceof NetworkError
      ) {
        console.error(`\n${RED}✗ ${error.message}${RESET}`);
        if ('action' in error && error.action) {
          console.error(`  ${error.action}`);
        }
        process.exitCode = 1;
        return;
      }
      throw error;
    }
  });
