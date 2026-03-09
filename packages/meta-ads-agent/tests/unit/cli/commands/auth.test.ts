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

import { authCommand } from '../../../../src/cli/commands/auth.js';

describe('auth CLI command', () => {
  it('should have setup subcommand', () => {
    const commands = authCommand.commands.map((c) => c.name());
    expect(commands).toContain('setup');
  });

  it('should have status subcommand', () => {
    const commands = authCommand.commands.map((c) => c.name());
    expect(commands).toContain('status');
  });

  it('should have correct description', () => {
    expect(authCommand.description()).toContain('Meta Ads API');
  });
});
