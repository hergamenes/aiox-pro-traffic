import { z } from 'zod';

// Period and level types

export type InsightsPeriod = '7d' | '14d' | '30d' | 'custom';
export type InsightsLevel = 'account' | 'campaign' | 'adset' | 'ad';

// Filter types

export interface InsightsFilter {
  campaignId?: string;
  tag?: string;
}

// Params

export interface InsightsParams {
  adAccountId: string;
  period: InsightsPeriod;
  from?: string;
  to?: string;
  level: InsightsLevel;
  filter?: InsightsFilter;
}

// Raw API response shapes

export interface RawAction {
  action_type: string;
  value: string;
}

export interface RawCostPerAction {
  action_type: string;
  value: string;
}

export interface RawWebsiteCtr {
  action_type: string;
  value: string;
}

export interface RawPurchaseRoas {
  action_type: string;
  value: string;
}

export interface RawInsightRow {
  spend: string;
  impressions: string;
  cpm: string;
  frequency: string;
  actions?: RawAction[];
  cost_per_action_type?: RawCostPerAction[];
  website_ctr?: RawWebsiteCtr[];
  purchase_roas?: RawPurchaseRoas[];
  campaign_name?: string;
  campaign_id?: string;
  adset_name?: string;
  adset_id?: string;
  ad_name?: string;
  ad_id?: string;
}

// Parsed metrics (all 22)

export interface ParsedMetrics {
  // Identity (varies by level)
  campaignName?: string;
  campaignId?: string;
  adsetName?: string;
  adsetId?: string;
  adName?: string;
  adId?: string;

  // 1-5: Direct fields
  spend: number;
  budget: number | null;
  impressions: number;
  cpm: number;
  frequency: number;

  // 6-8: Clicks
  linkClicks: number;
  cpcLink: number;
  ctrLink: number;

  // 9-11: Landing page
  landingPageViews: number;
  costPerLandingPageView: number;
  landingPageViewRate: number;

  // 12-13: Conversions (general)
  conversions: number;
  costPerConversion: number;

  // 14-15: Initiate checkout
  initiateCheckout: number;
  costPerInitiateCheckout: number;

  // 16-17: Purchases
  purchases: number;
  costPerPurchase: number;

  // 18: ROAS
  roas: number;

  // 19-20: Leads
  leads: number;
  costPerLead: number;

  // 21-22: Calculated rates
  purchaseRateByClicks: number;
  purchaseRateByLandingPageViews: number;

  // 23-26: Messaging (Click-to-WhatsApp / messages)
  messagingConversationsStarted: number;
  costPerMessagingConversation: number;
  messagingFirstReplies: number;
  totalMessagingConnections: number;

  // 27-28: Result (campaign objective — resolved via fallback hierarchy)
  results: number;
  costPerResult: number;
}

// Budget info (from adsets endpoint)

export interface BudgetInfo {
  adsetName: string;
  dailyBudget: number | null;
  lifetimeBudget: number | null;
  campaignId: string;
}

// Action type constants

export const ACTION_TYPES = {
  LINK_CLICK: 'link_click',
  LANDING_PAGE_VIEW: 'landing_page_view',
  INITIATE_CHECKOUT: 'offsite_conversion.fb_pixel_initiate_checkout',
  PURCHASE: 'offsite_conversion.fb_pixel_purchase',
  // Leads: Meta reports the same lead under several action types depending on the
  // source. LEAD is the aggregate Meta exposes ('lead'); the specific sources
  // (native instant form, website pixel) are below. The parser resolves leads by
  // preference WITHOUT summing (the aggregate already includes the specifics) —
  // see extractLeads in insights-parser.
  LEAD: 'lead',
  LEAD_FORM_GROUPED: 'onsite_conversion.lead_grouped',
  LEAD_PIXEL: 'offsite_conversion.fb_pixel_lead',
  // Prefix (no attribution-window suffix): matched via startsWith so it works
  // regardless of the account's window (_7d, _1d, or none). See insights-parser.
  MESSAGING_CONVERSATION_STARTED: 'onsite_conversion.messaging_conversation_started',
  MESSAGING_FIRST_REPLY: 'onsite_conversion.messaging_first_reply',
  TOTAL_MESSAGING_CONNECTION: 'onsite_conversion.total_messaging_connection',
} as const;

export const ACTION_TYPE_LABELS: Record<string, string> = {
  [ACTION_TYPES.LINK_CLICK]: 'Cliques no Link',
  [ACTION_TYPES.LANDING_PAGE_VIEW]: 'Visualizações da Página de Destino',
  [ACTION_TYPES.INITIATE_CHECKOUT]: 'Finalizações de Compra',
  [ACTION_TYPES.PURCHASE]: 'Compras',
  [ACTION_TYPES.LEAD]: 'Leads',
  [ACTION_TYPES.MESSAGING_CONVERSATION_STARTED]: 'Conversas Iniciadas (WhatsApp)',
  [ACTION_TYPES.MESSAGING_FIRST_REPLY]: 'Primeiras Respostas',
  [ACTION_TYPES.TOTAL_MESSAGING_CONNECTION]: 'Conexões de Mensagem',
};

// Zod schemas

const rawActionSchema = z.object({
  action_type: z.string(),
  value: z.string(),
});

export const rawInsightRowSchema = z.object({
  spend: z.string().default('0'),
  impressions: z.string().default('0'),
  cpm: z.string().default('0'),
  frequency: z.string().default('0'),
  actions: z.array(rawActionSchema).optional(),
  cost_per_action_type: z.array(rawActionSchema).optional(),
  website_ctr: z.array(rawActionSchema).optional(),
  purchase_roas: z.array(rawActionSchema).optional(),
  campaign_name: z.string().optional(),
  campaign_id: z.string().optional(),
  adset_name: z.string().optional(),
  adset_id: z.string().optional(),
  ad_name: z.string().optional(),
  ad_id: z.string().optional(),
});

export const insightsParamsSchema = z.object({
  adAccountId: z.string().min(1),
  period: z.enum(['7d', '14d', '30d', 'custom']).default('7d'),
  from: z.string().optional(),
  to: z.string().optional(),
  level: z.enum(['account', 'campaign', 'adset', 'ad']).default('campaign'),
  filter: z.object({
    campaignId: z.string().optional(),
    tag: z.string().optional(),
  }).optional(),
});
