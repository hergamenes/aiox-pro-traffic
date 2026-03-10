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
  default: { FacebookAdsApi: { init: vi.fn() } },
  FacebookAdsApi: { init: vi.fn() },
}));

vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    metadata: vi.fn().mockResolvedValue({ width: 1080, height: 1080 }),
  })),
}));

vi.mock('fluent-ffmpeg', () => {
  const fn = vi.fn();
  fn.setFfprobePath = vi.fn();
  fn.ffprobe = vi.fn();
  return { default: fn };
});

vi.mock('ffprobe-static', () => ({ path: '/mock/ffprobe' }));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    text: '',
  })),
}));

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  select: vi.fn(),
  number: vi.fn(),
}));

import { upCommand } from '../../../../src/cli/commands/up.js';

describe('up CLI command', () => {
  it('should be registered with correct name', () => {
    expect(upCommand.name()).toBe('up');
  });

  it('should have correct description', () => {
    expect(upCommand.description()).toContain('Criar campanha');
  });

  it('should have --budget option', () => {
    const budgetOption = upCommand.options.find((o) => o.long === '--budget');
    expect(budgetOption).toBeDefined();
  });

  it('should have --page option', () => {
    const pageOption = upCommand.options.find((o) => o.long === '--page');
    expect(pageOption).toBeDefined();
  });

  it('should have --url option', () => {
    const urlOption = upCommand.options.find((o) => o.long === '--url');
    expect(urlOption).toBeDefined();
  });

  it('should accept [type] and [name] arguments', () => {
    const args = upCommand.registeredArguments;
    expect(args).toHaveLength(2);
    expect(args[0].name()).toBe('type');
    expect(args[1].name()).toBe('name');
  });
});
