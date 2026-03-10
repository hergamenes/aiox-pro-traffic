import { z } from 'zod';
import type { CampaignType } from './campaign.js';

export interface CampaignLogEntry {
  campaignId: string;
  campaignName: string;
  type: CampaignType;
  dailyBudget: number;
  adSetId: string;
  adId: string;
  status: string;
  creativeFormat: string;
  creativeFiles: string[];
  pageId: string;
  adsManagerUrl: string;
  createdAt: string; // ISO 8601 string for JSON serialization
}

export interface HistoryFilter {
  type?: CampaignType;
  date?: string; // DD-MM-YY format
  limit?: number;
  all?: boolean;
}

export const campaignLogEntrySchema = z.object({
  campaignId: z.string(),
  campaignName: z.string(),
  type: z.enum(['sales', 'leads']),
  dailyBudget: z.number(),
  adSetId: z.string(),
  adId: z.string(),
  status: z.string(),
  creativeFormat: z.string(),
  creativeFiles: z.array(z.string()),
  pageId: z.string(),
  adsManagerUrl: z.string(),
  createdAt: z.string(),
});
