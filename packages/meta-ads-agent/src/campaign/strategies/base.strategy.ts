import type { CampaignStrategy, CampaignOptions, AdSetOptions, AdOptions } from './campaign-strategy.js';

/**
 * Lógica compartilhada entre estratégias de campanha.
 *
 * Encapsula o que é idêntico em todos os objetivos (params da campaign,
 * montagem do criativo, targeting base e orçamento) e deixa para as
 * subclasses apenas o que muda por objetivo: o `objective` e os params
 * do ad set (optimization_goal, destination_type, promoted_object).
 *
 * As estratégias `sales` e `leads` mantêm implementação própria por terem
 * regras específicas (pixel/promoted_object) e testes dedicados.
 */
export abstract class BaseCampaignStrategy implements CampaignStrategy {
  /** Objetivo ODAX enviado à campaign (ex.: OUTCOME_TRAFFIC). */
  protected abstract getObjective(): string;

  getCampaignParams(options?: CampaignOptions): Record<string, unknown> {
    const params: Record<string, unknown> = {
      objective: this.getObjective(),
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

  abstract getAdSetParams(options: AdSetOptions): Record<string, unknown>;

  /** Targeting base: Brasil + idade mínima opcional (Advantage+ audience). */
  protected buildBaseTargeting(options: AdSetOptions): Record<string, unknown> {
    const targeting: Record<string, unknown> = {
      geo_locations: { countries: ['BR'] },
    };
    if (options.ageMin) {
      targeting['age_min'] = options.ageMin;
    }
    return targeting;
  }

  /** Aplica orçamento e estratégia de lance no ad set quando não há CBO. */
  protected applyAdSetBudget(params: Record<string, unknown>, options: AdSetOptions): void {
    if (!options.cboEnabled) {
      params['daily_budget'] = Math.round(options.dailyBudget * 100);
      params['bid_strategy'] = 'LOWEST_COST_WITHOUT_CAP';
    }
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

    return {
      adset_id: options.adSetId,
      name: options.name,
      creative,
      status: 'ACTIVE',
    };
  }
}
