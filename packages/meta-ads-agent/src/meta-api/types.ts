import { z } from 'zod';

export interface AdAccount {
  accountId: string;
  name: string;
  status: number;
  statusLabel: string;
  currency: string;
  timezone: string;
}

export interface Page {
  id: string;
  name: string;
  category: string;
  instagramAccountId: string | null;
}

export interface InstagramAccount {
  id: string;
  name: string;
  username: string;
}

export const ACCOUNT_STATUS_LABELS: Record<number, string> = {
  1: 'Ativa',
  2: 'Desativada',
  3: 'Não publicada',
  7: 'Em análise',
  9: 'Em período de carência',
  100: 'Suspensa',
  101: 'Fechada',
  201: 'Qualquer atividade encerrada',
};

export function getStatusLabel(status: number): string {
  return ACCOUNT_STATUS_LABELS[status] ?? `Desconhecido (${status})`;
}

export const adAccountResponseSchema = z.object({
  account_id: z.string(),
  name: z.string(),
  account_status: z.number(),
  currency: z.string().optional().default('BRL'),
  timezone_name: z.string().optional().default(''),
});

export const pageResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional().default(''),
  instagram_business_account: z
    .object({ id: z.string() })
    .nullable()
    .optional()
    .default(null),
});

export const instagramResponseSchema = z.object({
  id: z.string(),
  name: z.string().optional().default(''),
  username: z.string().optional().default(''),
});
