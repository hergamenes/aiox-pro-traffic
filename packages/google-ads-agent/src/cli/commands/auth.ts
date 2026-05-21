import { Command } from 'commander';
import { input, password } from '@inquirer/prompts';
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildAuthUrl,
  exchangeCodeForRefreshToken,
  generateState,
  getOAuthPort,
  getRedirectUri,
  startLoopbackServer,
} from '../../auth/oauth-flow.js';
import {
  storeDeveloperToken,
  storeClientId,
  storeClientSecret,
  storeRefreshToken,
  storeCustomerId,
  storeLoginCustomerId,
} from '../../auth/keychain.js';
import { verifyToken } from '../../auth/token-manager.js';
import { printError } from '../../errors/error-handler.js';
import { COLORS, mask } from '../display.js';
import { logger } from '../logger.js';

export const authCommand = new Command('auth').description(
  'Gerenciar autenticação com a Google Ads API',
);

authCommand
  .command('setup')
  .description('Iniciar fluxo de autenticação OAuth 2.0')
  .action(async () => {
    try {
      console.log(`${COLORS.bold}Setup OAuth Google Ads${COLORS.reset}\n`);
      console.log(
        'Você precisará: (1) Developer Token, (2) Google Cloud OAuth client_id + client_secret.\n',
      );

      const developerToken = await password({
        message: 'Developer Token:',
        mask: '*',
        validate: (v) => v.trim().length >= 10 || 'Developer token muito curto',
      });
      const clientId = await input({
        message: 'OAuth Client ID:',
        validate: (v) => v.trim().length > 0 || 'Obrigatório',
      });
      const clientSecret = await password({
        message: 'OAuth Client Secret:',
        mask: '*',
        validate: (v) => v.trim().length > 0 || 'Obrigatório',
      });

      const port = getOAuthPort();
      const redirectUri = getRedirectUri(port);
      const state = generateState();
      const authUrl = buildAuthUrl({ clientId, redirectUri, state });

      const urlFile = join(tmpdir(), 'google-ads-auth-url.txt');
      await writeFile(urlFile, authUrl, 'utf-8');

      console.log(
        `\n${COLORS.dim}1. Servidor local iniciado em ${redirectUri}${COLORS.reset}`,
      );
      console.log(
        `${COLORS.dim}2. Tentando abrir navegador automaticamente...${COLORS.reset}`,
      );

      const opened = await tryOpenBrowser(authUrl);
      if (opened) {
        console.log(
          `${COLORS.green}   ✓ Navegador aberto.${COLORS.reset} Se nada aconteceu, leia abaixo.`,
        );
      } else {
        console.log(
          `${COLORS.dim}   (não foi possível abrir automaticamente)${COLORS.reset}`,
        );
      }
      console.log(
        `\n${COLORS.dim}   Fallback — URL completa também salva em:${COLORS.reset}`,
      );
      console.log(`   ${COLORS.bold}${urlFile}${COLORS.reset}`);
      console.log(
        `${COLORS.dim}   Use 'open ${urlFile}' ou 'cat ${urlFile} | pbcopy' para copiar.${COLORS.reset}`,
      );
      console.log(
        `\n${COLORS.dim}3. Aguardando callback... (timeout 5min)${COLORS.reset}\n`,
      );

      const callback = await startLoopbackServer({ port, expectedState: state });
      const tokens = await exchangeCodeForRefreshToken({
        clientId,
        clientSecret,
        code: callback.code,
        redirectUri,
      });

      await Promise.all([
        storeDeveloperToken(developerToken),
        storeClientId(clientId),
        storeClientSecret(clientSecret),
        storeRefreshToken(tokens.refreshToken),
      ]);

      console.log(`${COLORS.green}✓ Credenciais persistidas no Keychain.${COLORS.reset}`);
      console.log(`  Developer Token: ${mask(developerToken)}`);
      console.log(`  Client ID:       ${mask(clientId)}`);
      console.log(`  Refresh Token:   ${mask(tokens.refreshToken)}`);
      console.log(
        `\n${COLORS.dim}Próximo passo: defina a conta padrão com 'google-ads config set-default' (Story 5.2).${COLORS.reset}`,
      );
    } catch (err) {
      printError(err);
      process.exitCode = 1;
    }
  });

