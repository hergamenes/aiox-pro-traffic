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

export class MetaApiError extends AppError {
  public readonly metaErrorCode: number;

  constructor(message: string, metaErrorCode: number, action: string = '') {
    super(message, 'META_API_ERROR', action);
    this.metaErrorCode = metaErrorCode;
  }
}

export class NetworkError extends AppError {
  constructor(message: string, action: string = '') {
    super(message, 'NETWORK_ERROR', action);
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
