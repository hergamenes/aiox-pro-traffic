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

vi.mock('@inquirer/prompts', () => ({
  select: vi.fn(),
}));

import { configCommand } from '../../../../src/cli/commands/config.js';

describe('config CLI command', () => {
  it('should be registered with correct name', () => {
    expect(configCommand.name()).toBe('config');
  });

  it('should have set-default subcommand', () => {
    const subcommands = configCommand.commands.map((c) => c.name());
    expect(subcommands).toContain('set-default');
  });

  it('should have correct description', () => {
    expect(configCommand.description()).toContain('configurações');
  });
});
