import type { CampaignType } from '../types/campaign.js';

/**
 * Qual campo de URL da CampaignConfig este objetivo exige como destino.
 * - `websiteUrl`: campanha aponta para um site/produto
 * - `landingPageUrl`: campanha aponta para uma landing page
 * - `none`: objetivo sem destino de link obrigatório (ex.: WhatsApp, Lead Form nativo)
 */
export type UrlField = 'websiteUrl' | 'landingPageUrl' | 'none';

/**
 * Especificação de um objetivo de campanha da Meta (ODAX).
 *
 * A Meta exige combinações específicas de objective × optimization_goal ×
 * billing_event × destination_type. Centralizar aqui evita combinações
 * inválidas espalhadas pelo código e documenta o "porquê" de cada escolha.
 */
export interface ObjectiveSpec {
  /** Objetivo ODAX enviado à Graph API (campo `objective` da campaign). */
  objective: string;
  /** Meta de otimização padrão do ad set (`optimization_goal`). */
  optimizationGoal: string;
  /** Evento de cobrança (`billing_event`). */
  billingEvent: string;
  /** Destino do ad set, quando aplicável (`destination_type`). */
  destinationType?: string;
  /** Call to action padrão do criativo, quando não informado. */
  ctaDefault: string;
  /** Campo de URL que a config exige para este objetivo. */
  urlField: UrlField;
  /** Rótulo amigável em pt-BR para exibição na CLI. */
  label: string;
}

/**
 * Registry central de objetivos suportados pela CLI.
 *
 * Suporta 8 objetivos: vendas, leads, reconhecimento, tráfego, engajamento,
 * WhatsApp (Click-to-WhatsApp), Lead Ads (formulário nativo) e promoção de app.
 */
export const OBJECTIVE_SPECS: Record<CampaignType, ObjectiveSpec> = {
  sales: {
    objective: 'OUTCOME_SALES',
    optimizationGoal: 'OFFSITE_CONVERSIONS',
    billingEvent: 'IMPRESSIONS',
    ctaDefault: 'SHOP_NOW',
    urlField: 'websiteUrl',
    label: 'Vendas',
  },
  leads: {
    objective: 'OUTCOME_LEADS',
    optimizationGoal: 'LANDING_PAGE_VIEWS',
    billingEvent: 'IMPRESSIONS',
    destinationType: 'WEBSITE',
    ctaDefault: 'LEARN_MORE',
    urlField: 'landingPageUrl',
    label: 'Leads (Landing Page)',
  },
  awareness: {
    objective: 'OUTCOME_AWARENESS',
    optimizationGoal: 'REACH',
    billingEvent: 'IMPRESSIONS',
    ctaDefault: 'LEARN_MORE',
    urlField: 'websiteUrl',
    label: 'Reconhecimento',
  },
  traffic: {
    objective: 'OUTCOME_TRAFFIC',
    optimizationGoal: 'LANDING_PAGE_VIEWS',
    billingEvent: 'IMPRESSIONS',
    destinationType: 'WEBSITE',
    ctaDefault: 'LEARN_MORE',
    urlField: 'websiteUrl',
    label: 'Tráfego',
  },
  engagement: {
    objective: 'OUTCOME_ENGAGEMENT',
    optimizationGoal: 'POST_ENGAGEMENT',
    billingEvent: 'IMPRESSIONS',
    ctaDefault: 'LEARN_MORE',
    urlField: 'websiteUrl',
    label: 'Engajamento',
  },
  whatsapp: {
    objective: 'OUTCOME_ENGAGEMENT',
    optimizationGoal: 'CONVERSATIONS',
    billingEvent: 'IMPRESSIONS',
    destinationType: 'WHATSAPP',
    ctaDefault: 'WHATSAPP_MESSAGE',
    urlField: 'none',
    label: 'WhatsApp (Click-to-WhatsApp)',
  },
  leadform: {
    objective: 'OUTCOME_LEADS',
    optimizationGoal: 'LEAD_GENERATION',
    billingEvent: 'IMPRESSIONS',
    destinationType: 'ON_AD',
    ctaDefault: 'SIGN_UP',
    urlField: 'none',
    label: 'Lead Ads (Formulário Nativo)',
  },
  app: {
    objective: 'OUTCOME_APP_PROMOTION',
    optimizationGoal: 'APP_INSTALLS',
    billingEvent: 'IMPRESSIONS',
    ctaDefault: 'INSTALL_MOBILE_APP',
    urlField: 'none',
    label: 'Promoção de App',
  },
};

/** Lista de tipos de campanha suportados (derivada do registry). */
export const SUPPORTED_TYPES = Object.keys(OBJECTIVE_SPECS) as CampaignType[];
