import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomBytes } from 'node:crypto';
import { URL } from 'node:url';
import { logger } from '../cli/logger.js';
import { AppError } from '../errors/types.js';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/adwords';
const DEFAULT_PORT = 8765;

export interface BuildAuthUrlInput {
  clientId: string;
  redirectUri: string;
  state: string;
}

export interface LoopbackResult {
  code: string;
  state: string;
}

export interface ExchangeCodeInput {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}

export interface ExchangeCodeResult {
  refreshToken: string;
  accessToken: string;
  expiresIn: number;
}

export function generateState(): string {
  return randomBytes(32).toString('hex');
}

export function getOAuthPort(): number {
  const fromEnv = process.env['GOOGLE_ADS_OAUTH_PORT'];
  if (!fromEnv) return DEFAULT_PORT;
  const parsed = Number.parseInt(fromEnv, 10);
  if (Number.isNaN(parsed) || parsed < 1 || parsed > 65535) {
    logger.warn({ value: fromEnv }, 'Invalid GOOGLE_ADS_OAUTH_PORT — falling back to default');
    return DEFAULT_PORT;
  }
  return parsed;
}

export function getRedirectUri(port: number = getOAuthPort()): string {
  return `http://localhost:${port}/oauth/callback`;
}

export function buildAuthUrl(input: BuildAuthUrlInput): string {
  const params = new URLSearchParams({
    client_id: input.clientId,
    redirect_uri: input.redirectUri,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    state: input.state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Starts a loopback HTTP server on the given port and waits for a
 * single OAuth callback to arrive. Resolves with the parsed code +
 * state. The server is closed before resolving.
 *
 * Timeouts after 5 minutes if no callback arrives.
 */
export function startLoopbackServer(options: {
  port: number;
  expectedState: string;
  timeoutMs?: number;
}): Promise<LoopbackResult> {
  const timeoutMs = options.timeoutMs ?? 5 * 60 * 1000;

  return new Promise((resolve, reject) => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      try {
        if (!req.url) {
          respondPlain(res, 400, 'Missing URL');
          return;
        }
        const url = new URL(req.url, `http://localhost:${options.port}`);
        if (url.pathname !== '/oauth/callback') {
          respondPlain(res, 404, 'Not found');
          return;
        }

        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');

        if (error) {
          respondPlain(res, 400, `OAuth error: ${error}`);
          cleanup();
          reject(new AppError('AUTH_INVALID', `OAuth provider returned error: ${error}`));
          return;
        }

        if (!code || !state) {
          respondPlain(res, 400, 'Missing code or state');
          return;
        }

        if (state !== options.expectedState) {
          respondPlain(res, 400, 'State mismatch (possible CSRF)');
          cleanup();
          reject(new AppError('AUTH_INVALID', 'State mismatch on OAuth callback'));
          return;
        }

        respondHtml(
          res,
          200,
          '<h1>✓ Autenticação concluída</h1><p>Você pode fechar esta aba e voltar ao terminal.</p>',
        );
        cleanup();
        resolve({ code, state });
      } catch (err) {
        respondPlain(res, 500, 'Internal error');
        cleanup();
        reject(err);
      }
    });

    const timer = setTimeout(() => {
      cleanup();
      reject(new AppError('AUTH_INVALID', 'OAuth callback timeout (5min sem resposta)'));
    }, timeoutMs);

    function cleanup(): void {
      clearTimeout(timer);
      server.close();
    }

    server.on('error', (err) => {
      cleanup();
      reject(err);
    });

    server.listen(options.port, '127.0.0.1', () => {
      logger.debug({ port: options.port }, 'OAuth loopback server listening');
    });
  });
}

export async function exchangeCodeForRefreshToken(
  input: ExchangeCodeInput,
): Promise<ExchangeCodeResult> {
  const body = new URLSearchParams({
    code: input.code,
    client_id: input.clientId,
    client_secret: input.clientSecret,
    redirect_uri: input.redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    logger.debug({ status: response.status, body: text }, 'Token exchange failed');
    throw new AppError(
      'AUTH_INVALID',
      `Falha ao trocar code por refresh_token (HTTP ${response.status})`,
      'Verifique client_id/client_secret e tente novamente.',
    );
  }

  const json = (await response.json()) as {
    refresh_token?: string;
    access_token?: string;
    expires_in?: number;
  };

  if (!json.refresh_token || !json.access_token) {
    throw new AppError(
      'AUTH_INVALID',
      'Resposta de token inválida: refresh_token ou access_token ausente',
      'Tente novamente com prompt=consent para forçar emissão de refresh_token.',
    );
  }

  return {
    refreshToken: json.refresh_token,
    accessToken: json.access_token,
    expiresIn: json.expires_in ?? 3600,
  };
}

function respondPlain(res: ServerResponse, status: number, text: string): void {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

function respondHtml(res: ServerResponse, status: number, html: string): void {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

export { SCOPE, GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL };
