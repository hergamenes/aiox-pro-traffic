import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { Command } from 'commander';
import ora from 'ora';
import { scanCreatives } from '../../creative/scanner.js';
import { validateAll } from '../../creative/validator.js';
import { buildBundle } from '../../creative/bundle-builder.js';
import { createCampaign, createCampaignFromLibrary } from '../../campaign/orchestrator.js';
import { formatTable } from '../display.js';
import { resolvePageId } from '../page-resolver.js';
import { COLORS, formatDuration } from '../progress.js';
import { handleError } from '../../errors/error-handler.js';
import * as configRepo from '../../config/config-repository.js';
import type { CampaignConfig, CampaignType, Platform } from '../../types/campaign.js';
import type { CreativeBundle } from '../../types/creative.js';
import { OBJECTIVE_SPECS, SUPPORTED_TYPES } from '../../campaign/objectives.js';
import { parsePlatform } from '../../campaign/placements.js';

interface BatchRow {
  name: string;
  type: CampaignType;
  budget: number;
  url: string;
  headline: string;
  text: string;
  description: string;
  creativePath: string | null;
  imageHash: string | null;
  videoId: string | null;
  callToAction: string;
  // New fields
  storiesImageHash: string | null;
  pixelId: string | null;
  cboEnabled: boolean;
  ageMin: number | null;
  startTime: number | null;
  urlTags: string | null;
  adSetName: string | null;
  adName: string | null;
  platform: Platform | undefined;
  whatsappNumber: string | null;
  leadFormId: string | null;
  leadFormPrivacyUrl: string | null;
  applicationId: string | null;
  objectStoreUrl: string | null;
}

interface BatchResult {
  row: number;
  name: string;
  success: boolean;
  campaignId?: string;
  adSetId?: string;
  adId?: string;
  error?: string;
  duration: number;
}

function resolvePath(inputPath: string, basePath?: string): string {
  if (inputPath.startsWith('~')) {
    return resolve(homedir(), inputPath.slice(2));
  }
  if (basePath && !resolve(inputPath).startsWith('/')) {
    return resolve(basePath, inputPath);
  }
  return resolve(inputPath);
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCsv(content: string, csvDir: string): BatchRow[] {
  const lines = content.split('\n').filter((l) => l.trim() !== '');
  if (lines.length < 2) {
    throw new Error('CSV deve ter pelo menos um cabeçalho e uma linha de dados');
  }

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());

  const requiredColumns = ['name', 'budget', 'url', 'headline', 'text', 'description'];
  const missing = requiredColumns.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    throw new Error(`Colunas obrigatórias faltando no CSV: ${missing.join(', ')}`);
  }

  const rows: BatchRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    if (fields.length < header.length) continue;

    const getValue = (col: string): string => {
      const idx = header.indexOf(col);
      const raw = idx >= 0 ? fields[idx] : '';
      // Convert literal \n sequences to real newlines (for ad text in CSV)
      return raw.replace(/\\n/g, '\n');
    };

    const type = (getValue('type') || 'sales') as CampaignType;
    if (!SUPPORTED_TYPES.includes(type)) {
      throw new Error(`Linha ${i + 1}: tipo "${type}" inválido. Use: ${SUPPORTED_TYPES.join(', ')}.`);
    }

    const budget = parseFloat(getValue('budget'));
    if (isNaN(budget) || budget <= 0) {
      throw new Error(`Linha ${i + 1}: orçamento inválido "${getValue('budget')}".`);
    }

    const creativePath = getValue('creative_path') || null;
    const imageHash = getValue('image_hash') || null;
    const videoId = getValue('video_id') || null;
    const storiesImageHash = getValue('stories_image_hash') || null;
    const pixelId = getValue('pixel_id') || null;
    const cboEnabled = getValue('cbo_enabled') === 'true';
    const ageMinStr = getValue('age_min');
    const ageMin = ageMinStr ? parseInt(ageMinStr, 10) : null;
    const startTimeStr = getValue('start_time');
    const startTime = startTimeStr ? parseInt(startTimeStr, 10) : null;
    const urlTags = getValue('url_tags') || null;
    const adSetName = getValue('adset_name') || null;
    const adName = getValue('ad_name') || null;
    const platform = parsePlatform(getValue('platform') || undefined);
    const whatsappNumber = getValue('whatsapp_number') ? getValue('whatsapp_number').replace(/\D/g, '') : null;
    if (type === 'whatsapp' && !whatsappNumber) {
      throw new Error(`Linha ${i + 1}: campanha whatsapp exige a coluna "whatsapp_number".`);
    }
    const leadFormId = getValue('form_id') || null;
    const leadFormPrivacyUrl = getValue('privacy_url') || null;
    if (type === 'leadform' && !leadFormId && !leadFormPrivacyUrl) {
      throw new Error(`Linha ${i + 1}: campanha leadform exige "form_id" ou "privacy_url".`);
    }
    const applicationId = getValue('app_id') || null;
    const objectStoreUrl = getValue('store_url') || null;
    if (type === 'app' && (!applicationId || !objectStoreUrl)) {
      throw new Error(`Linha ${i + 1}: campanha app exige "app_id" e "store_url".`);
    }

    rows.push({
      name: getValue('name'),
      type,
      budget,
      url: getValue('url'),
      headline: getValue('headline'),
      text: getValue('text'),
      description: getValue('description'),
      creativePath: creativePath ? resolvePath(creativePath, csvDir) : null,
      imageHash,
      videoId,
      callToAction: getValue('cta') || OBJECTIVE_SPECS[type].ctaDefault,
      storiesImageHash,
      pixelId,
      cboEnabled,
      ageMin,
      startTime,
      urlTags,
      adSetName,
      adName,
      platform,
      whatsappNumber,
      leadFormId,
      leadFormPrivacyUrl,
      applicationId,
      objectStoreUrl,
    });
  }

  return rows;
}

