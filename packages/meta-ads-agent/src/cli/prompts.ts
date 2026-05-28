import { input, select, number } from '@inquirer/prompts';
import type { CampaignType } from '../types/campaign.js';
import { OBJECTIVE_SPECS, SUPPORTED_TYPES } from '../campaign/objectives.js';

export async function promptCampaignType(): Promise<CampaignType> {
  return select({
    message: 'Tipo de campanha:',
    choices: SUPPORTED_TYPES.map((type) => ({
      name: OBJECTIVE_SPECS[type].label,
      value: type,
    })),
  });
}

export async function promptAdName(): Promise<string> {
  return input({
    message: 'Nome do anúncio:',
    validate: (v) => (v.trim().length > 0 ? true : 'Nome é obrigatório'),
  });
}

export async function promptBudget(): Promise<number> {
  const value = await number({
    message: 'Orçamento diário (R$):',
    validate: (v) => {
      if (v === undefined || v === null || isNaN(v)) return 'Informe um número válido';
      if (v <= 0) return 'Orçamento deve ser maior que zero';
      return true;
    },
  });
  return value!;
}

export async function promptWebsiteUrl(): Promise<string> {
  return input({
    message: 'URL do site:',
    validate: (v) => (v.trim().length > 0 ? true : 'URL é obrigatória'),
  });
}

export async function promptLandingPageUrl(): Promise<string> {
  return input({
    message: 'URL da landing page:',
    validate: (v) => (v.trim().length > 0 ? true : 'URL é obrigatória'),
  });
}

/** Coleta o número de WhatsApp (somente dígitos com DDI, ex.: 5511999998888). */
export async function promptWhatsappNumber(): Promise<string> {
  const raw = await input({
    message: 'Número de WhatsApp (com DDI, ex.: 5511999998888):',
    validate: (v) => (/^\d{10,15}$/.test(v.replace(/\D/g, '')) ? true : 'Informe só dígitos com DDI (10 a 15 números)'),
  });
  return raw.replace(/\D/g, '');
}

/** Coleta a URL da política de privacidade (Lead Ads). */
export async function promptPrivacyUrl(): Promise<string> {
  return input({
    message: 'URL da política de privacidade:',
    validate: (v) => (v.trim().length > 0 ? true : 'URL é obrigatória'),
  });
}

/** Coleta o ID do aplicativo (Promoção de App). */
export async function promptAppId(): Promise<string> {
  return input({
    message: 'ID do aplicativo:',
    validate: (v) => (v.trim().length > 0 ? true : 'ID do aplicativo é obrigatório'),
  });
}

/** Coleta a URL da loja do app (App Store/Google Play). */
export async function promptStoreUrl(): Promise<string> {
  return input({
    message: 'URL da loja (App Store/Google Play):',
    validate: (v) => (v.trim().length > 0 ? true : 'URL da loja é obrigatória'),
  });
}

export interface AdTextsResult {
  headline: string;
  primaryText: string;
  description: string;
}

export async function promptAdTexts(): Promise<AdTextsResult> {
  const headline = await input({
    message: 'Título do anúncio:',
    validate: (v) => (v.trim().length > 0 ? true : 'Título é obrigatório'),
  });
  const primaryText = await input({
    message: 'Texto principal:',
    validate: (v) => (v.trim().length > 0 ? true : 'Texto principal é obrigatório'),
  });
  const description = await input({
    message: 'Descrição:',
    validate: (v) => (v.trim().length > 0 ? true : 'Descrição é obrigatória'),
  });
  return { headline, primaryText, description };
}
