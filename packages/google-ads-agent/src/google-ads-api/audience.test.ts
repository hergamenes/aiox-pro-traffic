import { describe, it, expect, vi, beforeEach } from 'vitest';

// Fake customer with a spied mutateResources, injected via the client mock.
type MutateResp = {
  mutate_operation_responses: Array<{ user_list?: { resource_name?: string } }>;
};
const mutateResources = vi.fn(
  async (_ops?: unknown, _opts?: unknown): Promise<MutateResp> => ({
    mutate_operation_responses: [
      { user_list: { resource_name: 'customers/1112223333/userLists/999' } },
    ],
  }),
);
const fakeCustomer = { mutateResources };

vi.mock('./client.js', () => ({
  getCustomer: () => fakeCustomer,
}));

import {
  buildRemarketingUserListOperation,
  createRemarketingUserList,
} from './audience.js';

const fakeClient = {} as unknown as Parameters<typeof createRemarketingUserList>[0];

beforeEach(() => {
  mutateResources.mockClear();
  mutateResources.mockResolvedValue({
    mutate_operation_responses: [
      { user_list: { resource_name: 'customers/1112223333/userLists/999' } },
    ],
  });
});

// Minimal structural view of the built resource, used to assert nested fields
// without depending on the SDK's static protobuf types in the test.
interface UserListResourceView {
  name?: string;
  description?: string;
  membership_status?: string;
  membership_life_span?: number;
  rule_based_user_list?: {
    prepopulation_status?: string;
    flexible_rule_user_list?: {
      inclusive_rule_operator?: string;
      inclusive_operands?: Array<{
        rule?: {
          rule_type?: string;
          rule_item_groups?: Array<{
            rule_items?: Array<{
              name?: string;
              string_rule_item?: { operator?: string; value?: string };
            }>;
          }>;
        };
      }>;
    };
  };
}

function resourceOf(op: ReturnType<typeof buildRemarketingUserListOperation>): UserListResourceView {
  return op.resource as unknown as UserListResourceView;
}

describe('buildRemarketingUserListOperation — pure builder', () => {
  // Helper to reach the nested string_rule_item value regardless of static typing.
  function ruleItem(op: ReturnType<typeof buildRemarketingUserListOperation>) {
    const r = resourceOf(op);
    const item =
      r.rule_based_user_list?.flexible_rule_user_list?.inclusive_operands?.[0]?.rule
        ?.rule_item_groups?.[0]?.rule_items?.[0];
    if (!item) throw new Error('rule_item ausente no shape gerado');
    return item;
  }

  it('usa o texto de urlContains como value quando informado', () => {
    const op = buildRemarketingUserListOperation({
      name: 'Visitantes medicalspin',
      membershipDurationDays: 90,
      urlContains: 'medicalspin.com.br',
    });
    const item = ruleItem(op);
    expect(item.name).toBe('url__');
    expect(item.string_rule_item?.operator).toBe('CONTAINS');
    expect(item.string_rule_item?.value).toBe('medicalspin.com.br');
  });

  it('usa o curinga "http" quando urlContains é omitido (todos os visitantes)', () => {
    const op = buildRemarketingUserListOperation({
      name: 'Todos os visitantes',
      membershipDurationDays: 540,
    });
    expect(ruleItem(op).string_rule_item?.value).toBe('http');
  });

  it('MNT-001: urlContains vazio ou só espaços cai no curinga "http"', () => {
    for (const urlContains of ['', '   ']) {
      const op = buildRemarketingUserListOperation({
        name: 'Borda',
        membershipDurationDays: 90,
        urlContains,
      });
      expect(ruleItem(op).string_rule_item?.value).toBe('http');
    }
  });

  it('MNT-001: urlContains com espaços ao redor é trimado', () => {
    const op = buildRemarketingUserListOperation({
      name: 'Trim',
      membershipDurationDays: 90,
      urlContains: '  medicalspin.com.br  ',
    });
    expect(ruleItem(op).string_rule_item?.value).toBe('medicalspin.com.br');
  });

  it('monta o shape completo da MutateOperation com enums como string literal', () => {
    const op = buildRemarketingUserListOperation({
      name: 'Lista X',
      description: 'minha lista',
      membershipDurationDays: 180,
    });
    expect(op.entity).toBe('user_list');
    expect(op.operation).toBe('create');
    const resource = resourceOf(op);
    expect(resource.name).toBe('Lista X');
    expect(resource.description).toBe('minha lista');
    expect(resource.membership_status).toBe('OPEN');
    expect(resource.membership_life_span).toBe(180);
    expect(resource.rule_based_user_list?.prepopulation_status).toBe('REQUESTED');
    expect(resource.rule_based_user_list?.flexible_rule_user_list?.inclusive_rule_operator).toBe('AND');
    const rule =
      resource.rule_based_user_list?.flexible_rule_user_list?.inclusive_operands?.[0]?.rule;
    expect(rule?.rule_type).toBe('OR_OF_ANDS');
  });

  it('omite description quando não fornecida', () => {
    const op = buildRemarketingUserListOperation({
      name: 'Sem descrição',
      membershipDurationDays: 30,
    });
    expect(resourceOf(op).description).toBeUndefined();
  });
});

describe('createRemarketingUserList — executor com SDK mockado', () => {
  it('cria a lista e lê o resource_name da resposta (sucesso, não dry-run)', async () => {
    const result = await createRemarketingUserList(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      operation: buildRemarketingUserListOperation({ name: 'X', membershipDurationDays: 90 }),
      dryRun: false,
    });

    expect(result.resourceName).toBe('customers/1112223333/userLists/999');
    expect(result.dryRun).toBe(false);
    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [, opts] = mutateResources.mock.calls[0] as [unknown, { validate_only: boolean; partial_failure: boolean }];
    expect(opts.validate_only).toBe(false);
    expect(opts.partial_failure).toBe(false);
  });

  it('passa validate_only=true em dry-run e devolve resource_name vazio quando a API não retorna', async () => {
    mutateResources.mockResolvedValueOnce({ mutate_operation_responses: [{}] });

    const result = await createRemarketingUserList(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      operation: buildRemarketingUserListOperation({ name: 'X', membershipDurationDays: 90 }),
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
      createRemarketingUserList(fakeClient, {
        customerId: '1112223333',
        refreshToken: 'rt',
        operation: buildRemarketingUserListOperation({ name: 'X', membershipDurationDays: 90 }),
        dryRun: false,
      }),
    ).rejects.toThrow(/PERMISSION_DENIED/);
  });
});
