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
import { MetaApiError, NetworkError, ValidationError, CreativeError, UploadError } from '../../errors/types.js';
import * as configRepo from '../../config/config-repository.js';
import type { CampaignConfig } from '../../types/campaign.js';

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

async function prompt(rl: ReturnType<typeof createInterface>, question: string): Promise<string> {
  const answer = await rl.question(`${BOLD}${question}${RESET} `);
  return answer.trim();
}

const salesCommand = new Command('sales')
  .description('Criar campanha de Vendas (Purchase/Compra)')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook')
  .action(async (nameArg: string | undefined, options: { page?: string }) => {
    const rl = createInterface({ input: stdin, output: stdout });

    try {
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${RED}✗ Nenhuma conta de anúncios configurada. Execute: meta-ads config set-default ad-account <id>${RESET}`);
        process.exitCode = 1;
        return;
      }

      const resolved = await resolvePageId({ pageFlag: options.page, config });

      // Collect inputs
      const name = nameArg ?? await prompt(rl, 'Nome do anúncio:');
      const budgetStr = await prompt(rl, 'Orçamento diário (R$):');
      const dailyBudget = parseFloat(budgetStr);
      if (isNaN(dailyBudget) || dailyBudget <= 0) {
        console.error(`${RED}✗ Orçamento inválido. Informe um valor positivo.${RESET}`);
        process.exitCode = 1;
        return;
      }

      const websiteUrl = await prompt(rl, 'URL do site:');
      const headline = await prompt(rl, 'Título do anúncio:');
      const primaryText = await prompt(rl, 'Texto principal:');
      const description = await prompt(rl, 'Descrição:');

      rl.close();

      // Step 1: Scan creatives
      const spinner = ora('[1/5] Validando criativos...').start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner.succeed('[1/5] Criativos validados');

      // Step 2: Upload
      const uploadSpinner = ora('[2/5] Fazendo upload...').start();

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
      rl.close();
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

const leadsCommand = new Command('leads')
  .description('Criar campanha de Leads (Landing Page)')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook')
  .action(async (nameArg: string | undefined, options: { page?: string }) => {
    const rl = createInterface({ input: stdin, output: stdout });

    try {
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${RED}✗ Nenhuma conta de anúncios configurada. Execute: meta-ads config set-default ad-account <id>${RESET}`);
        process.exitCode = 1;
        return;
      }

      const resolved = await resolvePageId({ pageFlag: options.page, config });

      // Collect inputs
      const name = nameArg ?? await prompt(rl, 'Nome do anúncio:');
      const budgetStr = await prompt(rl, 'Orçamento diário (R$):');
      const dailyBudget = parseFloat(budgetStr);
      if (isNaN(dailyBudget) || dailyBudget <= 0) {
        console.error(`${RED}✗ Orçamento inválido. Informe um valor positivo.${RESET}`);
        process.exitCode = 1;
        return;
      }

      const landingPageUrl = await prompt(rl, 'URL da landing page:');
      const headline = await prompt(rl, 'Título do anúncio:');
      const primaryText = await prompt(rl, 'Texto principal:');
      const description = await prompt(rl, 'Descrição:');

      rl.close();

      // Step 1: Scan creatives
      const spinner = ora('[1/5] Validando criativos...').start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner.succeed('[1/5] Criativos validados');

      // Step 2: Upload
      const uploadSpinner = ora('[2/5] Fazendo upload...').start();

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
      rl.close();
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

export const createCommand = new Command('create')
  .description('Criar campanhas na Meta Ads');

createCommand.addCommand(salesCommand);
createCommand.addCommand(leadsCommand);
