import type { CampaignType } from '../types/campaign.js';

const TYPE_MAP: Record<CampaignType, string> = {
  sales: 'VENDAS',
  leads: 'LEADS',
  awareness: 'RECONHECIMENTO',
  traffic: 'TRAFEGO',
  engagement: 'ENGAJAMENTO',
  whatsapp: 'WHATSAPP',
  leadform: 'LEADFORM',
  app: 'APP',
};

const EVENT_MAP: Record<CampaignType, string> = {
  sales: 'COMPRA',
  leads: 'LP',
  awareness: 'ALCANCE',
  traffic: 'LP',
  engagement: 'ENGAJAMENTO',
  whatsapp: 'CONVERSA',
  leadform: 'FORMULARIO',
  app: 'INSTALL',
};

function stripAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function sanitizeName(name: string): string {
  const stripped = stripAccents(name);
  return stripped
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}

export function generateCampaignName(
  type: CampaignType,
  name: string,
  date: Date = new Date(),
): string {
  const typeLabel = TYPE_MAP[type];
  const eventLabel = EVENT_MAP[type];
  const dateStr = formatDate(date);
  const safeName = sanitizeName(name);
  return `PPT_${typeLabel}_${eventLabel}_${dateStr}_${safeName}`;
}
