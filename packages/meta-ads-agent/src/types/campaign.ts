import { z } from 'zod';

export type CampaignType = 'sales' | 'leads';

export interface AdText {
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
}

export interface CampaignConfig {
  type: CampaignType;
  name: string;
  dailyBudget: number;
  adText: AdText;
  pageId: string;
  instagramAccountId: string | null;
  adAccountId: string;
  websiteUrl: string | null;
  landingPageUrl: string | null;
  pixelId: string | null;
}

export interface CampaignResult {
  campaignId: string;
  campaignName: string;
  adSetId: string;
  adId: string;
  type: CampaignType;
  dailyBudget: number;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  creativeFormat: string;
  adsManagerUrl: string;
  createdAt: Date;
}

export const adTextSchema = z.object({
  headline: z.string().min(1, 'Título é obrigatório'),
  primaryText: z.string().min(1, 'Texto principal é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  callToAction: z.string().min(1, 'Call to action é obrigatório'),
});

export const campaignConfigSchema = z.object({
  type: z.enum(['sales', 'leads']),
  name: z.string().min(1, 'Nome do anúncio é obrigatório'),
  dailyBudget: z.number().positive('Orçamento diário deve ser maior que zero'),
  adText: adTextSchema,
  pageId: z.string().min(1, 'Page ID é obrigatório'),
  instagramAccountId: z.string().nullable(),
  adAccountId: z.string().min(1, 'Ad Account ID é obrigatório'),
  websiteUrl: z.string().url('URL do site inválida').nullable(),
  landingPageUrl: z.string().url('URL da landing page inválida').nullable(),
  pixelId: z.string().nullable(),
}).refine(
  (data) => {
    if (data.type === 'sales') return data.websiteUrl !== null;
    return true;
  },
  { message: 'URL do site é obrigatória para campanhas de vendas', path: ['websiteUrl'] },
).refine(
  (data) => {
    if (data.type === 'leads') return data.landingPageUrl !== null;
    return true;
  },
  { message: 'URL da landing page é obrigatória para campanhas de leads', path: ['landingPageUrl'] },
);

export const campaignResultSchema = z.object({
  campaignId: z.string(),
  campaignName: z.string(),
  adSetId: z.string(),
  adId: z.string(),
  type: z.enum(['sales', 'leads']),
  dailyBudget: z.number(),
  status: z.enum(['ACTIVE', 'PAUSED', 'ERROR']),
  creativeFormat: z.string(),
  adsManagerUrl: z.string(),
  createdAt: z.date(),
});
