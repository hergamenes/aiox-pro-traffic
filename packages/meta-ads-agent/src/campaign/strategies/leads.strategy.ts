import type { CampaignStrategy, CampaignOptions, AdSetOptions, AdOptions } from './campaign-strategy.js';
import { OBJECTIVE_SPECS } from '../objectives.js';

const SPEC = OBJECTIVE_SPECS.leads;

export class LeadsCampaignStrategy implements CampaignStrategy {
  getCampaignParams(options?: CampaignOptions): Record<string, unknown> {
    const params: Record<string, unknown> = {
      objective: SPEC.objective,
      special_ad_categories: [],
      status: 'PAUSED',
    };

    if (options?.cboEnabled) {
      if (options.dailyBudget) {
        params['daily_budget'] = Math.round(options.dailyBudget * 100);
      }
      params['bid_strategy'] = 'LOWEST_COST_WITHOUT_CAP';
    }

    return params;
  }

  getAdSetParams(options: AdSetOptions): Record<string, unknown> {
    const targeting: Record<string, unknown> = {
      geo_locations: { countries: ['BR'] },
    };

    if (options.ageMin) {
      targeting['age_min'] = options.ageMin;
    }

    const params: Record<string, unknown> = {
      campaign_id: options.campaignId,
      optimization_goal: SPEC.optimizationGoal,
      billing_event: SPEC.billingEvent,
      ...(SPEC.destinationType ? { destination_type: SPEC.destinationType } : {}),
      targeting,
    };

    if (!options.cboEnabled) {
      params['daily_budget'] = Math.round(options.dailyBudget * 100);
      params['bid_strategy'] = 'LOWEST_COST_WITHOUT_CAP';
    }

    if (options.startTime) {
      params['start_time'] = options.startTime;
    }

    return params;
  }

  getAdParams(options: AdOptions): Record<string, unknown> {
    const objectStorySpec: Record<string, unknown> = {
      page_id: options.pageId,
    };

    if (options.videoId) {
      const videoData: Record<string, unknown> = {
        video_id: options.videoId,
        message: options.primaryText,
        title: options.headline,
        link_description: options.description,
        call_to_action: {
          type: options.callToAction,
          value: { link: options.websiteUrl },
        },
      };
      if (options.videoThumbnailUrl) {
        videoData['image_url'] = options.videoThumbnailUrl;
      }
      objectStorySpec['video_data'] = videoData;
    } else {
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
      }
      objectStorySpec['link_data'] = linkData;
    }

    if (options.instagramAccountId) {
      objectStorySpec['instagram_user_id'] = options.instagramAccountId;
    }

    const creative: Record<string, unknown> = {
      object_story_spec: objectStorySpec,
    };

    if (options.urlTags) {
      creative['url_tags'] = options.urlTags;
    }

    // TODO: Placement asset customization (Feed vs Stories) requires Dynamic Creative (DCO)
    // For now, the Feed image is used for all placements — Meta auto-adapts.

    return {
      adset_id: options.adSetId,
      name: options.name,
      creative,
      status: 'ACTIVE',
    };
  }
}
