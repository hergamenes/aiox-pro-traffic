/**
 * Tipos do comando `create audience-remarketing` (Story 9.1 — Epic 9).
 *
 * Uma lista de remarketing (`user_list`) rule-based coleta visitantes do
 * site do cliente (aproveitando a tag já instalada) para segmentar depois.
 * A regra mais simples — "todos os visitantes" — é expressa como o curinga
 * `url__ CONTAINS "http"`, o comportamento default quando `urlContains` é
 * omitido. Ver `src/google-ads-api/audience.ts` para o shape da MutateOperation.
 */

/** Parâmetros de entrada para criar uma lista de remarketing rule-based. */
export interface RemarketingUserListInput {
  /** Nome da lista (obrigatório, ≤255 chars). */
  name: string;
  /** Descrição opcional da lista. */
  description?: string;
  /**
   * Duração de associação em dias (`membership_life_span`): quanto tempo um
   * usuário permanece na lista após entrar. Faixa aceita: 1..540.
   */
  membershipDurationDays: number;
  /**
   * Trecho de URL que define quem entra na lista (ex.: o domínio do cliente).
   * Quando omitido, usa o curinga `http` — captura todos os visitantes do site.
   */
  urlContains?: string;
}

/** Resultado da criação de uma lista de remarketing. */
export interface RemarketingUserListResult {
  /**
   * Resource name da `user_list` criada (ex.: `customers/123/userLists/456`).
   * Em dry-run pode vir vazio — a API não devolve um resource_name real quando
   * `validate_only: true`.
   */
  resourceName: string;
  /** True quando a chamada foi apenas validação (`validate_only`), sem criação real. */
  dryRun: boolean;
}

// ============================================================================
// Story 9.2 — Aplicar público a campanha/grupo de anúncios (audience-target)
// ============================================================================

/**
 * Modo de aplicação de um público a uma campanha/ad group.
 *
 * - `observation`: a lista apenas OBSERVA (`bid_only: true`) — coleta dados e
 *   permite ajustar lances por público, mas NÃO restringe o alcance da campanha.
 *   É o default (mais seguro).
 * - `targeting`: a lista SEGMENTA (`bid_only: false`) — a campanha/ad group passa
 *   a servir SOMENTE para o público informado, RESTRINGINDO o alcance.
 */
export type AudienceTargetMode = 'observation' | 'targeting';

/**
 * Parâmetros para aplicar uma `user_list` existente a uma campanha OU a um
 * grupo de anúncios. Exatamente um entre `campaignId`/`adGroupId` deve estar
 * presente (XOR — garantido pela validação antes de chegar ao builder).
 */
export interface ApplyAudienceTargetInput {
  /** Customer ID (10 dígitos) — usado para montar os resource_names. */
  customerId: string;
  /** Resource name da lista a aplicar (`customers/{id}/userLists/{id}`). */
  userListResourceName: string;
  /** ID numérico da campanha (nível campanha). Mutuamente exclusivo com `adGroupId`. */
  campaignId?: string;
  /** ID numérico do grupo de anúncios (nível ad group). Mutuamente exclusivo com `campaignId`. */
  adGroupId?: string;
  /** Modo de aplicação (observação x segmentação). */
  mode: AudienceTargetMode;
}

/** Resultado da aplicação de um público a uma campanha/ad group. */
export interface ApplyAudienceTargetResult {
  /**
   * Resource name do criterion criado (`campaign_criterion` ou
   * `ad_group_criterion`). Em dry-run pode vir vazio — a API não devolve um
   * resource_name real quando `validate_only: true`.
   */
  criterionResourceName: string;
  /** True quando a chamada foi apenas validação (`validate_only`), sem mutação real. */
  dryRun: boolean;
}

// ============================================================================
// Story 9.3 — Custom segment (custom_audience de interesse) — Epic 9
// ============================================================================

/**
 * Tipos aceitos de `custom_audience` (`CustomAudienceTypeEnum.CustomAudienceType`,
 * SDK v23 — confirmado em `node_modules/google-ads-node/build/protos/protos.d.ts`).
 * Lista fechada exposta ao operador via `--type`. `INTEREST` é o default (mais
 * genérico, sem pré-requisitos de campos conhecidos — ver Dev Notes/R1).
 */
export const CUSTOM_AUDIENCE_TYPES = ['AUTO', 'INTEREST', 'PURCHASE_INTENT', 'SEARCH'] as const;

/** Um dos valores aceitos de `--type` para o custom segment. */
export type CustomAudienceTypeOption = (typeof CUSTOM_AUDIENCE_TYPES)[number];

