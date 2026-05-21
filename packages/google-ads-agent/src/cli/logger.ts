import pino from 'pino';

const isProduction = process.env['NODE_ENV'] === 'production';
const forceDebug = process.env['GOOGLE_ADS_DEBUG'] === '1' || process.env['GOOGLE_ADS_DEBUG'] === 'true';

const level = forceDebug ? 'debug' : isProduction ? 'info' : 'debug';

const transport = isProduction
  ? undefined
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
      },
    };

export const logger = pino({
  level,
  redact: [
    'developerToken',
    'clientSecret',
    'refreshToken',
    'accessToken',
    'token',
    'headers.authorization',
    '*.developer_token',
    '*.client_secret',
    '*.refresh_token',
    '*.access_token',
  ],
  ...(transport ? { transport } : {}),
});
