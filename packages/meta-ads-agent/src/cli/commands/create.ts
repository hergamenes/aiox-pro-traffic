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
import { handleError } from '../../errors/error-handler.js';
import * as configRepo from '../../config/config-repository.js';
import type { CampaignConfig, CampaignType, CampaignResult } from '../../types/campaign.js';
import { OBJECTIVE_SPECS } from '../../campaign/objectives.js';
import { VALID_PLATFORMS, parsePlatform } from '../../campaign/placements.js';

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

/** Callbacks de progresso compartilhados pelos comandos de criação. */
function buildProgressCallbacks(uploadSpinner: ReturnType<typeof ora> | null) {
  return {
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
}

/** Exibe a tabela de resultado padrão de uma campanha criada. */
function printResult(result: CampaignResult, startTime: number): void {
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
}

const salesCommand = new Command('sales')
  .description('Criar campanha de Vendas (Purchase/Compra)')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook')
  .option('--budget <value>', 'Orçamento diário em R$')
  .option('--url <url>', 'URL do site/produto')
  .option('--headline <text>', 'Título do anúncio')
  .option('--text <text>', 'Texto principal do anúncio')
  .option('--description <text>', 'Descrição do anúncio')
  .option('--plataforma <platform>', `Placements: ${VALID_PLATFORMS.join(', ')} (padrão: automático)`)
  .option('--quiet', 'Exibir apenas resultado final')
  .action(async (nameArg: string | undefined, options: { page?: string; budget?: string; url?: string; headline?: string; text?: string; description?: string; plataforma?: string; quiet?: boolean }) => {
    const allFlagsProvided = nameArg && options.budget && options.url && options.headline && options.text && options.description;
    const rl = allFlagsProvided ? null : createInterface({ input: stdin, output: stdout });

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

      // Collect inputs (use flags if provided, otherwise prompt)
      const name = nameArg ?? await prompt(rl!, 'Nome do anúncio:');
      const budgetStr = options.budget ?? await prompt(rl!, 'Orçamento diário (R$):');
      const dailyBudget = parseFloat(budgetStr);
      if (isNaN(dailyBudget) || dailyBudget <= 0) {
        console.error(`${COLORS.RED}✗ Orçamento inválido. Informe um valor positivo.${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const websiteUrl = options.url ?? await prompt(rl!, 'URL do site:');
      const headline = options.headline ?? await prompt(rl!, 'Título do anúncio:');
      const primaryText = options.text ?? await prompt(rl!, 'Texto principal:');
      const description = options.description ?? await prompt(rl!, 'Descrição:');
      const platform = parsePlatform(options.plataforma);

      rl?.close();

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
        platform,
      };

      const callbacks = options.quiet ? undefined : buildProgressCallbacks(uploadSpinner);

      const result = await createCampaign(campaignConfig, bundle, callbacks);

      printResult(result, startTime);
    } catch (error) {
      rl?.close();
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });

const leadsCommand = new Command('leads')
  .description('Criar campanha de Leads (Landing Page)')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook')
  .option('--plataforma <platform>', `Placements: ${VALID_PLATFORMS.join(', ')} (padrão: automático)`)
  .option('--quiet', 'Exibir apenas resultado final')
  .action(async (nameArg: string | undefined, options: { page?: string; plataforma?: string; quiet?: boolean }) => {
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
      const platform = parsePlatform(options.plataforma);

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
        platform,
      };

      const callbacks = options.quiet ? undefined : buildProgressCallbacks(uploadSpinner);

      const result = await createCampaign(campaignConfig, bundle, callbacks);

      printResult(result, startTime);
    } catch (error) {
      rl.close();
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });

/**
 * Factory para objetivos "diretos" que apontam para uma URL de site:
 * Reconhecimento, Tráfego e Engajamento. Reaproveita o mesmo fluxo do
 * comando de vendas (coleta de inputs → upload → criação).
 */
function makeObjectiveCommand(type: Extract<CampaignType, 'awareness' | 'traffic' | 'engagement'>): Command {
  const spec = OBJECTIVE_SPECS[type];
  return new Command(type)
    .description(`Criar campanha de ${spec.label}`)
    .argument('[name]', 'Nome do anúncio')
    .option('--page <pageId>', 'ID da página do Facebook')
    .option('--budget <value>', 'Orçamento diário em R$')
    .option('--url <url>', 'URL de destino')
    .option('--headline <text>', 'Título do anúncio')
    .option('--text <text>', 'Texto principal do anúncio')
    .option('--description <text>', 'Descrição do anúncio')
    .option('--plataforma <platform>', `Placements: ${VALID_PLATFORMS.join(', ')} (padrão: automático)`)
    .option('--quiet', 'Exibir apenas resultado final')
    .action(async (nameArg: string | undefined, options: { page?: string; budget?: string; url?: string; headline?: string; text?: string; description?: string; plataforma?: string; quiet?: boolean }) => {
      const allFlagsProvided = nameArg && options.budget && options.url && options.headline && options.text && options.description;
      const rl = allFlagsProvided ? null : createInterface({ input: stdin, output: stdout });

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

        const name = nameArg ?? await prompt(rl!, 'Nome do anúncio:');
        const budgetStr = options.budget ?? await prompt(rl!, 'Orçamento diário (R$):');
        const dailyBudget = parseFloat(budgetStr);
        if (isNaN(dailyBudget) || dailyBudget <= 0) {
          console.error(`${COLORS.RED}✗ Orçamento inválido. Informe um valor positivo.${COLORS.RESET}`);
          process.exitCode = 1;
          return;
        }

        const websiteUrl = options.url ?? await prompt(rl!, 'URL de destino:');
        const headline = options.headline ?? await prompt(rl!, 'Título do anúncio:');
        const primaryText = options.text ?? await prompt(rl!, 'Texto principal:');
        const description = options.description ?? await prompt(rl!, 'Descrição:');
        const platform = parsePlatform(options.plataforma);

        rl?.close();

        const spinner = options.quiet ? null : ora(STEP_LABELS.validate).start();
        const folderPath = resolvePath(config.creativesPath);
        const assets = await scanCreatives(folderPath);
        const validated = validateAll(assets);
        const bundle = buildBundle(validated);
        spinner?.succeed(STEP_SUCCESS.validate);

        const uploadSpinner = options.quiet ? null : ora(STEP_LABELS.upload).start();

        const campaignConfig: CampaignConfig = {
          type,
          name,
          dailyBudget,
          adText: {
            headline,
            primaryText,
            description,
            callToAction: spec.ctaDefault,
          },
          pageId: resolved.pageId,
          instagramAccountId: resolved.instagramAccountId,
          adAccountId,
          websiteUrl: spec.urlField === 'websiteUrl' ? websiteUrl : null,
          landingPageUrl: spec.urlField === 'landingPageUrl' ? websiteUrl : null,
          pixelId: null,
          platform,
        };

        const callbacks = options.quiet ? undefined : buildProgressCallbacks(uploadSpinner);

        const result = await createCampaign(campaignConfig, bundle, callbacks);

        printResult(result, startTime);
      } catch (error) {
        rl?.close();
        const result = handleError(error);
        console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
        if (result.action) {
          console.error(`  ${result.action}`);
        }
        process.exitCode = 1;
      }
    });
}

const whatsappCommand = new Command('whatsapp')
  .description('Criar campanha de WhatsApp (Click-to-WhatsApp)')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook (com WhatsApp conectado)')
  .option('--budget <value>', 'Orçamento diário em R$')
  .option('--whatsapp <number>', 'Número de WhatsApp com DDI (ex.: 5511999998888)')
  .option('--headline <text>', 'Título do anúncio')
  .option('--text <text>', 'Texto principal do anúncio')
  .option('--description <text>', 'Descrição do anúncio')
  .option('--plataforma <platform>', `Placements: ${VALID_PLATFORMS.join(', ')} (padrão: automático)`)
  .option('--quiet', 'Exibir apenas resultado final')
  .action(async (nameArg: string | undefined, options: { page?: string; budget?: string; whatsapp?: string; headline?: string; text?: string; description?: string; plataforma?: string; quiet?: boolean }) => {
    const allFlagsProvided = nameArg && options.budget && options.whatsapp && options.headline && options.text && options.description;
    const rl = allFlagsProvided ? null : createInterface({ input: stdin, output: stdout });

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

      const name = nameArg ?? await prompt(rl!, 'Nome do anúncio:');
      const budgetStr = options.budget ?? await prompt(rl!, 'Orçamento diário (R$):');
      const dailyBudget = parseFloat(budgetStr);
      if (isNaN(dailyBudget) || dailyBudget <= 0) {
        console.error(`${COLORS.RED}✗ Orçamento inválido. Informe um valor positivo.${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const whatsappRaw = options.whatsapp ?? await prompt(rl!, 'Número de WhatsApp (com DDI, ex.: 5511999998888):');
      const whatsappNumber = whatsappRaw.replace(/\D/g, '');
      const headline = options.headline ?? await prompt(rl!, 'Título do anúncio:');
      const primaryText = options.text ?? await prompt(rl!, 'Texto principal:');
      const description = options.description ?? await prompt(rl!, 'Descrição:');
      const platform = parsePlatform(options.plataforma);

      rl?.close();

      const spinner = options.quiet ? null : ora(STEP_LABELS.validate).start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner?.succeed(STEP_SUCCESS.validate);

      const uploadSpinner = options.quiet ? null : ora(STEP_LABELS.upload).start();

      const campaignConfig: CampaignConfig = {
        type: 'whatsapp',
        name,
        dailyBudget,
        adText: {
          headline,
          primaryText,
          description,
          callToAction: OBJECTIVE_SPECS.whatsapp.ctaDefault,
        },
        pageId: resolved.pageId,
        instagramAccountId: resolved.instagramAccountId,
        adAccountId,
        websiteUrl: null,
        landingPageUrl: null,
        pixelId: null,
        platform,
        whatsappNumber,
      };

      const callbacks = options.quiet ? undefined : buildProgressCallbacks(uploadSpinner);

      const result = await createCampaign(campaignConfig, bundle, callbacks);

      printResult(result, startTime);
    } catch (error) {
      rl?.close();
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });

const leadformCommand = new Command('leadform')
  .description('Criar campanha de Lead Ads (formulário nativo do Facebook)')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook')
  .option('--budget <value>', 'Orçamento diário em R$')
  .option('--privacy-url <url>', 'URL da política de privacidade (obrigatória)')
  .option('--form-id <id>', 'Usar um formulário existente (pula a criação)')
  .option('--headline <text>', 'Título do anúncio')
  .option('--text <text>', 'Texto principal do anúncio')
  .option('--description <text>', 'Descrição do anúncio')
  .option('--plataforma <platform>', `Placements: ${VALID_PLATFORMS.join(', ')} (padrão: automático)`)
  .option('--quiet', 'Exibir apenas resultado final')
  .action(async (nameArg: string | undefined, options: { page?: string; budget?: string; privacyUrl?: string; formId?: string; headline?: string; text?: string; description?: string; plataforma?: string; quiet?: boolean }) => {
    const allFlagsProvided = nameArg && options.budget && (options.privacyUrl || options.formId) && options.headline && options.text && options.description;
    const rl = allFlagsProvided ? null : createInterface({ input: stdin, output: stdout });

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

      const name = nameArg ?? await prompt(rl!, 'Nome do anúncio:');
      const budgetStr = options.budget ?? await prompt(rl!, 'Orçamento diário (R$):');
      const dailyBudget = parseFloat(budgetStr);
      if (isNaN(dailyBudget) || dailyBudget <= 0) {
        console.error(`${COLORS.RED}✗ Orçamento inválido. Informe um valor positivo.${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const formId = options.formId ?? null;
      const privacyUrl = formId ? null : (options.privacyUrl ?? await prompt(rl!, 'URL da política de privacidade:'));
      const headline = options.headline ?? await prompt(rl!, 'Título do anúncio:');
      const primaryText = options.text ?? await prompt(rl!, 'Texto principal:');
      const description = options.description ?? await prompt(rl!, 'Descrição:');
      const platform = parsePlatform(options.plataforma);

      rl?.close();

      const spinner = options.quiet ? null : ora(STEP_LABELS.validate).start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner?.succeed(STEP_SUCCESS.validate);

      const uploadSpinner = options.quiet ? null : ora(STEP_LABELS.upload).start();

      const campaignConfig: CampaignConfig = {
        type: 'leadform',
        name,
        dailyBudget,
        adText: {
          headline,
          primaryText,
          description,
          callToAction: OBJECTIVE_SPECS.leadform.ctaDefault,
        },
        pageId: resolved.pageId,
        instagramAccountId: resolved.instagramAccountId,
        adAccountId,
        websiteUrl: null,
        landingPageUrl: null,
        pixelId: null,
        platform,
        leadFormId: formId,
        leadFormPrivacyUrl: privacyUrl,
      };

      const callbacks = options.quiet ? undefined : buildProgressCallbacks(uploadSpinner);
      const result = await createCampaign(campaignConfig, bundle, callbacks);
      printResult(result, startTime);
    } catch (error) {
      rl?.close();
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });

const appCommand = new Command('app')
  .description('Criar campanha de Promoção de App')
  .argument('[name]', 'Nome do anúncio')
  .option('--page <pageId>', 'ID da página do Facebook')
  .option('--budget <value>', 'Orçamento diário em R$')
  .option('--app-id <id>', 'ID do aplicativo (Facebook App)')
  .option('--store-url <url>', 'URL da loja (App Store/Google Play)')
  .option('--headline <text>', 'Título do anúncio')
  .option('--text <text>', 'Texto principal do anúncio')
  .option('--description <text>', 'Descrição do anúncio')
  .option('--plataforma <platform>', `Placements: ${VALID_PLATFORMS.join(', ')} (padrão: automático)`)
  .option('--quiet', 'Exibir apenas resultado final')
  .action(async (nameArg: string | undefined, options: { page?: string; budget?: string; appId?: string; storeUrl?: string; headline?: string; text?: string; description?: string; plataforma?: string; quiet?: boolean }) => {
    const allFlagsProvided = nameArg && options.budget && options.appId && options.storeUrl && options.headline && options.text && options.description;
    const rl = allFlagsProvided ? null : createInterface({ input: stdin, output: stdout });

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

      const name = nameArg ?? await prompt(rl!, 'Nome do anúncio:');
      const budgetStr = options.budget ?? await prompt(rl!, 'Orçamento diário (R$):');
      const dailyBudget = parseFloat(budgetStr);
      if (isNaN(dailyBudget) || dailyBudget <= 0) {
        console.error(`${COLORS.RED}✗ Orçamento inválido. Informe um valor positivo.${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const applicationId = options.appId ?? await prompt(rl!, 'ID do aplicativo:');
      const objectStoreUrl = options.storeUrl ?? await prompt(rl!, 'URL da loja (App Store/Google Play):');
      const headline = options.headline ?? await prompt(rl!, 'Título do anúncio:');
      const primaryText = options.text ?? await prompt(rl!, 'Texto principal:');
      const description = options.description ?? await prompt(rl!, 'Descrição:');
      const platform = parsePlatform(options.plataforma);

      rl?.close();

      const spinner = options.quiet ? null : ora(STEP_LABELS.validate).start();
      const folderPath = resolvePath(config.creativesPath);
      const assets = await scanCreatives(folderPath);
      const validated = validateAll(assets);
      const bundle = buildBundle(validated);
      spinner?.succeed(STEP_SUCCESS.validate);

      const uploadSpinner = options.quiet ? null : ora(STEP_LABELS.upload).start();

      const campaignConfig: CampaignConfig = {
        type: 'app',
        name,
        dailyBudget,
        adText: {
          headline,
          primaryText,
          description,
          callToAction: OBJECTIVE_SPECS.app.ctaDefault,
        },
        pageId: resolved.pageId,
        instagramAccountId: resolved.instagramAccountId,
        adAccountId,
        websiteUrl: null,
        landingPageUrl: null,
        pixelId: null,
        platform,
        applicationId,
        objectStoreUrl,
      };

      const callbacks = options.quiet ? undefined : buildProgressCallbacks(uploadSpinner);
      const result = await createCampaign(campaignConfig, bundle, callbacks);
      printResult(result, startTime);
    } catch (error) {
      rl?.close();
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });

export const createCommand = new Command('create')
  .description('Criar campanhas na Meta Ads');

createCommand.addCommand(salesCommand);
createCommand.addCommand(leadsCommand);
createCommand.addCommand(makeObjectiveCommand('awareness'));
createCommand.addCommand(makeObjectiveCommand('traffic'));
createCommand.addCommand(makeObjectiveCommand('engagement'));
createCommand.addCommand(whatsappCommand);
createCommand.addCommand(leadformCommand);
createCommand.addCommand(appCommand);
