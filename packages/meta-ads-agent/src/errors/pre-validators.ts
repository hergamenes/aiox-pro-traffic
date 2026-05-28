import { getAccessToken } from '../auth/token-manager.js';
import { ValidationError } from './types.js';
import { MIN_DAILY_BUDGET_BRL } from '../types/campaign.js';
import type { CampaignConfig } from '../types/campaign.js';
import type { CreativeBundle } from '../types/creative.js';

export async function validatePreConditions(
  config: CampaignConfig,
  bundle: CreativeBundle,
): Promise<void> {
  // Validate token exists and is valid
  await getAccessToken();

  if (!config.adAccountId) {
    throw new ValidationError(
      'Conta de anúncios não configurada.',
      'Execute: meta-ads config set-default ad-account <id>',
    );
  }

  if (!config.pageId) {
    throw new ValidationError(
      'Página do Facebook não configurada.',
      'Execute: meta-ads config set-default page <id>',
    );
  }

  if (bundle.assets.length === 0) {
    throw new ValidationError(
      'Nenhum criativo encontrado.',
      'Adicione imagens ou vídeos à pasta de criativos',
    );
  }

  if (config.dailyBudget <= 0) {
    throw new ValidationError(
      'Orçamento diário deve ser maior que zero.',
      'Informe um valor positivo para o orçamento',
    );
  }

  if (config.dailyBudget < MIN_DAILY_BUDGET_BRL) {
    throw new ValidationError(
      `Orçamento diário abaixo do mínimo da Meta (R$${MIN_DAILY_BUDGET_BRL.toFixed(2)}/dia).`,
      `Informe pelo menos R$${MIN_DAILY_BUDGET_BRL.toFixed(2)} por dia`,
    );
  }
}
