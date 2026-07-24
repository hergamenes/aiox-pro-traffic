import { describe, it, expect, vi, beforeEach } from 'vitest';

// Fake customer with a spied mutateResources, injected via the client mock.
type MutateResp = {
  mutate_operation_responses: Array<{
    campaign_criterion?: { resource_name?: string };
    ad_group_criterion?: { resource_name?: string };
  }>;
};
const mutateResources = vi.fn(
  async (_ops?: unknown, _opts?: unknown): Promise<MutateResp> => ({
    mutate_operation_responses: [
      { campaign_criterion: { resource_name: 'customers/1112223333/campaignCriteria/555~444' } },
    ],
  }),
);
const fakeCustomer = { mutateResources };

vi.mock('./client.js', () => ({
  getCustomer: () => fakeCustomer,
}));

import {
  buildApplyAudienceTargetOperations,
  applyAudienceTarget,
  type AudienceTargetOperation,
} from './audience-target.js';

const fakeClient = {} as unknown as Parameters<typeof applyAudienceTarget>[0];

beforeEach(() => {
  mutateResources.mockClear();
  mutateResources.mockResolvedValue({
    mutate_operation_responses: [
      { campaign_criterion: { resource_name: 'customers/1112223333/campaignCriteria/555~444' } },
    ],
  });
});

// Minimal structural view of the built operations, used to assert nested fields
// without depending on the SDK's static protobuf types in the test.
interface OpView {
  entity?: string;
  operation?: string;
  update_mask?: { paths?: string[] };
  resource?: {
    resource_name?: string;
    campaign?: string;
    ad_group?: string;
    user_list?: { user_list?: string };
    targeting_setting?: {
      target_restriction_operations?: Array<{
        operator?: string;
        value?: { targeting_dimension?: string; bid_only?: boolean };
      }>;
    };
  };
}

function view(op: AudienceTargetOperation): OpView {
  return op as unknown as OpView;
}

describe('buildApplyAudienceTargetOperations — pure builder (campaign level)', () => {
  it('monta criterion create + targeting update no nível campanha (observation → bid_only:true)', () => {
    const ops = buildApplyAudienceTargetOperations({
      customerId: '1112223333',
      userListResourceName: 'customers/1112223333/userLists/999',
      campaignId: '555',
      mode: 'observation',
    });

    expect(ops).toHaveLength(2);

    const criterion = view(ops[0]);
    expect(criterion.entity).toBe('campaign_criterion');
    expect(criterion.operation).toBe('create');
    expect(criterion.resource?.campaign).toBe('customers/1112223333/campaigns/555');
    expect(criterion.resource?.user_list?.user_list).toBe('customers/1112223333/userLists/999');

    const targeting = view(ops[1]);
    expect(targeting.entity).toBe('campaign');
    expect(targeting.operation).toBe('update');
    expect(targeting.resource?.resource_name).toBe('customers/1112223333/campaigns/555');
    expect(targeting.update_mask?.paths).toEqual([
      'targeting_setting.target_restriction_operations',
    ]);
    const restriction = targeting.resource?.targeting_setting?.target_restriction_operations?.[0];
    expect(restriction?.operator).toBe('ADD');
    expect(restriction?.value?.targeting_dimension).toBe('AUDIENCE');
    expect(restriction?.value?.bid_only).toBe(true);
  });

  it('targeting mode → bid_only:false (segmentação restringe alcance)', () => {
    const ops = buildApplyAudienceTargetOperations({
      customerId: '1112223333',
      userListResourceName: 'customers/1112223333/userLists/999',
      campaignId: '555',
      mode: 'targeting',
    });
    const restriction = view(ops[1]).resource?.targeting_setting
      ?.target_restriction_operations?.[0];
    expect(restriction?.value?.bid_only).toBe(false);
  });

  it('normaliza customer ID com traços ao montar resource_names', () => {
    const ops = buildApplyAudienceTargetOperations({
      customerId: '111-222-3333',
      userListResourceName: 'customers/1112223333/userLists/999',
      campaignId: '555',
      mode: 'observation',
    });
    expect(view(ops[0]).resource?.campaign).toBe('customers/1112223333/campaigns/555');
    expect(view(ops[1]).resource?.resource_name).toBe('customers/1112223333/campaigns/555');
  });
});

