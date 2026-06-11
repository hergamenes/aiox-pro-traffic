/**
 * Tipos do comando `keyword-research` (Story 7.1).
 *
 * IMPORTANTE: este recurso usa KeywordPlanIdeaService.GenerateKeywordIdeas —
 * descobre VOLUME DE BUSCA e ideias NOVAS de palavras. É diferente de
 * `report --level keyword`, que lê métricas de keywords JÁ ativas na conta
 * (via keyword_view). Aqui os dados de volume vêm do Google, não da conta.
 */

/** Rede de pesquisa do Keyword Planner. */
export type KeywordPlanNetwork = 'GOOGLE_SEARCH' | 'GOOGLE_SEARCH_AND_PARTNERS';

/** Nível de concorrência normalizado da API. */
export type CompetitionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

/** Parâmetros de entrada para uma pesquisa de keywords. */
export interface KeywordResearchParams {
  /** Conta usada para autenticar a chamada (os dados de volume são do Google). */
  customerId: string;
  /** Palavras-semente (1 a 20). */
  seeds: string[];
  /** Resource name do geo target, ex.: 'geoTargetConstants/2076' (Brasil). */
  geoConstant: string;
  /** Resource name do idioma, ex.: 'languageConstants/1014' (Português). */
  languageConstant: string;
  /** Rede de pesquisa (default GOOGLE_SEARCH). */
  network: KeywordPlanNetwork;
  /** MCC override, quando a conta está sob uma conta-gerente. */
  loginCustomerId?: string;
}

/** Uma ideia de palavra-chave com suas métricas de volume/concorrência. */
export interface KeywordIdea {
  /** Texto da palavra-chave (a seed ou uma ideia relacionada). */
  keyword: string;
  /** Volume médio mensal de buscas. */
  avgMonthlySearches: number;
  /** Nível de concorrência. */
  competition: CompetitionLevel;
  /** Índice de concorrência 0-100 (undefined se a API não retornar). */
  competitionIndex?: number;
  /** Lance de topo de página — piso, em unidade monetária (micros / 1.000.000). */
  lowTopOfPageBid?: number;
  /** Lance de topo de página — teto, em unidade monetária (micros / 1.000.000). */
  highTopOfPageBid?: number;
}
