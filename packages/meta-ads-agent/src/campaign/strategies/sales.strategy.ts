import type { CampaignStrategy, CampaignOptions, AdSetOptions, AdOptions } from './campaign-strategy.js';

export class SalesCampaignStrategy implements CampaignStrategy {
  getCampaignParams(options?: CampaignOptions): Record<string, unknown> {
    const params: Record<string, unknown> = {
      objective: 'OUTCOME_SALES',
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
    const hasPixel = !!options.pixelId;
    const targeting: Record<string, unknown> = {
      geo_locations: { countries: ['BR'] },
    };

    if (options.ageMin) {
      targeting['age_min'] = options.ageMin;
    }

    const params: Record<string, unknown> = {
      campaign_id: options.campaignId,
      optimization_goal: hasPixel ? 'OFFSITE_CONVERSIONS' : 'LINK_CLICKS',
      billing_event: 'IMPRESSIONS',
      targeting,
    };

    if (!options.cboEnabled) {
      // Non-CBO: budget and bid strategy on ad set
      params['daily_budget'] = Math.round(options.dailyBudget * 100);
      params['bid_strategy'] = 'LOWEST_COST_WITHOUT_CAP';
    }

    if (hasPixel) {
      params['promoted_object'] = {
        pixel_id: options.pixelId,
        custom_event_type: 'PURCHASE',
      };
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
      // Video creative uses video_data
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
      // Image creative uses link_data
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

    // URL tracking tags
    if (options.urlTags) {
      creative['url_tags'] = options.urlTags;
    }

    // TODO: Placement asset customization (Feed vs Stories) requires Dynamic Creative (DCO)
    // For now, the Feed image is used for all placements — Meta auto-adapts.
    // storiesImageHash is stored in config for future DCO implementation.

    return {
      adset_id: options.adSetId,
      name: options.name,
      creative,
      status: 'ACTIVE',
    };
  }
}
