import { mkdir, appendFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { logger } from '../cli/logger.js';

export const MUTATION_LOG_DIR = join(homedir(), '.aiox');
export const MUTATION_LOG_FILE = join(MUTATION_LOG_DIR, 'google-ads-mutations.log');

export type MutationOperation =
  | 'update_budget'
  | 'update_bidding'
  | 'pause_campaign'
  | 'enable_campaign'
  | 'pause_ad_group'
  | 'enable_ad_group'
  | 'create_campaign_search'
  | 'create_campaign_display'
  | 'create_campaign_pmax'
  | 'create_ad_group'
  | 'add_keyword'
  | 'remove_keyword'
  | 'update_keyword_bid'
  | 'create_rsa'
  | 'create_rda'
  | 'upload_asset_image'
  | 'upload_asset_video'
  | 'upload_asset_text'
  | 'remove_campaign'
  | 'remove_ad_group'
  | 'create_audience_remarketing'
  | 'apply_audience_target';

export interface MutationLogEntry {
  timestamp: string;
  customerId: string;
  /**
   * ID da campanha alvo. Opcional: mutações que não são de campanha
   * (ex.: `create_audience_remarketing`, que cria uma user_list isolada)
   * omitem este campo. Story 9.1 (R3): campo tornado opcional em vez de
   * usar valor sentinela — nenhum consumidor do log lê campaignId como
   * obrigatório, então a mudança é não-breaking.
   */
  campaignId?: string;
  operation: MutationOperation;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  dryRun: boolean;
  success: boolean;
  error?: string;
  /** Story 6.7: exact phrase typed by operator for irreversible removals. */
  operator_confirmed_phrase?: string;
  /** Story 6.7: true if spend_24h > 0 forced the additional confirmation tier. */
  triple_confirm_required?: boolean;
}

/**
 * Appends a mutation log entry as a JSON Line. Fire-and-forget: any
 * filesystem error is logged via the standard logger but NOT thrown,
 * so callers do not need to wrap in try/catch — the actual mutation
 * outcome is not affected by audit log failures.
 *
 * Output path: ~/.aiox/google-ads-mutations.log
 */
export async function appendMutationLog(
  entry: Omit<MutationLogEntry, 'timestamp'> & { timestamp?: string },
): Promise<void> {
  try {
    await mkdir(MUTATION_LOG_DIR, { recursive: true });
    const full: MutationLogEntry = {
      ...entry,
      timestamp: entry.timestamp ?? new Date().toISOString(),
    };
    await appendFile(MUTATION_LOG_FILE, `${JSON.stringify(full)}\n`, 'utf-8');
    logger.debug({ entry: full }, 'Mutation logged');
  } catch (err) {
    logger.warn({ err }, 'Failed to append mutation log; mutation outcome unaffected');
  }
}
