export type AppErrorCode =
  | 'AUTH_MISSING'
  | 'AUTH_INVALID'
  | 'AUTH_EXPIRED'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'UNKNOWN';

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly action?: string;

  constructor(code: AppErrorCode, message: string, action?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    if (action) this.action = action;
  }
}

export interface GoogleAdsApiErrorLike {
  code?: number | string;
  message?: string;
  errors?: Array<{
    error_code?: Record<string, string | number>;
    message?: string;
  }>;
}

export class GoogleAdsApiError extends Error {
  public readonly code?: string | number;
  public readonly originalErrors?: GoogleAdsApiErrorLike['errors'];

  constructor(message: string, code?: string | number, originalErrors?: GoogleAdsApiErrorLike['errors']) {
    super(message);
    this.name = 'GoogleAdsApiError';
    if (code !== undefined) this.code = code;
    if (originalErrors) this.originalErrors = originalErrors;
  }
}
