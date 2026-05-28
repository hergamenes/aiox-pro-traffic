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

// Prefix variants: match the first action_type that starts with `prefix`.
// Used for events whose name carries an attribution-window suffix (e.g.
// messaging_conversation_started_7d / _1d). We take the FIRST match rather
// than summing, because the same conversion attributed across multiple windows
// is overlapping, not additive — summing would double-count.
export function extractActionByPrefix(actions: RawAction[] | undefined, prefix: string): number {
  if (!actions) return 0;
  const found = actions.find((a) => a.action_type.startsWith(prefix));
  return found ? parseFloat(found.value) || 0 : 0;
}

export function extractCostByPrefix(
  costPerActions: RawCostPerAction[] | undefined,
  prefix: string,
): number {
  if (!costPerActions) return 0;
  const found = costPerActions.find((a) => a.action_type.startsWith(prefix));
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

interface ResultInputs {
  spend: number;
  purchases: number;
  costPerPurchase: number;
  leads: number;
  costPerLead: number;
  messagingConversationsStarted: number;
  costPerMessagingConversation: number;
  linkClicks: number;
  cpcLink: number;
}

// Resolves the campaign's primary "result" by outcome priority:
// purchases > leads > messaging conversations > link clicks.
// Mirrors how Meta reports a single "Result" column based on the optimization goal.
// NOTE: per row this matches the entity's objective. At the ACCOUNT level a mixed
// account (pixel + messaging) collapses to the highest-priority outcome present
// (e.g. purchases), so the aggregate "result" may not reflect messaging. Read
// campaign/adset level for objective-accurate results in mixed accounts.
function resolveResult(i: ResultInputs): { results: number; costPerResult: number } {
  if (i.purchases > 0) {
    return { results: i.purchases, costPerResult: i.costPerPurchase || safeDivide(i.spend, i.purchases) };
  }
  if (i.leads > 0) {
    return { results: i.leads, costPerResult: i.costPerLead || safeDivide(i.spend, i.leads) };
  }
  if (i.messagingConversationsStarted > 0) {
    return {
      results: i.messagingConversationsStarted,
      costPerResult:
        i.costPerMessagingConversation || safeDivide(i.spend, i.messagingConversationsStarted),
    };
  }
  if (i.linkClicks > 0) {
    return { results: i.linkClicks, costPerResult: i.cpcLink || safeDivide(i.spend, i.linkClicks) };
  }
  return { results: 0, costPerResult: 0 };
}

export function parseInsightRow(raw: RawInsightRow): ParsedMetrics {
  const spend = parseFloat(raw.spend) || 0;
  const linkClicks = extractAction(raw.actions, ACTION_TYPES.LINK_CLICK);
  const landingPageViews = extractAction(raw.actions, ACTION_TYPES.LANDING_PAGE_VIEW);
  const purchases = extractAction(raw.actions, ACTION_TYPES.PURCHASE);
  const leads = extractAction(raw.actions, ACTION_TYPES.LEAD);

  const cpcLink = extractCostPerAction(raw.cost_per_action_type, ACTION_TYPES.LINK_CLICK);
  const costPerPurchase = extractCostPerAction(raw.cost_per_action_type, ACTION_TYPES.PURCHASE);
  const costPerLead = extractCostPerAction(raw.cost_per_action_type, ACTION_TYPES.LEAD);

  // Messaging (Click-to-WhatsApp / messages objective).
  // Conversations carry an attribution-window suffix (_7d/_1d) → match by prefix.
  const messagingConversationsStarted = extractActionByPrefix(
    raw.actions,
    ACTION_TYPES.MESSAGING_CONVERSATION_STARTED,
  );
  const messagingFirstReplies = extractAction(raw.actions, ACTION_TYPES.MESSAGING_FIRST_REPLY);
  const totalMessagingConnections = extractAction(
    raw.actions,
    ACTION_TYPES.TOTAL_MESSAGING_CONNECTION,
  );
  const costPerMessagingConversation = extractCostByPrefix(
    raw.cost_per_action_type,
    ACTION_TYPES.MESSAGING_CONVERSATION_STARTED,
  );

  const { results, costPerResult } = resolveResult({
    spend,
    purchases,
    costPerPurchase,
    leads,
    costPerLead,
    messagingConversationsStarted,
    costPerMessagingConversation,
    linkClicks,
    cpcLink,
  });

  return {
    // Identity
    campaignName: raw.campaign_name,
    campaignId: raw.campaign_id,
    adsetName: raw.adset_name,
    adsetId: raw.adset_id,
    adName: raw.ad_name,
    adId: raw.ad_id,

    // 1-5: Direct
    spend,
    budget: null, // Populated separately from adsets endpoint
    impressions: parseInt(raw.impressions, 10) || 0,
    cpm: parseFloat(raw.cpm) || 0,
    frequency: parseFloat(raw.frequency) || 0,

    // 6-8: Clicks
    linkClicks,
    cpcLink,
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
    costPerPurchase,

    // 18: ROAS
    roas: extractPurchaseRoas(raw.purchase_roas, ACTION_TYPES.PURCHASE),

    // 19-20: Leads
    leads,
    costPerLead,

    // 21-22: Calculated rates
    purchaseRateByClicks: safeDivide(purchases, linkClicks),
    purchaseRateByLandingPageViews: safeDivide(purchases, landingPageViews),

    // 23-26: Messaging (Click-to-WhatsApp)
    messagingConversationsStarted,
    costPerMessagingConversation,
    messagingFirstReplies,
    totalMessagingConnections,

    // 27-28: Result (primary outcome)
    results,
    costPerResult,
  };
}
