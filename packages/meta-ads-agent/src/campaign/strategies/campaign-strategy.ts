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
}
