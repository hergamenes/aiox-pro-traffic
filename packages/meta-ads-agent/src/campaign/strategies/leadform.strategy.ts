import type { AdSetOptions, AdOptions } from './campaign-strategy.js';
import { BaseCampaignStrategy } from './base.strategy.js';
import { OBJECTIVE_SPECS } from '../objectives.js';

/**
 * Estratégia de Lead Ads com formulário nativo (instant form).
 *
 * O anúncio abre um formulário dentro do próprio Facebook/Instagram, sem sair
 * do app. O formulário (`leadFormId`) é criado antes da criação do ad (ver
 * orchestrator) e referenciado no criativo.
 *
 * Combinação Meta:
 *   objective         = OUTCOME_LEADS
 *   optimization_goal = LEAD_GENERATION
 *   destination_type  = ON_AD
 *   promoted_object   = { page_id }
 *   call_to_action    = SIGN_UP (value.lead_gen_form_id)
 *
 * NOTA: requer validação contra conta real (criação de formulário usa page
 * access token e a Meta valida a política de privacidade).
 */
export class LeadFormCampaignStrategy extends BaseCampaignStrategy {
  protected getObjective(): string {
    return OBJECTIVE_SPECS.leadform.objective;
  }

  getAdSetParams(options: AdSetOptions): Record<string, unknown> {
    const spec = OBJECTIVE_SPECS.leadform;

    const params: Record<string, unknown> = {
      campaign_id: options.campaignId,
      optimization_goal: spec.optimizationGoal,
      billing_event: spec.billingEvent,
      destination_type: spec.destinationType,
      targeting: this.buildBaseTargeting(options),
    };

    if (options.pageId) {
      params['promoted_object'] = { page_id: options.pageId };
    }

    this.applyAdSetBudget(params, options);

    if (options.startTime) {
      params['start_time'] = options.startTime;
    }

    return params;
  }

  getAdParams(options: AdOptions): Record<string, unknown> {
    const callToAction = {
      type: 'SIGN_UP',
      value: { lead_gen_form_id: options.leadFormId },
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
        // O formulário abre no próprio anúncio (ON_AD); o link é apenas um
        // fallback exigido pela API.
        link: options.websiteUrl || 'https://fb.com/',
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
