import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Command } from 'commander';

// ---- SDK boundary: mock client (createClient + getCustomer) ----
const mutateResources = vi.fn(async (_ops?: unknown, _opts?: unknown) => ({
  mutate_operation_responses: [
    { user_list: { resource_name: 'customers/1112223333/userLists/999' } },
  ],
}));
const fakeCustomer = { mutateResources };

vi.mock('../../google-ads-api/client.js', () => ({
  createClient: () => ({}),
  getCustomer: () => fakeCustomer,
}));

// ---- auth ----
vi.mock('../../auth/token-manager.js', () => ({
  ensureValidAuth: async () => ({
    developerToken: 'dev',
    clientId: 'cid',
    clientSecret: 'sec',
    refreshToken: 'rt',
  }),
}));

// ---- config defaults ----
vi.mock('../../config/config-repository.js', () => ({
  getDefaults: async () => ({ customerId: '1112223333' }),
}));

// ---- audit log ----
const appendMutationLog = vi.fn(async (..._args: unknown[]) => {});
vi.mock('../../log/mutation-log.js', () => ({
  appendMutationLog: (...args: unknown[]) => appendMutationLog(...args),
}));

// ---- error handler ----
const printError = vi.fn((..._args: unknown[]) => {});
vi.mock('../../errors/error-handler.js', () => ({
  printError: (...args: unknown[]) => printError(...args),
}));

// ---- confirmation prompt (requireSimpleConfirm uses @inquirer/prompts input) ----
let confirmAnswer = 's';
vi.mock('@inquirer/prompts', () => ({
  input: async () => confirmAnswer,
}));

import { registerAudienceSubcommands } from './audience.js';

function buildProgram(): Command {
  const program = new Command();
  program.exitOverride();
  const createCmd = program.command('create');
  registerAudienceSubcommands(createCmd);
  return program;
}

function runCli(args: string[]): Promise<Command> {
  return buildProgram().parseAsync(['node', 'google-ads', 'create', 'audience-remarketing', ...args]);
}

beforeEach(() => {
  vi.clearAllMocks();
  mutateResources.mockResolvedValue({
    mutate_operation_responses: [
      { user_list: { resource_name: 'customers/1112223333/userLists/999' } },
    ],
  });
  confirmAnswer = 's';
  process.exitCode = 0;
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('create audience-remarketing — handler', () => {
  it('sucesso: confirma, cria a lista e audita success=true', async () => {
    await runCli(['--name', 'Todos os visitantes', '--membership-days', '90']);

    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [, opts] = mutateResources.mock.calls[0] as [unknown, { validate_only: boolean }];
    expect(opts.validate_only).toBe(false);

    expect(appendMutationLog).toHaveBeenCalledTimes(1);
    const entry = appendMutationLog.mock.calls[0][0] as {
      operation: string;
      success: boolean;
      campaignId?: string;
    };
    expect(entry.operation).toBe('create_audience_remarketing');
    expect(entry.success).toBe(true);
    expect(entry.campaignId).toBeUndefined();
    expect(printError).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(0);
  });

  it('cancelamento: não muta, audita success=false e sai sem erro (exit 0)', async () => {
    confirmAnswer = 'n';

    await runCli(['--name', 'Lista cancelada']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(appendMutationLog).toHaveBeenCalledTimes(1);
    const entry = appendMutationLog.mock.calls[0][0] as { success: boolean; error?: string };
    expect(entry.success).toBe(false);
    expect(entry.error).toMatch(/não confirmou/i);
    expect(printError).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(0);
  });

  it('dry-run: envia validate_only=true', async () => {
    await runCli(['--name', 'Teste', '--dry-run']);

    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [, opts] = mutateResources.mock.calls[0] as [unknown, { validate_only: boolean }];
    expect(opts.validate_only).toBe(true);
    expect(process.exitCode).toBe(0);
  });

  it('erro de API: trata via printError e sai com exit 1', async () => {
    mutateResources.mockRejectedValueOnce(new Error('PERMISSION_DENIED'));

    await runCli(['--name', 'Lista erro']);

    expect(printError).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
  });

  it('validação: rejeita membership-days fora da faixa antes de qualquer chamada', async () => {
    await runCli(['--name', 'Fora da faixa', '--membership-days', '999']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(appendMutationLog).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
});
