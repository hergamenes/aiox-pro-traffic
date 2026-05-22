import { Command } from 'commander';
import { readFile, access } from 'node:fs/promises';
import { ensureValidAuth } from '../../auth/token-manager.js';
import { createClient } from '../../google-ads-api/client.js';
import {
  uploadImageAsset,
  uploadVideoAsset,
  uploadTextAsset,
  listAssets,
  readCustomerCurrencyAndTz,
} from '../../google-ads-api/mutations.js';
import {
  detectImageMime,
  extractImageDimensions,
  validateImageSize,
  validateLogoDimensions,
  parseYoutubeUrl,
  suggestAssetName,
  validateTextAsset,
  IMAGE_SIZE_LIMIT_BYTES,
} from '../../google-ads-api/asset-validator.js';
import { getDefaults } from '../../config/config-repository.js';
import { requireSimpleConfirm } from '../mutation-prompt.js';
import { appendMutationLog } from '../../log/mutation-log.js';
import { COLORS, formatTable } from '../display.js';
import { printError } from '../../errors/error-handler.js';

// ============================================================================
// `upload` command (parent)
// ============================================================================

export const uploadCommand = new Command('upload')
  .description('Fazer upload de assets (image, YouTube video, text) para a biblioteca de assets');

uploadCommand
  .command('image <file-path>')
  .description('Faz upload de uma imagem como asset (IMAGE ou LOGO_IMAGE)')
  .option('--type <type>', 'Tipo: IMAGE ou LOGO_IMAGE', 'IMAGE')
  .option('--name <text>', 'Nome do asset (default: derivado do filename)')
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .option('--dry-run', '', false)
  .action(
    async (
      filePath: string,
      options: {
        type: string;
        name?: string;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      },
    ) => {
      try {
        const type = options.type.toUpperCase();
        if (type !== 'IMAGE' && type !== 'LOGO_IMAGE') {
          console.error(`${COLORS.red}--type deve ser IMAGE ou LOGO_IMAGE.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        // Read file
        try {
          await access(filePath);
        } catch {
          console.error(`${COLORS.red}Arquivo não encontrado: ${filePath}${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }
        const buffer = await readFile(filePath);

        // Validate size
        const sizeCheck = validateImageSize(buffer);
        if (sizeCheck.exceedsLimit) {
          console.error(
            `${COLORS.red}❌ Arquivo excede limite Google Ads (${(sizeCheck.sizeBytes / 1024 / 1024).toFixed(2)} MB > ${IMAGE_SIZE_LIMIT_BYTES / 1024 / 1024} MB).${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        // Detect MIME via magic bytes
        const mime = detectImageMime(buffer);
        if (!mime) {
          console.error(
            `${COLORS.red}❌ Arquivo não é PNG nem JPEG (magic bytes não batem). Renomeie ou converta.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        // Extract dimensions
        const dims = extractImageDimensions(buffer, mime);
        if (!dims) {
          console.error(
            `${COLORS.red}❌ Não foi possível extrair dimensões do arquivo. Header pode estar corrompido.${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        // LOGO_IMAGE dimension warning
        if (type === 'LOGO_IMAGE') {
          const logoCheck = validateLogoDimensions(dims);
          if (!logoCheck.isRecommended) {
            console.log(
              `${COLORS.yellow}⚠️  Logo com dimensões ${dims.width}x${dims.height} (ratio ${logoCheck.ratio}) fora das specs recomendadas (1:1 ≥1080x1080 ou 4:1 ≥1200x300).${COLORS.reset}`,
            );
            console.log(
              `${COLORS.yellow}    Google aceitará mas qualidade pode cair. Continue? (s/N)${COLORS.reset}`,
            );
            const cont = await requireSimpleConfirm('Continuar');
            if (!cont) {
              console.log(`${COLORS.dim}Upload cancelado.${COLORS.reset}`);
              return;
            }
          }
        }

        const dryRun = Boolean(options.dryRun);
        const name = options.name ?? suggestAssetName(filePath);

        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(`${COLORS.red}Erro: customer-id não fornecido.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }
        const loginCustomerId =
          options.loginCustomerId ?? defaults.loginCustomerId ?? creds.loginCustomerId;

        const client = createClient({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          developerToken: creds.developerToken,
        });

        // MCC check
        const ctx = await readCustomerCurrencyAndTz(
          client,
          creds.refreshToken,
          customerId,
          loginCustomerId,
        );
        if (ctx.isManager) {
          console.error(`${COLORS.red}Conta ${customerId} é MCC. Use conta cliente.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        // Preview
        console.log('');
        console.log(`${COLORS.bold}📋 Upload de Asset ${type}${COLORS.reset}`);
        console.log('━'.repeat(50));
        console.log(`Arquivo:         ${filePath}`);
        console.log(`Nome:            ${name}`);
        console.log(`Tipo:            ${type}`);
        console.log(`MIME:            ${mime === 'IMAGE_PNG' ? 'image/png' : 'image/jpeg'}`);
        console.log(`Dimensões:       ${dims.width} × ${dims.height} px`);
        console.log(`Tamanho:         ${(sizeCheck.sizeBytes / 1024).toFixed(0)} KB`);
        console.log(`Conta:           ${customerId}`);
        console.log('');

        const confirmed = await requireSimpleConfirm('Confirmar upload');
        if (!confirmed) {
          console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
          return;
        }

        const result = await uploadImageAsset(client, {
          customerId,
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          name,
          type: type as 'IMAGE' | 'LOGO_IMAGE',
          imageBuffer: buffer,
          mimeType: mime,
          width: dims.width,
          height: dims.height,
          dryRun,
        });

        await appendMutationLog({
          customerId,
          campaignId: '-',
          operation: 'upload_asset_image',
          before: {},
          after: {
            assetId: result.assetId,
            type,
            name,
            mime,
            width: dims.width,
            height: dims.height,
            sizeBytes: sizeCheck.sizeBytes,
            resourceName: result.resourceName,
          },
          dryRun,
          success: true,
        });

        console.log('');
        if (dryRun) {
          console.log(`${COLORS.green}✓ Dry-run validado — asset NÃO foi criado.${COLORS.reset}`);
        } else {
          console.log(`${COLORS.green}✅ Asset criado: ${result.resourceName}${COLORS.reset}`);
          console.log(`  Asset ID:  ${result.assetId}`);
        }
        console.log(`${COLORS.dim}ℹ️  Use o Asset ID acima ao criar RDA (Story 6.5) ou Asset Group (PMax).${COLORS.reset}`);
        console.log(`${COLORS.dim}ℹ️  Assets não podem ser deletados via API — Google auto-cleana órfãos.${COLORS.reset}`);
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );

uploadCommand
  .command('video <youtube-url-or-id>')
  .description('Cria asset referenciando vídeo do YouTube (não faz upload de arquivo)')
  .option('--name <text>', 'Nome do asset')
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .option('--dry-run', '', false)
  .action(
    async (
      youtubeInput: string,
      options: {
        name?: string;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      },
    ) => {
      try {
        const parsed = parseYoutubeUrl(youtubeInput);
        if (!parsed) {
          console.error(
            `${COLORS.red}❌ URL/ID inválido. Aceito: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, ou ID puro (11 chars).${COLORS.reset}`,
          );
          process.exitCode = 1;
          return;
        }

        const dryRun = Boolean(options.dryRun);
        const name = options.name ?? `YouTube ${parsed.videoId}`;

        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(`${COLORS.red}Erro: customer-id não fornecido.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }
        const loginCustomerId =
          options.loginCustomerId ?? defaults.loginCustomerId ?? creds.loginCustomerId;

        const client = createClient({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          developerToken: creds.developerToken,
        });

        console.log('');
        console.log(`${COLORS.bold}📋 Upload de Asset YOUTUBE_VIDEO${COLORS.reset}`);
        console.log('━'.repeat(50));
        console.log(`Video ID:        ${parsed.videoId}`);
        console.log(`URL original:    ${parsed.originalUrl}`);
        console.log(`Nome:            ${name}`);
        console.log(`Conta:           ${customerId}`);
        console.log('');

        const confirmed = await requireSimpleConfirm('Confirmar upload');
        if (!confirmed) {
          console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
          return;
        }

        const result = await uploadVideoAsset(client, {
          customerId,
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          name,
          youtubeVideoId: parsed.videoId,
          dryRun,
        });

        await appendMutationLog({
          customerId,
          campaignId: '-',
          operation: 'upload_asset_video',
          before: {},
          after: {
            assetId: result.assetId,
            youtubeVideoId: parsed.videoId,
            name,
            resourceName: result.resourceName,
          },
          dryRun,
          success: true,
        });

        console.log('');
        console.log(`${COLORS.green}✓ Asset YOUTUBE_VIDEO ${dryRun ? 'validado (dry-run)' : 'criado'}: ${result.resourceName}${COLORS.reset}`);
        console.log(`  Asset ID: ${result.assetId}`);
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );

uploadCommand
  .command('text <text>')
  .description('Cria asset TEXT para reuso em copy library')
  .requiredOption('--name <text>', 'Nome do asset (obrigatório para text)')
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .option('--dry-run', '', false)
  .action(
    async (
      text: string,
      options: {
        name: string;
        customerId?: string;
        loginCustomerId?: string;
        dryRun?: boolean;
      },
    ) => {
      try {
        const validation = validateTextAsset(text);
        if (!validation.valid) {
          console.error(`${COLORS.red}${validation.error}${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        const dryRun = Boolean(options.dryRun);
        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(`${COLORS.red}Erro: customer-id não fornecido.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }
        const loginCustomerId =
          options.loginCustomerId ?? defaults.loginCustomerId ?? creds.loginCustomerId;

        const client = createClient({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          developerToken: creds.developerToken,
        });

        console.log('');
        console.log(`${COLORS.bold}📋 Upload de Asset TEXT${COLORS.reset}`);
        console.log('━'.repeat(50));
        console.log(`Texto:           "${text}"`);
        console.log(`Length:          ${text.length}/300 chars`);
        console.log(`Nome:            ${options.name}`);
        console.log(`Conta:           ${customerId}`);
        console.log('');

        const confirmed = await requireSimpleConfirm('Confirmar upload');
        if (!confirmed) {
          console.log(`${COLORS.yellow}Cancelado.${COLORS.reset}`);
          return;
        }

        const result = await uploadTextAsset(client, {
          customerId,
          refreshToken: creds.refreshToken,
          ...(loginCustomerId ? { loginCustomerId } : {}),
          name: options.name,
          text,
          dryRun,
        });

        await appendMutationLog({
          customerId,
          campaignId: '-',
          operation: 'upload_asset_text',
          before: {},
          after: {
            assetId: result.assetId,
            name: options.name,
            text,
            length: text.length,
            resourceName: result.resourceName,
          },
          dryRun,
          success: true,
        });

        console.log('');
        console.log(`${COLORS.green}✓ Asset TEXT ${dryRun ? 'validado (dry-run)' : 'criado'}: ${result.resourceName}${COLORS.reset}`);
        console.log(`  Asset ID: ${result.assetId}`);
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );

// ============================================================================
// `list-assets` command
// ============================================================================

export const listAssetsCommand = new Command('list-assets')
  .description('Lista assets da conta (read-only)')
  .option('--type <type>', 'IMAGE | VIDEO | TEXT | ALL', 'ALL')
  .option('--format <format>', 'table | json', 'table')
  .option('--customer-id <id>')
  .option('--login-customer-id <id>')
  .action(
    async (options: {
      type: string;
      format: string;
      customerId?: string;
      loginCustomerId?: string;
    }) => {
      try {
        const type = options.type.toUpperCase();
        if (!['IMAGE', 'VIDEO', 'TEXT', 'ALL'].includes(type)) {
          console.error(`${COLORS.red}--type deve ser IMAGE, VIDEO, TEXT ou ALL.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }

        const creds = await ensureValidAuth();
        const defaults = await getDefaults();
        const customerId = options.customerId ?? defaults.customerId;
        if (!customerId) {
          console.error(`${COLORS.red}Erro: customer-id não fornecido.${COLORS.reset}`);
          process.exitCode = 1;
          return;
        }
        const loginCustomerId =
          options.loginCustomerId ?? defaults.loginCustomerId ?? creds.loginCustomerId;

        const client = createClient({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          developerToken: creds.developerToken,
        });

        const assets = await listAssets(
          client,
          creds.refreshToken,
          customerId,
          type as 'IMAGE' | 'VIDEO' | 'TEXT' | 'ALL',
          loginCustomerId,
        );

        if (options.format === 'json') {
          console.log(JSON.stringify(assets, null, 2));
          return;
        }

        if (assets.length === 0) {
          console.log(`${COLORS.dim}Nenhum asset encontrado (type=${type}).${COLORS.reset}`);
          return;
        }

        const rows = assets.map((a) => [
          a.assetId,
          a.type,
          a.name ?? '—',
          a.width && a.height ? `${a.width}×${a.height}` : a.youtubeVideoId ?? (a.text ? a.text.slice(0, 30) + (a.text.length > 30 ? '…' : '') : '—'),
        ]);
        console.log(formatTable(['ID', 'Tipo', 'Nome', 'Info'], rows));
        console.log(
          `\n${COLORS.dim}Total: ${assets.length} asset(s). Use os IDs ao criar RDA / Asset Group.${COLORS.reset}`,
        );
      } catch (err) {
        printError(err);
        process.exitCode = 1;
      }
    },
  );
