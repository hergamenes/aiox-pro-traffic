export interface CampaignStrategy {
  getCampaignParams(): Record<string, unknown>;
  getAdSetParams(options: AdSetOptions): Record<string, unknown>;
  getAdParams(options: AdOptions): Record<string, unknown>;
}

export interface AdSetOptions {
  campaignId: string;
  dailyBudget: number;
  pixelId: string | null;
}

export interface AdOptions {
  adSetId: string;
  pageId: string;
  instagramAccountId: string | null;
  imageHash: string | null;
  videoId: string | null;
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
  websiteUrl: string;
  name: string;
}
