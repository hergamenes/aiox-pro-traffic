import type { AdSetOptions, AdOptions } from './campaign-strategy.js';
import { BaseCampaignStrategy } from './base.strategy.js';
import { OBJECTIVE_SPECS } from '../objectives.js';

/**
 * Estratégia de Promoção de App.
 *
 * Direciona o usuário para instalar/abrir um aplicativo na loja
 * (App Store / Google Play).
 *
 * Combinação Meta:
 *   objective         = OUTCOME_APP_PROMOTION
 *   optimization_goal = APP_INSTALLS
 *   promoted_object   = { application_id, object_store_url }
 *   call_to_action    = INSTALL_MOBILE_APP (link = object_store_url)
 *
 * NOTA: requer validação contra conta real (a Meta valida o vínculo do app
 * e o object_store_url).
 */
export class AppCampaignStrategy extends BaseCampaignStrategy {
  protected getObjective(): string {
    return OBJECTIVE_SPECS.app.objective;
  }

  getAdSetParams(options: AdSetOptions): Record<string, unknown> {
    const spec = OBJECTIVE_SPECS.app;

    const params: Record<string, unknown> = {
      campaign_id: options.campaignId,
      optimization_goal: spec.optimizationGoal,
      billing_event: spec.billingEvent,
      targeting: this.buildBaseTargeting(options),
    };

    if (options.applicationId && options.objectStoreUrl) {
      params['promoted_object'] = {
        application_id: options.applicationId,
        object_store_url: options.objectStoreUrl,
      };
    }

    this.applyAdSetBudget(params, options);

    if (options.startTime) {
      params['start_time'] = options.startTime;
    }

    return params;
  }

  getAdParams(options: AdOptions): Record<string, unknown> {
    const storeLink = options.objectStoreUrl || options.websiteUrl;
    const callToAction = {
      type: 'INSTALL_MOBILE_APP',
      value: { link: storeLink },
    };

    const objectStorySpec: Record<string, unknown> = {
      page_id: options.pageId,
    };

    if (options.videoId) {
      const videoData: Record<string, unknown> = {
        video_id: options.videoId,
        message: options.primaryText,
        title: options.headline,
        link_description: options.description,
        call_to_action: callToAction,
      };
      if (options.videoThumbnailUrl) {
        videoData['image_url'] = options.videoThumbnailUrl;
      }
      objectStorySpec['video_data'] = videoData;
    } else {
      const linkData: Record<string, unknown> = {
        link: storeLink,
        message: options.primaryText,
        name: options.headline,
        description: options.description,
        call_to_action: callToAction,
      };
      if (options.imageHash) {
        linkData['image_hash'] = options.imageHash;
      }
      objectStorySpec['link_data'] = linkData;
    }

    if (options.instagramAccountId) {
      objectStorySpec['instagram_user_id'] = options.instagramAccountId;
    }

    return {
      adset_id: options.adSetId,
      name: options.name,
      creative: { object_story_spec: objectStorySpec },
      status: 'ACTIVE',
    };
  }
}