async function prepareBundle(creativePath: string): Promise<CreativeBundle> {
  const assets = await scanCreatives(creativePath);
  const validated = validateAll(assets);
  return buildBundle(validated);
}

export const batchCommand = new Command('batch')
  .description('Criar múltiplas campanhas a partir de um CSV')
  .argument('<csv-file>', 'Caminho do arquivo CSV com as campanhas')
  .option('--page <pageId>', 'ID da página do Facebook')
  .option('--dry-run', 'Simular sem criar (validar CSV)')
  .option('--delay <ms>', 'Delay entre campanhas em ms (padrão: 2000)', '2000')
  .option('--continue-on-error', 'Continuar mesmo se uma campanha falhar')
  .action(async (csvFile: string, options: {
    page?: string;
    dryRun?: boolean;
    delay?: string;
    continueOnError?: boolean;
  }) => {
    const startTime = Date.now();
    const delay = parseInt(options.delay ?? '2000', 10);

    try {
      // Load config
      const config = await configRepo.load();
      const adAccountId = config.defaults.adAccountId;
      if (!adAccountId) {
        console.error(`${COLORS.RED}✗ Nenhuma conta de anúncios configurada. Execute: meta-ads config set-default ad-account <id>${COLORS.RESET}`);
        process.exitCode = 1;
        return;
      }

      const resolved = await resolvePageId({ pageFlag: options.page, config });

      // Read and parse CSV
      const csvPath = resolvePath(csvFile);
      const csvDir = dirname(csvPath);
      const spinner = ora('Lendo arquivo CSV...').start();
      const csvContent = await readFile(csvPath, 'utf-8');
      const rows = parseCsv(csvContent, csvDir);
      spinner.succeed(`CSV lido: ${rows.length} campanhas encontradas`);

      // Check if using Media Library or local files
      const usesLibrary = rows.some((r) => r.imageHash || r.videoId);
      const usesLocalFiles = rows.some((r) => !r.imageHash && !r.videoId);

      // Prepare bundles only for rows that need local upload
      const defaultCreativePath = resolvePath(config.creativesPath);
      const bundleCache = new Map<string, CreativeBundle>();

      if (usesLocalFiles) {
        const bundleSpinner = ora('Validando criativos locais...').start();
        for (const row of rows) {
          if (row.imageHash || row.videoId) continue; // skip library rows
          const path = row.creativePath ?? defaultCreativePath;
          if (!bundleCache.has(path)) {
            bundleCache.set(path, await prepareBundle(path));
          }
        }
        bundleSpinner.succeed(`Criativos locais validados (${bundleCache.size} pasta(s))`);
      }

      // Count sources
      const libraryCount = rows.filter((r) => r.imageHash || r.videoId).length;
      const localCount = rows.length - libraryCount;
      const cboCount = rows.filter((r) => r.cboEnabled).length;
      const pixelCount = rows.filter((r) => r.pixelId).length;

      // Show summary
      console.log(`\n${COLORS.BOLD}Resumo do Batch:${COLORS.RESET}`);
      console.log(`  Campanhas: ${rows.length}`);
      if (usesLibrary) console.log(`    Biblioteca de Mídia: ${libraryCount}`);
      if (usesLocalFiles) console.log(`    Upload local: ${localCount}`);
      if (cboCount > 0) console.log(`  CBO (Advantage): ${cboCount} campanhas`);
      if (pixelCount > 0) console.log(`  Pixel: ${pixelCount} campanhas`);
      console.log(`  Conta: ${adAccountId}`);
      console.log(`  Página: ${resolved.pageId}`);
      console.log(`  Orçamento total: R$ ${rows.reduce((sum, r) => sum + r.budget, 0).toFixed(2)}/dia`);

      if (options.dryRun) {
        console.log(`\n${COLORS.GREEN}${COLORS.BOLD}✓ Dry run: CSV válido!${COLORS.RESET}`);
        console.log('\nCampanhas que seriam criadas:\n');

        const previewRows = rows.map((r, i) => {
          const creative = r.videoId
            ? `video:${r.videoId}`
            : r.imageHash
              ? `img:${r.imageHash.substring(0, 12)}...`
              : 'local';
          const extras: string[] = [];
          if (r.cboEnabled) extras.push('CBO');
          if (r.pixelId) extras.push('Pixel');
          if (r.storiesImageHash) extras.push('Stories');
          if (r.ageMin) extras.push(`${r.ageMin}+`);
          return [
            String(i + 1),
            r.name,
            r.type,
            `R$ ${r.budget.toFixed(2)}`,
            creative,
            extras.join(', ') || '-',
          ];
        });
        console.log(formatTable(['#', 'Nome', 'Tipo', 'Orçamento', 'Criativo', 'Extras'], previewRows));
        return;
      }

      console.log(`\n${COLORS.BOLD}Iniciando criação...${COLORS.RESET}\n`);

      // Create campaigns
      const results: BatchResult[] = [];
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowStart = Date.now();
        const progress = `[${i + 1}/${rows.length}]`;
        const rowSpinner = ora(`${progress} Criando: ${row.name}`).start();

        try {
          const campaignConfig: CampaignConfig = {
            type: row.type,
            name: row.name,
            dailyBudget: row.budget,
            adText: {
              headline: row.headline,
              primaryText: row.text,
              description: row.description,
              callToAction: row.callToAction,
            },
            pageId: resolved.pageId,
            instagramAccountId: resolved.instagramAccountId,
            adAccountId,
            websiteUrl: OBJECTIVE_SPECS[row.type].urlField === 'websiteUrl' ? row.url : null,
            landingPageUrl: OBJECTIVE_SPECS[row.type].urlField === 'landingPageUrl' ? row.url : null,
            pixelId: row.pixelId,
            imageHash: row.imageHash,
            videoId: row.videoId,
            storiesImageHash: row.storiesImageHash,
            cboEnabled: row.cboEnabled,
            ageMin: row.ageMin ?? undefined,
            startTime: row.startTime ?? undefined,
            urlTags: row.urlTags ?? undefined,
            adSetName: row.adSetName ?? undefined,
            adName: row.adName ?? undefined,
            platform: row.platform,
            whatsappNumber: row.whatsappNumber,
            leadFormId: row.leadFormId,
            leadFormPrivacyUrl: row.leadFormPrivacyUrl,
            applicationId: row.applicationId,
            objectStoreUrl: row.objectStoreUrl,
          };

          let result;

          if (row.imageHash || row.videoId) {
            // Use Media Library creative (no upload)
            result = await createCampaignFromLibrary(campaignConfig);
          } else {
            // Use local file upload
            const creativePath = row.creativePath ?? defaultCreativePath;
            const bundle = bundleCache.get(creativePath)!;
            result = await createCampaign(campaignConfig, bundle);
          }

          rowSpinner.succeed(
            `${progress} ${COLORS.GREEN}✓${COLORS.RESET} ${row.name} → ${result.campaignId}`,
          );

          results.push({
            row: i + 1,
            name: row.name,
            success: true,
            campaignId: result.campaignId,
            adSetId: result.adSetId,
            adId: result.adId,
            duration: Date.now() - rowStart,
          });
          successCount++;
        } catch (error) {
          const errorResult = handleError(error);
          rowSpinner.fail(
            `${progress} ${COLORS.RED}✗${COLORS.RESET} ${row.name}: ${errorResult.message}`,
          );

          results.push({
            row: i + 1,
            name: row.name,
            success: false,
            error: errorResult.message,
            duration: Date.now() - rowStart,
          });
          failCount++;

          if (!options.continueOnError) {
            console.error(`\n${COLORS.RED}Batch interrompido. Use --continue-on-error para continuar após falhas.${COLORS.RESET}`);
            break;
          }
        }

        // Delay between campaigns (rate limiting)
        if (i < rows.length - 1 && delay > 0) {
          await new Promise((r) => setTimeout(r, delay));
        }
      }

      // Final summary
      const totalDuration = Date.now() - startTime;
      console.log(`\n${'━'.repeat(60)}`);
      console.log(`${COLORS.BOLD}Resultado do Batch${COLORS.RESET}\n`);

      const summaryRows = results.map((r) => [
        String(r.row),
        r.name,
        r.success ? `${COLORS.GREEN}OK${COLORS.RESET}` : `${COLORS.RED}FALHA${COLORS.RESET}`,
        r.campaignId ?? r.error ?? '-',
        formatDuration(r.duration),
      ]);

      console.log(formatTable(['#', 'Nome', 'Status', 'ID / Erro', 'Tempo'], summaryRows));

      console.log(`\n  ${COLORS.GREEN}Sucesso: ${successCount}${COLORS.RESET}`);
      if (failCount > 0) {
        console.log(`  ${COLORS.RED}Falha: ${failCount}${COLORS.RESET}`);
      }
      console.log(`  Total: ${results.length}/${rows.length}`);
      console.log(`  Tempo total: ${formatDuration(totalDuration)}`);

      if (failCount > 0) {
        process.exitCode = 1;
      }
    } catch (error) {
      const result = handleError(error);
      console.error(`\n${COLORS.RED}✗ ${result.message}${COLORS.RESET}`);
      if (result.action) {
        console.error(`  ${result.action}`);
      }
      process.exitCode = 1;
    }
  });
