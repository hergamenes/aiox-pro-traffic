import type {
  RawInsightRow,
  RawAction,
  RawCostPerAction,
  RawWebsiteCtr,
  RawPurchaseRoas,
  ParsedMetrics,
} from '../types/insights.js';
import { ACTION_TYPES } from '../types/insights.js';

export function extractAction(actions: RawAction[] | undefined, actionType: string): number {
  if (!actions) return 0;
  const found = actions.find((a) => a.action_type === actionType);
  return found ? parseFloat(found.value) || 0 : 0;
}

export function extractCostPerAction(
  costPerActions: RawCostPerAction[] | undefined,
  actionType: string,
): number {
  if (!costPerActions) return 0;
  const found = costPerActions.find((a) => a.action_type === actionType);
  return found ? parseFloat(found.value) || 0 : 0;
}

function extractWebsiteCtr(websiteCtr: RawWebsiteCtr[] | undefined, actionType: string): number {
  if (!websiteCtr) return 0;
  const found = websiteCtr.find((a) => a.action_type === actionType);
  return found ? parseFloat(found.value) || 0 : 0;
}

function extractPurchaseRoas(purchaseRoas: RawPurchaseRoas[] | undefined, actionType: string): number {
  if (!purchaseRoas) return 0;
  const found = purchaseRoas.find((a) => a.action_type === actionType);
  return found ? parseFloat(found.value) || 0 : 0;
}

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

function sumConversions(actions: RawAction[] | undefined): number {
  if (!actions) return 0;
  return actions
    .filter((a) => a.action_type.startsWith('offsite_conversion.'))
    .reduce((sum, a) => sum + (parseFloat(a.value) || 0), 0);
}

function sumConversionCosts(costPerActions: RawCostPerAction[] | undefined): number {
  if (!costPerActions) return 0;
  const conversions = costPerActions.filter((a) =>
    a.action_type.startsWith('offsite_conversion.'),
  );
  if (conversions.length === 0) return 0;
  // Return average cost across all conversion types
  const total = conversions.reduce((sum, a) => sum + (parseFloat(a.value) || 0), 0);
  return total / conversions.length;
}

export function parseInsightRow(raw: RawInsightRow): ParsedMetrics {
  const linkClicks = extractAction(raw.actions, ACTION_TYPES.LINK_CLICK);
  const landingPageViews = extractAction(raw.actions, ACTION_TYPES.LANDING_PAGE_VIEW);
  const purchases = extractAction(raw.actions, ACTION_TYPES.PURCHASE);

  return {
    // Identity
    campaignName: raw.campaign_name,
    campaignId: raw.campaign_id,
    adsetName: raw.adset_name,
    adsetId: raw.adset_id,
    adName: raw.ad_name,
    adId: raw.ad_id,

    // 1-5: Direct
    spend: parseFloat(raw.spend) || 0,
    budget: null, // Populated separately from adsets endpoint
    impressions: parseInt(raw.impressions, 10) || 0,
    cpm: parseFloat(raw.cpm) || 0,
    frequency: parseFloat(raw.frequency) || 0,

    // 6-8: Clicks
    linkClicks,
    cpcLink: extractCostPerAction(raw.cost_per_action_type, ACTION_TYPES.LINK_CLICK),
    ctrLink: extractWebsiteCtr(raw.website_ctr, ACTION_TYPES.LINK_CLICK),

    // 9-11: Landing page
    landingPageViews,
    costPerLandingPageView: extractCostPerAction(
      raw.cost_per_action_type,
      ACTION_TYPES.LANDING_PAGE_VIEW,
    ),
    landingPageViewRate: safeDivide(landingPageViews, linkClicks),

    // 12-13: Conversions (all offsite_conversion.* summed)
    conversions: sumConversions(raw.actions),
    costPerConversion: sumConversionCosts(raw.cost_per_action_type),

    // 14-15: Initiate checkout
    initiateCheckout: extractAction(raw.actions, ACTION_TYPES.INITIATE_CHECKOUT),
    costPerInitiateCheckout: extractCostPerAction(
      raw.cost_per_action_type,
      ACTION_TYPES.INITIATE_CHECKOUT,
    ),

    // 16-17: Purchases
    purchases,
    costPerPurchase: extractCostPerAction(raw.cost_per_action_type, ACTION_TYPES.PURCHASE),

    // 18: ROAS
    roas: extractPurchaseRoas(raw.purchase_roas, ACTION_TYPES.PURCHASE),

    // 19-20: Leads
    leads: extractAction(raw.actions, ACTION_TYPES.LEAD),
    costPerLead: extractCostPerAction(raw.cost_per_action_type, ACTION_TYPES.LEAD),

    // 21-22: Calculated rates
    purchaseRateByClicks: safeDivide(purchases, linkClicks),
    purchaseRateByLandingPageViews: safeDivide(purchases, landingPageViews),
  };
}
