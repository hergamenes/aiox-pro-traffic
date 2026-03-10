import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('../../../src/log/log-repository.js', () => ({
  readHistory: vi.fn().mockResolvedValue([]),
  formatCsv: vi.fn().mockReturnValue(''),
}));

vi.mock('../../../src/errors/error-handler.js', () => ({
  handleError: vi.fn().mockReturnValue({
    message: 'Erro de teste',
    action: 'Tente novamente',
    shouldLog: false,
  }),
}));

import { historyCommand } from '../../../src/cli/commands/history.js';

describe('history CLI command', () => {
  it('should be registered with correct name', () => {
    expect(historyCommand.name()).toBe('history');
  });

  it('should have correct description in Portuguese', () => {
    expect(historyCommand.description()).toContain('histórico');
  });

  it('should have --all option', () => {
    const option = historyCommand.options.find((o) => o.long === '--all');
    expect(option).toBeDefined();
  });

  it('should have --type option', () => {
    const option = historyCommand.options.find((o) => o.long === '--type');
    expect(option).toBeDefined();
  });

  it('should have --date option', () => {
    const option = historyCommand.options.find((o) => o.long === '--date');
    expect(option).toBeDefined();
  });

  it('should have --export option', () => {
    const option = historyCommand.options.find((o) => o.long === '--export');
    expect(option).toBeDefined();
  });

  it('should not accept positional arguments', () => {
    expect(historyCommand.registeredArguments).toHaveLength(0);
  });
});
