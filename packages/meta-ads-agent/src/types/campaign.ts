import { z } from 'zod';

export type CampaignType =
  | 'sales'
  | 'leads'
  | 'awareness'
  | 'traffic'
  | 'engagement'
  | 'whatsapp'
  | 'leadform'
  | 'app';

/** Plataforma de veiculação (placements). `all` deixa a Meta decidir (Advantage+). */
export type Platform = 'instagram' | 'facebook' | 'all';

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
  /** Image hash from Media Library (skips upload) */
  imageHash?: string | null;
  /** Video ID from Media Library (skips upload) */
  videoId?: string | null;
  /** Image hash for Stories placement (1080x1920) */
  storiesImageHash?: string | null;
  /** Enable Campaign Budget Optimization (Advantage budget) */
  cboEnabled?: boolean;
  /** Minimum age for targeting */
  ageMin?: number;
  /** Ad set start time (Unix timestamp) */
  startTime?: number;
  /** URL tracking tags appended to all links */
  urlTags?: string;
  /** Custom ad set name override */
  adSetName?: string;
  /** Custom ad name override */
  adName?: string;
  /** Plataforma de veiculação (placements). Omitido = automático (Advantage+). */
  platform?: Platform;
  /** Número de WhatsApp (somente dígitos, com DDI) para campanhas Click-to-WhatsApp. */
  whatsappNumber?: string | null;
  /** ID de um formulário de Lead Ads já existente (pula a criação automática). */
  leadFormId?: string | null;
  /** URL da política de privacidade — obrigatória para criar formulário de Lead Ads. */
  leadFormPrivacyUrl?: string | null;
  /** ID do aplicativo (Facebook App) — campanhas de Promoção de App. */
  applicationId?: string | null;
  /** URL da loja (App Store/Google Play) — campanhas de Promoção de App. */
  objectStoreUrl?: string | null;
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

/** Objetivos cujo destino é uma URL de site (campo websiteUrl). */
const WEBSITE_URL_TYPES: CampaignType[] = ['sales', 'awareness', 'traffic', 'engagement'];

export const campaignConfigSchema = z.object({
  type: z.enum(['sales', 'leads', 'awareness', 'traffic', 'engagement', 'whatsapp', 'leadform', 'app']),
  name: z.string().min(1, 'Nome do anúncio é obrigatório'),
  dailyBudget: z.number().positive('Orçamento diário deve ser maior que zero'),
  adText: adTextSchema,
  pageId: z.string().min(1, 'Page ID é obrigatório'),
  instagramAccountId: z.string().nullable(),
  adAccountId: z.string().min(1, 'Ad Account ID é obrigatório'),
  websiteUrl: z.string().url('URL do site inválida').nullable(),
  landingPageUrl: z.string().url('URL da landing page inválida').nullable(),
  pixelId: z.string().nullable(),
  platform: z.enum(['instagram', 'facebook', 'all']).optional(),
  whatsappNumber: z.string().regex(/^\d{10,15}$/, 'Número de WhatsApp inválido (use só dígitos com DDI, ex: 5511999998888)').nullable().optional(),
  leadFormId: z.string().nullable().optional(),
  leadFormPrivacyUrl: z.string().url('URL da política de privacidade inválida').nullable().optional(),
  applicationId: z.string().nullable().optional(),
  objectStoreUrl: z.string().url('URL da loja inválida').nullable().optional(),
}).refine(
  (data) => {
    if (WEBSITE_URL_TYPES.includes(data.type)) return data.websiteUrl !== null;
    return true;
  },
  { message: 'URL do site é obrigatória para este tipo de campanha', path: ['websiteUrl'] },
).refine(
  (data) => {
    if (data.type === 'leads') return data.landingPageUrl !== null;
    return true;
  },
  { message: 'URL da landing page é obrigatória para campanhas de leads', path: ['landingPageUrl'] },
).refine(
  (data) => {
    if (data.type === 'whatsapp') return data.whatsappNumber != null && data.whatsappNumber !== '';
    return true;
  },
  { message: 'Número de WhatsApp é obrigatório para campanhas Click-to-WhatsApp', path: ['whatsappNumber'] },
).refine(
  (data) => {
    // Lead Ads: precisa de um formulário existente OU dados para criar um novo (URL de privacidade).
    if (data.type === 'leadform') return (data.leadFormId != null && data.leadFormId !== '') || (data.leadFormPrivacyUrl != null && data.leadFormPrivacyUrl !== '');
    return true;
  },
  { message: 'Lead Ads exige um formulário existente (leadFormId) ou a URL da política de privacidade para criar um', path: ['leadFormPrivacyUrl'] },
).refine(
  (data) => {
    if (data.type === 'app') return data.applicationId != null && data.applicationId !== '';
    return true;
  },
  { message: 'ID do aplicativo é obrigatório para campanhas de Promoção de App', path: ['applicationId'] },
).refine(
  (data) => {
    if (data.type === 'app') return data.objectStoreUrl != null && data.objectStoreUrl !== '';
    return true;
  },
  { message: 'URL da loja é obrigatória para campanhas de Promoção de App', path: ['objectStoreUrl'] },
);

export const campaignResultSchema = z.object({
  campaignId: z.string(),
  campaignName: z.string(),
  adSetId: z.string(),
  adId: z.string(),
  type: z.enum(['sales', 'leads', 'awareness', 'traffic', 'engagement', 'whatsapp', 'leadform', 'app']),
  dailyBudget: z.number(),
  status: z.enum(['ACTIVE', 'PAUSED', 'ERROR']),
  creativeFormat: z.string(),
  adsManagerUrl: z.string(),
  createdAt: z.date(),
});
