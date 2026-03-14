import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { URL } from 'node:url';
import { randomBytes } from 'node:crypto';
import { exec } from 'node:child_process';
import { logger } from '../cli/logger.js';
import { AuthError } from '../errors/types.js';
import type { TokenInfo, OAuthCallbackResult } from '../types/auth.js';

const META_API_VERSION = 'v21.0';
const AUTH_TIMEOUT_MS = 300_000;

export function buildAuthorizationUrl(
  appId: string,
  redirectUri: string,
  state: string,
): string {
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: 'ads_management,ads_read,pages_read_engagement,pages_show_list,instagram_business_basic',
    response_type: 'code',
    state,
  });
  return `https://www.facebook.com/${META_API_VERSION}/dialog/oauth?${params.toString()}`;
}

async function exchangeCodeForToken(
  code: string,
  appId: string,
  appSecret: string,
  redirectUri: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    client_secret: appSecret,
    code,
  });
  const url = `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?${params.toString()}`;

  const response = await fetch(url);
  const data = (await response.json()) as Record<string, unknown>;

  if (!response.ok || data['error']) {
    const error = data['error'] as Record<string, string> | undefined;
    throw new AuthError(
      error?.['message'] ?? 'Falha ao trocar código por token.',
      'Verifique App ID e App Secret no developers.facebook.com',
    );
  }

  return {
    accessToken: data['access_token'] as string,
    expiresIn: (data['expires_in'] as number) ?? 3600,
  };
}

async function exchangeForLongLivedToken(
  shortToken: string,
  appId: string,
  appSecret: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortToken,
  });
  const url = `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?${params.toString()}`;

  const response = await fetch(url);
  const data = (await response.json()) as Record<string, unknown>;

  if (!response.ok || data['error']) {
    const error = data['error'] as Record<string, string> | undefined;
    throw new AuthError(
      error?.['message'] ?? 'Falha ao obter token de longa duração.',
      'Tente novamente o fluxo de autenticação.',
    );
  }

  return {
    accessToken: data['access_token'] as string,
    expiresIn: (data['expires_in'] as number) ?? 5_184_000,
  };
}

function waitForCallback(
  port: number,
  expectedState: string,
): Promise<OAuthCallbackResult> {
  return new Promise((resolve, reject) => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url ?? '/', `http://localhost:${port}`);

      if (url.pathname !== '/callback') {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Autorização negada</h1><p>Você pode fechar esta janela.</p>');
        clearTimeout(timeout);
        server.close();
        reject(new AuthError(
          `Autorização negada: ${error}`,
          'Tente novamente e aceite as permissões.',
        ));
        return;
      }

      if (!code || state !== expectedState) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Erro</h1><p>Código inválido.</p>');
        clearTimeout(timeout);
        server.close();
        reject(new AuthError(
          'Código de autorização inválido.',
          'Tente novamente.',
        ));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>✓ Autorização concluída!</h1><p>Pode fechar esta janela e voltar ao terminal.</p>');

      clearTimeout(timeout);
      server.close();
      resolve({ code, state });
    });

    const timeout = setTimeout(() => {
      server.close();
      reject(new AuthError(
        'Tempo esgotado aguardando autorização.',
        'Tente novamente.',
      ));
    }, AUTH_TIMEOUT_MS);

    server.listen(port, '127.0.0.1', () => {
      logger.debug(`OAuth callback server listening on http://127.0.0.1:${port}`);
    });
  });
}

function openBrowser(url: string): void {
  exec(`open "${url}"`);
}

export async function startAuthFlow(
  appId: string,
  appSecret: string,
  callbackPort: number = 3000,
): Promise<TokenInfo> {
  const state = randomBytes(16).toString('hex');
  const redirectUri = `http://localhost:${callbackPort}/callback`;

  const authUrl = buildAuthorizationUrl(appId, redirectUri, state);

  logger.info('Abrindo navegador para autorização...');
  openBrowser(authUrl);

  const callbackPromise = waitForCallback(callbackPort, state);

  const { code } = await callbackPromise;
  logger.info('Código recebido. Trocando por token...');

  const shortToken = await exchangeCodeForToken(code, appId, appSecret, redirectUri);
  logger.info('Token de curta duração obtido. Convertendo para longa duração...');

  const longToken = await exchangeForLongLivedToken(shortToken.accessToken, appId, appSecret);

  const expiresAt = new Date(Date.now() + longToken.expiresIn * 1000);

  logger.info('Token de longa duração obtido com sucesso.');

  return {
    accessToken: longToken.accessToken,
    expiresAt,
    appId,
  };
}