describe('buildApplyAudienceTargetOperations — pure builder (ad group level)', () => {
  it('monta ad_group_criterion create + ad_group update (observation)', () => {
    const ops = buildApplyAudienceTargetOperations({
      customerId: '1112223333',
      userListResourceName: 'customers/1112223333/userLists/999',
      adGroupId: '777',
      mode: 'observation',
    });

    expect(ops).toHaveLength(2);

    const criterion = view(ops[0]);
    expect(criterion.entity).toBe('ad_group_criterion');
    expect(criterion.operation).toBe('create');
    expect(criterion.resource?.ad_group).toBe('customers/1112223333/adGroups/777');
    expect(criterion.resource?.user_list?.user_list).toBe('customers/1112223333/userLists/999');

    const targeting = view(ops[1]);
    expect(targeting.entity).toBe('ad_group');
    expect(targeting.operation).toBe('update');
    expect(targeting.resource?.resource_name).toBe('customers/1112223333/adGroups/777');
    const restriction = targeting.resource?.targeting_setting?.target_restriction_operations?.[0];
    expect(restriction?.value?.bid_only).toBe(true);
    expect(restriction?.value?.targeting_dimension).toBe('AUDIENCE');
  });

  it('ad group + targeting → bid_only:false', () => {
    const ops = buildApplyAudienceTargetOperations({
      customerId: '1112223333',
      userListResourceName: 'customers/1112223333/userLists/999',
      adGroupId: '777',
      mode: 'targeting',
    });
    const restriction = view(ops[1]).resource?.targeting_setting
      ?.target_restriction_operations?.[0];
    expect(restriction?.value?.bid_only).toBe(false);
  });
});

describe('applyAudienceTarget — executor com SDK mockado', () => {
  const ops = buildApplyAudienceTargetOperations({
    customerId: '1112223333',
    userListResourceName: 'customers/1112223333/userLists/999',
    campaignId: '555',
    mode: 'observation',
  });

  it('aplica e lê o resource_name do criterion (sucesso, não dry-run)', async () => {
    const result = await applyAudienceTarget(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      operations: ops,
      dryRun: false,
    });

    expect(result.criterionResourceName).toBe('customers/1112223333/campaignCriteria/555~444');
    expect(result.dryRun).toBe(false);
    expect(mutateResources).toHaveBeenCalledTimes(1);
    const [, opts] = mutateResources.mock.calls[0] as [
      unknown,
      { validate_only: boolean; partial_failure: boolean },
    ];
    expect(opts.validate_only).toBe(false);
    expect(opts.partial_failure).toBe(false);
  });

  it('lê ad_group_criterion.resource_name quando a resposta é de ad group', async () => {
    mutateResources.mockResolvedValueOnce({
      mutate_operation_responses: [
        { ad_group_criterion: { resource_name: 'customers/1112223333/adGroupCriteria/777~444' } },
      ],
    });
    const result = await applyAudienceTarget(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      operations: ops,
      dryRun: false,
    });
    expect(result.criterionResourceName).toBe('customers/1112223333/adGroupCriteria/777~444');
  });

  it('passa validate_only=true em dry-run e devolve resource_name vazio quando a API não retorna', async () => {
    mutateResources.mockResolvedValueOnce({ mutate_operation_responses: [{}] });

    const result = await applyAudienceTarget(fakeClient, {
      customerId: '1112223333',
      refreshToken: 'rt',
      operations: ops,
      dryRun: true,
    });

    expect(result.criterionResourceName).toBe('');
    expect(result.dryRun).toBe(true);
    const [, opts] = mutateResources.mock.calls[0] as [unknown, { validate_only: boolean }];
    expect(opts.validate_only).toBe(true);
  });

  it('propaga erro da API', async () => {
    mutateResources.mockRejectedValueOnce(new Error('NOT_FOUND'));

    await expect(
      applyAudienceTarget(fakeClient, {
        customerId: '1112223333',
        refreshToken: 'rt',
        operations: ops,
        dryRun: false,
      }),
    ).rejects.toThrow(/NOT_FOUND/);
  });
});
