import pino from 'pino';

const isProduction = process.env['NODE_ENV'] === 'production';
const forceDebug = process.env['META_ADS_DEBUG'] === '1' || process.env['META_ADS_DEBUG'] === 'true';

const level = forceDebug ? 'debug' : isProduction ? 'info' : 'debug';

const transport = isProduction
  ? undefined
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
        destination: 2,
      },
    };

export const logger = pino(
  {
    level,
    redact: [
      'accessToken',
      'appSecret',
      'token',
      'headers.authorization',
      '*.access_token',
      '*.app_secret',
    ],
    ...(transport ? { transport } : {}),
  },
  isProduction ? pino.destination(2) : undefined,
);
