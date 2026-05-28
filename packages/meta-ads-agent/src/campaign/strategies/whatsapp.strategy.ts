import type { AdSetOptions, AdOptions } from './campaign-strategy.js';
import { BaseCampaignStrategy } from './base.strategy.js';
import { OBJECTIVE_SPECS } from '../objectives.js';

/**
 * Estratégia Click-to-WhatsApp (CTWA).
 *
 * O anúncio abre uma conversa no WhatsApp ao ser clicado. Exige uma página
 * com WhatsApp Business conectado (informada via `pageId`) e um número de
 * destino (`whatsappNumber`).
 *
 * Combinação Meta:
 *   objective        = OUTCOME_ENGAGEMENT
 *   optimization_goal = CONVERSATIONS
 *   destination_type  = WHATSAPP
 *   promoted_object   = { page_id }
 *   call_to_action    = WHATSAPP_MESSAGE (app_destination WHATSAPP)
 *
 * NOTA: requer validação contra conta real (a Meta valida a conexão
 * página↔WhatsApp no momento da criação).
 */
export class WhatsappCampaignStrategy extends BaseCampaignStrategy {
  protected getObjective(): string {
    return OBJECTIVE_SPECS.whatsapp.objective;
  }

  getAdSetParams(options: AdSetOptions): Record<string, unknown> {
    const spec = OBJECTIVE_SPECS.whatsapp;

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
    const waLink = options.whatsappNumber
      ? `https://api.whatsapp.com/send?phone=${options.whatsappNumber}`
      : options.websiteUrl;

    // O destino (wa.me/api.whatsapp) vai no link_data.link. O value do CTA
    // carrega apenas app_destination — incluir `link` aqui também é redundante
    // e a Meta pode rejeitar a combinação.
    const callToAction = {
      type: 'WHATSAPP_MESSAGE',
      value: { app_destination: 'WHATSAPP' },
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
        link: waLink,
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
