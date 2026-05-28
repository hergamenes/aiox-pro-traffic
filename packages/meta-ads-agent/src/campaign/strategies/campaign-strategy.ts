export interface CampaignStrategy {
  getCampaignParams(options?: CampaignOptions): Record<string, unknown>;
  getAdSetParams(options: AdSetOptions): Record<string, unknown>;
  getAdParams(options: AdOptions): Record<string, unknown>;
}

export interface CampaignOptions {
  cboEnabled?: boolean;
  dailyBudget?: number;
}

export interface AdSetOptions {
  campaignId: string;
  dailyBudget: number;
  pixelId: string | null;
  cboEnabled?: boolean;
  ageMin?: number;
  startTime?: number;
  /** ID da página — necessário para promoted_object (ex.: Click-to-WhatsApp, Lead Ads). */
  pageId?: string;
  /** ID do aplicativo — promoted_object de Promoção de App. */
  applicationId?: string | null;
  /** URL da loja — promoted_object de Promoção de App. */
  objectStoreUrl?: string | null;
}

export interface AdOptions {
  adSetId: string;
  pageId: string;
  instagramAccountId: string | null;
  imageHash: string | null;
  videoId: string | null;
  videoThumbnailUrl?: string | null;
  storiesImageHash?: string | null;
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
  websiteUrl: string;
  name: string;
  urlTags?: string;
  /** Número de WhatsApp (dígitos com DDI) para criativos Click-to-WhatsApp. */
  whatsappNumber?: string | null;
  /** ID do formulário de Lead Ads associado ao criativo. */
  leadFormId?: string | null;
  /** URL da loja do app — usada como link do criativo de Promoção de App. */
  objectStoreUrl?: string | null;
}
