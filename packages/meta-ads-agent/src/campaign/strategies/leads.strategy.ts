import type { CampaignStrategy, AdSetOptions, AdOptions } from './campaign-strategy.js';

export class LeadsCampaignStrategy implements CampaignStrategy {
  getCampaignParams(): Record<string, unknown> {
    return {
      objective: 'OUTCOME_LEADS',
      special_ad_categories: [],
      status: 'PAUSED',
    };
  }

  getAdSetParams(options: AdSetOptions): Record<string, unknown> {
    return {
      campaign_id: options.campaignId,
      optimization_goal: 'LANDING_PAGE_VIEWS',
      billing_event: 'IMPRESSIONS',
      destination_type: 'WEBSITE',
      daily_budget: Math.round(options.dailyBudget * 100),
      targeting: {
        geo_locations: { countries: ['BR'] },
      },
    };
  }

  getAdParams(options: AdOptions): Record<string, unknown> {
    const linkData: Record<string, unknown> = {
      link: options.websiteUrl,
      message: options.primaryText,
      name: options.headline,
      description: options.description,
      call_to_action: {
        type: options.callToAction,
        value: { link: options.websiteUrl },
      },
    };

    if (options.imageHash) {
      linkData['image_hash'] = options.imageHash;
    } else if (options.videoId) {
      linkData['video_id'] = options.videoId;
    }

    const objectStorySpec: Record<string, unknown> = {
      page_id: options.pageId,
      link_data: linkData,
    };

    if (options.instagramAccountId) {
      objectStorySpec['instagram_actor_id'] = options.instagramAccountId;
    }

    return {
      adset_id: options.adSetId,
      name: options.name,
      creative: {
        object_story_spec: objectStorySpec,
      },
      status: 'ACTIVE',
    };
  }
}
