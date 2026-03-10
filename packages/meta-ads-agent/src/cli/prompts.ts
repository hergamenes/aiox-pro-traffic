import { input, select, number } from '@inquirer/prompts';
import type { CampaignType } from '../types/campaign.js';

export async function promptCampaignType(): Promise<CampaignType> {
  return select({
    message: 'Tipo de campanha:',
    choices: [
      { name: 'Vendas (Purchase/Compra)', value: 'sales' as CampaignType },
      { name: 'Leads (Landing Page)', value: 'leads' as CampaignType },
    ],
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
