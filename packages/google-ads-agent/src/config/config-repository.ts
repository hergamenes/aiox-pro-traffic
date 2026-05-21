import {
  getCustomerId,
  getLoginCustomerId,
  storeCustomerId,
  storeLoginCustomerId,
} from '../auth/keychain.js';
import { AppError } from '../errors/types.js';

export interface Defaults {
  customerId?: string;
  loginCustomerId?: string;
}

export interface SetDefaultsInput {
  customerId: string;
  loginCustomerId?: string;
}

/** Strip dashes/whitespace from a customer-id-like string. */
export function normalizeCustomerId(raw: string): string {
  return raw.replace(/[\s-]/g, '');
}

/** Validates that a customer-id is exactly 10 numeric digits. */
export function isValidCustomerId(raw: string): boolean {
  return /^\d{10}$/.test(normalizeCustomerId(raw));
}

export async function getDefaults(): Promise<Defaults> {
  const [customerId, loginCustomerId] = await Promise.all([
    getCustomerId(),
    getLoginCustomerId(),
  ]);
  return {
    ...(customerId ? { customerId } : {}),
    ...(loginCustomerId ? { loginCustomerId } : {}),
  };
}

export async function setDefaults(input: SetDefaultsInput): Promise<void> {
  const customerId = normalizeCustomerId(input.customerId);
  if (!isValidCustomerId(customerId)) {
    throw new AppError(
      'VALIDATION',
      `Customer ID inválido: '${input.customerId}'. Deve ter exatamente 10 dígitos.`,
      "Exemplo válido: 1234567890 (com ou sem traços '123-456-7890').",
    );
  }
  await storeCustomerId(customerId);
  if (input.loginCustomerId) {
    const loginCustomerId = normalizeCustomerId(input.loginCustomerId);
    if (!isValidCustomerId(loginCustomerId)) {
      throw new AppError(
        'VALIDATION',
        `Login Customer ID (MCC) inválido: '${input.loginCustomerId}'. Deve ter 10 dígitos.`,
      );
    }
    await storeLoginCustomerId(loginCustomerId);
  }
}
