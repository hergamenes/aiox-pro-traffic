import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Command } from 'commander';

// ---- SDK boundary: mock client (createClient + getCustomer) ----
type MutateEntry = {
  user_list?: { resource_name?: string };
  campaign_criterion?: { resource_name?: string };
  ad_group_criterion?: { resource_name?: string };
  custom_audience?: { resource_name?: string };
};
const mutateResources = vi.fn(
  async (_ops?: unknown, _opts?: unknown): Promise<{ mutate_operation_responses: MutateEntry[] }> => ({
    mutate_operation_responses: [
      { user_list: { resource_name: 'customers/1112223333/userLists/999' } },
    ],
  }),
);
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

function runTargetCli(args: string[]): Promise<Command> {
  return buildProgram().parseAsync(['node', 'google-ads', 'create', 'audience-target', ...args]);
}

function runSegmentCli(args: string[]): Promise<Command> {
  return buildProgram().parseAsync([
    'node',
    'google-ads',
    'create',
    'audience-custom-segment',
    ...args,
  ]);
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

describe('create audience-target — handler', () => {
  const USER_LIST = 'customers/1112223333/userLists/999';

  beforeEach(() => {
    mutateResources.mockResolvedValue({
      mutate_operation_responses: [
        { campaign_criterion: { resource_name: 'customers/1112223333/campaignCriteria/555~444' } },
      ],
    });
  });

  it('sucesso (nível campanha, observação): aplica e audita success=true com campaignId', async () => {
    await runTargetCli(['--user-list', USER_LIST, '--campaign-id', '555']);

    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [ops, opts] = mutateResources.mock.calls[0] as [
      Array<{ entity: string }>,
      { validate_only: boolean; partial_failure: boolean },
    ];
    expect(ops).toHaveLength(2);
    expect(ops[0].entity).toBe('campaign_criterion');
    expect(ops[1].entity).toBe('campaign');
    expect(opts.validate_only).toBe(false);
    expect(opts.partial_failure).toBe(false);

    expect(appendMutationLog).toHaveBeenCalledTimes(1);
    const entry = appendMutationLog.mock.calls[0][0] as {
      operation: string;
      success: boolean;
      campaignId?: string;
      after: { mode: string };
    };
    expect(entry.operation).toBe('apply_audience_target');
    expect(entry.success).toBe(true);
    expect(entry.campaignId).toBe('555');
    expect(entry.after.mode).toBe('observation');
    expect(printError).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(0);
  });

  it('sucesso (nível ad group): usa ad_group_criterion e omite campaignId no log', async () => {
    mutateResources.mockResolvedValueOnce({
      mutate_operation_responses: [
        { ad_group_criterion: { resource_name: 'customers/1112223333/adGroupCriteria/777~444' } },
      ],
    });

    await runTargetCli(['--user-list', USER_LIST, '--ad-group-id', '777']);

    const [ops] = mutateResources.mock.calls[0] as [Array<{ entity: string }>, unknown];
    expect(ops[0].entity).toBe('ad_group_criterion');
    expect(ops[1].entity).toBe('ad_group');

    const entry = appendMutationLog.mock.calls[0][0] as { campaignId?: string; success: boolean };
    expect(entry.campaignId).toBeUndefined();
    expect(entry.success).toBe(true);
    expect(process.exitCode).toBe(0);
  });

  it('modo targeting: monta bid_only:false na operação de targeting', async () => {
    await runTargetCli(['--user-list', USER_LIST, '--campaign-id', '555', '--mode', 'targeting']);

    const [ops] = mutateResources.mock.calls[0] as [
      Array<{
        resource?: {
          targeting_setting?: {
            target_restriction_operations?: Array<{ value?: { bid_only?: boolean } }>;
          };
        };
      }>,
      unknown,
    ];
    const bidOnly =
      ops[1].resource?.targeting_setting?.target_restriction_operations?.[0]?.value?.bid_only;
    expect(bidOnly).toBe(false);
    expect(process.exitCode).toBe(0);
  });

  it('cancelamento: não muta, audita success=false e sai sem erro (exit 0)', async () => {
    confirmAnswer = 'n';

    await runTargetCli(['--user-list', USER_LIST, '--campaign-id', '555']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(appendMutationLog).toHaveBeenCalledTimes(1);
    const entry = appendMutationLog.mock.calls[0][0] as { success: boolean; error?: string };
    expect(entry.success).toBe(false);
    expect(entry.error).toMatch(/não confirmou/i);
    expect(printError).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(0);
  });

  it('dry-run: envia validate_only=true', async () => {
    await runTargetCli(['--user-list', USER_LIST, '--campaign-id', '555', '--dry-run']);

    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [, opts] = mutateResources.mock.calls[0] as [unknown, { validate_only: boolean }];
    expect(opts.validate_only).toBe(true);
    expect(process.exitCode).toBe(0);
  });

  it('erro de API: trata via printError e sai com exit 1', async () => {
    mutateResources.mockRejectedValueOnce(new Error('NOT_FOUND'));

    await runTargetCli(['--user-list', USER_LIST, '--campaign-id', '555']);

    expect(printError).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
  });

  it('validação XOR: rejeita quando campaign-id e ad-group-id são informados juntos', async () => {
    await runTargetCli(['--user-list', USER_LIST, '--campaign-id', '555', '--ad-group-id', '777']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(appendMutationLog).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it('validação: rejeita user-list em formato inválido antes de qualquer chamada', async () => {
    await runTargetCli(['--user-list', 'formato-errado', '--campaign-id', '555']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(appendMutationLog).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it('validação: rejeita mode desconhecido', async () => {
    await runTargetCli(['--user-list', USER_LIST, '--campaign-id', '555', '--mode', 'segment']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
});

describe('create audience-custom-segment — handler', () => {
  beforeEach(() => {
    mutateResources.mockResolvedValue({
      mutate_operation_responses: [
        { custom_audience: { resource_name: 'customers/1112223333/customAudiences/321' } },
      ],
    });
  });

  it('sucesso (keywords): cria o segmento e audita success=true, sem campaignId', async () => {
    await runSegmentCli(['--name', 'Interessados em RM', '--keywords', 'ressonância,tomografia']);

    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [ops, opts] = mutateResources.mock.calls[0] as [
      Array<{ entity: string; resource: { members: Array<{ member_type: string }> } }>,
      { validate_only: boolean; partial_failure: boolean },
    ];
    expect(ops).toHaveLength(1);
    expect(ops[0].entity).toBe('custom_audience');
    expect(ops[0].resource.members).toHaveLength(2);
    expect(ops[0].resource.members.every((m) => m.member_type === 'KEYWORD')).toBe(true);
    expect(opts.validate_only).toBe(false);
    expect(opts.partial_failure).toBe(false);

    expect(appendMutationLog).toHaveBeenCalledTimes(1);
    const entry = appendMutationLog.mock.calls[0][0] as {
      operation: string;
      success: boolean;
      campaignId?: string;
      after: { type: string; keywords: number; urls: number };
    };
    expect(entry.operation).toBe('create_audience_custom_segment');
    expect(entry.success).toBe(true);
    expect(entry.campaignId).toBeUndefined();
    expect(entry.after.type).toBe('INTEREST');
    expect(entry.after.keywords).toBe(2);
    expect(entry.after.urls).toBe(0);
    expect(printError).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(0);
  });

  it('sucesso (urls + type): monta members URL e propaga o type', async () => {
    await runSegmentCli([
      '--name',
      'Navegam concorrente',
      '--urls',
      'concorrente.com, portal.com/x',
      '--type',
      'PURCHASE_INTENT',
    ]);

    const [ops] = mutateResources.mock.calls[0] as [
      Array<{ resource: { type: string; members: Array<{ member_type: string; url?: string }> } }>,
      unknown,
    ];
    expect(ops[0].resource.type).toBe('PURCHASE_INTENT');
    expect(ops[0].resource.members).toHaveLength(2);
    expect(ops[0].resource.members.every((m) => m.member_type === 'URL')).toBe(true);
    expect(process.exitCode).toBe(0);
  });

  it('cancelamento: não muta, audita success=false e sai sem erro (exit 0)', async () => {
    confirmAnswer = 'n';

    await runSegmentCli(['--name', 'Cancelado', '--keywords', 'k']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(appendMutationLog).toHaveBeenCalledTimes(1);
    const entry = appendMutationLog.mock.calls[0][0] as { success: boolean; error?: string };
    expect(entry.success).toBe(false);
    expect(entry.error).toMatch(/não confirmou/i);
    expect(printError).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(0);
  });

  it('dry-run: envia validate_only=true', async () => {
    await runSegmentCli(['--name', 'Teste', '--keywords', 'k', '--dry-run']);

    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [, opts] = mutateResources.mock.calls[0] as [unknown, { validate_only: boolean }];
    expect(opts.validate_only).toBe(true);
    expect(process.exitCode).toBe(0);
  });

  it('erro de API: trata via printError e sai com exit 1', async () => {
    mutateResources.mockRejectedValueOnce(new Error('PERMISSION_DENIED'));

    await runSegmentCli(['--name', 'Erro', '--keywords', 'k']);

    expect(printError).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
  });

  it('validação: rejeita zero members (nem keywords nem urls) antes de qualquer chamada', async () => {
    await runSegmentCli(['--name', 'Sem members']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(appendMutationLog).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it('validação: keywords só com vírgulas/espaços resulta em zero members e é rejeitado', async () => {
    await runSegmentCli(['--name', 'Vazio', '--keywords', ' , , ']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it('validação: rejeita --type fora da lista fechada', async () => {
    await runSegmentCli(['--name', 'Tipo ruim', '--keywords', 'k', '--type', 'AFFINITY']);

    expect(mutateResources).not.toHaveBeenCalled();
    expect(appendMutationLog).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
});
