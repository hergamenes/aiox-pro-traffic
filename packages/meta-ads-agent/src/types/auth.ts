import { z } from 'zod';

export interface AuthStatus {
  authenticated: boolean;
  expiresAt: Date | null;
  daysRemaining: number | null;
  tokenPreview: string | null;
}

export interface TokenInfo {
  accessToken: string;
  expiresAt: Date;
  appId: string;
}

export interface OAuthCallbackResult {
  code: string;
  state: string;
}

export const tokenDataSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.string().datetime(),
  appId: z.string().min(1),
});

export type TokenData = z.infer<typeof tokenDataSchema>;
