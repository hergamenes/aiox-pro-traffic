import type { AdSetOptions } from './campaign-strategy.js';
import { BaseCampaignStrategy } from './base.strategy.js';
import { OBJECTIVE_SPECS } from '../objectives.js';
import type { CampaignType } from '../../types/campaign.js';

/**
 * Estratégia genérica dirigida pelo registry de objetivos (OBJECTIVE_SPECS).
 *
 * Cobre objetivos "diretos" que só precisam de objective + optimization_goal
 * + destination_type opcional: Reconhecimento, Tráfego e Engajamento.
 *
 * Objetivos com regras especiais (vendas com pixel, leads, WhatsApp, lead
 * forms, app) usam estratégias dedicadas.
 */
export class GenericCampaignStrategy extends BaseCampaignStrategy {
  constructor(private readonly type: CampaignType) {
    super();
  }

  protected getObjective(): string {
    return OBJECTIVE_SPECS[this.type].objective;
  }

  getAdSetParams(options: AdSetOptions): Record<string, unknown> {
    const spec = OBJECTIVE_SPECS[this.type];

    const params: Record<string, unknown> = {
      campaign_id: options.campaignId,
      optimization_goal: spec.optimizationGoal,
      billing_event: spec.billingEvent,
      targeting: this.buildBaseTargeting(options),
    };

    if (spec.destinationType) {
      params['destination_type'] = spec.destinationType;
    }

    this.applyAdSetBudget(params, options);

    if (options.startTime) {
      params['start_time'] = options.startTime;
    }

    return params;
  }
}