authCommand
  .command('manual')
  .description('Autenticar colando refresh_token manualmente (fallback se OAuth falhar)')
  .action(async () => {
    try {
      console.log(
        `${COLORS.bold}Autenticação manual${COLORS.reset}\n${COLORS.dim}Use quando OAuth loopback não estiver disponível.${COLORS.reset}\n`,
      );

      const developerToken = await password({ message: 'Developer Token:', mask: '*' });
      const clientId = await input({ message: 'OAuth Client ID:' });
      const clientSecret = await password({ message: 'OAuth Client Secret:', mask: '*' });
      const refreshToken = await password({
        message: 'Refresh Token (do OAuth Playground ou outro flow):',
        mask: '*',
      });
      const customerIdInput = await input({
        message: 'Customer ID padrão (opcional, 10 dígitos sem traços):',
        default: '',
      });
      const loginCustomerIdInput = await input({
        message: 'Login Customer ID (MCC, opcional):',
        default: '',
      });

      await Promise.all([
        storeDeveloperToken(developerToken),
        storeClientId(clientId),
        storeClientSecret(clientSecret),
        storeRefreshToken(refreshToken),
        ...(customerIdInput ? [storeCustomerId(customerIdInput)] : []),
        ...(loginCustomerIdInput ? [storeLoginCustomerId(loginCustomerIdInput)] : []),
      ]);

      console.log(`${COLORS.green}✓ Credenciais persistidas no Keychain.${COLORS.reset}`);
    } catch (err) {
      printError(err);
      process.exitCode = 1;
    }
  });

authCommand
  .command('status')
  .description('Verificar status da autenticação')
  .action(async () => {
    try {
      const result = await verifyToken();
      if (result.valid) {
        console.log(`${COLORS.green}✓ Autenticado${COLORS.reset}`);
        console.log(`  Contas acessíveis: ${result.accessibleCustomers.length}`);
        if (result.accessibleCustomers.length > 0) {
          const preview = result.accessibleCustomers.slice(0, 5).join(', ');
          const suffix = result.accessibleCustomers.length > 5 ? ', ...' : '';
          console.log(`  IDs: ${preview}${suffix}`);
        }
      } else {
        console.log(`${COLORS.red}✗ Não autenticado${COLORS.reset}`);
        if (result.reason) {
          console.log(`${COLORS.dim}  Motivo: ${result.reason}${COLORS.reset}`);
        }
        console.log(`${COLORS.dim}  Ação: execute 'google-ads auth setup'${COLORS.reset}`);
        process.exitCode = 1;
      }
    } catch (err) {
      logger.debug({ err }, 'auth status crashed');
      printError(err);
      process.exitCode = 1;
    }
  });

/**
 * Tries to open the given URL in the user's default browser using
 * the appropriate platform command. Returns true on success, false
 * on failure (caller falls back to manual copy/paste).
 *
 * Note: we don't await the child process — we just check that spawn
 * succeeded. The actual browser open is fire-and-forget.
 */
async function tryOpenBrowser(url: string): Promise<boolean> {
  const platform = process.platform;
  let command: string;
  let args: string[];

  if (platform === 'darwin') {
    command = 'open';
    args = [url];
  } else if (platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', url];
  } else {
    command = 'xdg-open';
    args = [url];
  }

  return new Promise((resolve) => {
    try {
      const child = spawn(command, args, { stdio: 'ignore', detached: true });
      child.on('error', () => resolve(false));
      child.unref();
      // Give the child a brief moment to fail before reporting success.
      setTimeout(() => resolve(true), 200);
    } catch {
      resolve(false);
    }
  });
}
