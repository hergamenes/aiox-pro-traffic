import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('keytar', () => ({
  default: {
    setPassword: vi.fn().mockResolvedValue(undefined),
    getPassword: vi.fn().mockResolvedValue(null),
    deletePassword: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('facebook-nodejs-business-sdk', () => ({
  default: {
    FacebookAdsApi: { init: vi.fn() },
  },
  FacebookAdsApi: { init: vi.fn() },
}));

import { accountsCommand } from '../../../../src/cli/commands/accounts.js';

describe('accounts CLI command', () => {
  it('should be registered with correct name', () => {
    expect(accountsCommand.name()).toBe('accounts');
  });

  it('should have correct description', () => {
    expect(accountsCommand.description()).toContain('contas de anúncio');
  });
});
