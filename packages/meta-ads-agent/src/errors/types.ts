export class AppError extends Error {
  public readonly code: string;
  public readonly action: string;

  constructor(message: string, code: string = 'APP_ERROR', action: string = '') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.action = action;
  }
}

export class AuthError extends AppError {
  constructor(message: string, action: string = '') {
    super(message, 'AUTH_ERROR', action);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, action: string = '') {
    super(message, 'VALIDATION_ERROR', action);
  }
}

/**
 * Códigos de erro da Meta que indicam condição TRANSITÓRIA (rate limit ou
 * instabilidade temporária) e que, portanto, valem a pena ser retentados.
 *
 * Referência (Graph API error codes):
 * - 1   API Unknown (frequentemente transitório)
 * - 2   API Service (temporário)
 * - 4   Application request limit reached (rate limit)
 * - 17  User request limit reached (rate limit)
 * - 32  Page-level throttling (rate limit)
 * - 613 Calls to this api have exceeded the rate limit
 * - 80004 Limite de taxa específico de anúncios
 */
const TRANSIENT_META_CODES = new Set([1, 2, 4, 17, 32, 613, 80004]);

/** Subcódigos transitórios conhecidos (ex.: 80004 aparece como subcode). */
const TRANSIENT_META_SUBCODES = new Set([80004]);

export class MetaApiError extends AppError {
  public readonly metaErrorCode: number;
  /** Subcódigo de erro da Meta (`error_subcode`), quando disponível. */
  public readonly subcode?: number;
  /** Trace ID retornado pela Meta (`fbtrace_id`) para suporte/diagnóstico. */
  public readonly fbtraceId?: string;
  /** Status HTTP da resposta, quando aplicável. */
  public readonly httpStatus?: number;

  constructor(
    message: string,
    metaErrorCode: number,
    action: string = '',
    options?: { subcode?: number; fbtraceId?: string; httpStatus?: number },
  ) {
    super(message, 'META_API_ERROR', action);
    this.metaErrorCode = metaErrorCode;
    this.subcode = options?.subcode;
    this.fbtraceId = options?.fbtraceId;
    this.httpStatus = options?.httpStatus;
  }

  /**
   * Indica se o erro é transitório (rate limit / instabilidade) e portanto
   * elegível para retry com backoff. Considera código, subcódigo e status HTTP.
   */
  get isTransient(): boolean {
    if (TRANSIENT_META_CODES.has(this.metaErrorCode)) return true;
    if (this.subcode !== undefined && TRANSIENT_META_SUBCODES.has(this.subcode)) return true;
    if (this.httpStatus !== undefined && (this.httpStatus === 429 || this.httpStatus >= 500)) {
      return true;
    }
    return false;
  }
}

export class NetworkError extends AppError {
  constructor(message: string, action: string = '') {
    super(message, 'NETWORK_ERROR', action);
  }
}

export class CreativeError extends AppError {
  public readonly filePath?: string;
  public readonly validationErrors?: string[];

  constructor(
    message: string,
    options?: { filePath?: string; validationErrors?: string[]; action?: string },
  ) {
    super(message, 'CREATIVE_ERROR', options?.action ?? '');
    this.filePath = options?.filePath;
    this.validationErrors = options?.validationErrors;
  }
}

export class UploadError extends AppError {
  public readonly filePath: string;
  public readonly adAccountId: string;
  public readonly assetType: 'image' | 'video';
  /** Código de erro da Meta (quando o upload falhou por erro da API). */
  public readonly metaErrorCode?: number;
  public readonly subcode?: number;
  public readonly httpStatus?: number;

  constructor(
    message: string,
    options: {
      filePath: string;
      adAccountId: string;
      assetType: 'image' | 'video';
      action?: string;
      metaErrorCode?: number;
      subcode?: number;
      httpStatus?: number;
    },
  ) {
    super(message, 'UPLOAD_ERROR', options.action ?? '');
    this.filePath = options.filePath;
    this.adAccountId = options.adAccountId;
    this.assetType = options.assetType;
    this.metaErrorCode = options.metaErrorCode;
    this.subcode = options.subcode;
    this.httpStatus = options.httpStatus;
  }

  /** Mesmo critério de transitoriedade do MetaApiError (rate limit / 5xx). */
  get isTransient(): boolean {
    if (this.metaErrorCode !== undefined && TRANSIENT_META_CODES.has(this.metaErrorCode)) {
      return true;
    }
    if (this.subcode !== undefined && TRANSIENT_META_SUBCODES.has(this.subcode)) return true;
    if (this.httpStatus !== undefined && (this.httpStatus === 429 || this.httpStatus >= 500)) {
      return true;
    }
    return false;
  }
}

export const AUTH_ERRORS = {
  TOKEN_EXPIRED: new AuthError(
    'Token de acesso inválido ou expirado.',
    'Execute: meta-ads auth setup',
  ),
  INVALID_CREDENTIALS: new AuthError(
    'App ID ou App Secret inválido.',
    'Verifique suas credenciais no developers.facebook.com',
  ),
  TIMEOUT: new AuthError(
    'Tempo esgotado aguardando autorização.',
    'Tente novamente.',
  ),
  NETWORK: new NetworkError(
    'Erro de rede.',
    'Verifique sua conexão e tente novamente.',
  ),
  INSUFFICIENT_PERMISSIONS: new AuthError(
    'Permissões insuficientes.',
    'O Meta App precisa das permissões: ads_management, ads_read, pages_read_engagement',
  ),
} as const;