/**
 * Parâmetros de entrada para criar um custom segment (`custom_audience`).
 *
 * Diferente de `user_list` (Story 9.1, baseada em visitas ao site), um
 * `custom_audience` é definido por sinais de interesse/intenção declarados:
 * palavras-chave que a pessoa pesquisa (`keywords`) e/ou URLs que ela navega
 * (`urls`). Cada item vira um `ICustomAudienceMember`. Pelo menos um member
 * (keyword OU url) é obrigatório — garantido pela validação antes do builder.
 */
export interface CustomSegmentInput {
  /** Nome do segmento (obrigatório, ≤255 chars). */
  name: string;
  /** Descrição opcional do segmento. */
  description?: string;
  /** Palavras-chave já parseadas (trim + sem vazios) — viram members `KEYWORD`. */
  keywords: string[];
  /** URLs já parseadas (trim + sem vazios) — viram members `URL`. */
  urls: string[];
  /** Tipo do segmento (default `INTEREST`). */
  type: CustomAudienceTypeOption;
}

/** Resultado da criação de um custom segment. */
export interface CustomSegmentResult {
  /**
   * Resource name do `custom_audience` criado (ex.: `customers/123/customAudiences/456`).
   * Em dry-run pode vir vazio — a API não devolve um resource_name real quando
   * `validate_only: true`.
   */
  resourceName: string;
  /** True quando a chamada foi apenas validação (`validate_only`), sem criação real. */
  dryRun: boolean;
}

// ============================================================================
// Story 9.4 — Customer Match (crm_based_user_list + OfflineUserDataJob) — Epic 9
// ============================================================================

/**
 * Tipos de chave de upload aceitos por `crm_based_user_list_info.upload_key_type`
 * (`CustomerMatchUploadKeyTypeEnum`, confirmado no SDK v23). Esta story cobre
 * APENAS `CONTACT_INFO` (e-mail/telefone). `CRM_ID`/`MOBILE_ADVERTISING_ID`
 * ficam para evolução futura — expostos aqui só para documentar o domínio.
 */
export const CUSTOMER_MATCH_KEY_TYPES = ['contact-info'] as const;

/** Valor aceito de `--key-type` (default e único suportado: `contact-info`). */
export type CustomerMatchKeyTypeOption = (typeof CUSTOMER_MATCH_KEY_TYPES)[number];

/**
 * Um contato já HASHEADO, pronto para virar um `UserData`/`UserIdentifier` no
 * SDK. ⚠️ NUNCA carrega e-mail/telefone em claro — só o SHA-256 hex (R2). Um
 * contato válido tem pelo menos um dos dois campos preenchidos.
 */
export interface HashedIdentifier {
  /** SHA-256 (hex) do e-mail normalizado (trim + lowercase). */
  hashedEmail?: string;
  /** SHA-256 (hex) do telefone normalizado (E.164). */
  hashedPhoneNumber?: string;
}

/**
 * Parâmetros de entrada do comando `create audience-customer-match`. NÃO inclui
 * os dados de contato — o arquivo é lido/hasheado à parte (R2).
 */
export interface CustomerMatchInput {
  /** Nome da lista (obrigatório, ≤255 chars). */
  name: string;
  /** Descrição opcional da lista. */
  description?: string;
  /** Caminho do CSV de contatos (`--from-file`). */
  fromFile: string;
  /** Tipo de chave de upload (default `contact-info`). */
  keyType: CustomerMatchKeyTypeOption;
}

/** Resultado da Fase 1 — criação da `crm_based_user_list`. */
export interface CrmUserListResult {
  /**
   * Resource name da `user_list` criada (`customers/{id}/userLists/{id}`).
   * Base para o `customer_match_user_list_metadata.user_list` da Fase 2.
   */
  resourceName: string;
}

/** Resultado da Fase 2 — upload dos contatos via OfflineUserDataJob. */
export interface CustomerMatchUploadResult {
  /** Resource name do `offline_user_data_job` criado. */
  jobResourceName: string;
  /** Quantos contatos (operações `UserData`) foram enviados. */
  uploadedCount: number;
  /**
   * Nome da `longrunning.Operation` retornada por `runOfflineUserDataJob`,
   * quando disponível. O processamento do lado do Google é ASSÍNCRONO — esta
   * story dispara o `run` e reporta o job, sem fazer polling até a conclusão
   * (comportamento documentado em Completion Notes — R3).
   */
  operationName?: string;
}
