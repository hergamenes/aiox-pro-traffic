/**
 * Translation map for Google Ads API gRPC status codes and common
 * Node.js network errors into Portuguese messages with actionable
 * guidance for the operator.
 */

export interface ErrorTranslation {
  message: string;
  action: string;
}

const GOOGLE_ADS_CODES: Record<string, ErrorTranslation> = {
  UNAUTHENTICATED: {
    message: 'Autenticação inválida ou expirada.',
    action: 'Execute: google-ads auth setup',
  },
  PERMISSION_DENIED: {
    message: 'Acesso negado à conta solicitada.',
    action: 'Verifique se o usuário tem permissão na conta Google Ads ou se o developer token está aprovado.',
  },
  INVALID_ARGUMENT: {
    message: 'Argumento inválido enviado para a API.',
    action: 'Confirme parâmetros (customer-id, datas, level) e tente novamente.',
  },
  UNAVAILABLE: {
    message: 'Serviço Google Ads temporariamente indisponível.',
    action: 'Aguarde alguns minutos e tente novamente.',
  },
  DEADLINE_EXCEEDED: {
    message: 'Tempo limite excedido ao chamar a API.',
    action: 'Verifique sua conexão e reduza o intervalo de datas.',
  },
  INTERNAL: {
    message: 'Erro interno do servidor Google.',
    action: 'Tente novamente em alguns minutos. Se persistir, verifique o Google Ads Status Dashboard.',
  },
  RESOURCE_EXHAUSTED: {
    message: 'Cota da API excedida.',
    action: 'Aguarde 24h ou solicite aumento de cota.',
  },
  FAILED_PRECONDITION: {
    message: 'Pré-condição da operação falhou.',
    action: 'Confirme estado da campanha/conta antes de tentar novamente.',
  },
  REQUESTED_METRICS_FOR_MANAGER: {
    message: 'A conta selecionada é uma Manager Account (MCC). Métricas só podem ser consultadas em contas cliente.',
    action: "Use 'google-ads accounts' para encontrar uma conta cliente e passe seu customer-id no comando report ou em config set-default.",
  },
};

const NETWORK_CODES: Record<string, ErrorTranslation> = {
  ENOTFOUND: {
    message: 'Servidor não encontrado. Verifique sua conexão com a internet.',
    action: 'Verifique sua conexão e tente novamente.',
  },
  ETIMEDOUT: {
    message: 'Tempo de conexão esgotado.',
    action: 'Verifique sua conexão e tente novamente.',
  },
  ECONNREFUSED: {
    message: 'Conexão recusada pelo servidor.',
    action: 'Tente novamente em alguns minutos.',
  },
  ECONNRESET: {
    message: 'Conexão interrompida pelo servidor.',
    action: 'Tente novamente em alguns minutos.',
  },
};

export function translateCode(code: string | number | undefined): ErrorTranslation | null {
  if (code === undefined || code === null) return null;
  const key = String(code).toUpperCase();
  return GOOGLE_ADS_CODES[key] ?? NETWORK_CODES[key] ?? null;
}

export function listKnownCodes(): string[] {
  return [...Object.keys(GOOGLE_ADS_CODES), ...Object.keys(NETWORK_CODES)];
}

export { GOOGLE_ADS_CODES, NETWORK_CODES };
