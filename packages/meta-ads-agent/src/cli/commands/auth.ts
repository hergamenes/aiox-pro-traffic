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
