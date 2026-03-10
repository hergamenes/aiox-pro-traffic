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

import { createCommand } from '../../../../src/cli/commands/create.js';

describe('create CLI command', () => {
  it('should be registered with correct name', () => {
    expect(createCommand.name()).toBe('create');
  });

  it('should have correct description', () => {
    expect(createCommand.description()).toContain('Criar campanhas');
  });

  it('should have sales subcommand', () => {
    const salesCmd = createCommand.commands.find((c) => c.name() === 'sales');
    expect(salesCmd).toBeDefined();
    expect(salesCmd?.description()).toContain('Vendas');
  });
});
