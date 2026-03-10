import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
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
import { MetaApiError, NetworkError, ValidationError, CreativeError, UploadError } from '../../errors/types.js';
import * as configRepo from '../../config/config-repository.js';
import type { CampaignConfig } from '../../types/campaign.js';

function resolvePath(inputPath: string): string {
  if (inputPath.startsWith('~')) {
    return resolve(homedir(), inputPath.slice(2));
  }
  return resolve(inputPath);
}

async function prompt(rl: ReturnType<typeof createInterface>, question: string): Promise<string> {
  const answer = await rl.question(`${COLORS.BOLD}${question}${COLORS.RESET} `);
  return answer.trim();
}

const salesCommand = new Command('sales')
  .description('Criar campanha de Vendas (Purchase/Compra)')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook')
  .option('--quiet', 'Exibir apenas resultado final')
  .action(async (nameArg: string | undefined, options: { page?: string; quiet?: boolean }) => {
    const rl = createInterface({ input: stdin, output: stdout });

    try {
      const startTime = Date.now();
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${COLORS.RED}✗ Nenhuma conta de anúncios configurada. Execute: meta-ads config set-default ad-account <id>${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const resolved = await resolvePageId({ pageFlag: options.page, config });

      // Collect inputs
      const name = nameArg ?? await prompt(rl, 'Nome do anúncio:');
      const budgetStr = await prompt(rl, 'Orçamento diário (R$):');
      const dailyBudget = parseFloat(budgetStr);
      if (isNaN(dailyBudget) || dailyBudget <= 0) {
        console.error(`${COLORS.RED}✗ Orçamento inválido. Informe um valor positivo.${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const websiteUrl = await prompt(rl, 'URL do site:');
      const headline = await prompt(rl, 'Título do anúncio:');
      const primaryText = await prompt(rl, 'Texto principal:');
      const description = await prompt(rl, 'Descrição:');

      rl.close();

      // Step 1: Scan creatives
      const spinner = options.quiet ? null : ora(STEP_LABELS.validate).start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner?.succeed(STEP_SUCCESS.validate);

      // Step 2: Upload
      const uploadSpinner = options.quiet ? null : ora(STEP_LABELS.upload).start();

      const campaignConfig: CampaignConfig = {
        type: 'sales',
        name,
        dailyBudget,
        adText: {
          headline,
          primaryText,
          description,
          callToAction: 'SHOP_NOW',
        },
        pageId: resolved.pageId,
        instagramAccountId: resolved.instagramAccountId,
        adAccountId,
        websiteUrl,
        landingPageUrl: null,
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
      rl.close();
      if (
        error instanceof ValidationError ||
        error instanceof CreativeError ||
        error instanceof UploadError ||
        error instanceof MetaApiError ||
        error instanceof NetworkError
      ) {
        console.error(`\n${COLORS.RED}✗ ${error.message}${COLORS.RESET}`);
        if ('action' in error && error.action) {
          console.error(`  ${error.action}`);
        }
        process.exitCode = 1;
        return;
      }
      throw error;
    }
  });

const leadsCommand = new Command('leads')
  .description('Criar campanha de Leads (Landing Page)')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook')
  .option('--quiet', 'Exibir apenas resultado final')
  .action(async (nameArg: string | undefined, options: { page?: string; quiet?: boolean }) => {
    const rl = createInterface({ input: stdin, output: stdout });

    try {
      const startTime = Date.now();
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${COLORS.RED}✗ Nenhuma conta de anúncios configurada. Execute: meta-ads config set-default ad-account <id>${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const resolved = await resolvePageId({ pageFlag: options.page, config });

      // Collect inputs
      const name = nameArg ?? await prompt(rl, 'Nome do anúncio:');
      const budgetStr = await prompt(rl, 'Orçamento diário (R$):');
      const dailyBudget = parseFloat(budgetStr);
      if (isNaN(dailyBudget) || dailyBudget <= 0) {
        console.error(`${COLORS.RED}✗ Orçamento inválido. Informe um valor positivo.${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const landingPageUrl = await prompt(rl, 'URL da landing page:');
      const headline = await prompt(rl, 'Título do anúncio:');
      const primaryText = await prompt(rl, 'Texto principal:');
      const description = await prompt(rl, 'Descrição:');

      rl.close();

      // Step 1: Scan creatives
      const spinner = options.quiet ? null : ora(STEP_LABELS.validate).start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner?.succeed(STEP_SUCCESS.validate);

      // Step 2: Upload
      const uploadSpinner = options.quiet ? null : ora(STEP_LABELS.upload).start();

      const campaignConfig: CampaignConfig = {
        type: 'leads',
        name,
        dailyBudget,
        adText: {
          headline,
          primaryText,
          description,
          callToAction: 'LEARN_MORE',
        },
        pageId: resolved.pageId,
        instagramAccountId: resolved.instagramAccountId,
        adAccountId,
        websiteUrl: null,
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
      rl.close();
      if (
        error instanceof ValidationError ||
        error instanceof CreativeError ||
        error instanceof UploadError ||
        error instanceof MetaApiError ||
        error instanceof NetworkError
      ) {
        console.error(`\n${COLORS.RED}✗ ${error.message}${COLORS.RESET}`);
        if ('action' in error && error.action) {
          console.error(`  ${error.action}`);
        }
        process.exitCode = 1;
        return;
      }
      throw error;
    }
  });

export const createCommand = new Command('create')
  .description('Criar campanhas na Meta Ads');

createCommand.addCommand(salesCommand);
createCommand.addCommand(leadsCommand);
