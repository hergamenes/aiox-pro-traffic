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
import { COLORS, STEP_LABELS, STEP_SUCCESS, formatDuration } from '../progress.js';
import {
  promptCampaignType,
  promptAdName,
  promptBudget,
  promptWebsiteUrl,
  promptLandingPageUrl,
  promptAdTexts,
} from '../prompts.js';
import { ValidationError } from '../../errors/types.js';
import { handleError } from '../../errors/error-handler.js';
import * as configRepo from '../../config/config-repository.js';
import type { CampaignConfig, CampaignType } from '../../types/campaign.js';

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
  .option('--quiet', 'Exibir apenas resultado final')
  .action(async (typeArg: string | undefined, nameArg: string | undefined, options: { budget?: string; page?: string; url?: string; quiet?: boolean }) => {
    try {
      const startTime = Date.now();
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${COLORS.RED}✗ Nenhuma conta de anúncios configurada. Execute: meta-ads config set-default ad-account <id>${COLORS.RESET}`);
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
      const spinner = options.quiet ? null : ora(STEP_LABELS.validate).start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner?.succeed(STEP_SUCCESS.validate);

      // Step 2-5: Create campaign
      const uploadSpinner = options.quiet ? null : ora(STEP_LABELS.upload).start();

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

      const callbacks = options.quiet ? undefined : {
        onProgress: (step: string, _pct: number) => {
          switch (step) {
            case 'upload':
              uploadSpinner?.succeed(STEP_SUCCESS.upload);
              break;
            case 'campaign':
              ora(STEP_LABELS.campaign).start().succeed(STEP_SUCCESS.campaign);
              break;
            case 'adset':
              ora(STEP_LABELS.adset).start().succeed(STEP_SUCCESS.adset);
              break;
            case 'activate':
              ora(STEP_LABELS.activate).start().succeed(STEP_SUCCESS.activate);
              break;
          }
        },
        onUploadProgress: (asset: string, pct: number) => {
          if (uploadSpinner) {
            uploadSpinner.text = `${STEP_LABELS.upload} ${asset} ${pct}%`;
          }
        },
      };

      const result = await createCampaign(campaignConfig, bundle, callbacks);

      // Show result
      console.log(`\n${COLORS.GREEN}${COLORS.BOLD}✓ Campanha criada com sucesso!${COLORS.RESET}\n`);

      const rows = [
        ['Nome', result.campaignName],
        ['ID Campanha', result.campaignId],
        ['ID Conjunto', result.adSetId],
        ['ID Anúncio', result.adId],
        ['Orçamento', `R$ ${result.dailyBudget.toFixed(2)}/dia`],
        ['Criativo', result.creativeFormat],
        ['Status', `${COLORS.GREEN}${result.status}${COLORS.RESET}`],
        ['Link', result.adsManagerUrl],
      ];

      console.log(formatTable(['Campo', 'Valor'], rows));
      console.log(`\nTempo total: ${formatDuration(Date.now() - startTime)}`);
    } catch (error) {
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });
