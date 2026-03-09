import { z } from 'zod';

export interface AppConfig {
  version: number;
  defaults: {
    adAccountId: string | null;
    pageId: string | null;
    instagramAccountId: string | null;
  };
  creativesPath: string;
  logPath: string;
  app: {
    appId: string;
    callbackPort: number;
  };
}

export const appConfigSchema = z.object({
  version: z.number().default(1),
  defaults: z
    .object({
      adAccountId: z.string().nullable().default(null),
      pageId: z.string().nullable().default(null),
      instagramAccountId: z.string().nullable().default(null),
    })
    .default({}),
  creativesPath: z.string().default('~/Downloads/criativos-meta/'),
  logPath: z.string().default('~/.meta-ads/campaigns.log'),
  app: z
    .object({
      appId: z.string().default(''),
      callbackPort: z.number().default(3000),
    })
    .default({}),
});
