import { describe, it, expect, vi, beforeEach } from 'vitest';

// Fake customer with a spied mutateResources, injected via the client mock.
type MutateResp = {
  mutate_operation_responses: Array<{ custom_audience?: { resource_name?: string } }>;
};
const mutateResources = vi.fn(
  async (_ops?: unknown, _opts?: unknown): Promise<MutateResp> => ({
    mutate_operation_responses: [
      { custom_audience: { resource_name: 'customers/1112223333/customAudiences/999' } },
    ],
  }),
);
const fakeCustomer = { mutateResources };

vi.mock('./client.js', () => ({
  getCustomer: () => fakeCustomer,
}));

import {
  buildCustomSegmentMembers,
  buildCustomSegmentOperation,
  createCustomSegment,
} from './custom-segment.js';

const fakeClient = {} as unknown as Parameters<typeof createCustomSegment>[0];

beforeEach(() => {
  mutateResources.mockClear();
  mutateResources.mockResolvedValue({
    mutate_operation_responses: [
      { custom_audience: { resource_name: 'customers/1112223333/customAudiences/999' } },
    ],
  });
});

// Minimal structural view of the built resource, used to assert nested fields
// without depending on the SDK's static protobuf types in the test.
interface CustomAudienceResourceView {
  name?: string;
  description?: string;
  type?: string;
  status?: string;
  members?: Array<{ member_type?: string; keyword?: string; url?: string }>;
}

function resourceOf(
  op: ReturnType<typeof buildCustomSegmentOperation>,
): CustomAudienceResourceView {
  return op.resource as unknown as CustomAudienceResourceView;
}

describe('buildCustomSegmentMembers — pure builder', () => {
  it('monta members KEYWORD a partir das keywords', () => {
    const members = buildCustomSegmentMembers(['ressonância', 'tomografia'], []);
    expect(members).toHaveLength(2);
    expect(members[0]).toEqual({ member_type: 'KEYWORD', keyword: 'ressonância' });
    expect(members[1]).toEqual({ member_type: 'KEYWORD', keyword: 'tomografia' });
  });

  it('monta members URL a partir das urls', () => {
    const members = buildCustomSegmentMembers([], ['concorrente.com', 'portal.com/x']);
    expect(members).toHaveLength(2);
    expect(members[0]).toEqual({ member_type: 'URL', url: 'concorrente.com' });
    expect(members[1]).toEqual({ member_type: 'URL', url: 'portal.com/x' });
  });

  it('combina keywords e urls na ordem keywords → urls', () => {
    const members = buildCustomSegmentMembers(['kw1'], ['url1']);
    expect(members).toHaveLength(2);
    expect(members[0].member_type).toBe('KEYWORD');
    expect(members[0].keyword).toBe('kw1');
    expect(members[1].member_type).toBe('URL');
    expect(members[1].url).toBe('url1');
  });

  it('devolve array vazio quando não há keywords nem urls', () => {
    expect(buildCustomSegmentMembers([], [])).toEqual([]);
  });
});

describe('buildCustomSegmentOperation — pure builder', () => {
  it('monta a MutateOperation com só keywords', () => {
    const op = buildCustomSegmentOperation({
      name: 'Interessados em RM',
      keywords: ['ressonância magnética'],
      urls: [],
      type: 'INTEREST',
    });
    expect(op.entity).toBe('custom_audience');
    expect(op.operation).toBe('create');
    const r = resourceOf(op);
    expect(r.name).toBe('Interessados em RM');
    expect(r.type).toBe('INTEREST');
    expect(r.status).toBe('ENABLED');
    expect(r.members).toHaveLength(1);
    expect(r.members?.[0]).toEqual({ member_type: 'KEYWORD', keyword: 'ressonância magnética' });
  });

  it('monta a MutateOperation com só urls', () => {
    const op = buildCustomSegmentOperation({
      name: 'Navegam concorrente',
      keywords: [],
      urls: ['concorrente.com'],
      type: 'INTEREST',
    });
    const r = resourceOf(op);
    expect(r.members).toHaveLength(1);
    expect(r.members?.[0]).toEqual({ member_type: 'URL', url: 'concorrente.com' });
  });

  it('monta a MutateOperation com keywords E urls', () => {
    const op = buildCustomSegmentOperation({
      name: 'Misto',
      keywords: ['kw1', 'kw2'],
      urls: ['url1'],
      type: 'PURCHASE_INTENT',
    });
    const r = resourceOf(op);
    expect(r.type).toBe('PURCHASE_INTENT');
    expect(r.members).toHaveLength(3);
    expect(r.members?.filter((m) => m.member_type === 'KEYWORD')).toHaveLength(2);
    expect(r.members?.filter((m) => m.member_type === 'URL')).toHaveLength(1);
  });

  it('propaga o type informado (AUTO/SEARCH também são aceitos no shape)', () => {
    expect(resourceOf(buildCustomSegmentOperation({ name: 'A', keywords: ['k'], urls: [], type: 'AUTO' })).type).toBe('AUTO');
    expect(resourceOf(buildCustomSegmentOperation({ name: 'S', keywords: ['k'], urls: [], type: 'SEARCH' })).type).toBe('SEARCH');
  });

  it('inclui description quando fornecida', () => {
    const op = buildCustomSegmentOperation({
      name: 'Com desc',
      description: 'minha descrição',
      keywords: ['k'],
      urls: [],
      type: 'INTEREST',
    });
    expect(resourceOf(op).description).toBe('minha descrição');
  });

  it('omite description quando não fornecida', () => {
    const op = buildCustomSegmentOperation({
      name: 'Sem desc',
      keywords: ['k'],
      urls: [],
      type: 'INTEREST',
    });
    expect(resourceOf(op).description).toBeUndefined();
  });
});

describe('createCustomSegment — executor com SDK mockado', () => {
  const baseOp = () =>
    buildCustomSegmentOperation({ name: 'X', keywords: ['k'], urls: [], type: 'INTEREST' });

  it('cria o segmento e lê o resource_name da resposta (sucesso, não dry-run)', async () => {
    const result = await createCustomSegment(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      operation: baseOp(),
      dryRun: false,
    });

    expect(result.resourceName).toBe('customers/1112223333/customAudiences/999');
    expect(result.dryRun).toBe(false);
    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [, opts] = mutateResources.mock.calls[0] as [
      unknown,
      { validate_only: boolean; partial_failure: boolean },
    ];
    expect(opts.validate_only).toBe(false);
    expect(opts.partial_failure).toBe(false);
  });

  it('passa validate_only=true em dry-run e devolve resource_name vazio quando a API não retorna', async () => {
    mutateResources.mockResolvedValueOnce({ mutate_operation_responses: [{}] });

    const result = await createCustomSegment(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      operation: baseOp(),
      dryRun: true,
    });

    expect(result.resourceName).toBe('');
    expect(result.dryRun).toBe(true);
    const [, opts] = mutateResources.mock.calls[0] as [unknown, { validate_only: boolean }];
    expect(opts.validate_only).toBe(true);
  });

  it('propaga erro da API', async () => {
    mutateResources.mockRejectedValueOnce(new Error('PERMISSION_DENIED'));

    await expect(
      createCustomSegment(fakeClient, {
        customerId: '1112223333',
        refreshToken: 'rt',
        operation: baseOp(),
        dryRun: false,
      }),
    ).rejects.toThrow(/PERMISSION_DENIED/);
  });
});
