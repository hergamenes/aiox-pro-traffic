import { Command } from 'commander';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { logger } from '../logger.js';
import { startAuthFlow } from '../../auth/oauth-flow.js';
import * as tokenManager from '../../auth/token-manager.js';
import * as keychain from '../../auth/keychain.js';
import { AuthError } from '../../errors/types.js';

async function promptInput(question: string): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question(question);
    return answer.trim();
  } finally {
    rl.close();
  }
}

export const authCommand = new Command('auth')
  .description('Gerenciar autenticação com a Meta Ads API');

authCommand
  .command('setup')
  .description('Iniciar fluxo de autenticação OAuth 2.0')
  .action(async () => {
    try {
      let appId = await keychain.getAppId();
      let appSecret = await keychain.getAppSecret();

      if (!appId) {
        appId = await promptInput('App ID (do developers.facebook.com): ');
        if (!appId) {
          console.error('✗ App ID é obrigatório.');
          process.exitCode = 1;
          return;
        }
      }

      if (!appSecret) {
        appSecret = await promptInput('App Secret (do developers.facebook.com): ');
        if (!appSecret) {
          console.error('✗ App Secret é obrigatório.');
          process.exitCode = 1;
          return;
        }
      }

      await keychain.storeAppId(appId);
      await keychain.storeAppSecret(appSecret);

      const tokenInfo = await startAuthFlow(appId, appSecret);
      await tokenManager.saveToken(tokenInfo);

      console.log('');
      console.log('✓ Autenticação concluída! Token válido por 60 dias.');
      console.log(`  Expira em: ${tokenInfo.expiresAt.toLocaleDateString('pt-BR')}`);
    } catch (error) {
      if (error instanceof AuthError) {
        console.error(`✗ ${error.message}`);
        if (error.action) console.error(`  ${error.action}`);
      } else {
        logger.error(error, 'Auth setup failed');
        console.error('✗ Erro inesperado durante autenticação.');
      }
      process.exitCode = 1;
    }
  });

authCommand
  .command('manual')
  .description('Autenticar com token colado manualmente (do Graph API Explorer)')
  .action(async () => {
    try {
      console.log('');
      console.log('📋 Autenticação Manual');
      console.log('━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('1. Acesse: https://developers.facebook.com/tools/explorer/');
      console.log('2. No topo, selecione seu App (aiox-cli ou aiox-ads-agent)');
      console.log('3. Clique em "Generate Access Token"');
      console.log('4. Marque as permissões: ads_management, ads_read, pages_read_engagement');
      console.log('5. Clique em "Generate Access Token" e autorize');
      console.log('6. Copie o token gerado e cole abaixo');
      console.log('');

      const token = await promptInput('Cole o Access Token aqui: ');
      if (!token) {
        console.error('✗ Token é obrigatório.');
        process.exitCode = 1;
        return;
      }

      // Validate token by calling /me
      const response = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${token}`);
      const data = (await response.json()) as Record<string, unknown>;

      if (data['error']) {
        const error = data['error'] as Record<string, string>;
        console.error(`✗ Token inválido: ${error['message']}`);
        process.exitCode = 1;
        return;
      }

      console.log(`✓ Token válido! Usuário: ${data['name']}`);

      // Try to exchange for long-lived token if we have app credentials
      const appId = await keychain.getAppId();
      const appSecret = await keychain.getAppSecret();

      let finalToken = token;
      let expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour default

      if (appId && appSecret) {
        try {
          const params = new URLSearchParams({
            grant_type: 'fb_exchange_token',
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: token,
          });
          const longResponse = await fetch(
            `https://graph.facebook.com/v21.0/oauth/access_token?${params.toString()}`
          );
          const longData = (await longResponse.json()) as Record<string, unknown>;

          if (longData['access_token']) {
            finalToken = longData['access_token'] as string;
            const expiresIn = (longData['expires_in'] as number) ?? 5_184_000;
            expiresAt = new Date(Date.now() + expiresIn * 1000);
            console.log('✓ Token convertido para longa duração (60 dias)');
          }
        } catch {
          logger.debug('Could not exchange for long-lived token, using short-lived');
        }
      }

      await tokenManager.saveToken({
        accessToken: finalToken,
        expiresAt,
        appId: appId ?? '',
      });

      console.log('');
      console.log('✓ Autenticação concluída!');
      console.log(`  Expira em: ${expiresAt.toLocaleDateString('pt-BR')}`);
    } catch (error) {
      if (error instanceof AuthError) {
        console.error(`✗ ${error.message}`);
        if (error.action) console.error(`  ${error.action}`);
      } else {
        logger.error(error, 'Manual auth failed');
        console.error('✗ Erro inesperado durante autenticação.');
      }
      process.exitCode = 1;
    }
  });

authCommand
  .command('status')
  .description('Verificar status da autenticação')
  .action(async () => {
    try {
      const status = await tokenManager.getAuthStatus();

      if (!status.tokenPreview) {
        console.log('✗ Não configurado');
        console.log('  Execute: meta-ads auth setup');
        return;
      }

      if (!status.authenticated) {
        console.log('⚠ Expirado');
        console.log(`  Token: ${status.tokenPreview}`);
        if (status.expiresAt) {
          console.log(`  Expirou em: ${status.expiresAt.toLocaleDateString('pt-BR')}`);
        }
        console.log('  Execute: meta-ads auth setup para renovar');
        return;
      }

      console.log('✓ Autenticado');
      console.log(`  Token: ${status.tokenPreview}`);
      if (status.expiresAt) {
        console.log(`  Expira em: ${status.expiresAt.toLocaleDateString('pt-BR')}`);
      }
      if (status.daysRemaining !== null) {
        console.log(`  Dias restantes: ${status.daysRemaining}`);
        if (status.daysRemaining <= 7) {
          console.log('  ⚠ Token expirando em breve! Execute: meta-ads auth setup para renovar');
        }
      }
    } catch (error) {
      logger.error(error, 'Auth status check failed');
      console.error('✗ Erro ao verificar status da autenticação.');
      process.exitCode = 1;
    }
  });
